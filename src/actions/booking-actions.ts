"use server";

import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/validators/booking";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { BookingStatus } from "@prisma/client";

/* ==========================================================================
   1. CUSTOMER PIPELINE: Create a New Booking Reservation
   ========================================================================== */
export async function createBooking(formData: { roomId: string; checkIn: Date; checkOut: Date }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized access block initialized.");

  // Validate incoming user date payloads via zod validation rules
  const validatedData = bookingSchema.parse(formData);

  // Fetch your local database user model linked to this Clerk account identity
  let internalUser = await prisma.user.findUnique({
  where: { clerkId: clerkId },
  select: { id: true }
});

// 🔄 Fallback Recovery Gate: Auto-sync profile to database if webhook hasn't run yet
if (!internalUser) {
  console.log(`⚠️ User ${clerkId} missing from local DB. Running live sync fallback...`);
  
  // Fetch current user email directly from Clerk's secure session context
  const { currentUser } = await import("@clerk/nextjs/server");
  const clerkUser = await currentUser();
  
  if (!clerkUser) {
    throw new Error("Unable to retrieve verified authentication token profiles from Clerk.");
  }

  const primaryEmail = clerkUser.emailAddresses[0]?.emailAddress;
  const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

  // Create the missing user record on the fly
  internalUser = await prisma.user.create({
    data: {
      clerkId: clerkId,
      email: primaryEmail || `${clerkId}@temporary-clerk-alias.local`,
      name: fullName || "Verified Guest",
      role: "GUEST" // Standard default tier assignment
    },
    select: { id: true }
  });
}

  // Retrieve target physical room parameters alongside its structural pricing tier
  const targetRoom = await prisma.room.findUnique({
    where: { id: validatedData.roomId },
    include: { roomType: true },
  });
  if (!targetRoom) throw new Error("The specified room asset could not be found.");

  // Calculate dynamic pricing parameters accurately
  const totalDays = Math.max(
    1,
    Math.ceil((validatedData.checkOut.getTime() - validatedData.checkIn.getTime()) / (1000 * 60 * 60 * 24))
  );
  const calculatedTotalPrice = totalDays * targetRoom.roomType.price;

  // Execute an atomic transaction block to write both the Booking and Payment records
  const reservation = await prisma.$transaction(async (tx) => {
    const newBooking = await tx.booking.create({
      data: {
        userId: internalUser.id,
        roomId: validatedData.roomId,
        checkIn: validatedData.checkIn,
        checkOut: validatedData.checkOut,
        status: "PENDING", // 🟢 Changed from "CONFIRMED" to "PENDING" for checkout hold security
      },
    });

    await tx.payment.create({
      data: {
        amount: calculatedTotalPrice,
        status: "PENDING",
        bookingId: newBooking.id,
      },
    });

    return newBooking;
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/bookings");
  
  return { success: true, bookingId: reservation.id };
}

/* ==========================================================================
   2. ADMINISTRATIVE PIPELINE: Update Existing Booking Lifecycle Status
   ========================================================================== */
interface UpdateStatusInput {
  bookingId: string;
  status: BookingStatus;
}

export async function updateBookingStatus({ bookingId, status }: UpdateStatusInput) {
  try {
    // Update the booking lifecycle state
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    });

    // Business Logic: If a guest checks out or cancels, automatically free up the room
    if (status === "CHECKED_OUT" || status === "CANCELLED") {
      await prisma.room.update({
        where: { id: updatedBooking.roomId },
        data: { available: true }
      });
    } 
    // If a guest checks in, mark the room unit as occupied/unavailable
    else if (status === "CHECKED_IN") {
      await prisma.room.update({
        where: { id: updatedBooking.roomId },
        data: { available: false }
      });
    }

    // Clear data caches instantly across the admin layout panels
    revalidatePath("/admin/bookings");
    revalidatePath("/admin");

    return { success: true };
  } catch (error: any) {
    console.error("Failed to transition reservation lifecycle state:", error);
    throw new Error(error.message || "An unexpected error locked execution parameters.");
  }
}
"use server";

import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/validators/booking";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createBooking(formData: { roomId: string; checkIn: Date; checkOut: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized access block initialized.");

  // Run business validation checks
  const validatedData = bookingSchema.parse(formData);

  const targetRoom = await prisma.room.findUnique({
    where: { id: validatedData.roomId },
    include: { roomType: true },
  });
  if (!targetRoom) throw new Error("The specified room asset could not be found.");

  // Calculate dynamic pricing metrics
  const totalDays = Math.ceil((validatedData.checkOut.getTime() - validatedData.checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const calculatedTotalPrice = totalDays * targetRoom.roomType.price;

  const reservation = await prisma.booking.create({
    data: {
      userId,
      roomId: validatedData.roomId,
      checkIn: validatedData.checkIn,
      checkOut: validatedData.checkOut,
      totalPrice: calculatedTotalPrice,
      status: "CONFIRMED", // Default status for Phase 3
    },
  });

  revalidatePath("/dashboard");
  return { success: true, bookingId: reservation.id };
}
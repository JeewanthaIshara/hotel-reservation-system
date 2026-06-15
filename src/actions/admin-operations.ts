"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Admin Whitelist configuration verification rule
const ADMIN_EMAILS = ["jisharapemathilaka@gmail.com"];

async function verifyStaffClearance() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Authentication session required.");
  
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()?.trim();
  const isAdmin = userEmail && ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(userEmail);

  if (!isAdmin) {
    throw new Error("Unauthorized Access: Administrative/Staff clearance required.");
  }
}

/**
 * ACTION: Toggle a Physical Room's Cleaning/Maintenance Status
 */
export async function updateRoomStatus(roomId: string, status: "CLEAN" | "DIRTY" | "UNDER_MAINTENANCE") {
  try {
    await verifyStaffClearance();

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: { 
        status,
        // Safety lock: if a room is under maintenance or dirty, take it offline for guest booking
        available: status === "CLEAN" 
      }
    });

    revalidatePath("/admin/rooms");
    revalidatePath("/rooms"); // Sync guest view
    return { success: true, data: updatedRoom };
  } catch (error: any) {
    console.error("❌ ROOM STATUS UPDATE FAILURE:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * ACTION: Front-Desk Check-In Processor
 * Transitions booking state and confirms the physical room assignment
 */
export async function processGuestCheckIn(bookingId: string) {
  try {
    await verifyStaffClearance();

    // 1. Fetch current booking details to find the target physical room
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { roomId: true }
    });

    if (!booking) throw new Error("Target booking record not found.");

    // 2. Run atomic updates via an isolating transaction block
    await prisma.$transaction([
      // Update booking lifecycle state
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CHECKED_IN" }
      }),
      // Confirm room status reflects current guest usage
      prisma.room.update({
        where: { id: booking.roomId },
        data: { available: false } // Block booking engines entirely during occupancy
      })
    ]);

    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error: any) {
    console.error("❌ FRONT DESK CHECK-IN ERROR:", error.message);
    return { success: false, error: error.message };
  }
}

/**
 * ACTION: Front-Desk Check-Out Processor
 * Reclaims room asset and triggers housekeeping pipeline automatically!
 */
export async function processGuestCheckOut(bookingId: string) {
  try {
    await verifyStaffClearance();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      select: { roomId: true }
    });

    if (!booking) throw new Error("Target booking record not found.");

    await prisma.$transaction([
      // 1. Finalize the reservation lifecycle status parameters
      prisma.booking.update({
        where: { id: bookingId },
        data: { status: "CHECKED_OUT" }
      }),
      // 2. 🪄 Automation: Flag the room as DIRTY. It cannot go live until housekeeping hits "Cleaned"
      prisma.room.update({
        where: { id: booking.roomId },
        data: { 
          status: "DIRTY", 
          available: false 
        }
      })
    ]);

    revalidatePath("/admin/bookings");
    revalidatePath("/admin/rooms");
    return { success: true };
  } catch (error: any) {
    console.error("❌ FRONT DESK CHECK-OUT ERROR:", error.message);
    return { success: false, error: error.message };
  }
}
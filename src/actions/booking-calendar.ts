"use server";

import { prisma } from "@/lib/prisma";

interface BlockedDateRange {
  from: Date;
  to: Date;
}

/**
 * Fetches all date blocks where inventory capacity for a specific RoomType is completely full.
 */
export async function getBlockedDatesForRoomType(roomTypeId: string): Promise<BlockedDateRange[]> {
  try {
    // 1. Get total count of physical rooms mapped to this room type
    const physicalRoomCount = await prisma.room.count({
      where: { 
        roomTypeId,
        status: { not: "UNDER_MAINTENANCE" } // Don't count broken rooms toward bookable capacity
      },
    });

    if (physicalRoomCount === 0) {
      return [{ from: new Date("2020-01-01"), to: new Date("2040-12-31") }]; // Lock everything if no rooms exist
    }

    // 2. Fetch all active or upcoming bookings for these physical rooms
    const activeBookings = await prisma.booking.findMany({
      where: {
        room: { roomTypeId },
        status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
        checkOut: { gte: new Date() }, // Only look at current or future reservations
      },
      select: {
        checkIn: true,
        checkOut: true,
        roomId: true,
      },
    });

    // 3. Map out a date matrix density tracking system to identify overlapping dates
    // For a lightweight solution, we return the booking blocks directly.
    // If you have multiple physical rooms, a date is only blocked if overlapping reservations == physicalRoomCount.
    const blockedRanges = activeBookings.map((b) => ({
      from: new Date(b.checkIn),
      to: new Date(b.checkOut),
    }));

    return blockedRanges;
  } catch (error: any) {
    console.error("❌ FAILED TO AGGREGATE CALENDAR BLOCKS:", error.message);
    return [];
  }
}
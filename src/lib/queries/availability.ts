import { prisma } from "@/lib/prisma";

interface SearchParams {
  checkIn: Date;
  checkOut: Date;
  guests: number;
}

export async function getAvailableRooms({ checkIn, checkOut, guests }: SearchParams) {
  // Finds all rooms that possess a booking overlapping your requested window
  const bookedRooms = await prisma.booking.findMany({
    where: {
      OR: [
        {
          checkIn: { lte: checkIn },
          checkOut: { gte: checkIn },
        },
        {
          checkIn: { lte: checkOut },
          checkOut: { gte: checkOut },
        },
        {
          checkIn: { gte: checkIn },
          checkOut: { lte: checkOut },
        },
      ],
    },
    select: { roomId: true },
  });

  const bookedRoomIds = bookedRooms.map((b) => b.roomId);

  // Return rooms not booked, matching the capacity requirement
  return await prisma.room.findMany({
    where: {
      id: { notIn: bookedRoomIds },
      roomType: {
        capacity: { gte: guests },
      },
    },
    include: {
      roomType: true,
      hotel: true,
    },
  });
}
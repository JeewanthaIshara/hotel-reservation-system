import { prisma } from "@/lib/prisma";

export async function getRooms() {
  return await prisma.room.findMany({
    include: {
      roomType: true,
      hotel: true,
    },
  });
}

export async function getRoomById(id: string) {
  return await prisma.room.findUnique({
    where: { id },
    include: {
      roomType: true,
      hotel: true,
    },
  });
}

// ➕ Add this new query to the bottom of your existing file
export async function getUserBookings(userId: string) {
  return await prisma.booking.findMany({
    where: {
      userId: userId,
    },
    include: {
      room: {
        include: {
          roomType: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
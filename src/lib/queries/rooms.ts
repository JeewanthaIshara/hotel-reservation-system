import { prisma } from "@/lib/prisma";

export async function getRooms() {
  return await prisma.room.findMany({
    where: {
      available: true, // Only show active rooms
    },
    include: {
      // 🟢 CRITICAL: This pulls the nested roomType object into the result
      roomType: {
        include: {
          amenities: {
            include: {
              amenity: true, // Pulls the actual text names like "Free Wi-Fi"
            },
          },
        },
      },
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
export async function getUserBookings(clerkId: string) {
  return await prisma.booking.findMany({
    where: {
      user: {
        clerkId: clerkId // 💡 Maps the Clerk auth token string back to your relation model
      }
    },
    include: {
      room: {
        include: {
          roomType: true
        }
      }
    },
    orderBy: {
      checkIn: "asc"
    }
  });
}
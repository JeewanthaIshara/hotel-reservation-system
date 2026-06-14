"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CreateRoomInput {
  roomNumber: string;
  roomTypeId: string;
}

export async function createPhysicalRoom(data: CreateRoomInput) {
  try {
    // 1. Fetch the default hotel instance ID from your database setup
    const defaultHotel = await prisma.hotel.findFirst({
      select: { id: true }
    });

    if (!defaultHotel) {
      throw new Error("No active Hotel profile found in the registry. Please create a Hotel record first.");
    }

    // 2. 🪛 FIX: Use findFirst to safely search standard un-indexed scalar field layouts
    const duplicateRoom = await prisma.room.findFirst({
      where: { 
        roomNumber: data.roomNumber, 
        hotelId: defaultHotel.id 
      }
    });

    if (duplicateRoom) {
      throw new Error(`Room number ${data.roomNumber} is already registered in this hotel.`);
    }

    // 3. Insert the fresh record with the required relational hotelId link
    await prisma.room.create({
      data: {
        roomNumber: data.roomNumber,
        roomTypeId: data.roomTypeId,
        hotelId: defaultHotel.id, 
        available: true,
      },
    });

    // 4. Wipe NextJS server cache tags so dashboards update instantly
    revalidatePath("/admin/rooms");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error: any) {
    console.error("Failed to commit transactional unit allocation:", error);
    throw new Error(error.message || "An unexpected system error locked execution parameters.");
  }
}
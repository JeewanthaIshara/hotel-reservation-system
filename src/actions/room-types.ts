"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Type definitions for data integrity verification
interface RoomTypeInput {
  name: string;
  description: string;
  price: number;
  capacity: number;
  images: string[];
}

/**
 * Enterprise Middleware Verification Rule
 */
async function verifyAdminClearance() {
  const { sessionClaims } = await auth();
  // Ensure your Clerk metadata matches the role claim
  if (sessionClaims?.metadata?.role !== "admin") {
    throw new Error("Unauthorized Access Violation: Administrative Clearance Required.");
  }
}

/**
 * CREATE: Add New Suite Tier Option
 */
export async function createRoomType(data: RoomTypeInput) {
  await verifyAdminClearance();

  const newType = await prisma.roomType.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      capacity: data.capacity,
      images: data.images,
    },
  });

  // Purge the public cache path so fresh inventory renders instantly
  revalidatePath("/rooms");
  revalidatePath("/admin/room-types");
  return { success: true, data: newType };
}

/**
 * UPDATE: Modify Existing Suite Parameters
 */
export async function updateRoomType(id: string, data: Partial<RoomTypeInput>) {
  await verifyAdminClearance();

  const updatedType = await prisma.roomType.update({
    where: { id },
    data,
  });

  revalidatePath("/rooms");
  revalidatePath(`/rooms/${id}`);
  revalidatePath("/admin/room-types");
  return { success: true, data: updatedType };
}

/**
 * DELETE: Erase Room Type Configuration
 */
export async function deleteRoomType(id: string) {
  await verifyAdminClearance();

  await prisma.roomType.delete({
    where: { id },
  });

  revalidatePath("/rooms");
  revalidatePath("/admin/room-types");
  return { success: true };
}
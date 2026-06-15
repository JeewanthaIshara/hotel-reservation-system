"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// 🎛️ Input Interface supporting chosen Amenity ID arrays
interface RoomTypeInput {
  name: string;
  description: string;
  price: number;
  capacity: number;
  images: string[];
  amenityIds?: string[];
}

// 🔐 Hardcoded developer email whitelist matching your layout.tsx permission rules
const ADMIN_EMAILS = [
  "jisharapemathilaka@gmail.com",
];

/**
 * Administrative Clearance Middleware Guard
 */
async function verifyAdminClearance() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    throw new Error("Unauthorized Access Violation: Login session required.");
  }

  // Fetch primary email safely and format in lowercase
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()?.trim();
  
  // Validate presence within your whitelisted developer configuration list
  const isAdmin = userEmail && ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(userEmail);

  if (!isAdmin) {
    console.log(`❌ Backend Mutation Denied for user email: ${userEmail}`);
    throw new Error("Unauthorized Access Violation: Administrative Clearance Required.");
  }
}

/**
 * CREATE: Add New Suite Tier Option with Bundled Amenities
 */
export async function createRoomType(data: RoomTypeInput) {
  try {
    await verifyAdminClearance();

    const { amenityIds, ...roomTypeData } = data;

    const newType = await prisma.roomType.create({
      data: {
        ...roomTypeData,
        // Mapping explicit intermediate join rows atomically
        amenities: {
          create: amenityIds?.map((id) => ({
            amenity: { connect: { id } }
          })) || []
        }
      },
    });

    // Purge relevant display view caches instantly
    revalidatePath("/rooms");
    revalidatePath("/admin/room-types");
    
    return { success: true, data: newType };
  } catch (error: any) {
    console.error("❌ CREATE SERVER ACTION ERROR:", error.message);
    return { success: false, error: error.message || "Database execution transaction failed." };
  }
}

/**
 * UPDATE: Modify Existing Suite Parameters and Adjust Amenity Links
 */
export async function updateRoomType(id: string, data: Partial<RoomTypeInput>) {
  try {
    await verifyAdminClearance();

    const { amenityIds, ...roomTypeData } = data;

    const updatedType = await prisma.roomType.update({
      where: { id },
      data: {
        ...roomTypeData,
        ...(amenityIds && {
          // Wipe previous amenity assignments and re-insert fresh checklist selections
          amenities: {
            deleteMany: {},
            create: amenityIds.map((id) => ({
              amenity: { connect: { id } }
            }))
          }
        })
      },
    });

    revalidatePath("/rooms");
    revalidatePath(`/rooms/${id}`);
    revalidatePath("/admin/room-types");
    
    return { success: true, data: updatedType };
  } catch (error: any) {
    console.error("❌ UPDATE SERVER ACTION ERROR:", error.message);
    return { success: false, error: error.message || "Database update transaction failed." };
  }
}

/**
 * DELETE: Erase Room Type Configuration
 */
export async function deleteRoomType(id: string) {
  try {
    await verifyAdminClearance();

    // Due to Cascade settings configured in schema.prisma, deleting the parent roomType 
    // row will automatically clean up linked TypeAmenity row entries instantly!
    await prisma.roomType.delete({
      where: { id },
    });

    revalidatePath("/rooms");
    revalidatePath("/admin/room-types");
    
    return { success: true };
  } catch (error: any) {
    console.error("❌ DELETE SERVER ACTION ERROR:", error.message);
    return { success: false, error: error.message || "Database deletion transaction failed." };
  }
}
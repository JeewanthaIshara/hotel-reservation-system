"use server";

import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const ADMIN_EMAILS = ["jisharapemathilaka@gmail.com"];

async function verifyStaffClearance() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) throw new Error("Authentication required.");
  
  const userEmail = user.emailAddresses[0]?.emailAddress?.toLowerCase()?.trim();
  const isAdmin = userEmail && ADMIN_EMAILS.map(e => e.toLowerCase().trim()).includes(userEmail);

  if (!isAdmin) {
    throw new Error("Unauthorized Access: Administrative clearance required.");
  }
}

/**
 * ACTION: Manually settle or update a specific invoice state
 */
export async function updatePaymentStatus(paymentId: string, status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED") {
  try {
    await verifyStaffClearance();

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: { status },
      include: {
        booking: {
          select: { id: true }
        }
      }
    });

    // If a payment fails or is refunded, optionally flag the booking status automatically
    if (status === "REFUNDED" || status === "FAILED") {
      await prisma.booking.update({
        where: { id: updatedPayment.bookingId },
        data: { status: "CANCELLED" }
      });
    } else if (status === "SUCCESS") {
      await prisma.booking.update({
        where: { id: updatedPayment.bookingId },
        data: { status: "CONFIRMED" }
      });
    }

    revalidatePath("/admin/payments");
    revalidatePath("/admin/bookings");
    return { success: true };
  } catch (error: any) {
    console.error("❌ PAYMENT MANAGEMENT FAILURE:", error.message);
    return { success: false, error: error.message };
  }
}
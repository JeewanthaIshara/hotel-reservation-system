import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized access profile configuration" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (!bookingId) {
      return NextResponse.json({ error: "Missing required booking identifier" }, { status: 400 });
    }

    // Fetch the pending payment record linked to this hold
    const paymentRecord = await prisma.payment.findFirst({
      where: { bookingId, status: "PENDING" },
      include: {
        booking: {
          include: {
            room: { include: { roomType: true } }
          }
        }
      }
    });

    if (!paymentRecord || !paymentRecord.booking?.room?.roomType) {
      return NextResponse.json({ error: "No matching pending payment ledger found" }, { status: 404 });
    }

    const roomType = paymentRecord.booking.room.roomType;

    // Create a secure Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: roomType.name,
              description: `Reservation at AuraStay - Room ${paymentRecord.booking.room.roomNumber}`,
            },
            unit_amount: Math.round(paymentRecord.amount * 100), // Stripe processes values in cents ($10.00 = 1000)
          },
          quantity: 1,
        },
      ],
      // Metadata allows us to map this session back to our DB tables inside the webhook later
      metadata: {
        bookingId: bookingId,
        paymentId: paymentRecord.id,
      },
      success_url: `${request.nextUrl.origin}/rooms?success=true`,
      cancel_url: `${request.nextUrl.origin}/rooms?cancelled=true`,
    });

    if (!session.url) {
      throw new Error("Stripe engine failed to generate an active URL mapping.");
    }

    // Redirect the guest directly to Stripe's secure hosted payment form page
    return NextResponse.redirect(session.url);
  } catch (error: any) {
    console.error("❌ STRIPE ROUTE ENGINE CONFIGURATION ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
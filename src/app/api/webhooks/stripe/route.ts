import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing required security signature mapping" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // Verify that the payload actually came from Stripe using your webhook secret key
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err: any) {
    console.error(`❌ Webhook Signature Verification Failed: ${err.message}`);
    return NextResponse.json({ error: `Security failure: ${err.message}` }, { status: 400 });
  }

  // 🟢 Handle successful payment validation sequences
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Extract the custom metadata properties we passed in step 6
    const bookingId = session.metadata?.bookingId;
    const paymentId = session.metadata?.paymentId;

    if (bookingId && paymentId) {
      try {
        // Run an atomic multi-table write transaction to secure states simultaneously
        await prisma.$transaction([
          // 1. Settle the financial ledger record string parameters
          prisma.payment.update({
            where: { id: paymentId },
            data: { status: "SUCCESS" },
          }),
          // 2. Formally transition the room hold allocation from PENDING to CONFIRMED
          prisma.booking.update({
            where: { id: bookingId },
            data: { status: "CONFIRMED" },
          })
        ]);

        console.log(`✅ DATABASE TRANSACTION SYNCED: Booking ${bookingId} is now CONFIRMED.`);
      } catch (dbError: any) {
        console.error("❌ WEBHOOK DATABASE ATOMIC TRANSACTION WRITE FAILED:", dbError.message);
        return NextResponse.json({ error: "Internal ledger sync failure" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const rawBody = await request.text();
    const sig = request.headers.get("stripe-signature");

    let event;
    if (webhookSecret && !webhookSecret.includes("placeholder")) {
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // Dev mode without a signed webhook secret — parse raw body directly
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.id;

      await prisma.order.updateMany({
        where: { stripeSessionId: sessionId },
        data: { paymentStatus: "paid" },
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook processing error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

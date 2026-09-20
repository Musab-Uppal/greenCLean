import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db, updateOrderPayment } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    const rawBody = await request.text();
    let event;

    if (webhookSecret && !webhookSecret.includes("placeholder")) {
      const sig = request.headers.get("stripe-signature");
      event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } else {
      // In dev or without webhook signing secret
      try {
        event = JSON.parse(rawBody);
      } catch {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
      }
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const sessionId = session.id;

      // Update matching orders in SQLite database to paid
      const stmt = db.prepare(`
        UPDATE orders 
        SET payment_status = 'paid', status = 'confirmed' 
        WHERE stripe_session_id = ?
      `);
      stmt.run(sessionId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook processing error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      items = [],
      customer = {},
      scheduledDate,
      selectedTimeSlot,
      notes = "",
      discountPercent = 0,
      totalAmount = 0
    } = body;

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No services selected for checkout." },
        { status: 400 }
      );
    }

    if (!customer.email || !customer.address || !customer.postcode) {
      return NextResponse.json(
        { error: "Customer details and Liverpool service address are required." },
        { status: 400 }
      );
    }

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const discountMultiplier = discountPercent > 0 ? (100 - discountPercent) / 100 : 1;

    // Build Stripe Line Items strictly in GBP (UK currency)
    const line_items = items.map((item) => {
      const discountedUnitPounds = item.price * discountMultiplier;
      const unitAmountInPence = Math.max(50, Math.round(discountedUnitPounds * 100)); // pence

      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.name,
            description: `Eco-friendly service in Liverpool & Merseyside (${item.duration || "Professional Clean"})`,
          },
          unit_amount: unitAmountInPence,
        },
        quantity: item.qty || 1,
      };
    });

    // Metadata payload
    const metadata = {
      customer_name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
      customer_email: customer.email,
      customer_phone: customer.phone || "",
      customer_address: customer.address,
      customer_postcode: customer.postcode,
      scheduled_date: scheduledDate || "",
      time_slot: selectedTimeSlot || "",
      notes: notes.slice(0, 400),
      items_json: JSON.stringify(
        items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, price: i.price, db_id: i.db_id }))
      ).slice(0, 500),
      total_amount: String(totalAmount || 0),
    };

    // If Stripe keys are not yet configured with a live/test key, provide seamless test mode redirect
    if (!isStripeConfigured()) {
      const mockSessionId = `mock_session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      // Save metadata in a short-lived cache or pass via redirect
      return NextResponse.json({
        url: `${origin}/book/success?session_id=${mockSessionId}&mock=true`,
        sessionId: mockSessionId,
        isMock: true,
        message: "Stripe key is in test/mock mode. Set STRIPE_SECRET_KEY in .env for live processing."
      });
    }

    // Create real Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: customer.email,
      client_reference_id: customer.email,
      metadata,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["GB"],
      },
      locale: "en-GB",
      success_url: `${origin}/book/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/book?payment_status=cancelled`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Stripe checkout creation error:", error);

    // If it was an authentication error with Stripe API (e.g. invalid key during test)
    if (error.type === "StripeAuthenticationError" || error.code === "api_key_expired") {
      const origin =
        request.headers.get("origin") ||
        process.env.NEXT_PUBLIC_BASE_URL ||
        "http://localhost:3000";
      const mockSessionId = `test_session_${Date.now()}`;
      return NextResponse.json({
        url: `${origin}/book/success?session_id=${mockSessionId}&mock=true`,
        sessionId: mockSessionId,
        isMock: true,
      });
    }

    return NextResponse.json(
      { error: error.message || "Failed to create Stripe checkout session." },
      { status: 500 }
    );
  }
}

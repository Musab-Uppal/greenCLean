import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

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
    console.error("[Stripe checkout]", error);

    if (error.type === "StripeConnectionError" || error.code === "ECONNREFUSED") {
      return NextResponse.json(
        { error: "Could not connect to payment servers. Please check your internet connection and try again." },
        { status: 503 }
      );
    }

    if (error.type === "StripeAuthenticationError") {
      return NextResponse.json(
        { error: "Payment gateway configuration error. Please contact support." },
        { status: 500 }
      );
    }

    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invalid payment request. Please review your booking details and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Unable to start secure checkout. Please try again or choose a different payment method." },
      { status: 500 }
    );
  }
}


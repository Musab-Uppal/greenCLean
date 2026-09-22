import { NextResponse } from "next/server";
import { createPayPalOrder, isPayPalConfigured } from "@/lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    // Fail fast with a clear message if keys aren't set yet
    if (!isPayPalConfigured()) {
      return NextResponse.json(
        { error: "PayPal payments are not yet available. Please use card payment or pay on arrival." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      items = [],
      customer = {},
      scheduledDate,
      selectedTimeSlot,
      notes = "",
      discountPercent = 0,
      totalAmount = 0,
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

    if (!totalAmount || Number(totalAmount) <= 0) {
      return NextResponse.json(
        { error: "Invalid order amount." },
        { status: 400 }
      );
    }

    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    const customerName = `${customer.firstName || ""} ${customer.lastName || ""}`.trim();

    // Encode booking data into the return URL so it survives the PayPal redirect
    // without needing a server-side session store
    const returnParams = new URLSearchParams({
      provider: "paypal",
      email: customer.email,
      address: `${customer.address}, ${customer.postcode}`,
      phone: customer.phone || "",
      name: customerName,
      date: scheduledDate || "",
      slot: selectedTimeSlot || "",
      total: String(totalAmount),
      items: Buffer.from(
        JSON.stringify(
          items.map((i) => ({
            id: i.id,
            name: i.name,
            qty: i.qty,
            price: i.price,
            db_id: i.db_id,
          }))
        )
      ).toString("base64"),
    });

    const { orderId, approvalUrl } = await createPayPalOrder({
      amountGBP: Number(totalAmount),
      description: `Green Clean Group – ${items.map((i) => i.name).join(", ")}`.slice(0, 127),
      returnUrl: `${origin}/book/success?${returnParams.toString()}`,
      cancelUrl: `${origin}/book?payment_status=cancelled`,
      metadata: {
        email: customer.email,
        scheduled_date: scheduledDate || "",
        time_slot: selectedTimeSlot || "",
      },
    });

    return NextResponse.json({ url: approvalUrl, orderId });
  } catch (error) {
    // Log full error server-side, return safe message to client
    console.error("[PayPal create-order]", error);

    const userMessage = error.isConfigError
      ? "PayPal payments are not yet available. Please use card payment or pay on arrival."
      : (error.message || "Unable to start PayPal checkout. Please try again or choose a different payment method.");

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}

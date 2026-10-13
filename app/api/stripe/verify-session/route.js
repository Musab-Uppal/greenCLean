import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import {
  prisma,
  createOrder,
  getOrdersByStripeSessionId,
  saveSubscriber,
} from "@/lib/db";
import { subscribeToMailchimp } from "@/lib/mailchimp";

const BOOKING_CONSENT_WORDING =
  "I'd like to receive cleaning reminders and special offers by email from Green Clean Group. I can unsubscribe at any time.";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // 1. Check if order was already recorded for this session
    const existingOrders = await getOrdersByStripeSessionId(sessionId);
    if (existingOrders && existingOrders.length > 0) {
      const firstOrder = existingOrders[0];
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        bookingRef: `GCG-${firstOrder.order_id + 10000}`,
        scheduledDate: firstOrder.scheduled_date,
        address: firstOrder.address,
        phone: firstOrder.order_phone,
        email: firstOrder.customer_email,
        paymentStatus: firstOrder.payment_status,
        paymentMethod: firstOrder.payment_method,
        totalAmount: firstOrder.total_amount,
        items: firstOrder.items || [],
        orderId: firstOrder.order_id,
        orderIds: [firstOrder.order_id],
        orders: existingOrders,
      });
    }

    // 2. Retrieve real session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return NextResponse.json(
        { error: "Stripe checkout session not found." },
        { status: 404 }
      );
    }

    const isPaid = session.payment_status === "paid";
    const meta = session.metadata || {};
    const email = meta.customer_email || session.customer_details?.email || session.client_reference_id;
    const phone = meta.customer_phone || session.customer_details?.phone || "07359068284";
    const address = `${meta.customer_address || "Liverpool City Centre"}, ${meta.customer_postcode || "L1"}`;
    const scheduled_date = meta.scheduled_date && meta.time_slot
      ? `${meta.scheduled_date} ${meta.time_slot}`
      : meta.scheduled_date || "Confirmed UK Window";
    const totalAmount = session.amount_total ? session.amount_total / 100 : Number(meta.total_amount || 0);

    // 3. Parse items and insert order
    let items = [];
    try {
      if (meta.items_json) {
        items = JSON.parse(meta.items_json);
      }
    } catch (_) {}

    const orderItems = [];
    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        let resolvedId = it.db_id;
        if (!resolvedId && it.id) {
          const row = await prisma.productService.findFirst({
            where: { OR: [{ slug: String(it.id) }, { id: Number(it.id) || -1 }] },
            select: { id: true, price: true, name: true },
          });
          if (row) {
            resolvedId = row.id;
            it.name = it.name || row.name;
          }
        }

        if (resolvedId) {
          orderItems.push({
            product_service_id: resolvedId,
            price: Number(it.price) || 0,
            name: it.name,
          });
        }
      }
    }

    if (orderItems.length === 0) {
      const defaultService = await prisma.productService.findFirst({
        select: { id: true, price: true, name: true },
      });
      if (defaultService) {
        orderItems.push({
          product_service_id: defaultService.id,
          price: totalAmount,
          name: defaultService.name,
        });
      }
    }

    const hasMarketingConsent = meta.marketing_consent === "true";
    const consentDate = hasMarketingConsent ? new Date().toISOString() : null;

    const orderRes = await createOrder({
      product_service_id: orderItems[0]?.product_service_id,
      customer_email: email,
      address,
      phoneno: phone,
      status: "pending",
      scheduled_date,
      payment_method: "creditcard",
      payment_status: isPaid ? "paid" : "pending",
      stripe_session_id: session.id,
      total_amount: totalAmount,
      items: orderItems,
      marketing_consent: hasMarketingConsent,
      consent_date: consentDate,
      consent_wording: hasMarketingConsent ? BOOKING_CONSENT_WORDING : null,
      consent_source: "booking-stripe",
    });

    const orderId = orderRes.lastInsertRowid;
    const bookingRef = `GCG-${orderId + 10000}`;

    // ── Mailchimp + DB: Only subscribe if explicit consent given ──
    if (email && hasMarketingConsent) {
      const fullName = meta.customer_name || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      saveSubscriber({
        email,
        firstName,
        lastName,
        phone,
        source: "booking-stripe",
        marketing_consent: true,
        consent_date: consentDate,
        consent_wording: BOOKING_CONSENT_WORDING,
        consent_source: "booking-stripe",
      }).catch((err) => console.error("[DB saveSubscriber] Stripe error:", err));

      subscribeToMailchimp({
        email,
        firstName,
        lastName,
        phone,
        tags: ["Booked", "Paid Customer", "Stripe", "Booking Form Opt-in"],
      }).catch((err) => console.error("[Mailchimp] Stripe subscribe failed silently:", err));
    }
    // ────────────────────────────────────────────────────────────────────────

    return NextResponse.json({
      success: true,
      bookingRef,
      scheduledDate: scheduled_date,
      address,
      phone,
      email,
      paymentStatus: isPaid ? "paid" : "pending",
      paymentMethod: "creditcard",
      totalAmount,
      orderId,
      orderIds: [orderId],
      items: orderItems,
    });
  } catch (error) {
    console.error("[Stripe verify-session]", error);
    if (error.type === "StripeConnectionError") {
      return NextResponse.json(
        { error: "Could not reach payment servers to verify your booking. Please refresh the page or contact support." },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { error: "Could not verify your payment. Please contact support at 07359 068284." },
      { status: 500 }
    );
  }
}

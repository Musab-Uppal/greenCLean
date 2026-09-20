import { NextResponse } from "next/server";
import { stripe, isStripeConfigured } from "@/lib/stripe";
import { 
  db, 
  getUserByEmail, 
  createUser, 
  createOrder, 
  getOrdersByStripeSessionId 
} from "@/lib/db";

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
    const existingOrders = getOrdersByStripeSessionId(sessionId);
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
        orders: existingOrders,
      });
    }

    // 2. Handle Mock Session in Dev/Test Mode
    if (sessionId.startsWith("mock_") || sessionId.startsWith("test_") || !isStripeConfigured()) {
      return NextResponse.json({
        success: true,
        isMock: true,
        bookingRef: `GCG-${Math.floor(10000 + Math.random() * 90000)}`,
        scheduledDate: "Tomorrow (Confirmed Slot)",
        address: "Liverpool, Merseyside",
        email: "customer@greencleangroup.co.uk",
        paymentStatus: "paid",
        paymentMethod: "creditcard",
        totalAmount: 50.00,
        message: "Booking verified in mock/test payment mode."
      });
    }

    // 3. Retrieve real session from Stripe
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

    // 4. Find or create user
    let user = getUserByEmail(email);
    if (!user) {
      const userRes = createUser({
        email,
        phone,
        password: "guest_stripe_account"
      });
      user = { id: userRes.lastInsertRowid, email, phone };
    }

    // 5. Parse items and insert orders
    let items = [];
    try {
      if (meta.items_json) {
        items = JSON.parse(meta.items_json);
      }
    } catch (_) {}

    const createdOrderIds = [];
    if (Array.isArray(items) && items.length > 0) {
      for (const it of items) {
        let resolvedId = it.db_id;
        if (!resolvedId && it.id) {
          const row = db.prepare("SELECT id FROM product_service WHERE slug = ? OR id = ?").get(it.id, it.id);
          if (row) resolvedId = row.id;
        }

        if (resolvedId) {
          const res = createOrder({
            product_service_id: resolvedId,
            customer_id: user.id,
            address,
            phoneno: phone,
            status: "confirmed",
            scheduled_date,
            payment_method: "creditcard",
            payment_status: isPaid ? "paid" : "pending",
            stripe_session_id: session.id,
            total_amount: it.price || totalAmount
          });
          createdOrderIds.push(res.lastInsertRowid);
        }
      }
    } else {
      // Fallback: pick primary service
      const defaultService = db.prepare("SELECT id FROM product_service LIMIT 1").get();
      if (defaultService) {
        const res = createOrder({
          product_service_id: defaultService.id,
          customer_id: user.id,
          address,
          phoneno: phone,
          status: "confirmed",
          scheduled_date,
          payment_method: "creditcard",
          payment_status: isPaid ? "paid" : "pending",
          stripe_session_id: session.id,
          total_amount: totalAmount
        });
        createdOrderIds.push(res.lastInsertRowid);
      }
    }

    const firstOrderId = createdOrderIds[0] || Math.floor(1000 + Math.random() * 9000);
    const bookingRef = `GCG-${firstOrderId + 10000}`;

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
      orderIds: createdOrderIds
    });
  } catch (error) {
    console.error("Stripe verify session error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify Stripe payment session" },
      { status: 500 }
    );
  }
}

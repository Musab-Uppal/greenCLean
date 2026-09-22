import { NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypal";
import { getUserByEmail, createUser, createOrder, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/paypal/capture-order
 *
 * Called from SuccessContent after PayPal redirects back.
 * Query params:
 *   token      - PayPal Order ID (set by PayPal on return)
 *   email      - customer email
 *   address    - full address string
 *   phone      - customer phone
 *   name       - customer full name
 *   date       - scheduled date
 *   slot       - time slot
 *   total      - total amount (GBP)
 *   items      - base64 encoded JSON array of cart items
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const paypalOrderId = searchParams.get("token");

    if (!paypalOrderId) {
      return NextResponse.json(
        { error: "PayPal order token is required." },
        { status: 400 }
      );
    }

    // Check if this order was already captured / recorded in DB
    const existingOrders = await prisma.order.findMany({
      where: { stripeSessionId: `paypal_${paypalOrderId}` },
      include: {
        customer: true,
        orderItems: { include: { productService: true } },
      },
    });

    if (existingOrders.length > 0) {
      const o = existingOrders[0];
      return NextResponse.json({
        success: true,
        alreadyProcessed: true,
        bookingRef: `GCG-${o.id + 10000}`,
        scheduledDate: o.scheduledDate,
        address: o.address,
        phone: o.phoneno,
        email: o.customer?.email,
        paymentStatus: o.paymentStatus,
        paymentMethod: "paypal",
        totalAmount: o.totalAmount,
        items: o.orderItems.map((oi) => ({
          service_name: oi.productService?.name,
          price: oi.price,
        })),
        orderId: o.id,
      });
    }

    // Capture the PayPal payment
    const capture = await capturePayPalOrder(paypalOrderId);

    const captureStatus = capture.status; // "COMPLETED" on success
    const isPaid = captureStatus === "COMPLETED";

    // Extract data passed via query string from the return URL
    const email = searchParams.get("email") || "";
    const address = searchParams.get("address") || "Liverpool, Merseyside";
    const phone = searchParams.get("phone") || "";
    const name = searchParams.get("name") || "";
    const scheduledDate = searchParams.get("date") || "";
    const timeSlot = searchParams.get("slot") || "";
    const totalAmount = Number(searchParams.get("total") || 0);
    const itemsB64 = searchParams.get("items") || "";

    const scheduled_date = scheduledDate && timeSlot
      ? `${scheduledDate} ${timeSlot}`
      : scheduledDate || "Confirmed UK Window";

    // Decode items
    let items = [];
    try {
      if (itemsB64) {
        items = JSON.parse(Buffer.from(itemsB64, "base64").toString("utf8"));
      }
    } catch (_) {}

    // Find or create user
    let user = await getUserByEmail(email);
    if (!user) {
      user = await createUser({
        email,
        phone,
        password: "guest_paypal_account",
      });
    }

    // Resolve order items
    const orderItems = [];
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

    const orderRes = await createOrder({
      product_service_id: orderItems[0]?.product_service_id,
      customer_id: user.id,
      address,
      phoneno: phone,
      status: "pending",
      scheduled_date,
      payment_method: "paypal",
      payment_status: isPaid ? "paid" : "pending",
      stripe_session_id: `paypal_${paypalOrderId}`, // reuse field to store PayPal reference
      total_amount: totalAmount,
      items: orderItems,
    });

    const orderId = orderRes.lastInsertRowid;
    const bookingRef = `GCG-${orderId + 10000}`;

    return NextResponse.json({
      success: true,
      bookingRef,
      scheduledDate: scheduled_date,
      address,
      phone,
      email,
      name,
      paymentStatus: isPaid ? "paid" : "pending",
      paymentMethod: "paypal",
      totalAmount,
      orderId,
      items: orderItems,
    });
  } catch (error) {
    console.error("[PayPal capture-order]", error);

    const userMessage = error.isConfigError
      ? "PayPal payments are not yet available. Please contact support."
      : "Payment confirmation failed. If you were charged, please contact us at 07359 068284 and we will resolve it immediately.";

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma, createOrder, getOrders, getOrderById, saveSubscriber, isDateBlocked, isSlotBooked } from "@/lib/db";
import { subscribeToMailchimp, sendBookingConfirmationEmails } from "@/lib/mailchimp";
import { sanitizeOrderBody, sanitizeEmail } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

// Exact consent wording stored alongside the record — must match what the user sees on the form
const BOOKING_CONSENT_WORDING =
  "I'd like to receive cleaning reminders and special offers by email from Green Clean Group. I can unsubscribe at any time.";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawEmail = searchParams.get("customerEmail") || searchParams.get("email");
    // Sanitize query param before passing to DB
    const email = rawEmail ? sanitizeEmail(rawEmail) : null;

    const orders = await getOrders(email);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error retrieving orders from DB:", error);
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const rawBody = await request.json();

    // ── Sanitize & validate all inputs ──────────────────────────────────────
    const { errors, data: body } = sanitizeOrderBody(rawBody);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors[0] }, { status: 400 });
    }

    const {
      email,
      address,
      phoneno,
      scheduled_date,
      payment_method,
      coupon_code: couponCode,
      discount_amount: discountAmount,
      total_amount,
      marketingConsent,
      firstName,
      lastName,
    } = body;

    // Pull through raw (safe) fields that sanitizeOrderBody doesn't cover
    const stripe_session_id =
      typeof rawBody?.stripe_session_id === "string"
        ? rawBody.stripe_session_id.replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 200)
        : null;

    const product_service_id = rawBody?.product_service_id ?? null;
    const items = Array.isArray(rawBody?.items) ? rawBody.items : [];
    const phone = rawBody?.phone ?? phoneno;

    if (!email || !address || !phoneno) {
      return NextResponse.json(
        { error: "Email, address, and phone number are required" },
        { status: 400 }
      );
    }

    // Check if the requested booking date is blocked by admin leave
    if (scheduled_date && (await isDateBlocked(scheduled_date))) {
      return NextResponse.json(
        { error: "The selected date is unavailable for bookings due to scheduled admin leave. Please select another date." },
        { status: 400 }
      );
    }

    // Check if the requested date + time slot is already booked
    if (scheduled_date && (await isSlotBooked(scheduled_date))) {
      return NextResponse.json(
        { error: "This time slot is already booked. Please select another available time slot." },
        { status: 409 }
      );
    }

    // 2. Resolve items for single order — validate each item ID against DB
    const orderItems = [];
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        // Only accept numeric db_id or slug strings — no arbitrary injection
        let resolvedServiceId = item.db_id ? parseInt(item.db_id, 10) : null;
        if (!resolvedServiceId && item.id) {
          const idStr = String(item.id).replace(/[^a-zA-Z0-9_\-]/g, "").slice(0, 100);
          const serviceRow = await prisma.productService.findFirst({
            where: { OR: [{ slug: idStr }, { id: parseInt(idStr, 10) || -1 }] },
            select: { id: true, price: true },
          });
          if (serviceRow) resolvedServiceId = serviceRow.id;
        }

        if (resolvedServiceId) {
          orderItems.push({
            product_service_id: resolvedServiceId,
            price: Math.max(0, Number(item.price) || 0),
          });
        }
      }
    } else if (product_service_id) {
      const psId = parseInt(String(product_service_id), 10);
      if (psId > 0) {
        orderItems.push({
          product_service_id: psId,
          price: Math.max(0, Number(total_amount) || 0),
        });
      }
    }

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: "At least one valid product/service must be specified" },
        { status: 400 }
      );
    }

    const calculatedTotal =
      total_amount !== null && total_amount !== undefined
        ? Math.max(0, Number(total_amount))
        : orderItems.reduce((sum, it) => sum + it.price, 0);

    const consentDate = marketingConsent ? new Date().toISOString() : null;

    const orderRes = await createOrder({
      product_service_id: orderItems[0]?.product_service_id,
      customer_email: email,
      address,
      phoneno,
      status: "pending", // Always pending from public endpoint
      scheduled_date,
      payment_method,
      payment_status: "pending",
      stripe_session_id,
      total_amount: calculatedTotal,
      items: orderItems,
      marketing_consent: !!marketingConsent,
      consent_date: consentDate,
      consent_wording: marketingConsent ? BOOKING_CONSENT_WORDING : null,
      consent_source: "booking-form",
      coupon_code: couponCode || null,
      discount_amount: Math.max(0, discountAmount),
    });

    const orderId = orderRes.lastInsertRowid;

    const customerPhone = phone || phoneno || "";

    // ── Only sync to Mailchimp if customer explicitly opted in ──
    if (marketingConsent && email) {
      // Save locally to PostgreSQL database with consent record
      saveSubscriber({
        email,
        firstName,
        lastName,
        phone: customerPhone,
        source: "booking-form",
        marketing_consent: true,
        consent_date: consentDate,
        consent_wording: BOOKING_CONSENT_WORDING,
        consent_source: "booking-form",
      }).catch((err) => console.error("[DB saveSubscriber] Failed silently:", err));

      // Sync to Mailchimp — respects unsubscribed status
      subscribeToMailchimp({
        email,
        firstName,
        lastName,
        phone: customerPhone,
        tags: ["Booked", `Payment: ${payment_method}`, "Booking Form Opt-in"],
      }).catch((err) => console.error("[Mailchimp] subscribe failed silently:", err));
    } else if (email) {
      // Save to local DB without consent (for order records only, no email marketing)
      saveSubscriber({
        email,
        firstName,
        lastName,
        phone: customerPhone,
        source: "booking-form",
        marketing_consent: false,
      }).catch((err) => console.error("[DB saveSubscriber] Failed silently:", err));
    }

    // Fetch complete items with service names from DB so notification emails include clear service titles
    let emailItems = orderItems;
    try {
      const fullOrder = await getOrderById(orderId);
      if (fullOrder && Array.isArray(fullOrder.items) && fullOrder.items.length > 0) {
        emailItems = fullOrder.items;
      }
    } catch (fetchErr) {
      console.warn("[Orders route] Could not fetch full order items for email:", fetchErr);
    }

    // ── Send Booking Confirmation Emails to Customer & Admin ──
    try {
      await sendBookingConfirmationEmails({
        orderId,
        customerEmail: email,
        customerName: `${firstName || ""} ${lastName || ""}`.trim() || email.split("@")[0],
        customerPhone,
        address,
        scheduledDate: scheduled_date,
        totalAmount: calculatedTotal,
        paymentMethod: payment_method,
        paymentStatus: "pending",
        items: emailItems,
        marketingConsent: !!marketingConsent,
      });
    } catch (err) {
      console.error("[sendBookingConfirmationEmails] error:", err);
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      orderIds: [orderId],
      totalAmount: calculatedTotal,
      message: "Order successfully placed and recorded in database."
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}

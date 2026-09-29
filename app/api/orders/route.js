import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createOrder, getOrders } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    const orders = await getOrders(customerId ? parseInt(customerId, 10) : null);
    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error retrieving orders from DB:", error);
    return NextResponse.json({ error: "Failed to retrieve orders" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      email, 
      phone, 
      product_service_id, 
      items = [],
      address, 
      phoneno,
      scheduled_date = null,
      status = "pending",
      payment_method = "local",
      payment_status = "pending",
      stripe_session_id = null,
      total_amount = null
    } = body;

    if (!email || !address || !phoneno) {
      return NextResponse.json(
        { error: "Email, address, and phone number are required" },
        { status: 400 }
      );
    }

    // Persist order — email and phone stored directly on the order row

    // 2. Resolve items for single order
    const orderItems = [];
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        let resolvedServiceId = item.db_id;
        if (!resolvedServiceId && item.id) {
          const serviceRow = await prisma.productService.findFirst({
            where: { OR: [{ slug: String(item.id) }, { id: Number(item.id) || -1 }] },
            select: { id: true, price: true },
          });
          if (serviceRow) resolvedServiceId = serviceRow.id;
        }

        if (resolvedServiceId) {
          orderItems.push({
            product_service_id: resolvedServiceId,
            price: Number(item.price) || 0
          });
        }
      }
    } else if (product_service_id) {
      orderItems.push({
        product_service_id,
        price: Number(total_amount) || 0
      });
    }

    if (orderItems.length === 0) {
      return NextResponse.json(
        { error: "At least one product/service must be specified" },
        { status: 400 }
      );
    }

    const calculatedTotal = total_amount !== null && total_amount !== undefined
      ? Number(total_amount)
      : orderItems.reduce((sum, it) => sum + it.price, 0);

    const validStatus = (status || "").toLowerCase().trim() === "completed" ? "completed" : "pending";

    const orderRes = await createOrder({
      product_service_id: orderItems[0]?.product_service_id,
      customer_email: email,
      address,
      phoneno,
      status: validStatus,
      scheduled_date,
      payment_method,
      payment_status,
      stripe_session_id,
      total_amount: calculatedTotal,
      items: orderItems
    });

    const orderId = orderRes.lastInsertRowid;

    return NextResponse.json({
      success: true,
      customerId: user.id,
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

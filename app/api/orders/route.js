import { NextResponse } from "next/server";
import { createUser, getUserByEmail, createOrder, getOrders, db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");

    const orders = getOrders(customerId ? parseInt(customerId, 10) : null);
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
      password = "guest_default_password", 
      product_service_id, 
      items = [],
      address, 
      phoneno,
      scheduled_date = null,
      status = "confirmed"
    } = body;

    if (!email || !address || !phoneno) {
      return NextResponse.json(
        { error: "Email, address, and phone number are required" },
        { status: 400 }
      );
    }

    // 1. Find or create user
    let user = getUserByEmail(email);
    if (!user) {
      const userRes = createUser({
        email,
        phone: phone || phoneno,
        password
      });
      user = { id: userRes.lastInsertRowid, email, phone };
    }

    // 2. Create Order(s)
    const createdOrders = [];
    
    // If cart items are passed, insert an order for each product/service as per the schema
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        // Resolve product_service_id from item.db_id or item.id (slug)
        let resolvedServiceId = item.db_id;
        if (!resolvedServiceId && item.id) {
          const serviceRow = db.prepare("SELECT id FROM product_service WHERE slug = ? OR id = ?").get(item.id, item.id);
          if (serviceRow) resolvedServiceId = serviceRow.id;
        }

        if (resolvedServiceId) {
          const orderRes = createOrder({
            product_service_id: resolvedServiceId,
            customer_id: user.id,
            address,
            phoneno,
            status,
            scheduled_date
          });
          createdOrders.push(orderRes.lastInsertRowid);
        }
      }
    } else if (product_service_id) {
      const orderRes = createOrder({
        product_service_id,
        customer_id: user.id,
        address,
        phoneno,
        status,
        scheduled_date
      });
      createdOrders.push(orderRes.lastInsertRowid);
    } else {
      return NextResponse.json(
        { error: "At least one product/service must be specified" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      customerId: user.id,
      orderIds: createdOrders,
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

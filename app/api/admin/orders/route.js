import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { getOrders, updateOrderStatus, updateOrder } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = getOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Admin get orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, scheduled_date, address, phoneno } = body;

    if (!id) {
      return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
    }

    if (status !== undefined) {
      updateOrderStatus(id, status);
    }

    if (scheduled_date !== undefined || address !== undefined || phoneno !== undefined) {
      updateOrder(id, { scheduled_date, address, phoneno });
    }

    return NextResponse.json({
      success: true,
      message: `Order #${id} updated successfully.`
    });
  } catch (error) {
    console.error("Admin patch order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

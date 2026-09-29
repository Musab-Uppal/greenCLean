import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { getOrders, updateOrderStatus, updateOrder, getOrderById } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await getOrders();
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

    const existingOrder = await getOrderById(id);
    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    // Determine final status
    const finalStatus =
      status !== undefined
        ? String(status).toLowerCase().trim()
        : (existingOrder.status || "pending").toLowerCase().trim();

    // Restrict changing time to pending orders only
    if (scheduled_date !== undefined && finalStatus === "completed") {
      return NextResponse.json(
        {
          error:
            "Cannot change scheduled time for completed orders. Only pending orders can be rescheduled.",
        },
        { status: 400 }
      );
    }

    if (status !== undefined) {
      const normalizedStatus = String(status).toLowerCase().trim();
      if (!["pending", "completed"].includes(normalizedStatus)) {
        return NextResponse.json(
          { error: "Invalid status. Order status must be either 'pending' or 'completed'." },
          { status: 400 }
        );
      }
      await updateOrderStatus(id, normalizedStatus);
    }

    if (scheduled_date !== undefined || address !== undefined || phoneno !== undefined) {
      await updateOrder(id, { scheduled_date, address, phoneno });
    }

    const updatedOrder = await getOrderById(id);

    return NextResponse.json({
      success: true,
      message: `Order #${id} updated successfully.`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Admin patch order error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

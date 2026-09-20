import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "@/lib/auth";
import { getOrderById, updateOrderScheduleTime } from "@/lib/db";

import { getUkDateString, normalizeTimeSlot } from "@/lib/dateUtils";

export const dynamic = "force-dynamic";

function isTodayOrPast(dateStr) {
  if (!dateStr) return false;
  const datePart = dateStr.split(" ")[0];
  const todayInUk = getUkDateString();
  return datePart <= todayInUk;
}

export async function PATCH(request, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload || !payload.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const orderId = parseInt(resolvedParams.id, 10);
    const order = getOrderById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Ensure the order belongs to the logged-in user
    if (order.customer_id !== payload.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Block editing completed orders
    if (order.status === "completed") {
      return NextResponse.json({ error: "Cannot edit a completed order" }, { status: 400 });
    }

    // Block editing if the service is currently scheduled for today (or in the past)
    if (isTodayOrPast(order.scheduled_date)) {
      return NextResponse.json(
        { error: "Cannot reschedule an order on or after the service date" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const existingDateStr = order.scheduled_date || order.created_at || "";
    const existingDatePart = existingDateStr.split(" ")[0] || "";
    const existingTimePart = existingDateStr.indexOf(" ") !== -1 ? existingDateStr.slice(existingDateStr.indexOf(" ") + 1).trim() : "9:00 - 11:00";

    let newDate = (body?.date || "").trim();
    let newTime = (body?.time || body?.timeSlot || "").trim();

    if (!newDate) {
      newDate = existingDatePart;
    }
    if (!newTime) {
      newTime = existingTimePart;
    }

    if (!newDate || !newTime) {
      return NextResponse.json({ error: "Date and time are required" }, { status: 400 });
    }

    // Validate date format YYYY-MM-DD
    const dateParts = newDate.split("-");
    if (dateParts.length !== 3) {
      return NextResponse.json({ error: "Invalid date format. Expected YYYY-MM-DD." }, { status: 400 });
    }

    const todayInUk = getUkDateString();
    // New date cannot be today or in the past in Liverpool UK timezone
    if (newDate <= todayInUk) {
      return NextResponse.json(
        { error: "New schedule date must be in the future (from tomorrow onwards)" },
        { status: 400 }
      );
    }

    const normalizedTime = normalizeTimeSlot(newTime);
    const newScheduledDate = `${newDate} ${normalizedTime}`;
    updateOrderScheduleTime(orderId, newScheduledDate);

    return NextResponse.json({ success: true, scheduled_date: newScheduledDate });
  } catch (error) {
    console.error("Order update error:", error);
    return NextResponse.json({ error: "Failed to update order schedule" }, { status: 500 });
  }
}



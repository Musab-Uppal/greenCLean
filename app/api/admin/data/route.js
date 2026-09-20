import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { getOrders, getCategoriesWithCount, getAllServices } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json(
        { error: "Unauthorized. Admin credentials required." },
        { status: 401 }
      );
    }

    const orders = getOrders();
    const categories = getCategoriesWithCount();
    const services = getAllServices();

    // Calculate executive KPIs
    let totalRevenue = 0;
    let pendingCount = 0;
    let confirmedCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;

    orders.forEach((order) => {
      const price = Number(order.service_price) || 0;
      if (order.status !== "cancelled") {
        totalRevenue += price;
      }
      const st = (order.status || "").toLowerCase();
      if (st === "pending") pendingCount++;
      else if (st === "confirmed") confirmedCount++;
      else if (st === "completed") completedCount++;
      else if (st === "cancelled") cancelledCount++;
    });

    return NextResponse.json({
      success: true,
      orders,
      categories,
      services,
      kpis: {
        totalOrders: orders.length,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingCount,
        confirmedCount,
        completedCount,
        cancelledCount
      }
    });
  } catch (error) {
    console.error("Admin data route error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve administrator data." },
      { status: 500 }
    );
  }
}

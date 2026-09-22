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

    const [orders, categories, services] = await Promise.all([
      getOrders(),
      getCategoriesWithCount(),
      getAllServices(),
    ]);

    // Calculate executive KPIs
    // 1. Order status is strictly 'pending' or 'completed'.
    // 2. Revenue rules:
    //    - Card payments: ONLY when received (payment_status === 'paid')
    //    - Local payments: ONLY when order is completed (status === 'completed')
    let totalRevenue = 0;
    let pendingCount = 0;
    let completedCount = 0;

    orders.forEach((order) => {
      const amount = Number(order.total_amount) > 0 ? Number(order.total_amount) : Number(order.service_price) || 0;
      const paymentMethod = (order.payment_method || "local").toLowerCase().trim();
      const paymentStatus = (order.payment_status || "pending").toLowerCase().trim();
      const status = (order.status || "pending").toLowerCase().trim();

      const isCardPaymentReceived =
        (paymentMethod === "creditcard" || paymentMethod === "card" || paymentMethod === "stripe") &&
        paymentStatus === "paid";
      const isLocalPaymentCompleted =
        paymentMethod === "local" && status === "completed";

      if (isCardPaymentReceived || isLocalPaymentCompleted) {
        totalRevenue += amount;
      }

      if (status === "completed") {
        completedCount++;
      } else {
        pendingCount++;
      }
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
        completedCount
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

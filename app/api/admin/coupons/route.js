import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "@/lib/db";

export const dynamic = "force-dynamic";

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token || !verifyAdminToken(token)) {
    return false;
  }
  return true;
}

export async function GET() {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const coupons = await getAllCoupons();
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error("Admin GET coupons error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      code,
      discountType = "percentage",
      discountValue,
      minOrderAmount = 0,
      maxUses = null,
      expiresAt = null,
      isActive = true,
    } = body;

    if (!code || !String(code).trim()) {
      return NextResponse.json({ error: "Coupon code is required." }, { status: 400 });
    }

    const parsedDiscount = parseFloat(discountValue);
    if (isNaN(parsedDiscount) || parsedDiscount <= 0) {
      return NextResponse.json(
        { error: "Please enter a valid discount amount greater than 0." },
        { status: 400 }
      );
    }

    if (discountType === "percentage" && parsedDiscount > 100) {
      return NextResponse.json(
        { error: "Percentage discount cannot exceed 100%." },
        { status: 400 }
      );
    }

    const coupon = await createCoupon({
      code: String(code).trim().toUpperCase(),
      discountType: discountType === "fixed" ? "fixed" : "percentage",
      discountValue: parsedDiscount,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
      maxUses: maxUses ? parseInt(maxUses, 10) : null,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      isActive: isActive !== false,
    });

    return NextResponse.json({ success: true, coupon });
  } catch (error) {
    console.error("Admin POST coupon error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A coupon with this code already exists. Please choose or generate a unique code." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Failed to create coupon." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required." }, { status: 400 });
    }

    const updated = await updateCoupon(id, data);
    return NextResponse.json({ success: true, coupon: updated });
  } catch (error) {
    console.error("Admin PATCH coupon error:", error);
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "A coupon with this code already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: error?.message || "Failed to update coupon." },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Coupon ID is required." }, { status: 400 });
    }

    await deleteCoupon(id);
    return NextResponse.json({ success: true, message: "Coupon deleted successfully." });
  } catch (error) {
    console.error("Admin DELETE coupon error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete coupon." },
      { status: 500 }
    );
  }
}

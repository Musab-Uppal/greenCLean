import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/db";
import { sanitizeCouponCode, parseNonNegativeFloat } from "@/lib/sanitize";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body?.code || typeof body.code !== "string" || !body.code.trim()) {
      return NextResponse.json(
        { valid: false, error: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const code = sanitizeCouponCode(body.code);
    if (!code) {
      return NextResponse.json(
        { valid: false, error: "Invalid coupon code format." },
        { status: 400 }
      );
    }

    const subtotal = parseNonNegativeFloat(body.subtotal ?? 0);

    const result = await validateCoupon(code, isNaN(subtotal) ? 0 : subtotal);

    if (!result.valid) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[validateCoupon API error]", err);
    return NextResponse.json(
      { valid: false, error: "Failed to validate coupon code." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { validateCoupon } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();
    const { code, subtotal } = body;

    if (!code || typeof code !== "string" || !code.trim()) {
      return NextResponse.json(
        { valid: false, error: "Please enter a coupon code." },
        { status: 400 }
      );
    }

    const result = await validateCoupon(code, subtotal || 0);

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

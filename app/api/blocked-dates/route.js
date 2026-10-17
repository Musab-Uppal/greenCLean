import { NextResponse } from "next/server";
import { getBlockedDateStrings } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blockedDates = await getBlockedDateStrings();
    return NextResponse.json({
      success: true,
      blockedDates,
    });
  } catch (error) {
    console.error("GET /api/blocked-dates error:", error);
    return NextResponse.json({ success: false, blockedDates: [] }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { getBookedSlotsMap } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const bookedSlots = await getBookedSlotsMap();
    return NextResponse.json(
      {
        success: true,
        bookedSlots,
      },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/booked-slots error:", error);
    return NextResponse.json({ success: false, bookedSlots: {} }, { status: 500 });
  }
}

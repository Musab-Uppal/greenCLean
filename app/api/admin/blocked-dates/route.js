import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import {
  getAllBlockedDates,
  addBlockedDate,
  addBlockedDateRange,
  deleteBlockedDate,
  deleteBlockedDateByDate,
} from "@/lib/db";

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
    const blockedDates = await getAllBlockedDates();
    return NextResponse.json({ success: true, blockedDates });
  } catch (error) {
    console.error("Admin GET blocked-dates error:", error);
    return NextResponse.json({ error: "Failed to fetch blocked dates." }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { date, startDate, endDate, reason } = body;

    // Range block (e.g., vacation / annual leave)
    if (startDate && endDate) {
      const records = await addBlockedDateRange({
        startDate,
        endDate,
        reason: reason || "Annual Leave",
      });
      return NextResponse.json({
        success: true,
        message: `Successfully blocked ${records.length} date(s) from ${startDate} to ${endDate}.`,
        blockedDates: records,
      });
    }

    // Single date block
    if (!date) {
      return NextResponse.json(
        { error: "Date or date range (startDate & endDate) is required." },
        { status: 400 }
      );
    }

    const record = await addBlockedDate({
      date,
      reason: reason || "Leave / Unavailable",
    });

    return NextResponse.json({
      success: true,
      message: `Date ${date} is now blocked from bookings.`,
      blockedDate: record,
    });
  } catch (error) {
    console.error("Admin POST blocked-dates error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to block date." },
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
    const date = searchParams.get("date");

    if (id) {
      await deleteBlockedDate(id);
      return NextResponse.json({ success: true, message: "Date unblocked successfully." });
    }

    if (date) {
      await deleteBlockedDateByDate(date);
      return NextResponse.json({ success: true, message: "Date unblocked successfully." });
    }

    return NextResponse.json(
      { error: "Must specify an id or date to unblock." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Admin DELETE blocked-dates error:", error);
    return NextResponse.json(
      { error: "Failed to unblock date." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { getMarketingConsents, getConsentExportData } from "@/lib/db";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/consents
 * Returns all marketing-consented contacts.
 * Query param: ?format=csv  → returns CSV download
 */
export async function GET(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    if (format === "csv") {
      const rows = await getConsentExportData();

      if (rows.length === 0) {
        const csv = "Email,First Name,Last Name,Phone,Consent Date,Consent Source,Consent Wording,Source Type,Record ID\n";
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="green-clean-consents-${new Date().toISOString().slice(0, 10)}.csv"`,
          },
        });
      }

      const headers = Object.keys(rows[0]);
      const csvLines = [
        headers.map((h) => `"${h}"`).join(","),
        ...rows.map((row) =>
          headers
            .map((h) => `"${String(row[h] || "").replace(/"/g, '""')}"`)
            .join(",")
        ),
      ];
      const csv = csvLines.join("\n");

      return new Response(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="green-clean-consents-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    // Default: return JSON
    const consents = await getMarketingConsents();
    return NextResponse.json({ consents, total: consents.length });
  } catch (error) {
    console.error("[Admin consents] Error:", error);
    return NextResponse.json({ error: "Failed to load consents" }, { status: 500 });
  }
}

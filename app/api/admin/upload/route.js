import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;

    if (!token || !verifyAdminToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No image file provided." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const uniqueName = `cat-${Date.now()}-${safeName}`;
      const filePath = path.join(uploadDir, uniqueName);

      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${uniqueName}`
      });
    } catch (fsError) {
      console.warn("Filesystem upload fallback to base64:", fsError.message);
      // Fallback to data URL if filesystem is read-only (e.g. serverless)
      const mime = file.type || "image/jpeg";
      const base64Url = `data:${mime};base64,${buffer.toString("base64")}`;
      return NextResponse.json({
        success: true,
        url: base64Url
      });
    }
  } catch (error) {
    console.error("Admin file upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image file. Please try again." },
      { status: 500 }
    );
  }
}

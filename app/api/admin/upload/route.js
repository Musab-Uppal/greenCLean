import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

// Whitelist of allowed MIME types for category images
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

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

    // ── Validate MIME type (server-side, not just extension) ─────────────────
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // ── Validate file size ───────────────────────────────────────────────────
    if (buffer.byteLength > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File too large. Maximum allowed size is 5 MB." },
        { status: 400 }
      );
    }

    // ── Validate magic bytes (actual file header, not just MIME claim) ───────
    const isValidImage = validateImageMagicBytes(buffer, file.type);
    if (!isValidImage) {
      return NextResponse.json(
        { error: "File content does not match the declared image type." },
        { status: 400 }
      );
    }

    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // ── Sanitize filename: strip path traversal and non-safe chars ─────────
      const originalName = path.basename(file.name || "upload");
      const ext = path.extname(originalName).toLowerCase().replace(/[^.a-z0-9]/g, "");
      const baseName = path.basename(originalName, path.extname(originalName))
        .replace(/[^a-zA-Z0-9_\-]/g, "_")
        .slice(0, 60);

      const safeName = `${baseName}${ext}`;
      const uniqueName = `cat-${Date.now()}-${safeName}`;

      // ── Ensure the final path is inside uploadDir (path traversal guard) ───
      const filePath = path.resolve(uploadDir, uniqueName);
      if (!filePath.startsWith(path.resolve(uploadDir))) {
        return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
      }

      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${uniqueName}`,
      });
    } catch (fsError) {
      console.warn("Filesystem upload fallback to base64:", fsError.message);
      // Fallback: return data URL for serverless environments
      const mime = file.type;
      const base64Url = `data:${mime};base64,${buffer.toString("base64")}`;
      return NextResponse.json({ success: true, url: base64Url });
    }
  } catch (error) {
    console.error("Admin file upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload image file. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * Checks file magic bytes to verify the actual content matches the declared MIME type.
 * Prevents polyglot attacks (e.g. a PHP file renamed to .jpg).
 */
function validateImageMagicBytes(buffer, mimeType) {
  if (buffer.length < 4) return false;

  const b = buffer;

  switch (mimeType) {
    case "image/jpeg":
      // JPEG: FF D8 FF
      return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;

    case "image/png":
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      return (
        b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47
      );

    case "image/webp":
      // WebP: RIFF????WEBP
      return (
        b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
        buffer.length > 11 &&
        b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
      );

    case "image/gif":
      // GIF: GIF87a or GIF89a
      return (
        b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 &&
        b[3] === 0x38 && (b[4] === 0x37 || b[4] === 0x39) && b[5] === 0x61
      );

    default:
      return false;
  }
}

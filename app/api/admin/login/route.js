import { NextResponse } from "next/server";
import { verifyAdminCredentials, createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    // Strictly validate types — no coercion
    const username = typeof body?.username === "string" ? body.username.trim().slice(0, 128) : "";
    const password = typeof body?.password === "string" ? body.password.slice(0, 256) : "";

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username, password);

    if (!isValid) {
      // Generic message — never reveal which field was wrong
      return NextResponse.json(
        { error: "Access Denied: Invalid credentials." },
        { status: 401 }
      );
    }

    const token = createAdminToken();

    const response = NextResponse.json({
      success: true,
      user: "admin",
      message: "Authenticated successfully.",
    });

    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,                                        // Not accessible from JS
      secure: process.env.NODE_ENV === "production",         // HTTPS-only in prod
      sameSite: "strict",                                    // CSRF protection
      path: "/",                                             // Cookie sent on all paths
      maxAge: 60 * 60 * 8,                                  // 8-hour session
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    // Don't leak internal error details
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}

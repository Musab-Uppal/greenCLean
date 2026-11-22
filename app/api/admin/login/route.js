import { NextResponse } from "next/server";
import { verifyAdminCredentials, createAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// ─── Brute-Force & Lockout Controls ──────────────────────────────────────────
let globalFailedAttempts = 0;
let lockoutUntil = 0;

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15-minute lockout after 5 consecutive failures
const TARPIT_DELAY_MS = 1200;       // 1,200ms tarpit delay on failed attempts to crush bot throughput

export async function POST(request) {
  try {
    const now = Date.now();

    // Check if system is currently in lockout mode
    if (now < lockoutUntil) {
      const remainingMinutes = Math.max(1, Math.ceil((lockoutUntil - now) / 60000));
      return NextResponse.json(
        {
          error: `Security Lockout: Too many failed login attempts. Admin access is locked for ${remainingMinutes} more minute${remainingMinutes > 1 ? "s" : ""}.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));

    // Strictly validate types — no coercion
    const username = typeof body?.username === "string" ? body.username.trim().slice(0, 128) : "";
    const password = typeof body?.password === "string" ? body.password.slice(0, 256) : "";
    const rememberMe = Boolean(body?.rememberMe);

    if (!username || !password) {
      await new Promise((resolve) => setTimeout(resolve, TARPIT_DELAY_MS));
      return NextResponse.json(
        { error: "Username and password are required." },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username, password);

    if (!isValid) {
      // Artificial delay (tarpit) prevents rapid-fire dictionary attacks
      await new Promise((resolve) => setTimeout(resolve, TARPIT_DELAY_MS));

      globalFailedAttempts += 1;

      if (globalFailedAttempts >= MAX_FAILED_ATTEMPTS) {
        lockoutUntil = Date.now() + LOCKOUT_MS;
        globalFailedAttempts = 0;
        return NextResponse.json(
          {
            error: "Security Alert: 5 consecutive failed attempts detected. Admin login has been locked for 15 minutes.",
          },
          { status: 429 }
        );
      }

      const remaining = MAX_FAILED_ATTEMPTS - globalFailedAttempts;
      return NextResponse.json(
        {
          error: `Access Denied: Invalid credentials. (${remaining} attempt${remaining > 1 ? "s" : ""} remaining before lockout)`,
        },
        { status: 401 }
      );
    }

    // ── Authentication successful ─────────────────────────────────────────────
    globalFailedAttempts = 0;
    lockoutUntil = 0;

    const token = createAdminToken();

    const response = NextResponse.json({
      success: true,
      user: "admin",
      message: "Authenticated successfully.",
    });

    const cookieOptions = {
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,                                        // Not accessible from JavaScript (XSS protection)
      secure: process.env.NODE_ENV === "production",         // HTTPS-only in production
      sameSite: "strict",                                    // Strict CSRF protection
      path: "/",                                             // Sent on all paths
    };

    // Session-only vs Persistent cookie:
    // If "Remember Me" is checked by user, set maxAge to 8 hours.
    // If unchecked (default), maxAge is omitted -> Browser Session Cookie that terminates when browser closes.
    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 8; // 8 hours
    }

    response.cookies.set(cookieOptions);

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}

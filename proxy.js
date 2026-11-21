import { NextResponse } from "next/server";
import { verifyAdminToken, ADMIN_COOKIE_NAME } from "@/lib/adminAuth";

// ─── In-memory rate limit store ───────────────────────────────────────────────
// Key: "ip:endpoint-group" → { count, resetAt }
const rateLimitStore = new Map();

/**
 * Returns true if the request should be blocked (rate limit exceeded).
 * @param {string} key       Unique key (e.g. ip + route group)
 * @param {number} limit     Max requests allowed
 * @param {number} windowMs  Window size in milliseconds
 */
function isRateLimited(key, limit, windowMs) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (entry.count >= limit) return true;

  entry.count += 1;
  return false;
}

// Prune stale entries periodically (every 5 min) so the Map doesn't grow forever
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) rateLimitStore.delete(key);
  }
}, 5 * 60 * 1000);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getClientIp(request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function rateLimitedResponse(retryAfterSec = 60) {
  return new NextResponse(
    JSON.stringify({ error: "Too many requests. Please slow down." }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(retryAfterSec),
      },
    }
  );
}

// ─── Security Headers ─────────────────────────────────────────────────────────
function applySecurityHeaders(response) {
  const h = response.headers;

  // Prevent browsers from MIME-sniffing
  h.set("X-Content-Type-Options", "nosniff");

  // Deny framing (clickjacking)
  h.set("X-Frame-Options", "DENY");

  // Disable legacy XSS auditor (kept for older browsers; modern browsers use CSP)
  h.set("X-XSS-Protection", "1; mode=block");

  // Don't send referrer on cross-origin navigations
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Restrict powerful features
  h.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()"
  );

  // HSTS — only effective over HTTPS; safe to include always (browsers ignore on HTTP)
  h.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );

  // Content-Security-Policy
  // Tailored for a Next.js + React SPA with Stripe & PayPal
  h.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      // Scripts: self + Next.js inline runtime + Stripe + PayPal
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com https://www.paypalobjects.com",
      // Styles: self + inline (Tailwind, Next.js injects inline styles)
      "style-src 'self' 'unsafe-inline'",
      // Images: self + data URIs (uploaded previews) + Stripe CDN
      "img-src 'self' data: blob: https://stripe.com https://www.paypalobjects.com",
      // Fonts: self
      "font-src 'self' data:",
      // Connect: self + Stripe + PayPal APIs
      "connect-src 'self' https://api.stripe.com https://www.paypal.com https://api.paypal.com",
      // Frames: Stripe checkout embeds
      "frame-src https://js.stripe.com https://hooks.stripe.com https://www.paypal.com",
      // Objects: none
      "object-src 'none'",
      // Base tag: only self
      "base-uri 'self'",
      // Form submissions: only self
      "form-action 'self'",
    ].join("; ")
  );

  return response;
}

// ─── CORS helper (API routes only) ────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
];

function applyCors(request, response) {
  const origin = request.headers.get("origin") || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  }
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

// ─── Proxy (Next.js 16 convention replacing middleware) ─────────────────────────
export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const ip = getClientIp(request);

  // ── Handle CORS preflight ──────────────────────────────────────────────────
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const preflightRes = new NextResponse(null, { status: 204 });
    applyCors(request, preflightRes);
    return preflightRes;
  }

  // ── Rate Limit: Admin login endpoint (strict) ──────────────────────────────
  // 10 attempts per 15 minutes per IP
  if (pathname === "/api/admin/login") {
    if (isRateLimited(`${ip}:admin-login`, 10, 15 * 60 * 1000)) {
      return applySecurityHeaders(rateLimitedResponse(900));
    }
  }

  // ── Rate Limit: Public order creation ─────────────────────────────────────
  // 20 orders per 10 minutes per IP
  if (pathname === "/api/orders" && request.method === "POST") {
    if (isRateLimited(`${ip}:order-create`, 20, 10 * 60 * 1000)) {
      return applySecurityHeaders(rateLimitedResponse(600));
    }
  }

  // ── Rate Limit: Coupon validation ─────────────────────────────────────────
  // 30 checks per 5 minutes per IP
  if (pathname === "/api/coupons/validate") {
    if (isRateLimited(`${ip}:coupon-validate`, 30, 5 * 60 * 1000)) {
      return applySecurityHeaders(rateLimitedResponse(300));
    }
  }

  // ── Rate Limit: Newsletter subscribe ─────────────────────────────────────
  // 5 per 10 minutes per IP
  if (pathname === "/api/mailchimp/subscribe") {
    if (isRateLimited(`${ip}:newsletter`, 5, 10 * 60 * 1000)) {
      return applySecurityHeaders(rateLimitedResponse(600));
    }
  }

  // ── Rate Limit: General API (all other /api/* routes) ─────────────────────
  // 120 requests per minute per IP
  if (pathname.startsWith("/api/")) {
    if (isRateLimited(`${ip}:api-general`, 120, 60 * 1000)) {
      return applySecurityHeaders(rateLimitedResponse(60));
    }
  }

  // ── Protect /adminpage/* routes ───────────────────────────────────────────
  // These are server-rendered pages — redirect unauthenticated users to login
  if (pathname.startsWith("/adminpage")) {
    // Always redirect /adminpage root to login (the actual auth check is done client-side via /api/admin/me)
    // We additionally verify the cookie here at the edge so bots get a hard redirect
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const payload = token ? verifyAdminToken(token) : null;

    if (!payload || payload.role !== "admin") {
      // Redirect to adminpage (the page itself has a login gate)
      // but block direct API probing of admin routes without a valid cookie
      const response = NextResponse.redirect(new URL("/adminpage", request.url));
      return applySecurityHeaders(response);
    }
  }

  // ── Protect /api/admin/* routes (except /api/admin/login & /api/admin/logout & /api/admin/me) ──
  const publicAdminRoutes = ["/api/admin/login", "/api/admin/logout", "/api/admin/me"];
  if (
    pathname.startsWith("/api/admin/") &&
    !publicAdminRoutes.includes(pathname)
  ) {
    const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const payload = token ? verifyAdminToken(token) : null;

    if (!payload || payload.role !== "admin") {
      return applySecurityHeaders(
        new NextResponse(
          JSON.stringify({ error: "Unauthorized. Admin access required." }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        )
      );
    }
  }

  // ── Block /admin route entirely (decoy, already returns 404 in page.js) ───
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    // Return generic 404 — no info disclosure
    return applySecurityHeaders(
      new NextResponse("Not Found", { status: 404 })
    );
  }

  // ── Pass through — apply security headers to all responses ────────────────
  const response = NextResponse.next();
  applySecurityHeaders(response);

  // Apply CORS headers only on API routes
  if (pathname.startsWith("/api/")) {
    applyCors(request, response);
  }

  return response;
}

export default proxy;

export const config = {
  // Run on all routes (excluding static assets and _next internals)
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|otf|css|js|map)).*)",
  ],
};

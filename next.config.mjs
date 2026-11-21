/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker / Dokploy deployment
  output: "standalone",

  // ── Security Headers ────────────────────────────────────────────────────────
  // These serve as a fallback when middleware isn't active (e.g. static exports).
  // The middleware.js applies them dynamically for all routes.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",  value: "nosniff" },
          { key: "X-Frame-Options",          value: "DENY" },
          { key: "X-XSS-Protection",         value: "1; mode=block" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://www.paypal.com https://www.paypalobjects.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https://stripe.com https://www.paypalobjects.com",
              "font-src 'self' data:",
              "connect-src 'self' https://api.stripe.com https://www.paypal.com https://api.paypal.com",
              "frame-src https://js.stripe.com https://hooks.stripe.com https://www.paypal.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },

  // ── CORS for API routes is handled via middleware.js ────────────────────────

  // Disable the x-powered-by header (removes "Next.js" fingerprint)
  poweredByHeader: false,
};

export default nextConfig;

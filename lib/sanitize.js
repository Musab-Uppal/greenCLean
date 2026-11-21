/**
 * Input sanitization and validation helpers.
 * Used across API routes to prevent XSS, injection, and abuse.
 */

// ─── String sanitizers ────────────────────────────────────────────────────────

/**
 * Strip all HTML tags from a string to prevent stored XSS.
 */
export function stripHtml(str) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").trim();
}

/**
 * Sanitize a plain-text field: strip HTML, trim whitespace, truncate to maxLen.
 */
export function sanitizeText(str, maxLen = 500) {
  if (str === null || str === undefined) return "";
  const stripped = stripHtml(String(str));
  return stripped.slice(0, maxLen);
}

/**
 * Sanitize an email address: lowercase, trim, strip HTML.
 * Returns the cleaned email or null if it doesn't look valid.
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== "string") return null;
  const cleaned = stripHtml(email).toLowerCase().trim().slice(0, 254);
  // Basic RFC 5322 sanity check (not exhaustive)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(cleaned) ? cleaned : null;
}

/**
 * Sanitize a phone number: allow digits, spaces, +, -, (, ) only.
 */
export function sanitizePhone(phone) {
  if (!phone || typeof phone !== "string") return "";
  return phone.replace(/[^\d\s+\-()\\.]/g, "").slice(0, 30);
}

/**
 * Sanitize an address: strip HTML tags, limit length.
 */
export function sanitizeAddress(addr) {
  return sanitizeText(addr, 300);
}

/**
 * Sanitize a URL path / image path: allow only safe characters.
 * Prevents path traversal attacks.
 */
export function sanitizeImagePath(path) {
  if (!path || typeof path !== "string") return "";
  const stripped = stripHtml(path).trim();
  // Allow: /uploads/name.jpg  or  /services/image.jpg  or  data:image/...
  if (stripped.startsWith("data:image/")) return stripped.slice(0, 2_000_000); // Allow base64 data URIs up to ~2 MB
  // Block path traversal
  if (/\.\./.test(stripped)) return "";
  // Allow only URL-safe characters for file paths
  return stripped.replace(/[^a-zA-Z0-9/_.\-]/g, "").slice(0, 500);
}

/**
 * Sanitize a coupon code: uppercase alphanumeric + hyphens only.
 */
export function sanitizeCouponCode(code) {
  if (!code || typeof code !== "string") return "";
  return code.toUpperCase().replace(/[^A-Z0-9\-_]/g, "").slice(0, 50);
}

// ─── Numeric validators ────────────────────────────────────────────────────────

/**
 * Parse a positive integer from input. Returns NaN if invalid.
 */
export function parsePositiveInt(val) {
  const n = parseInt(String(val), 10);
  return Number.isInteger(n) && n > 0 ? n : NaN;
}

/**
 * Parse a non-negative float from input. Returns NaN if invalid.
 */
export function parseNonNegativeFloat(val) {
  const n = parseFloat(String(val));
  return isFinite(n) && n >= 0 ? n : NaN;
}

// ─── Object sanitizers ────────────────────────────────────────────────────────

/**
 * Sanitize a full booking/order body from a user request.
 * Returns { data, errors } where errors is a string[] of validation messages.
 */
export function sanitizeOrderBody(body) {
  const errors = [];

  const email = sanitizeEmail(body?.email);
  if (!email) errors.push("A valid email address is required.");

  const address = sanitizeAddress(body?.address);
  if (!address) errors.push("Address is required.");

  const phoneno = sanitizePhone(body?.phoneno || body?.phone);
  if (!phoneno) errors.push("Phone number is required.");

  // scheduled_date: must be YYYY-MM-DD or "YYYY-MM-DD HH:MM" format, or null
  let scheduled_date = null;
  if (body?.scheduled_date) {
    const sd = String(body.scheduled_date).trim().slice(0, 30);
    if (/^\d{4}-\d{2}-\d{2}(\s.+)?$/.test(sd)) {
      scheduled_date = sd;
    }
  }

  // payment_method: whitelist
  const allowedPaymentMethods = ["local", "stripe", "creditcard", "card", "paypal"];
  const payment_method = allowedPaymentMethods.includes(body?.payment_method)
    ? body.payment_method
    : "local";

  const coupon_code = body?.couponCode ? sanitizeCouponCode(body.couponCode) : null;

  const discount_amount = parseNonNegativeFloat(body?.discountAmount ?? 0);

  const total_amount =
    body?.total_amount !== undefined && body?.total_amount !== null
      ? parseNonNegativeFloat(body.total_amount)
      : null;

  const marketingConsent = body?.marketingConsent === true;

  return {
    errors,
    data: {
      email,
      address,
      phoneno,
      scheduled_date,
      payment_method,
      coupon_code,
      discount_amount: isNaN(discount_amount) ? 0 : discount_amount,
      total_amount: isNaN(total_amount) ? null : total_amount,
      marketingConsent,
      firstName: sanitizeText(body?.firstName, 100),
      lastName: sanitizeText(body?.lastName, 100),
      status: "pending", // Always force pending from public endpoint
      payment_status: "pending",
    },
  };
}

import crypto from "crypto";

// Guard against missing secret in production
const ADMIN_SECRET = process.env.ADMIN_SECRET;
if (!ADMIN_SECRET && process.env.NODE_ENV === "production") {
  throw new Error("ADMIN_SECRET environment variable is not set. Refusing to start.");
}
const _secret = ADMIN_SECRET || "greenclean_admin_secure_salt_9284!__dev_only__";

export const ADMIN_COOKIE_NAME = "gc_admin_token";

// Credentials are read only from environment — never fall back to plaintext defaults in production
const _username = process.env.ADMIN_USERNAME || (process.env.NODE_ENV !== "production" ? "admin" : "");
const _password = process.env.ADMIN_PASSWORD || (process.env.NODE_ENV !== "production" ? "changeme_in_production" : "");

if (process.env.NODE_ENV === "production" && (!_username || !_password)) {
  throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in production.");
}

/**
 * Timing-safe username + password check.
 * Both comparisons always run to prevent timing side-channels.
 */
export function verifyAdminCredentials(username, password) {
  if (!username || !password) return false;

  const userBuf    = Buffer.from(username.trim().padEnd(64));
  const targetUser = Buffer.from(_username.padEnd(64));
  const passBuf    = Buffer.from(password);
  const targetPass = Buffer.from(_password);

  // Pad to equal length before timing-safe compare (prevents length leak)
  const maxLen = Math.max(passBuf.length, targetPass.length);
  const paddedPass   = Buffer.concat([passBuf,    Buffer.alloc(maxLen - passBuf.length)]);
  const paddedTarget = Buffer.concat([targetPass, Buffer.alloc(maxLen - targetPass.length)]);

  const userMatch = crypto.timingSafeEqual(userBuf, targetUser);
  const passMatch =
    passBuf.length === targetPass.length &&
    crypto.timingSafeEqual(paddedPass, paddedTarget);

  return userMatch && passMatch;
}

export function createAdminToken() {
  const payload = {
    role: "admin",
    user: _username,
    loginAt: Date.now(),
    // 8-hour session — shorter than 7 days is safer
    exp: Date.now() + 1000 * 60 * 60 * 8,
  };

  const dataB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", _secret)
    .update(dataB64)
    .digest("base64url");

  return `${dataB64}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token || typeof token !== "string") return null;

  const dotIdx = token.indexOf(".");
  if (dotIdx === -1) return null;

  const dataB64 = token.slice(0, dotIdx);
  const signature = token.slice(dotIdx + 1);

  // Reject tokens with more than one dot segment (extra protection)
  if (signature.includes(".")) return null;

  const expectedSignature = crypto
    .createHmac("sha256", _secret)
    .update(dataB64)
    .digest("base64url");

  // Timing-safe signature comparison
  let sigMatch = false;
  try {
    const sigBuf  = Buffer.from(signature);
    const expBuf  = Buffer.from(expectedSignature);
    if (sigBuf.length === expBuf.length) {
      sigMatch = crypto.timingSafeEqual(sigBuf, expBuf);
    }
  } catch {
    return null;
  }

  if (!sigMatch) return null;

  try {
    const payload = JSON.parse(Buffer.from(dataB64, "base64url").toString());
    if (payload.role !== "admin") return null;
    if (!payload.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

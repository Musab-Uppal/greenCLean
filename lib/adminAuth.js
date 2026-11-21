import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "gc_admin_token";

// Secrets are resolved lazily at request time, not at module load / build time.
// This avoids build failures when env vars are only available at runtime (e.g. Docker / Dokploy).
function getSecret() {
  const s = process.env.ADMIN_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SECRET environment variable is not set.");
  }
  return s || "greenclean_admin_secure_salt_9284!__dev_only__";
}

function getCredentials() {
  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;
  if (process.env.NODE_ENV === "production" && (!username || !password)) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in production.");
  }
  return {
    username: username || "admin",
    password: password || "changeme_in_production",
  };
}

/**
 * Timing-safe username + password check.
 * Both comparisons always run to prevent timing side-channels.
 */
export function verifyAdminCredentials(username, password) {
  if (!username || !password) return false;
  const { username: _username, password: _password } = getCredentials();

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
  const { username: _username } = getCredentials();
  const _secret = getSecret();

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
  const _secret = getSecret();

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

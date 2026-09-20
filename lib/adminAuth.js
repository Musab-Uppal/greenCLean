import crypto from "crypto";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "greenclean_admin_secure_salt_9284!";
export const ADMIN_COOKIE_NAME = "gc_admin_token";

export const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "112233@;9)"
};

export function verifyAdminCredentials(username, password) {
  if (!username || !password) return false;
  
  const trimmedUser = username.trim();
  if (trimmedUser !== ADMIN_CREDENTIALS.username) {
    return false;
  }

  const passBuffer = Buffer.from(password);
  const targetBuffer = Buffer.from(ADMIN_CREDENTIALS.password);

  if (passBuffer.length !== targetBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(passBuffer, targetBuffer);
}

export function createAdminToken() {
  const payload = {
    role: "admin",
    user: ADMIN_CREDENTIALS.username,
    loginAt: Date.now(),
    exp: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
  };

  const dataB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(dataB64)
    .digest("base64url");

  return `${dataB64}.${signature}`;
}

export function verifyAdminToken(token) {
  if (!token || !token.includes(".")) return null;
  const [dataB64, signature] = token.split(".");

  const expectedSignature = crypto
    .createHmac("sha256", ADMIN_SECRET)
    .update(dataB64)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(dataB64, "base64url").toString());
    if (payload.role !== "admin") return null;
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

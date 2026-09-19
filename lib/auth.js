import crypto from "crypto";
import { getUserById } from "./db.js";

const AUTH_SECRET = process.env.AUTH_SECRET || "greenclean_secret_key_session_2026";
const COOKIE_NAME = "gc_customer_token";

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedPassword) {
  if (!storedPassword) return false;
  if (!storedPassword.includes(":")) {
    // Fallback for plain-text entries
    return password === storedPassword;
  }
  const [salt, key] = storedPassword.split(":");
  const keyBuffer = Buffer.from(key, "hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(keyBuffer, derivedKey);
}

export function createToken(payload) {
  const data = JSON.stringify({
    ...payload,
    exp: Date.now() + 1000 * 60 * 60 * 24 * 30 // 30 days
  });
  const dataB64 = Buffer.from(data).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(dataB64)
    .digest("base64url");
  return `${dataB64}.${signature}`;
}

export function verifyToken(token) {
  if (!token || !token.includes(".")) return null;
  const [dataB64, signature] = token.split(".");
  const expectedSignature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(dataB64)
    .digest("base64url");

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(dataB64, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

export { COOKIE_NAME };

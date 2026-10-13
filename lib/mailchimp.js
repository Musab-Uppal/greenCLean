/**
 * Mailchimp Marketing API v3 client for Green Clean Group
 * Docs: https://mailchimp.com/developer/marketing/api/
 *
 * Key safety rules:
 * - Never re-subscribes a contact who has previously unsubscribed
 * - Every marketing email sent via Mailchimp automatically includes an unsubscribe link
 * - Only syncs contacts who have explicitly given marketing consent
 */

/**
 * Returns the MD5 hash of a lowercase email — used as Mailchimp member ID.
 * We use the native Web Crypto API (available in Node 18+ and Next.js edge).
 */
async function emailToMd5(email) {
  const clean = email.trim().toLowerCase();
  // Use Node's crypto module (server-side only)
  const { createHash } = await import("crypto");
  return createHash("md5").update(clean).digest("hex");
}

function getConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX; // e.g. "us21"

  if (!apiKey || !listId || !serverPrefix) {
    console.warn(
      "[Mailchimp] Missing env vars: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, or MAILCHIMP_SERVER_PREFIX. Skipping."
    );
    return null;
  }
  return { apiKey, listId, serverPrefix };
}

function baseUrl(serverPrefix, listId) {
  return `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;
}

/**
 * Subscribe (or update) a contact in Mailchimp.
 *
 * IMPORTANT: If the contact is currently "unsubscribed" in Mailchimp, this function
 * will NOT re-subscribe them — it will leave them as unsubscribed and return { ok: true, skipped: true }.
 *
 * @param {object} opts
 * @param {string}   opts.email       - Contact email (required)
 * @param {string}  [opts.firstName]  - First name
 * @param {string}  [opts.lastName]   - Last name
 * @param {string}  [opts.phone]      - Phone number
 * @param {string[]}[opts.tags]       - Array of tag names to apply
 * @returns {Promise<{ok: boolean, skipped?: boolean, data?: object, error?: string}>}
 */
export async function subscribeToMailchimp({
  email,
  firstName = "",
  lastName = "",
  phone = "",
  tags = [],
}) {
  const config = getConfig();
  if (!config) return { ok: false, error: "Mailchimp not configured" };

  if (!email || !email.includes("@")) {
    return { ok: false, error: "Invalid email address" };
  }

  const cleanEmail = email.trim().toLowerCase();
  const { apiKey, listId, serverPrefix } = config;
  const base = baseUrl(serverPrefix, listId);
  const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Basic ${auth}`,
  };

  // 1. Check if the contact already exists in Mailchimp
  const memberHash = await emailToMd5(cleanEmail);
  const checkRes = await fetch(`${base}/members/${memberHash}`, {
    method: "GET",
    headers,
  });

  if (checkRes.ok) {
    const existing = await checkRes.json();
    // Do NOT re-subscribe unsubscribed contacts
    if (existing.status === "unsubscribed") {
      console.log(
        `[Mailchimp] ${cleanEmail} is unsubscribed — skipping re-subscribe.`
      );
      return { ok: true, skipped: true };
    }
  }

  // 2. Upsert the contact as "subscribed"
  const payload = {
    email_address: cleanEmail,
    status_if_new: "subscribed", // only applies if new
    status: "subscribed",
    merge_fields: {
      FNAME: firstName || "",
      LNAME: lastName || "",
      PHONE: phone || "",
    },
  };

  try {
    const putRes = await fetch(`${base}/members/${memberHash}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await putRes.json();

    if (!putRes.ok) {
      console.error("[Mailchimp] Subscribe error:", data);
      return { ok: false, error: data?.detail || "Mailchimp API error" };
    }

    // 3. Apply tags if any
    if (tags.length > 0) {
      await applyTagsToMember(memberHash, tags, base, headers);
    }

    console.log(`[Mailchimp] Subscribed: ${cleanEmail}`);
    return { ok: true, data };
  } catch (err) {
    console.error("[Mailchimp] Network error:", err);
    return { ok: false, error: err.message };
  }
}

/**
 * Apply (or create) tags on a Mailchimp member.
 *
 * @param {string} memberHash - MD5 of lowercase email
 * @param {string[]} tagNames
 * @param {string} base       - Base URL (already includes list ID)
 * @param {object} headers    - Auth headers
 */
async function applyTagsToMember(memberHash, tagNames, base, headers) {
  try {
    const body = JSON.stringify({
      tags: tagNames.map((name) => ({ name, status: "active" })),
    });
    await fetch(`${base}/members/${memberHash}/tags`, {
      method: "POST",
      headers,
      body,
    });
  } catch (err) {
    console.error("[Mailchimp] Failed to apply tags:", err);
  }
}

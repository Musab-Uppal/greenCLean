/**
 * Mailchimp Marketing & Transactional API client for Green Clean Group
 * Docs:
 * - Marketing API v3: https://mailchimp.com/developer/marketing/api/
 * - Transactional API: https://mailchimp.com/developer/transactional/api/
 *
 * Capabilities:
 * 1. Upsert contacts & tags to Mailchimp Audience
 * 2. Dispatch custom Mailchimp Events ('booking_placed', 'admin_new_booking') to trigger Customer Journeys
 * 3. Send 1-to-1 immediate transactional confirmation emails via Mailchimp Transactional (Mandrill)
 *    to BOTH the customer and the admin (info@greencleangroup.co.uk)
 */

import { sendEmail } from "./email.js";

const ADMIN_EMAIL_DEFAULT = "info@greencleangroup.co.uk";

/**
 * Returns the MD5 hash of a lowercase email — used as Mailchimp member ID.
 */
async function emailToMd5(email) {
  const clean = (email || "").trim().toLowerCase();
  const { createHash } = await import("crypto");
  return createHash("md5").update(clean).digest("hex");
}

function getMarketingConfig() {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX; // e.g. "us19"

  if (!apiKey || !listId || !serverPrefix) {
    console.warn(
      "[Mailchimp] Missing env vars: MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID, or MAILCHIMP_SERVER_PREFIX."
    );
    return null;
  }
  return { apiKey, listId, serverPrefix };
}

function getTransactionalKey() {
  return (
    process.env.MANDRILL_API_KEY ||
    process.env.MAILCHIMP_TRANSACTIONAL_API_KEY ||
    process.env.MAILCHIMP_TRANSACTIONAL_KEY ||
    ""
  );
}

function getAdminNotificationEmail() {
  return process.env.ADMIN_NOTIFICATION_EMAIL || ADMIN_EMAIL_DEFAULT;
}

function baseUrl(serverPrefix, listId) {
  return `https://${serverPrefix}.api.mailchimp.com/3.0/lists/${listId}`;
}

/**
 * Subscribe (or update) a contact in Mailchimp Audience.
 */
export async function subscribeToMailchimp({
  email,
  firstName = "",
  lastName = "",
  phone = "",
  tags = [],
  status = "subscribed", // 'subscribed' for marketing consent, 'transactional' for booking-only
}) {
  const config = getMarketingConfig();
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

  try {
    const memberHash = await emailToMd5(cleanEmail);

    // 1. Check if contact exists and if unsubscribed
    const checkRes = await fetch(`${base}/members/${memberHash}`, {
      method: "GET",
      headers,
    });

    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (existing.status === "unsubscribed") {
        console.log(`[Mailchimp] ${cleanEmail} is unsubscribed — preserving status.`);
        return { ok: true, skipped: true };
      }
    }

    // 2. Upsert contact with appropriate status
    const targetStatus = status === "transactional" ? "transactional" : "subscribed";
    const payload = {
      email_address: cleanEmail,
      status_if_new: targetStatus,
      status: targetStatus,
      merge_fields: {
        FNAME: firstName || "",
        LNAME: lastName || "",
        PHONE: phone || "",
      },
    };

    const putRes = await fetch(`${base}/members/${memberHash}`, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });

    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      console.warn("[Mailchimp] Upsert member warning:", errData);
    }

    // 3. Apply tags
    if (tags.length > 0) {
      await applyTagsToMember(memberHash, tags, base, headers);
    }

    return { ok: true };
  } catch (err) {
    console.error("[Mailchimp] subscribeToMailchimp error:", err);
    return { ok: false, error: err.message };
  }
}

/**
 * Apply tags to a Mailchimp member
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
    console.warn("[Mailchimp] Failed to apply tags:", err);
  }
}

/**
 * Record a custom event on a member profile in Mailchimp Marketing API.
 * This triggers any active Mailchimp Customer Journeys (Automations) configured for this event.
 * Note: Mailchimp requires event property values to be strings!
 */
export async function recordMailchimpEvent({ email, eventName, properties = {} }) {
  const config = getMarketingConfig();
  if (!config) return { ok: false, error: "Mailchimp not configured" };

  try {
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail.includes("@")) return { ok: false, error: "Invalid email" };

    const { apiKey, listId, serverPrefix } = config;
    const base = baseUrl(serverPrefix, listId);
    const auth = Buffer.from(`anystring:${apiKey}`).toString("base64");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    };

    const memberHash = await emailToMd5(cleanEmail);

    // Convert all property values to strings
    const stringifiedProps = {};
    for (const [k, v] of Object.entries(properties)) {
      stringifiedProps[k] = v !== null && v !== undefined ? String(v) : "";
    }

    const res = await fetch(`${base}/members/${memberHash}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: eventName,
        properties: stringifiedProps,
      }),
    });

    if (res.status === 204 || res.ok) {
      return { ok: true };
    }

    const errJson = await res.json().catch(() => ({}));
    console.warn(`[Mailchimp Event] Error recording '${eventName}':`, errJson);
    return { ok: false, error: errJson };
  } catch (err) {
    console.error("[Mailchimp Event] Network error:", err);
    return { ok: false, error: err.message };
  }
}

/**
 * Send an email via the multi-transport dispatcher (SMTP, Mandrill, or Resend)
 */
export async function sendMailchimpTransactionalEmail({
  to,
  subject,
  html,
  text,
  fromEmail = "info@greencleangroup.co.uk",
  fromName = "Green Clean Group",
}) {
  return sendEmail({
    to,
    subject,
    html,
    text,
    fromEmail,
    fromName,
  });
}

// ─── Branded HTML Email Templates ─────────────────────────────────────────────

function buildCustomerEmailHtml({
  orderId,
  customerName,
  customerEmail,
  address,
  scheduledDate,
  totalAmount,
  paymentMethod,
  paymentStatus,
  items = [],
}) {
  const formattedTotal = Number(totalAmount || 0).toFixed(2);
  const itemsRows = items.length > 0
    ? items
        .map(
          (it) => `
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px;">
                ${it.service_name || it.name || "Cleaning Service"}
              </td>
              <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: 600; font-size: 14px;">
                £${Number(it.price || 0).toFixed(2)}
              </td>
            </tr>`
        )
        .join("")
    : `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px;">Eco Cleaning Service</td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; text-align: right; color: #0f172a; font-weight: 600; font-size: 14px;">£${formattedTotal}</td>
      </tr>`;

  const paymentLabel =
    paymentMethod === "creditcard" || paymentMethod === "stripe"
      ? "Debit / Credit Card (Paid)"
      : paymentMethod === "paypal"
      ? "PayPal (Paid)"
      : "Pay on Arrival (Cash / Local)";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Booking Confirmed — Green Clean Group</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Green Clean Group</h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">Professional Eco-Friendly Cleaning</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 24px;">
      <div style="display: inline-block; background: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 999px; text-transform: uppercase; margin-bottom: 16px;">
        ✓ Booking Confirmed
      </div>

      <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #0f172a;">Thank you for your booking, ${customerName || "Customer"}!</h2>
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
        We have received your appointment request. Our professional, eco-friendly cleaner will arrive within your designated arrival window.
      </p>

      <!-- Booking Summary Box -->
      <div style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Booking Reference:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #0f172a; font-size: 14px;">#${orderId}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Arrival Window:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #059669; font-size: 14px;">${scheduledDate || "To be confirmed"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Service Address:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #0f172a; font-size: 13px;">${address || "Provided"}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-size: 13px;">Payment Method:</td>
            <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #0f172a; font-size: 13px;">${paymentLabel}</td>
          </tr>
        </table>
      </div>

      <!-- Services Table -->
      <h3 style="font-size: 16px; margin: 0 0 12px 0; color: #0f172a;">Booked Services</h3>
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <thead>
          <tr style="border-bottom: 2px solid #e2e8f0;">
            <th style="text-align: left; padding-bottom: 8px; font-size: 13px; color: #64748b; text-transform: uppercase;">Service</th>
            <th style="text-align: right; padding-bottom: 8px; font-size: 13px; color: #64748b; text-transform: uppercase;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRows}
          <tr>
            <td style="padding: 14px 0 0 0; font-size: 16px; font-weight: 800; color: #0f172a;">Total</td>
            <td style="padding: 14px 0 0 0; text-align: right; font-size: 18px; font-weight: 800; color: #059669;">£${formattedTotal}</td>
          </tr>
        </tbody>
      </table>

      <!-- Support / Contact -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b; line-height: 1.6;">
        <p style="margin: 0 0 6px 0;">Need to reschedule or have questions? Contact our friendly support team:</p>
        <p style="margin: 0; color: #0f172a; font-weight: 600;">
          📞 Phone: 07359 068284 &nbsp;|&nbsp; ✉️ Email: <a href="mailto:info@greencleangroup.co.uk" style="color: #059669; text-decoration: none;">info@greencleangroup.co.uk</a>
        </p>
        <p style="margin: 4px 0 0 0;">Operating Hours: Monday – Sunday: 08:00 – 19:00</p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      © ${new Date().getFullYear()} Green Clean Group. Eco-Friendly Commercial & Residential Cleaning.
    </div>
  </div>
</body>
</html>`;
}

function buildAdminEmailHtml({
  orderId,
  customerName,
  customerEmail,
  customerPhone,
  address,
  scheduledDate,
  totalAmount,
  paymentMethod,
  paymentStatus,
  items = [],
}) {
  const formattedTotal = Number(totalAmount || 0).toFixed(2);
  const itemsText = items
    .map((it) => `${it.service_name || it.name || "Cleaning Service"} (£${Number(it.price || 0).toFixed(2)})`)
    .join(", ");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Booking Alert — Green Clean Group</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #e2e8f0;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
    
    <!-- Admin Header -->
    <div style="background: #059669; padding: 24px; color: #ffffff;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 800;">🔔 New Customer Booking Placed</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">Order #${orderId} • Total: £${formattedTotal}</p>
    </div>

    <div style="padding: 24px;">
      <!-- Customer Info Card -->
      <div style="background: #0f172a; border-radius: 8px; border: 1px solid #334155; padding: 18px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #38bdf8; letter-spacing: 0.5px;">Customer Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #94a3b8; width: 120px;">Name:</td>
            <td style="padding: 4px 0; font-weight: 700; color: #ffffff;">${customerName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #94a3b8;">Email:</td>
            <td style="padding: 4px 0; font-weight: 600; color: #38bdf8;"><a href="mailto:${customerEmail}" style="color: #38bdf8; text-decoration: none;">${customerEmail}</a></td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #94a3b8;">Phone:</td>
            <td style="padding: 4px 0; font-weight: 700; color: #ffffff;"><a href="tel:${customerPhone}" style="color: #ffffff; text-decoration: none;">${customerPhone || "N/A"}</a></td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #94a3b8;">Address:</td>
            <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${address}</td>
          </tr>
        </table>
      </div>

      <!-- Booking Info Card -->
      <div style="background: #0f172a; border-radius: 8px; border: 1px solid #334155; padding: 18px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #34d399; letter-spacing: 0.5px;">Appointment Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 4px 0; color: #94a3b8; width: 120px;">Scheduled:</td>
            <td style="padding: 4px 0; font-weight: 700; color: #34d399; font-size: 15px;">${scheduledDate || "Unscheduled"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #94a3b8;">Services:</td>
            <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${itemsText || "Cleaning Service"}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #94a3b8;">Payment:</td>
            <td style="padding: 4px 0; font-weight: 600; color: #ffffff;">${paymentMethod} (${paymentStatus})</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #94a3b8;">Total Revenue:</td>
            <td style="padding: 4px 0; font-weight: 800; color: #34d399; font-size: 16px;">£${formattedTotal}</td>
          </tr>
        </table>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-top: 24px;">
        <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://greencleangroup.co.uk"}/adminpage" 
           style="display: inline-block; background: #059669; color: #ffffff; padding: 12px 24px; border-radius: 6px; font-weight: 700; font-size: 14px; text-decoration: none;">
          Open Admin Dashboard →
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Main coordinator: sends confirmation emails to BOTH Customer and Admin (info@greencleangroup.co.uk).
 * Uses Mailchimp Audience & Events API + Mailchimp Transactional (Mandrill) API.
 */
export async function sendBookingConfirmationEmails({
  orderId,
  customerEmail,
  customerName = "",
  customerPhone = "",
  address = "",
  scheduledDate = "",
  totalAmount = 0,
  paymentMethod = "local",
  paymentStatus = "pending",
  items = [],
  marketingConsent = false,
}) {
  if (!customerEmail || !customerEmail.includes("@")) {
    console.warn("[sendBookingConfirmationEmails] Invalid customer email:", customerEmail);
    return { ok: false, error: "Invalid customer email" };
  }

  const adminEmail = getAdminNotificationEmail();
  const nameParts = (customerName || "").trim().split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  console.log(`[sendBookingConfirmationEmails] Dispatching confirmations for Order #${orderId} to: Customer (${customerEmail}) & Admin (${adminEmail}) [Marketing Consent: ${marketingConsent}]`);

  const results = {
    customerEmail,
    adminEmail,
    marketingConsent,
    customerMarketingEvent: null,
    adminMarketingEvent: null,
    customerTransactional: null,
    adminTransactional: null,
  };

  const servicesSummary = items.length > 0
    ? items.map((it) => it.service_name || it.name || "Cleaning Service").join(", ")
    : "Eco Cleaning Service";

  // ── 1. Mailchimp Audience: Upsert Customer with GDPR Separation ───────────
  // If user opted into marketing: status is 'subscribed'
  // If user did NOT opt in: status is 'transactional' (EXCLUDED from marketing campaigns)
  try {
    const audienceStatus = marketingConsent ? "subscribed" : "transactional";
    const customerTags = marketingConsent
      ? ["Booked", "Booking-Confirmed", "Marketing-Opt-In", `Payment: ${paymentMethod}`]
      : ["Booked", "Booking-Confirmed", "Transactional-Only", `Payment: ${paymentMethod}`];

    await subscribeToMailchimp({
      email: customerEmail,
      firstName,
      lastName,
      phone: customerPhone,
      tags: customerTags,
      status: audienceStatus,
    });

    const eventResult = await recordMailchimpEvent({
      email: customerEmail,
      eventName: "booking_placed",
      properties: {
        order_id: String(orderId),
        customer_name: customerName || "Customer",
        customer_phone: customerPhone || "",
        scheduled_date: scheduledDate || "",
        service_address: address || "",
        total_amount: `£${Number(totalAmount || 0).toFixed(2)}`,
        payment_method: paymentMethod || "local",
        payment_status: paymentStatus || "pending",
        services: servicesSummary,
        marketing_opt_in: String(marketingConsent),
      },
    });
    results.customerMarketingEvent = eventResult;
  } catch (err) {
    console.error("[Mailchimp] Customer audience event error:", err);
  }

  // ── 2. Mailchimp Marketing: Upsert Admin & Record 'admin_new_booking' Event ──
  try {
    await subscribeToMailchimp({
      email: adminEmail,
      firstName: "Admin",
      lastName: "Green Clean",
      tags: ["Admin-Notification", "New-Booking-Alert"],
    });

    const adminEventResult = await recordMailchimpEvent({
      email: adminEmail,
      eventName: "admin_new_booking",
      properties: {
        order_id: String(orderId),
        customer_email: customerEmail,
        customer_name: customerName || "",
        customer_phone: customerPhone || "",
        scheduled_date: scheduledDate || "",
        service_address: address || "",
        total_amount: `£${Number(totalAmount || 0).toFixed(2)}`,
        payment_method: paymentMethod || "local",
        services: servicesSummary,
      },
    });
    results.adminMarketingEvent = adminEventResult;
  } catch (err) {
    console.error("[Mailchimp] Admin marketing event failed:", err);
  }

  // ── 3. Mailchimp Transactional (Mandrill): Send Direct 1-to-1 Emails ─────────
  const customerHtml = buildCustomerEmailHtml({
    orderId,
    customerName,
    customerEmail,
    address,
    scheduledDate,
    totalAmount,
    paymentMethod,
    paymentStatus,
    items,
  });

  const adminHtml = buildAdminEmailHtml({
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    address,
    scheduledDate,
    totalAmount,
    paymentMethod,
    paymentStatus,
    items,
  });

  try {
    // A. Send Customer Confirmation
    const custRes = await sendMailchimpTransactionalEmail({
      to: [{ email: customerEmail, name: customerName || "Customer", type: "to" }],
      subject: `Booking Confirmed: Order #${orderId} — Green Clean Group`,
      html: customerHtml,
      text: `Thank you for booking with Green Clean Group! Order #${orderId} for ${scheduledDate}. Address: ${address}. Total: £${Number(totalAmount).toFixed(2)}.`,
    });
    results.customerTransactional = custRes;

    // B. Send Admin Alert
    const adminRes = await sendMailchimpTransactionalEmail({
      to: [{ email: adminEmail, name: "Green Clean Admin", type: "to" }],
      subject: `🔔 New Booking Alert: Order #${orderId} (£${Number(totalAmount).toFixed(2)}) — ${customerEmail}`,
      html: adminHtml,
      text: `New Booking received: Order #${orderId} from ${customerName || customerEmail} (${customerPhone}). Date: ${scheduledDate}. Address: ${address}. Total: £${Number(totalAmount).toFixed(2)}.`,
    });
    results.adminTransactional = adminRes;
  } catch (err) {
    console.error("[Mailchimp Transactional] Direct email dispatch error:", err);
  }

  return { ok: true, results };
}

/**
 * Branded HTML Welcome & 10% Discount Email Template for New Newsletter Subscribers
 */
export function buildNewsletterWelcomeEmailHtml({ email, discountCode = "WELCOME10" }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://greencleangroup.co.uk";
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to Green Clean Group — 10% Off Your First Clean</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 36px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Green Clean Group</h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">Liverpool's Premier Eco-Friendly Cleaning Team</p>
    </div>

    <!-- Main Content -->
    <div style="padding: 32px 24px;">
      <div style="display: inline-block; background: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 999px; text-transform: uppercase; margin-bottom: 16px;">
        🎉 Welcome to the Club
      </div>

      <h2 style="margin: 0 0 12px 0; font-size: 22px; color: #0f172a;">Here is your 10% discount code!</h2>
      <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
        Thank you for subscribing to Green Clean Group. As promised, here is your exclusive <strong>10% discount voucher</strong> valid on your first eco-friendly cleaning booking:
      </p>

      <!-- Promo Code Box -->
      <div style="background: #f0fdf4; border: 2px dashed #059669; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
        <span style="font-size: 13px; font-weight: 700; color: #065f46; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 8px;">
          Use Voucher Code at Checkout
        </span>
        <div style="font-size: 32px; font-weight: 800; color: #059669; letter-spacing: 3px; font-family: monospace; margin-bottom: 8px;">
          ${discountCode}
        </div>
        <p style="margin: 0; font-size: 13px; color: #047857; font-weight: 500;">
          Enjoy 10% off any oven, deep house, tenancy, or kitchen clean across Liverpool &amp; 40 miles around.
        </p>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${baseUrl}/book" style="display: inline-block; background: #059669; color: #ffffff; padding: 14px 32px; border-radius: 999px; font-weight: 700; font-size: 15px; text-decoration: none; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.35);">
          Book Online with 10% Off →
        </a>
      </div>

      <!-- Highlights Box -->
      <div style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 20px; margin-bottom: 24px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">Why Liverpool Trusts Us:</h4>
        <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #475569; line-height: 1.8;">
          <li>🌱 <strong>100% Non-Toxic &amp; Plant-Based:</strong> Safe for babies, pets, and food prep</li>
          <li>🔥 <strong>Van-Mounted Heated Dip Tank:</strong> Eliminates burnt-on oven grease without harsh caustic fumes</li>
          <li>🛡️ <strong>Fully Insured &amp; Experienced:</strong> Family-run team with satisfaction guaranteed</li>
        </ul>
      </div>

      <!-- Support & Contact -->
      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b; line-height: 1.6;">
        <p style="margin: 0 0 6px 0;">Need help choosing a service or want to book over the phone?</p>
        <p style="margin: 0; color: #0f172a; font-weight: 600;">
          📞 Phone: 07359 068284 &nbsp;|&nbsp; ✉️ Email: <a href="mailto:info@greencleangroup.co.uk" style="color: #059669; text-decoration: none;">info@greencleangroup.co.uk</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      © ${new Date().getFullYear()} Green Clean Group. Eco-Friendly Commercial &amp; Domestic Cleaning.<br/>
      Liverpool &amp; 40 Miles Around. You received this email because you subscribed on our website.
    </div>
  </div>
</body>
</html>`;
}

/**
 * Dispatch welcome email with 10% discount code to new subscriber
 */
export async function sendNewsletterWelcomeEmail({ email, discountCode = "WELCOME10" }) {
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Invalid email" };
  }
  const cleanEmail = email.trim().toLowerCase();
  const html = buildNewsletterWelcomeEmailHtml({ email: cleanEmail, discountCode });

  console.log(`[sendNewsletterWelcomeEmail] Dispatching 10% discount code (${discountCode}) to: ${cleanEmail}`);

  return sendEmail({
    to: cleanEmail,
    subject: "🎉 Your 10% Off Discount Code — Welcome to Green Clean Group!",
    html,
    text: `Thank you for subscribing to Green Clean Group! Use promo code ${discountCode} on our booking page to save 10% on your first cleaning service. Book online at ${process.env.NEXT_PUBLIC_BASE_URL || "https://greencleangroup.co.uk"}/book or call us on 07359 068284.`,
  });
}

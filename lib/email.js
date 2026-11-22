import nodemailer from "nodemailer";

/**
 * Multi-transport Email Dispatcher for Green Clean Group
 * 
 * Supports:
 * 1. Direct SMTP (recommended - e.g. domain cPanel/Titan, Gmail, Outlook, Brevo, SendGrid)
 *    Env: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_SECURE, SMTP_FROM
 * 2. Mailchimp Transactional / Mandrill
 *    Env: MANDRILL_API_KEY or MAILCHIMP_TRANSACTIONAL_API_KEY
 * 3. Resend
 *    Env: RESEND_API_KEY
 */

export function getEmailConfig() {
  const fromEmail = process.env.FROM_EMAIL || "noreply@greencleangroup.co.uk";
  const replyToEmail = process.env.REPLY_TO_EMAIL || "info@greencleangroup.co.uk";
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL || "info@greencleangroup.co.uk";

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true" || smtpPort === 465;
  const smtpFrom =
    process.env.SMTP_FROM ||
    process.env.EMAIL_FROM ||
    (process.env.FROM_EMAIL ? `"Green Clean Group" <${process.env.FROM_EMAIL}>` : null) ||
    (smtpUser ? `"Green Clean Group" <${smtpUser}>` : `"Green Clean Group" <${fromEmail}>`);

  const mandrillKey =
    process.env.MANDRILL_API_KEY ||
    process.env.MAILCHIMP_TRANSACTIONAL_API_KEY ||
    process.env.MAILCHIMP_TRANSACTIONAL_KEY ||
    "";

  const resendKey = process.env.RESEND_API_KEY || "";

  return {
    fromEmail,
    replyToEmail,
    adminEmail,
    smtp:
      smtpHost && smtpUser && smtpPass
        ? {
            host: smtpHost,
            port: smtpPort,
            secure: smtpSecure,
            user: smtpUser,
            pass: smtpPass,
            from: smtpFrom,
          }
        : null,
    mandrillKey: mandrillKey.trim() || null,
    resendKey: resendKey.trim() || null,
  };
}

/**
 * Send an email using the best available configured transport.
 * 
 * @param {Object} params
 * @param {string|Array<{email: string, name?: string}>} params.to - Recipient(s)
 * @param {string} params.subject - Email subject
 * @param {string} params.html - HTML body
 * @param {string} [params.text] - Plain text body
 * @param {string} [params.fromEmail] - Sender email address
 * @param {string} [params.fromName] - Sender display name
 * @returns {Promise<{ok: boolean, transport?: string, error?: any, skipped?: boolean, reason?: string}>}
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
  fromEmail = process.env.FROM_EMAIL || "noreply@greencleangroup.co.uk",
  fromName = "Green Clean Group",
  replyTo = "info@greencleangroup.co.uk",
}) {
  const config = getEmailConfig();

  // Normalize recipient list to comma-separated string for SMTP and Resend array
  const recipientsList = Array.isArray(to)
    ? to.map((t) => (typeof t === "string" ? t : t.email)).filter(Boolean)
    : [typeof to === "string" ? to : to?.email].filter(Boolean);

  if (recipientsList.length === 0) {
    console.warn("[Email Dispatch] No valid recipient email provided.");
    return { ok: false, error: "No recipient email provided" };
  }

  // 1. SMTP Transport (preferred, direct, zero per-email cost)
  if (config.smtp) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.secure,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
      });

      const fromAddress = fromEmail
        ? `"${fromName}" <${fromEmail}>`
        : (config.smtp.from || `"${fromName}" <${config.smtp.user || "noreply@greencleangroup.co.uk"}>`);

      const mailOptions = {
        from: fromAddress,
        to: recipientsList.join(", "),
        subject,
        text: text || "Green Clean Group notification",
        html,
      };

      if (replyTo) {
        mailOptions.replyTo = replyTo;
      }

      const info = await transporter.sendMail(mailOptions);

      console.log(`[Email Dispatch - SMTP] Sent to ${recipientsList.join(", ")} (ID: ${info.messageId})`);
      return { ok: true, transport: "smtp", messageId: info.messageId };
    } catch (smtpErr) {
      console.error("[Email Dispatch - SMTP] Failed:", smtpErr.message || smtpErr);
      // Fall through to other transports if configured
    }
  }

  // 2. Mailchimp Transactional / Mandrill
  if (config.mandrillKey) {
    try {
      const mandrillRecipients = Array.isArray(to)
        ? to.map((t) => (typeof t === "string" ? { email: t, type: "to" } : { email: t.email, name: t.name || "", type: "to" }))
        : [{ email: typeof to === "string" ? to : to.email, name: typeof to === "object" ? to.name : "", type: "to" }];

      const payload = {
        key: config.mandrillKey,
        message: {
          html,
          text: text || "Green Clean Group notification",
          subject,
          from_email: fromEmail,
          from_name: fromName,
          to: mandrillRecipients,
          headers: replyTo ? { "Reply-To": replyTo } : {},
        },
      };

      const res = await fetch("https://mandrillapp.com/api/1.0/messages/send.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.warn("[Email Dispatch - Mandrill] API returned error:", data);
        return { ok: false, transport: "mandrill", error: data };
      }

      console.log(`[Email Dispatch - Mandrill] Sent to ${recipientsList.join(", ")}`);
      return { ok: true, transport: "mandrill", data };
    } catch (mandrillErr) {
      console.error("[Email Dispatch - Mandrill] Network error:", mandrillErr.message || mandrillErr);
    }
  }

  // 3. Resend API
  if (config.resendKey) {
    try {
      const payload = {
        from: `${fromName} <${fromEmail}>`,
        to: recipientsList,
        subject,
        html,
        text,
      };

      if (replyTo) {
        payload.reply_to = replyTo;
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.resendKey}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        console.warn("[Email Dispatch - Resend] API error:", data);
        return { ok: false, transport: "resend", error: data };
      }

      console.log(`[Email Dispatch - Resend] Sent to ${recipientsList.join(", ")}`);
      return { ok: true, transport: "resend", data };
    } catch (resendErr) {
      console.error("[Email Dispatch - Resend] Network error:", resendErr.message || resendErr);
    }
  }

  // If no transport is configured
  console.warn(
    `[Email Dispatch] No email transport configured (SMTP_HOST, MANDRILL_API_KEY, or RESEND_API_KEY). Could not dispatch email '${subject}' to ${recipientsList.join(", ")}.`
  );

  return {
    ok: false,
    skipped: true,
    reason:
      "No active email transport configured in environment variables. Please configure SMTP (SMTP_HOST, SMTP_USER, SMTP_PASS) or MANDRILL_API_KEY or RESEND_API_KEY in .env.",
  };
}

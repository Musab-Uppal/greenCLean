import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";
import { sanitizeEmail, sanitizeText, sanitizePhone } from "@/lib/sanitize";
import { saveSubscriber, ensureWelcomeCoupon } from "@/lib/db";
import { subscribeToMailchimp, sendNewsletterWelcomeEmail } from "@/lib/mailchimp";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL_DEFAULT = "info@greencleangroup.co.uk";

function buildAdminContactEmailHtml({ fullName, cleanEmail, cleanPhone, cleanMessage, subscribe }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Website Enquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #e2e8f0;">
  <div style="max-width: 600px; margin: 0 auto; background: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
    <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 24px; color: #ffffff;">
      <h1 style="margin: 0; font-size: 20px; font-weight: 800;">📩 New Contact Form Message</h1>
      <p style="margin: 4px 0 0 0; font-size: 13px; opacity: 0.9;">From ${fullName} • Green Clean Group Website</p>
    </div>
    <div style="padding: 24px;">
      <div style="background: #0f172a; border-radius: 8px; border: 1px solid #334155; padding: 18px; margin-bottom: 20px;">
        <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; color: #38bdf8; letter-spacing: 0.5px;">Customer Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 5px 0; color: #94a3b8; width: 110px;">Name:</td>
            <td style="padding: 5px 0; font-weight: 700; color: #ffffff;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8;">Email:</td>
            <td style="padding: 5px 0; font-weight: 600; color: #38bdf8;">
              <a href="mailto:${cleanEmail}" style="color: #38bdf8; text-decoration: none;">${cleanEmail}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8;">Phone:</td>
            <td style="padding: 5px 0; font-weight: 600; color: #ffffff;">
              ${cleanPhone ? `<a href="tel:${cleanPhone}" style="color: #ffffff; text-decoration: none;">${cleanPhone}</a>` : `<span style="color: #64748b;">Not provided</span>`}
            </td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #94a3b8;">Newsletter:</td>
            <td style="padding: 5px 0; font-weight: 600; color: ${subscribe ? "#34d399" : "#94a3b8"};">
              ${subscribe ? "✓ Subscribed (Opted In)" : "No"}
            </td>
          </tr>
        </table>
      </div>

      <div style="background: #0f172a; border-radius: 8px; border: 1px solid #334155; padding: 18px; margin-bottom: 24px;">
        <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; color: #34d399; letter-spacing: 0.5px;">Message</h3>
        <div style="background: #1e293b; padding: 14px; border-radius: 6px; color: #f8fafc; font-size: 14px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;">${cleanMessage}</div>
      </div>

      <div style="text-align: center;">
        <a href="mailto:${cleanEmail}?subject=Re: Your enquiry to Green Clean Group" style="display: inline-block; background: #059669; color: #ffffff; padding: 12px 28px; border-radius: 6px; font-weight: 700; font-size: 14px; text-decoration: none;">
          Reply to Customer Directly →
        </a>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function buildCustomerAckEmailHtml({ firstName, cleanMessage }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>We've received your message — Green Clean Group</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 800;">Green Clean Group</h1>
      <p style="margin: 6px 0 0 0; font-size: 14px; opacity: 0.95;">Liverpool's Eco-Friendly Cleaning Specialists</p>
    </div>
    <div style="padding: 32px 24px;">
      <div style="display: inline-block; background: #ecfdf5; color: #065f46; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 999px; text-transform: uppercase; margin-bottom: 16px;">
        ✓ Message Received
      </div>
      <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #0f172a;">Thanks for contacting us, ${firstName || "there"}!</h2>
      <p style="margin: 0 0 20px 0; font-size: 15px; line-height: 1.6; color: #475569;">
        We have received your message. A member of our Liverpool customer care team will get back to you within <strong>2 hours</strong> during operating hours.
      </p>

      <div style="background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 16px; margin-bottom: 24px;">
        <span style="font-size: 12px; font-weight: 700; text-transform: uppercase; color: #64748b; display: block; margin-bottom: 6px;">Your Message:</span>
        <div style="font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${cleanMessage}</div>
      </div>

      <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 13px; color: #64748b; line-height: 1.6;">
        <p style="margin: 0 0 6px 0;"><strong>Need urgent assistance or ready to book?</strong></p>
        <p style="margin: 0; color: #0f172a; font-weight: 600;">
          📞 Phone: 07359 068284 &nbsp;|&nbsp; ✉️ Email: <a href="mailto:info@greencleangroup.co.uk" style="color: #059669; text-decoration: none;">info@greencleangroup.co.uk</a>
        </p>
        <p style="margin: 4px 0 0 0;">Operating Hours: Monday – Sunday: 08:00 – 19:00</p>
      </div>
    </div>
    <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
      © ${new Date().getFullYear()} Green Clean Group · Liverpool &amp; 40 Miles Around
    </div>
  </div>
</body>
</html>`;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      firstName = "",
      lastName = "",
      email = "",
      phone = "",
      message = "",
      subscribe = false,
    } = body;

    const cleanFirstName = sanitizeText(firstName, 100);
    const cleanLastName = sanitizeText(lastName, 100);
    const fullName = `${cleanFirstName} ${cleanLastName}`.trim() || cleanFirstName || "Customer";
    const cleanEmail = sanitizeEmail(email);
    const cleanPhone = sanitizePhone(phone);
    const cleanMessage = sanitizeText(message, 3000);

    // Validation
    if (!cleanFirstName) {
      return NextResponse.json({ error: "First name is required." }, { status: 400 });
    }
    if (!cleanEmail) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }
    if (!cleanMessage || cleanMessage.length < 10) {
      return NextResponse.json(
        { error: "Please enter a message with at least 10 characters." },
        { status: 400 }
      );
    }

    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || ADMIN_EMAIL_DEFAULT;

    // 1. Dispatch email to business admin
    const adminHtml = buildAdminContactEmailHtml({
      fullName,
      cleanEmail,
      cleanPhone,
      cleanMessage,
      subscribe: Boolean(subscribe),
    });

    const adminEmailRes = await sendEmail({
      to: adminEmail,
      subject: `📩 New Contact Form Message from ${fullName}`,
      html: adminHtml,
      text: `New contact form submission from ${fullName} (${cleanEmail}, Phone: ${cleanPhone || "N/A"}):\n\n${cleanMessage}`,
    });

    // 2. Dispatch auto-reply confirmation to the customer
    const customerHtml = buildCustomerAckEmailHtml({
      firstName: cleanFirstName,
      cleanMessage,
    });

    sendEmail({
      to: cleanEmail,
      subject: "We've received your message — Green Clean Group",
      html: customerHtml,
      text: `Hi ${cleanFirstName},\n\nThank you for reaching out to Green Clean Group. We have received your message and will reply within 2 hours during business hours.\n\nYour message:\n${cleanMessage}\n\nPhone: 07359 068284\nEmail: info@greencleangroup.co.uk`,
    }).catch((custErr) => {
      console.warn("[Contact Route] Customer auto-reply warning:", custErr?.message);
    });

    // 3. If opted into newsletter, subscribe & deliver 10% discount code
    if (subscribe) {
      try {
        await ensureWelcomeCoupon("WELCOME10", 10);
        await saveSubscriber({
          email: cleanEmail,
          firstName: cleanFirstName,
          lastName: cleanLastName,
          phone: cleanPhone,
          source: "contact-form",
          marketing_consent: true,
          consent_date: new Date().toISOString(),
          consent_wording: "Subscribed via contact form",
          consent_source: "contact-form",
        });

        await subscribeToMailchimp({
          email: cleanEmail,
          firstName: cleanFirstName,
          lastName: cleanLastName,
          phone: cleanPhone,
          tags: ["Contact Form", "Newsletter Signup", "10% Discount Claimed"],
        });

        sendNewsletterWelcomeEmail({
          email: cleanEmail,
          discountCode: "WELCOME10",
        }).catch((err) => console.warn("[Contact Route] Welcome email warning:", err?.message));
      } catch (subErr) {
        console.warn("[Contact Route] Newsletter sync warning:", subErr?.message);
      }
    }

    // Check delivery status
    if (adminEmailRes.skipped) {
      console.warn("[Contact Route] Warning: No email transport configured (SMTP, Mandrill, or Resend).");
      // If no transport is configured in .env, tell user so they don't think it sent silently
      return NextResponse.json({
        success: true,
        warning: "No email transport configured. Please configure SMTP in .env.",
        message: "Message received. For immediate inquiries, please call 07359068284.",
      });
    }

    if (!adminEmailRes.ok && adminEmailRes.error) {
      console.error("[Contact Route] Email dispatch failed:", adminEmailRes.error);
      return NextResponse.json(
        {
          error:
            "Unable to deliver your message at this time. Please call our team on 07359 068284 or email info@greencleangroup.co.uk directly.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your message has been sent successfully! We will get back to you within 2 hours.",
    });
  } catch (err) {
    console.error("[Contact Route Error]:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred while sending your message. Please try again or call 07359068284." },
      { status: 500 }
    );
  }
}

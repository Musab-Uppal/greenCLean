import { NextResponse } from "next/server";
import { subscribeToMailchimp, recordMailchimpEvent, sendNewsletterWelcomeEmail } from "@/lib/mailchimp";
import { saveSubscriber, ensureWelcomeCoupon } from "@/lib/db";

export const dynamic = "force-dynamic";

// Exact consent wording for the standalone newsletter signup form
const NEWSLETTER_CONSENT_WORDING =
  "I'd like to receive cleaning reminders and special offers by email from Green Clean Group. I can unsubscribe at any time.";

const WELCOME_DISCOUNT_CODE = "WELCOME10";

/**
 * POST /api/mailchimp/subscribe
 * Body: { email, firstName?, lastName?, phone?, source? }
 *
 * Used by the standalone newsletter signup form.
 * The form itself is an explicit opt-in act, so subscribing here implies consent.
 * Subscribes to Mailchimp AND stores the subscriber locally with a consent record.
 *
 * Mailchimp respects its own unsubscribe links — if a contact has previously
 * unsubscribed via Mailchimp, they will NOT be re-subscribed.
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { email, firstName = "", lastName = "", phone = "", source = "newsletter-form" } = body;

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const consentDate = new Date().toISOString();

    // 1. Always save to local PostgreSQL database first (with consent record)
    try {
      await saveSubscriber({
        email,
        firstName,
        lastName,
        phone,
        source,
        marketing_consent: true,
        consent_date: consentDate,
        consent_wording: NEWSLETTER_CONSENT_WORDING,
        consent_source: source,
      });
    } catch (dbErr) {
      console.error("[Subscribe route] DB saveSubscriber error:", dbErr);
    }

    // 2. Ensure the 10% welcome coupon exists and is active in DB
    try {
      await ensureWelcomeCoupon(WELCOME_DISCOUNT_CODE, 10);
    } catch (couponErr) {
      console.warn("[Subscribe route] Note on welcome coupon:", couponErr?.message);
    }

    // 3. Sync to Mailchimp Audience with tags
    const result = await subscribeToMailchimp({
      email,
      firstName,
      lastName,
      phone,
      tags: ["Newsletter Signup", "10% Discount Claimed", `Source: ${source}`],
    });

    // 4. Record custom event in Mailchimp to trigger any Customer Journey automations
    recordMailchimpEvent({
      email,
      eventName: "newsletter_subscribed",
      properties: {
        promo_code: WELCOME_DISCOUNT_CODE,
        discount: "10%",
        source,
      },
    }).catch((eventErr) =>
      console.warn("[Subscribe route] Mailchimp event warning:", eventErr?.message)
    );

    // 5. Send automated welcome email with the 10% discount voucher code
    sendNewsletterWelcomeEmail({
      email,
      discountCode: WELCOME_DISCOUNT_CODE,
    }).catch((mailErr) =>
      console.error("[Subscribe route] Welcome email error:", mailErr)
    );

    if (!result.ok) {
      // If Mailchimp isn't configured yet or temporary warning, local subscriber & email still delivered
      if (result.error === "Mailchimp not configured") {
        console.warn("[Mailchimp] Signup saved locally; Mailchimp is not configured yet.");
        return NextResponse.json({
          success: true,
          pending: true,
          discountCode: WELCOME_DISCOUNT_CODE,
          message: `Subscribed! Your 10% discount code is ${WELCOME_DISCOUNT_CODE}.`,
        });
      }
    }

    if (result.skipped) {
      // Contact is unsubscribed in Mailchimp — we respect that
      return NextResponse.json({
        success: true,
        discountCode: WELCOME_DISCOUNT_CODE,
        message: "Your preferences have been recorded.",
      });
    }

    return NextResponse.json({
      success: true,
      discountCode: WELCOME_DISCOUNT_CODE,
      message: `Subscribed! Your 10% discount code is ${WELCOME_DISCOUNT_CODE}.`,
    });
  } catch (err) {
    console.error("[Subscribe route] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

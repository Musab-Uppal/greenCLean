import { NextResponse } from "next/server";
import { subscribeToMailchimp } from "@/lib/mailchimp";
import { saveSubscriber } from "@/lib/db";

export const dynamic = "force-dynamic";

// Exact consent wording for the standalone newsletter signup form
const NEWSLETTER_CONSENT_WORDING =
  "I'd like to receive cleaning reminders and special offers by email from Green Clean Group. I can unsubscribe at any time.";

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

    // 2. Sync to Mailchimp (respects unsubscribed status — won't re-subscribe)
    const result = await subscribeToMailchimp({
      email,
      firstName,
      lastName,
      phone,
      tags: ["Newsletter Signup", `Source: ${source}`],
    });

    if (!result.ok) {
      // If Mailchimp isn't configured yet, still return success so the form doesn't break
      if (result.error === "Mailchimp not configured") {
        console.warn("[Mailchimp] Signup attempted but Mailchimp is not configured yet.");
        return NextResponse.json({ success: true, pending: true });
      }
      return NextResponse.json(
        { error: "Failed to subscribe. Please try again." },
        { status: 500 }
      );
    }

    if (result.skipped) {
      // Contact is unsubscribed in Mailchimp — we respect that
      return NextResponse.json({
        success: true,
        message: "Your preferences have been recorded.",
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Subscribe route] Error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

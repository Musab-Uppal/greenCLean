/**
 * PayPal REST Orders API v2 helper
 * Docs: https://developer.paypal.com/docs/api/orders/v2/
 *
 * Required .env variables:
 *   PAYPAL_CLIENT_ID=...
 *   PAYPAL_CLIENT_SECRET=...
 *   PAYPAL_MODE=sandbox   (or "live")
 */

const PAYPAL_BASE =
  process.env.PAYPAL_MODE === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

/** Check whether PayPal credentials are configured */
export function isPayPalConfigured() {
  const clientId = process.env.PAYPAL_CLIENT_ID || "";
  const secret = process.env.PAYPAL_CLIENT_SECRET || "";
  return (
    Boolean(clientId) &&
    clientId !== "YOUR_PAYPAL_SANDBOX_CLIENT_ID" &&
    clientId !== "YOUR_PAYPAL_LIVE_CLIENT_ID" &&
    Boolean(secret) &&
    secret !== "YOUR_PAYPAL_SANDBOX_CLIENT_SECRET" &&
    secret !== "YOUR_PAYPAL_LIVE_CLIENT_SECRET"
  );
}

/** Fetch a short-lived OAuth 2.0 access token — internal use only */
async function getAccessToken() {
  if (!isPayPalConfigured()) {
    throw new PayPalNotConfiguredError();
  }

  const credentials = Buffer.from(
    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  let res;
  try {
    res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
  } catch (networkErr) {
    throw new Error("Could not reach PayPal servers. Please check your internet connection and try again.");
  }

  if (!res.ok) {
    const status = res.status;
    // Log the raw error server-side only — never expose to client
    const raw = await res.text().catch(() => "");
    console.error(`[PayPal] Auth failed (${status}):`, raw);

    if (status === 401) {
      throw new Error("PayPal credentials are invalid. Please check your PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET.");
    }
    throw new Error("PayPal authentication failed. Please try again later.");
  }

  const data = await res.json();
  return data.access_token;
}

/**
 * Create a PayPal Order and return the approval URL + order ID.
 */
export async function createPayPalOrder({
  amountGBP,
  description,
  returnUrl,
  cancelUrl,
  metadata = {},
}) {
  const token = await getAccessToken();

  const body = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "GBP",
          value: Number(amountGBP).toFixed(2),
        },
        description: String(description).slice(0, 127),
        custom_id: JSON.stringify(metadata).slice(0, 127),
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "Green Clean Group Liverpool",
          locale: "en-GB",
          landing_page: "NO_PREFERENCE",
          user_action: "PAY_NOW",
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      },
    },
  };

  let res;
  try {
    res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": `gcg-${Date.now()}`,
      },
      body: JSON.stringify(body),
    });
  } catch (networkErr) {
    throw new Error("Could not reach PayPal servers. Please check your internet connection and try again.");
  }

  if (!res.ok) {
    const status = res.status;
    const raw = await res.text().catch(() => "");
    console.error(`[PayPal] Create order failed (${status}):`, raw);
    throw new Error("Unable to create PayPal payment. Please try again or choose a different payment method.");
  }

  const order = await res.json();
  const approvalUrl = order.links?.find((l) => l.rel === "payer-action")?.href;

  if (!approvalUrl) {
    console.error("[PayPal] No payer-action link in response:", JSON.stringify(order));
    throw new Error("Unable to initialise PayPal checkout. Please try again.");
  }

  return { orderId: order.id, approvalUrl };
}

/**
 * Capture an approved PayPal Order.
 */
export async function capturePayPalOrder(orderId) {
  const token = await getAccessToken();

  let res;
  try {
    res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (networkErr) {
    throw new Error("Could not reach PayPal servers. Please check your internet connection and try again.");
  }

  if (!res.ok) {
    const status = res.status;
    const raw = await res.text().catch(() => "");
    console.error(`[PayPal] Capture failed (${status}):`, raw);
    if (status === 422) {
      throw new Error("This PayPal payment has already been captured or was declined.");
    }
    throw new Error("PayPal payment capture failed. Please contact support if the amount was charged.");
  }

  return res.json();
}

/**
 * Retrieve a PayPal Order's details.
 */
export async function getPayPalOrder(orderId) {
  const token = await getAccessToken();

  let res;
  try {
    res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (networkErr) {
    throw new Error("Could not reach PayPal servers. Please check your internet connection and try again.");
  }

  if (!res.ok) {
    const status = res.status;
    const raw = await res.text().catch(() => "");
    console.error(`[PayPal] Get order failed (${status}):`, raw);
    throw new Error("Could not retrieve PayPal order details.");
  }

  return res.json();
}

/** Sentinel error class for unconfigured PayPal */
class PayPalNotConfiguredError extends Error {
  constructor() {
    super("PayPal is not configured. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to your environment variables.");
    this.name = "PayPalNotConfiguredError";
    this.isConfigError = true;
  }
}

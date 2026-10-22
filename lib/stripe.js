import Stripe from "stripe";

// Lazy singleton — instantiated on first use so build-time env vars
// being absent don't cause the Next.js build to crash.
let _stripe = null;

export function getStripe() {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_API_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
      maxNetworkRetries: 3,
      timeout: 30000,
      appInfo: {
        name: "Green Clean Group Liverpool",
        version: "1.0.0",
      },
    });
  }
  return _stripe;
}

// Keep backward-compat named export (routes that already import { stripe })
export const stripe = new Proxy(
  {},
  {
    get(_, prop) {
      return getStripe()[prop];
    },
  }
);

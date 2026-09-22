import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
  maxNetworkRetries: 3,
  timeout: 30000,
  appInfo: {
    name: "Green Clean Group Liverpool",
    version: "1.0.0",
  },
});

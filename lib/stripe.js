import Stripe from "stripe";

// Initialize Stripe instance
// In production or development, reads STRIPE_SECRET_KEY from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";

export const stripe = new Stripe(stripeSecretKey || "sk_test_placeholder_not_configured", {
  apiVersion: "2023-10-16",
  appInfo: {
    name: "Green Clean Group Liverpool",
    version: "1.0.0",
  },
});

export const isStripeConfigured = () => {
  const key = process.env.STRIPE_SECRET_KEY || "";
  return Boolean(
    key &&
    key.startsWith("sk_") &&
    !key.includes("placeholder") &&
    !key.includes("REPLACE_WITH") &&
    key.length > 20
  );
};

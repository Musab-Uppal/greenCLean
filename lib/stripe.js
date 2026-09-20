import Stripe from "stripe";

// Initialize Stripe instance
// In production or development, reads STRIPE_SECRET_KEY from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key";

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2023-10-16",
  appInfo: {
    name: "Green Clean Group Liverpool",
    version: "1.0.0",
  },
});

export const isStripeConfigured = () => {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
    !process.env.STRIPE_SECRET_KEY.includes("placeholder")
  );
};

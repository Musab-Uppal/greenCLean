import { Suspense } from "react";
import SuccessContent from "./SuccessContent";

export const metadata = {
  title: "Booking Confirmed | Green Clean Group Liverpool",
  description: "Your eco-friendly cleaning service is confirmed. Thank you for booking with Green Clean Group Liverpool.",
};

export default function BookSuccessPage() {
  return (
    <div style={{ minHeight: "80vh", background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 400px)", padding: "60px 16px 100px" }}>
      <div className="container" style={{ maxWidth: "620px", margin: "0 auto" }}>
        <Suspense fallback={
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div className="spinner" style={{ width: "40px", height: "40px", border: "4px solid #10b981", borderTopColor: "transparent", borderRadius: "50%", margin: "0 auto 16px", animation: "spin 1s linear infinite" }} />
            <h2 style={{ fontSize: "1.4rem", fontWeight: "700", color: "var(--slate-800)" }}>Verifying your Stripe payment...</h2>
            <p style={{ color: "var(--slate-500)", fontSize: "0.9rem", marginTop: "8px" }}>Please wait while we confirm your booking details.</p>
          </div>
        }>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}

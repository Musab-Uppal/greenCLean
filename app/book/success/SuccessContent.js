"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Printer,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const provider = searchParams.get("provider"); // "paypal" or undefined (Stripe)
  const paypalToken = searchParams.get("token");  // PayPal Order ID on return

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    // ── PayPal return flow ──────────────────────────────────────────────────
    if (provider === "paypal" && paypalToken) {
      // Forward all the booking query params to the capture endpoint
      const captureParams = new URLSearchParams(window.location.search);
      fetch(`/api/paypal/capture-order?${captureParams.toString()}`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not capture PayPal payment.");
          return res.json();
        })
        .then((json) => {
          if (!isMounted) return;
          if (json.error) throw new Error(json.error);
          setData({ ...json, _provider: "paypal" });
        })
        .catch((err) => {
          if (!isMounted) return;
          setError(err.message || "Failed to confirm PayPal payment.");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
      return () => { isMounted = false; };
    }

    // ── Stripe flow ─────────────────────────────────────────────────────────
    if (sessionId) {
      fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`)
        .then((res) => {
          if (!res.ok) throw new Error("Could not verify session with Stripe.");
          return res.json();
        })
        .then((json) => {
          if (!isMounted) return;
          if (json.error) throw new Error(json.error);
          setData({ ...json, _provider: "stripe" });
        })
        .catch((err) => {
          if (!isMounted) return;
          setError(err.message || "Failed to confirm payment.");
        })
        .finally(() => {
          if (isMounted) setLoading(false);
        });
      return () => { isMounted = false; };
    }

    // No recognised session
    setError("No payment session reference detected.");
    setLoading(false);
    return () => { isMounted = false; };
  }, [sessionId, provider, paypalToken]);

  if (loading) {
    const isPayPal = provider === "paypal";
    return (
      <div className="glass-card" style={{ textAlign: "center", padding: "60px 24px", background: "#ffffff", borderRadius: "var(--radius-lg)" }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: `4px solid ${isPayPal ? "#b3d9f7" : "var(--emerald-200)"}`,
          borderTopColor: isPayPal ? "#009cde" : "var(--emerald-600)",
          borderRadius: "50%",
          margin: "0 auto 20px",
          animation: "spin 1s linear infinite"
        }} />
        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "8px" }}>
          {isPayPal ? "Confirming PayPal Payment" : "Verifying Payment & Scheduling"}
        </h2>
        <p style={{ color: "var(--slate-500)", fontSize: "0.95rem" }}>
          {isPayPal
            ? "Capturing your PayPal transaction securely..."
            : "Confirming transaction with Stripe UK secure gateway..."}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ textAlign: "center", padding: "50px 24px", background: "#ffffff", borderRadius: "var(--radius-lg)" }}>
        <div style={{
          width: "64px", height: "64px", borderRadius: "50%",
          background: "var(--danger-50)", color: "var(--danger-500)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px"
        }}>
          <AlertCircle size={36} />
        </div>
        <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "8px" }}>
          Payment Verification Notice
        </h2>
        <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", marginBottom: "24px" }}>
          {error}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/book" className="btn btn-secondary btn-sm">
            Return to Booking
          </Link>
          <Link href="/contact" className="btn btn-primary btn-sm">
            Contact Support (07359 068284)
          </Link>
        </div>
      </div>
    );
  }

  const bookingRef = data?.bookingRef || "GCG-CONFIRMED";
  const totalAmount = typeof data?.totalAmount === "number"
    ? data.totalAmount.toFixed(2)
    : data?.totalAmount || "50.00";
  const isPayPal = data?._provider === "paypal";

  return (
    <div
      className="glass-card"
      style={{
        padding: "44px 36px",
        background: "#ffffff",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
        textAlign: "center"
      }}
    >
      {/* Success Badge Icon */}
      <div style={{
        width: "76px", height: "76px", borderRadius: "50%",
        background: isPayPal ? "#e8f4fe" : "var(--emerald-100)",
        color: isPayPal ? "#003087" : "var(--emerald-600)",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 20px"
      }}>
        <CheckCircle2 size={46} />
      </div>

      <span style={{
        fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: isPayPal ? "#003087" : "var(--emerald-700)",
        background: isPayPal ? "#e8f4fe" : "var(--emerald-50)",
        padding: "4px 12px", borderRadius: "var(--radius-full)",
        border: `1px solid ${isPayPal ? "#009cde" : "var(--emerald-200)"}`,
        display: "inline-flex", alignItems: "center", gap: "6px"
      }}>
        {isPayPal ? (
          <>
            {/* PayPal P icon */}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .921-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.775-4.471z" fill="#003087"/>
            </svg>
            Payment Confirmed via PayPal
          </>
        ) : "Payment Confirmed via Stripe"}
      </span>

      <h1 style={{ fontSize: "2rem", fontWeight: "850", color: "var(--slate-900)", margin: "14px 0 8px", letterSpacing: "-0.02em" }}>
        Booking &amp; Payment Complete!
      </h1>

      <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", lineHeight: "1.6", maxWidth: "480px", margin: "0 auto 28px" }}>
        Your appointment is officially secured. We have dispatched a confirmation receipt to{" "}
        <strong>{data?.email || "your email address"}</strong>.
      </p>

      {/* Booking Summary Box */}
      <div style={{
        background: "var(--slate-50)", border: "1px solid var(--slate-200)",
        borderRadius: "var(--radius-md)", padding: "20px 24px",
        textAlign: "left", fontSize: "0.9rem", marginBottom: "28px",
        display: "flex", flexDirection: "column", gap: "10px"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--slate-500)" }}>Booking Reference:</span>
          <strong style={{ color: "var(--emerald-700)", fontSize: "1.05rem" }}>{bookingRef}</strong>
        </div>

        <div style={{ height: "1px", background: "var(--slate-200)", margin: "2px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--slate-500)", display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={14} color="#059669" />
            <span>Scheduled Arrival:</span>
          </span>
          <strong style={{ color: "var(--slate-800)" }}>{data?.scheduledDate || "Arrival window booked"}</strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--slate-500)", display: "flex", alignItems: "center", gap: "6px" }}>
            <MapPin size={14} color="#059669" />
            <span>Service Address:</span>
          </span>
          <strong style={{ color: "var(--slate-800)", textAlign: "right", maxWidth: "240px" }}>{data?.address || "Liverpool / Merseyside"}</strong>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--slate-500)", display: "flex", alignItems: "center", gap: "6px" }}>
            <CreditCard size={14} color="#059669" />
            <span>Payment Method:</span>
          </span>
          <span style={{ fontWeight: "600", color: isPayPal ? "#003087" : "var(--slate-800)", display: "flex", alignItems: "center", gap: "6px" }}>
            {isPayPal ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.06-.26.76-4.852.816-5.09a.932.932 0 0 1 .921-.788h.58c3.76 0 6.705-1.528 7.565-5.946.36-1.847.174-3.388-.775-4.471z" fill="#003087"/>
                </svg>
                PayPal (Online · GBP £)
              </>
            ) : "Credit Card (Online via Stripe)"}
          </span>
        </div>

        {/* Itemized Services Breakdown */}
        {Array.isArray(data?.items) && data.items.length > 0 && (
          <div style={{
            background: "#ffffff", borderRadius: "var(--radius-md)",
            padding: "12px 14px", border: "1px solid var(--slate-200)", margin: "4px 0"
          }}>
            <div style={{ fontSize: "0.72rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--slate-400)", marginBottom: "8px" }}>
              Services Booked ({data.items.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {data.items.map((it, idx) => (
                <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.86rem" }}>
                  <span style={{ color: "var(--slate-700)" }}>{it.name || it.service_name || "Eco Service"}</span>
                  <strong style={{ color: "var(--slate-900)" }}>£{Number(it.price).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ height: "1px", background: "var(--slate-200)", margin: "2px 0" }} />

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "12px 14px",
          background: isPayPal ? "#e8f4fe" : "var(--emerald-50)",
          borderRadius: "var(--radius-md)",
          border: `1.5px solid ${isPayPal ? "#009cde" : "var(--emerald-300)"}`
        }}>
          <span style={{ color: isPayPal ? "#003087" : "var(--emerald-900)", fontWeight: "800", fontSize: "1.05rem" }}>
            Total Paid (GBP):
          </span>
          <strong style={{ fontSize: "1.4rem", color: isPayPal ? "#009cde" : "var(--emerald-700)", fontWeight: "900" }}>
            £{totalAmount}
          </strong>
        </div>
      </div>

      {/* Trust reassurance */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "8px", fontSize: "0.85rem", color: "var(--slate-500)", marginBottom: "28px"
      }}>
        <ShieldCheck size={16} color="#059669" />
        <span>100% Eco-Friendly &amp; Satisfaction Guaranteed by Green Clean Group Liverpool</span>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => window.print()}
          className="btn btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <Printer size={16} />
          <span>Print Receipt</span>
        </button>

        <Link
          href="/dashboard"
          className="btn btn-secondary"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <span>View in Dashboard</span>
        </Link>

        <Link
          href="/"
          className="btn btn-primary"
          style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <span>Return Home</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

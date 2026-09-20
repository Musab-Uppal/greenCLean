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
  AlertCircle 
} from "lucide-react";

export default function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(() => Boolean(sessionId));
  const [data, setData] = useState(null);
  const [error, setError] = useState(() => (sessionId ? null : "No payment session reference detected."));

  useEffect(() => {
    if (!sessionId) return;

    let isMounted = true;
    fetch(`/api/stripe/verify-session?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not verify session with Stripe.");
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;
        if (json.error) throw new Error(json.error);
        setData(json);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Verification error:", err);
        setError(err.message || "Failed to confirm payment.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [sessionId]);

  if (loading) {
    return (
      <div className="glass-card" style={{ textAlign: "center", padding: "60px 24px", background: "#ffffff", borderRadius: "var(--radius-lg)" }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid var(--emerald-200)",
          borderTopColor: "var(--emerald-600)",
          borderRadius: "50%",
          margin: "0 auto 20px",
          animation: "spin 1s linear infinite"
        }} />
        <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "8px" }}>
          Verifying Payment &amp; Scheduling
        </h2>
        <p style={{ color: "var(--slate-500)", fontSize: "0.95rem" }}>
          Confirming transaction with Stripe UK secure gateway...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-card" style={{ textAlign: "center", padding: "50px 24px", background: "#ffffff", borderRadius: "var(--radius-lg)" }}>
        <div style={{
          width: "64px",
          height: "64px",
          borderRadius: "50%",
          background: "var(--danger-50)",
          color: "var(--danger-500)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
  const totalAmount = typeof data?.totalAmount === "number" ? data.totalAmount.toFixed(2) : data?.totalAmount || "50.00";

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
        width: "76px",
        height: "76px",
        borderRadius: "50%",
        background: "var(--emerald-100)",
        color: "var(--emerald-600)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 20px"
      }}>
        <CheckCircle2 size={46} />
      </div>

      <span style={{
        fontSize: "0.8rem",
        fontWeight: "800",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "var(--emerald-700)",
        background: "var(--emerald-50)",
        padding: "4px 12px",
        borderRadius: "var(--radius-full)",
        border: "1px solid var(--emerald-200)"
      }}>
        Payment Confirmed via Stripe
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
        background: "var(--slate-50)",
        border: "1px solid var(--slate-200)",
        borderRadius: "var(--radius-md)",
        padding: "20px 24px",
        textAlign: "left",
        fontSize: "0.9rem",
        marginBottom: "28px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
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
          <span style={{ fontWeight: "600", color: "var(--slate-800)" }}>
            Credit Card (Online via Stripe)
          </span>
        </div>

        <div style={{ height: "1px", background: "var(--slate-200)", margin: "2px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ color: "var(--slate-800)", fontWeight: "700" }}>Total Paid (GBP):</span>
          <strong style={{ fontSize: "1.25rem", color: "var(--emerald-700)" }}>£{totalAmount}</strong>
        </div>
      </div>

      {/* Trust reassurance */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontSize: "0.85rem",
        color: "var(--slate-500)",
        marginBottom: "28px"
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

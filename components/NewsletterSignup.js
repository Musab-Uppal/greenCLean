"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2, Loader2, Sparkles, ArrowRight } from "lucide-react";

/**
 * NewsletterSignup — reusable Mailchimp signup widget
 *
 * Props:
 *   variant: "footer" | "banner"   — layout style (default: "footer")
 *   source:  string                — used for Mailchimp tagging (default: "footer")
 *
 * Submitting this form is an explicit opt-in act — the subscriber record
 * is stored with full GDPR consent wording and date.
 */
export default function NewsletterSignup({ variant = "footer", source = "footer" }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/mailchimp/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  /* ── BANNER VARIANT ─────────────────────────────────────────────────── */
  if (variant === "banner") {
    return (
      <div style={{
        background: "linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)",
        borderRadius: "var(--radius-xl)",
        padding: "48px 40px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative blobs */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "180px", height: "180px",
          borderRadius: "50%", background: "rgba(16,185,129,0.12)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "-30px",
          width: "120px", height: "120px",
          borderRadius: "50%", background: "rgba(16,185,129,0.08)",
          pointerEvents: "none"
        }} />

        <div style={{ position: "relative", maxWidth: "540px", margin: "0 auto" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(16,185,129,0.2)", color: "#6ee7b7",
            padding: "6px 14px", borderRadius: "var(--radius-full)",
            fontSize: "0.8rem", fontWeight: "700", marginBottom: "16px",
            letterSpacing: "0.03em"
          }}>
            <Sparkles size={14} />
            EXCLUSIVE OFFERS & ECO TIPS
          </div>

          <h3 style={{
            fontSize: "1.75rem", fontWeight: "800", color: "#ffffff",
            marginBottom: "10px", letterSpacing: "-0.02em"
          }}>
            Get 10% Off Your First Clean
          </h3>
          <p style={{
            fontSize: "0.975rem", color: "rgba(255,255,255,0.75)",
            marginBottom: "28px", lineHeight: "1.6"
          }}>
            Join our newsletter for seasonal deals, eco-cleaning tips, and priority booking access — delivered straight to your inbox.
          </p>

          {status === "success" ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              background: "rgba(16,185,129,0.2)", color: "#6ee7b7",
              padding: "14px 24px", borderRadius: "var(--radius-full)",
              fontWeight: "700", fontSize: "1rem"
            }}>
              <CheckCircle2 size={22} />
              You&apos;re subscribed! Check your inbox 🎉
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{
              display: "flex", gap: "10px", maxWidth: "440px",
              margin: "0 auto", flexWrap: "wrap", justifyContent: "center"
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                placeholder="your@email.com"
                disabled={status === "loading"}
                style={{
                  flex: "1 1 220px",
                  padding: "13px 18px",
                  borderRadius: "var(--radius-full)",
                  border: status === "error" ? "2px solid #f87171" : "2px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.1)",
                  color: "#ffffff",
                  fontSize: "0.95rem",
                  outline: "none",
                  backdropFilter: "blur(8px)",
                }}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "8px",
                  padding: "13px 24px",
                  background: status === "loading" ? "rgba(16,185,129,0.5)" : "#10b981",
                  color: "#ffffff",
                  fontWeight: "700", fontSize: "0.95rem",
                  borderRadius: "var(--radius-full)",
                  border: "none", cursor: status === "loading" ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap"
                }}
              >
                {status === "loading" ? (
                  <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Subscribing…</>
                ) : (
                  <>Subscribe <ArrowRight size={16} /></>
                )}
              </button>
              {status === "error" && errorMsg && (
                <p style={{ width: "100%", textAlign: "center", color: "#fca5a5", fontSize: "0.85rem", margin: 0 }}>
                  {errorMsg}
                </p>
              )}
            </form>
          )}

          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)", marginTop: "14px" }}>
            No spam, ever. Unsubscribe at any time. GDPR compliant 🇬🇧
          </p>
        </div>
      </div>
    );
  }

  /* ── FOOTER VARIANT (compact inline) ───────────────────────────────── */
  return (
    <div>
      <h4 style={{
        fontSize: "0.95rem", fontWeight: "700", color: "#ffffff",
        marginBottom: "6px", display: "flex", alignItems: "center", gap: "8px"
      }}>
        <Mail size={16} color="#10b981" />
        Get Exclusive Deals
      </h4>
      <p style={{ fontSize: "0.82rem", color: "var(--slate-400)", marginBottom: "14px", lineHeight: "1.5" }}>
        Eco-cleaning tips, seasonal offers &amp; priority slots — straight to your inbox.
      </p>

      {status === "success" ? (
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          color: "#6ee7b7", fontSize: "0.875rem", fontWeight: "600",
          padding: "10px 14px",
          background: "rgba(16,185,129,0.1)",
          borderRadius: "var(--radius-md)",
          border: "1px solid rgba(16,185,129,0.2)"
        }}>
          <CheckCircle2 size={18} />
          Subscribed! Check your inbox 🎉
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
            placeholder="your@email.com"
            disabled={status === "loading"}
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              border: status === "error"
                ? "1.5px solid #f87171"
                : "1.5px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "#ffffff",
              fontSize: "0.875rem",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              padding: "10px 16px",
              background: status === "loading" ? "var(--emerald-800)" : "var(--emerald-600)",
              color: "#ffffff",
              fontWeight: "700", fontSize: "0.875rem",
              borderRadius: "var(--radius-md)",
              border: "none",
              cursor: status === "loading" ? "not-allowed" : "pointer",
              transition: "background 0.2s"
            }}
          >
            {status === "loading" ? (
              <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Subscribing…</>
            ) : (
              <>Subscribe — It&apos;s Free <ArrowRight size={14} /></>
            )}
          </button>
          {status === "error" && errorMsg && (
            <p style={{ color: "#f87171", fontSize: "0.8rem", margin: 0 }}>{errorMsg}</p>
          )}
          <p style={{ fontSize: "0.72rem", color: "var(--slate-500)", margin: 0 }}>
            No spam, ever. Unsubscribe anytime. GDPR compliant.
          </p>
        </form>
      )}
    </div>
  );
}

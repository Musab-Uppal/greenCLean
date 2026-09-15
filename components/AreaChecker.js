"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, CheckCircle2, AlertCircle, Search, Phone, Calendar } from "lucide-react";
import { SERVICE_AREAS } from "@/data/faqsData";

export default function AreaChecker() {
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState(null);

  const checkPostcode = (e) => {
    e?.preventDefault();
    if (!postcode.trim()) return;

    const cleanInput = postcode.trim().toUpperCase().replace(/\s+/g, "");
    // Extract prefix e.g. "L1", "L36", "WA10", "CH41", "M1"
    const prefixMatch = cleanInput.match(/^([A-Z]{1,2}[0-9]{1,2})/);
    const prefix = prefixMatch ? prefixMatch[1] : cleanInput.slice(0, 3);

    // Check Merseyside first
    const merseyside = SERVICE_AREAS[0];
    const cheshire = SERVICE_AREAS[1];
    const manchester = SERVICE_AREAS[2];

    if (merseyside.postcodes.some(p => cleanInput.startsWith(p))) {
      setResult({
        status: "covered",
        region: "Merseyside (Priority Route)",
        message: "Great news! Your area is fully covered with standard daily routes and flexible morning/afternoon time slots.",
        badge: "Full Daily Coverage"
      });
    } else if (cheshire.postcodes.some(p => cleanInput.startsWith(p))) {
      setResult({
        status: "covered",
        region: "Cheshire & Surrounding",
        message: "Yes! We serve your area with regular weekly routes.",
        badge: "Regular Coverage"
      });
    } else if (manchester.postcodes.some(p => cleanInput.startsWith(p))) {
      setResult({
        status: "covered",
        region: "Greater Manchester & Lancashire",
        message: "We cover your area on select scheduled days each week.",
        badge: "Scheduled Route"
      });
    } else {
      setResult({
        status: "inquire",
        region: "Outside Primary Core",
        message: "You are just outside our primary online booking zone. Please contact our dispatch team at 07359068284 to check our special travel schedule for your location.",
        badge: "Call to Confirm"
      });
    }
  };

  return (
    <div className="glass-card" style={{ padding: "36px 32px", border: "1.5px solid var(--emerald-200)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "var(--emerald-100)", color: "var(--emerald-700)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MapPin size={22} />
        </div>
        <div>
          <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--slate-900)" }}>Check Service Availability</h3>
          <p style={{ fontSize: "0.9rem", color: "var(--slate-600)" }}>Enter your Liverpool or North West postcode to verify service:</p>
        </div>
      </div>

      <form onSubmit={checkPostcode} style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
        <div style={{ position: "relative", flex: "1 1 240px" }}>
          <Search size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--slate-400)" }} />
          <input 
            type="text" 
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="e.g. L1 8JQ, L25, WA10, CH41..."
            className="form-input"
            style={{ paddingLeft: "42px" }}
            aria-label="Postcode input"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ padding: "12px 24px" }}>
          Check Coverage
        </button>
      </form>

      {/* Quick sample pills */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", fontSize: "0.85rem", color: "var(--slate-500)", marginBottom: "20px" }}>
        <span>Quick check:</span>
        {["L1 (Liverpool)", "L23 (Crosby)", "WA10 (St Helens)", "CH41 (Birkenhead)", "M1 (Manchester)"].map((sample) => (
          <button
            key={sample}
            type="button"
            onClick={() => {
              const code = sample.split(" ")[0];
              setPostcode(code);
              setTimeout(() => checkPostcode(), 50);
            }}
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              background: "var(--slate-100)",
              fontSize: "0.8rem",
              fontWeight: "600",
              color: "var(--slate-700)",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "var(--emerald-100)"}
            onMouseOut={(e) => e.currentTarget.style.background = "var(--slate-100)"}
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Coverage Result */}
      {result && (
        <div 
          style={{
            padding: "18px 20px",
            borderRadius: "var(--radius-md)",
            background: result.status === "covered" ? "var(--emerald-50)" : "var(--danger-50)",
            border: `1.5px solid ${result.status === "covered" ? "var(--emerald-300)" : "#fca5a5"}`,
            animation: "dropdownFadeIn 0.3s ease"
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
            {result.status === "covered" ? (
              <CheckCircle2 size={24} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
            ) : (
              <AlertCircle size={24} color="#dc2626" style={{ flexShrink: 0, marginTop: "2px" }} />
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontWeight: "800", color: result.status === "covered" ? "var(--emerald-900)" : "#991b1b", fontSize: "1.05rem" }}>
                  {result.region}
                </span>
                <span style={{
                  fontSize: "0.75rem",
                  fontWeight: "700",
                  padding: "3px 8px",
                  borderRadius: "var(--radius-full)",
                  background: result.status === "covered" ? "var(--emerald-200)" : "#fecaca",
                  color: result.status === "covered" ? "var(--emerald-800)" : "#7f1d1d"
                }}>
                  {result.badge}
                </span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "var(--slate-700)", lineHeight: "1.5", marginBottom: "14px" }}>
                {result.message}
              </p>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {result.status === "covered" ? (
                  <Link href="/book" className="btn btn-primary btn-sm">
                    <Calendar size={14} />
                    <span>Proceed to Book Online</span>
                  </Link>
                ) : (
                  <a href="tel:07359068284" className="btn btn-secondary btn-sm">
                    <Phone size={14} />
                    <span>Call 07359068284</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

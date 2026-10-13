"use client";

import React, { useState } from "react";

/**
 * Marketing Consents Tab — shows all customers who have explicitly opted in
 * to email marketing from Green Clean Group.
 *
 * Data is pulled from /api/admin/consents (protected by admin auth).
 * CSV export is available via /api/admin/consents?format=csv.
 */
export default function ConsentsTab({ consents = [], onRefresh, loading }) {
  const [search, setSearch] = useState("");

  const filtered = consents.filter((c) => {
    const q = search.toLowerCase();
    return (
      !q ||
      (c.email || "").toLowerCase().includes(q) ||
      (c.firstName || "").toLowerCase().includes(q) ||
      (c.lastName || "").toLowerCase().includes(q) ||
      (c.consentSource || "").toLowerCase().includes(q)
    );
  });

  function formatDate(isoStr) {
    if (!isoStr) return "—";
    try {
      return new Date(isoStr).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  }

  function handleExport() {
    window.open("/api/admin/consents?format=csv", "_blank");
  }

  const sourceBadge = (source_type) => {
    if (source_type === "booking") {
      return (
        <span style={{
          fontSize: "0.7rem",
          fontWeight: "700",
          padding: "2px 8px",
          borderRadius: "4px",
          background: "#d1fae5",
          color: "#065f46",
          whiteSpace: "nowrap",
        }}>
          Booking Form
        </span>
      );
    }
    return (
      <span style={{
        fontSize: "0.7rem",
        fontWeight: "700",
        padding: "2px 8px",
        borderRadius: "4px",
        background: "#dbeafe",
        color: "#1e40af",
        whiteSpace: "nowrap",
      }}>
        Newsletter Form
      </span>
    );
  };

  return (
    <section>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "12px",
        marginBottom: "20px",
      }}>
        <div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#f8fafc", margin: 0 }}>
            📧 Marketing Consents
          </h2>
          <p style={{ fontSize: "0.82rem", color: "#64748b", margin: "4px 0 0" }}>
            Customers who have explicitly opted in to receive marketing emails from Green Clean Group.
            These contacts are synced to Mailchimp automatically.
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{
            fontSize: "0.85rem",
            fontWeight: "700",
            color: "#10b981",
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)",
            padding: "5px 12px",
            borderRadius: "6px",
          }}>
            {consents.length} opted in
          </span>
          <button
            onClick={handleExport}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontWeight: "700",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export CSV
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: "#1e293b",
              color: "#94a3b8",
              border: "1px solid #334155",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div style={{
        padding: "12px 16px",
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.2)",
        borderRadius: "8px",
        marginBottom: "20px",
        fontSize: "0.82rem",
        color: "#94a3b8",
        lineHeight: "1.6",
      }}>
        <strong style={{ color: "#10b981" }}>✓ GDPR Compliant</strong> — Only customers who ticked the optional marketing consent checkbox are shown here.
        Every contact in this list has given explicit consent with the exact wording recorded below.
        Mailchimp automatically includes an unsubscribe link in every email.
        Customers who unsubscribe via Mailchimp will not be re-subscribed.
      </div>

      {/* Search */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email, name, or source…"
          style={{
            width: "100%",
            maxWidth: "380px",
            padding: "9px 14px",
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: "6px",
            color: "#f1f5f9",
            fontSize: "0.875rem",
            outline: "none",
          }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>Loading consents…</div>
      ) : filtered.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "48px 24px",
          background: "#0f172a",
          borderRadius: "10px",
          border: "1px dashed #334155",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📭</div>
          <p style={{ color: "#64748b", fontSize: "0.925rem", margin: 0 }}>
            {search ? "No contacts match your search." : "No marketing consents recorded yet."}
          </p>
          {!search && (
            <p style={{ color: "#475569", fontSize: "0.82rem", marginTop: "8px" }}>
              When a customer ticks the opt-in checkbox during booking or signs up via the newsletter form,
              they will appear here.
            </p>
          )}
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.85rem",
            minWidth: "700px",
          }}>
            <thead>
              <tr style={{ background: "#0f172a" }}>
                {["Email", "Name", "Source", "Consent Date", "Exact Wording Agreed"].map((h) => (
                  <th key={h} style={{
                    padding: "10px 14px",
                    textAlign: "left",
                    color: "#64748b",
                    fontWeight: "700",
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    borderBottom: "1px solid #1e293b",
                    whiteSpace: "nowrap",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={`${c.email}-${i}`} style={{
                  borderBottom: "1px solid #1e293b",
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)",
                }}>
                  <td style={{ padding: "11px 14px", color: "#e2e8f0", fontWeight: "500" }}>
                    {c.email}
                  </td>
                  <td style={{ padding: "11px 14px", color: "#94a3b8" }}>
                    {[c.firstName, c.lastName].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td style={{ padding: "11px 14px" }}>
                    {sourceBadge(c.source_type)}
                  </td>
                  <td style={{ padding: "11px 14px", color: "#94a3b8", whiteSpace: "nowrap" }}>
                    {formatDate(c.consentDate)}
                  </td>
                  <td style={{ padding: "11px 14px", color: "#64748b", maxWidth: "320px" }}>
                    <span style={{
                      fontSize: "0.78rem",
                      fontStyle: "italic",
                      lineHeight: "1.4",
                      display: "block",
                    }}>
                      &ldquo;{c.consentWording || "—"}&rdquo;
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mailchimp note */}
      <div style={{
        marginTop: "24px",
        padding: "14px 18px",
        background: "#0f172a",
        border: "1px solid #1e293b",
        borderRadius: "8px",
        fontSize: "0.8rem",
        color: "#64748b",
        lineHeight: "1.6",
      }}>
        <strong style={{ color: "#94a3b8" }}>Managing your email campaigns:</strong>{" "}
        All opted-in contacts are automatically synced to your Mailchimp account. You can write and send
        marketing emails directly from{" "}
        <a
          href="https://mailchimp.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#10b981", textDecoration: "underline" }}
        >
          Mailchimp
        </a>
        . Every email sent via Mailchimp automatically includes a working unsubscribe link.
        Customers who unsubscribe will not be re-added.
      </div>
    </section>
  );
}

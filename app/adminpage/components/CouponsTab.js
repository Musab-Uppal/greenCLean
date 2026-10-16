"use client";

import React, { useState, useMemo } from "react";

export default function CouponsTab({
  coupons = [],
  onOpenAddModal,
  onToggleStatus,
  onDeleteCoupon,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all | active | inactive | expired
  const [copiedCode, setCopiedCode] = useState(null);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch =
        coupon.code.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const isExpired = coupon.expiresAt && new Date() > new Date(coupon.expiresAt);

      if (statusFilter === "active") {
        return matchesSearch && coupon.isActive && !isExpired;
      }
      if (statusFilter === "inactive") {
        return matchesSearch && !coupon.isActive;
      }
      if (statusFilter === "expired") {
        return matchesSearch && isExpired;
      }
      return matchesSearch;
    });
  }, [coupons, searchTerm, statusFilter]);

  const totalUsed = coupons.reduce((acc, c) => acc + (c.usedCount || 0), 0);
  const activeCount = coupons.filter(
    (c) => c.isActive && (!c.expiresAt || new Date() <= new Date(c.expiresAt))
  ).length;

  return (
    <div className="admin-section-card">
      {/* Header & Controls */}
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Coupon Codes &amp; Promotions</h2>
          <p className="admin-section-subtitle">
            Create discount codes, set percentage or fixed discounts, and track customer usage.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="admin-login-submit-btn"
          style={{
            width: "auto",
            margin: 0,
            padding: "10px 20px",
            fontSize: "0.88rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span>Generate New Coupon</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            padding: "12px 16px",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 600 }}>
            Total Coupons
          </span>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#f8fafc", marginTop: "2px" }}>
            {coupons.length}
          </div>
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            padding: "12px 16px",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#34d399", textTransform: "uppercase", fontWeight: 600 }}>
            Active &amp; Ready
          </span>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#10b981", marginTop: "2px" }}>
            {activeCount}
          </div>
        </div>

        <div
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            padding: "12px 16px",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "#818cf8", textTransform: "uppercase", fontWeight: 600 }}>
            Total Times Redeemed
          </span>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#a5b4fc", marginTop: "2px" }}>
            {totalUsed}
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ position: "relative", minWidth: "260px", flex: 1 }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search coupon code..."
            className="admin-form-input"
            style={{ paddingLeft: "36px" }}
          />
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        <div style={{ display: "flex", gap: "6px" }}>
          {[
            { id: "all", label: "All" },
            { id: "active", label: "Active" },
            { id: "inactive", label: "Paused" },
            { id: "expired", label: "Expired" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                fontSize: "0.8rem",
                fontWeight: 600,
                border: "1px solid",
                borderColor: statusFilter === tab.id ? "#10b981" : "#334155",
                background: statusFilter === tab.id ? "rgba(16,185,129,0.15)" : "transparent",
                color: statusFilter === tab.id ? "#34d399" : "#94a3b8",
                cursor: "pointer",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {filteredCoupons.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#475569"
              strokeWidth="1.5"
              style={{ margin: "0 auto 12px" }}
            >
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            <p style={{ fontWeight: 600, fontSize: "0.95rem", color: "#94a3b8", margin: "0 0 4px" }}>
              No coupons found
            </p>
            <p style={{ fontSize: "0.82rem", margin: "0 0 16px" }}>
              {coupons.length === 0
                ? "You haven't generated any promotional codes yet."
                : "No coupons match the current search filter."}
            </p>
            {coupons.length === 0 && (
              <button
                type="button"
                onClick={onOpenAddModal}
                className="admin-login-submit-btn"
                style={{ width: "auto", display: "inline-block", padding: "8px 18px", fontSize: "0.85rem" }}
              >
                + Generate First Coupon
              </button>
            )}
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount Applied</th>
                <th>Min Spend</th>
                <th>Redemptions</th>
                <th>Expiry</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoupons.map((coupon) => {
                const isExpired = coupon.expiresAt && new Date() > new Date(coupon.expiresAt);
                const isMaxedOut = coupon.maxUses && coupon.usedCount >= coupon.maxUses;

                return (
                  <tr key={coupon.id}>
                    {/* Code with Copy button */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span
                          style={{
                            fontFamily: "monospace",
                            fontWeight: 800,
                            fontSize: "1rem",
                            color: "#f8fafc",
                            background: "rgba(30, 41, 59, 0.8)",
                            padding: "4px 10px",
                            borderRadius: "6px",
                            border: "1px solid #334155",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {coupon.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(coupon.code)}
                          title="Copy coupon code"
                          style={{
                            background: copiedCode === coupon.code ? "#059669" : "rgba(30,41,59,0.8)",
                            border: "1px solid #334155",
                            color: copiedCode === coupon.code ? "#ffffff" : "#94a3b8",
                            borderRadius: "6px",
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            transition: "all 0.15s",
                          }}
                        >
                          {copiedCode === coupon.code ? "✓ Copied" : "Copy"}
                        </button>
                      </div>
                    </td>

                    {/* Discount value & type */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span
                          style={{
                            background:
                              coupon.discountType === "percentage"
                                ? "rgba(16,185,129,0.15)"
                                : "rgba(56,189,248,0.15)",
                            color: coupon.discountType === "percentage" ? "#34d399" : "#38bdf8",
                            border:
                              coupon.discountType === "percentage"
                                ? "1px solid rgba(16,185,129,0.4)"
                                : "1px solid rgba(56,189,248,0.4)",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "0.85rem",
                          }}
                        >
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% OFF`
                            : `£${coupon.discountValue.toFixed(2)} OFF`}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
                          {coupon.discountType === "percentage" ? "Percentage" : "Fixed"}
                        </span>
                      </div>
                    </td>

                    {/* Min Spend */}
                    <td>
                      <span style={{ color: coupon.minOrderAmount > 0 ? "#f8fafc" : "#64748b", fontSize: "0.88rem" }}>
                        {coupon.minOrderAmount > 0 ? `£${coupon.minOrderAmount.toFixed(2)}` : "None"}
                      </span>
                    </td>

                    {/* Redemptions */}
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontWeight: 700, color: coupon.usedCount > 0 ? "#10b981" : "#94a3b8" }}>
                          {coupon.usedCount}
                        </span>
                        <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                          {coupon.maxUses ? `/ ${coupon.maxUses} max` : "uses (unlimited)"}
                        </span>
                      </div>
                    </td>

                    {/* Expiry */}
                    <td>
                      {coupon.expiresAt ? (
                        <span
                          style={{
                            fontSize: "0.82rem",
                            color: isExpired ? "#f87171" : "#94a3b8",
                            fontWeight: isExpired ? 600 : 400,
                          }}
                        >
                          {new Date(coupon.expiresAt).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                          {isExpired && " (Expired)"}
                        </span>
                      ) : (
                        <span style={{ fontSize: "0.82rem", color: "#64748b" }}>Never</span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td>
                      {isExpired ? (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: "rgba(239, 68, 68, 0.15)",
                            color: "#f87171",
                            border: "1px solid rgba(239,68,68,0.3)",
                            fontWeight: 700,
                          }}
                        >
                          Expired
                        </span>
                      ) : isMaxedOut ? (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: "rgba(245, 158, 11, 0.15)",
                            color: "#fbbf24",
                            border: "1px solid rgba(245,158,11,0.3)",
                            fontWeight: 700,
                          }}
                        >
                          Limit Reached
                        </span>
                      ) : coupon.isActive ? (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: "rgba(16, 185, 129, 0.15)",
                            color: "#34d399",
                            border: "1px solid rgba(16,185,129,0.3)",
                            fontWeight: 700,
                          }}
                        >
                          Active
                        </span>
                      ) : (
                        <span
                          style={{
                            fontSize: "0.75rem",
                            padding: "3px 8px",
                            borderRadius: "4px",
                            background: "rgba(100, 116, 139, 0.15)",
                            color: "#94a3b8",
                            border: "1px solid rgba(100,116,139,0.3)",
                            fontWeight: 700,
                          }}
                        >
                          Paused
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => onToggleStatus(coupon.id, !coupon.isActive)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            background: coupon.isActive ? "rgba(245, 158, 11, 0.15)" : "rgba(16, 185, 129, 0.15)",
                            border: `1px solid ${coupon.isActive ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)"}`,
                            color: coupon.isActive ? "#fbbf24" : "#34d399",
                            transition: "all 0.15s",
                          }}
                        >
                          {coupon.isActive ? "Pause" : "Activate"}
                        </button>

                        <button
                          type="button"
                          onClick={() => onDeleteCoupon(coupon.id, coupon.code)}
                          style={{
                            padding: "4px 8px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#f87171",
                            transition: "all 0.15s",
                          }}
                          title="Delete coupon"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

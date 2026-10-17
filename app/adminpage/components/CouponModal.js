"use client";

import React, { useState } from "react";

const CODE_PREFIXES = ["ECO", "CLEAN", "SAVE", "LIVERPOOL", "GREEN", "PROMO", "VIP", "SPRING", "SUMMER", "AUTUMN", "WINTER"];

function getRandomPrefix() {
  return CODE_PREFIXES[Math.floor(Math.random() * CODE_PREFIXES.length)];
}

export default function CouponModal({ isOpen, onClose, onSave, loading }) {
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // percentage | fixed
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState("");

  const generateRandomCode = () => {
    const prefix = getRandomPrefix();
    const num = Math.floor(10 + Math.random() * 90);
    const newCode = `${prefix}${discountValue ? Math.round(Number(discountValue)) : num}`;
    setCode(newCode.toUpperCase());
  };

  const handleApplyPreset = (type, val) => {
    setDiscountType(type);
    setDiscountValue(String(val));
    if (!code || CODE_PREFIXES.some((p) => code.startsWith(p))) {
      const prefix = getRandomPrefix();
      setCode(`${prefix}${val}`.toUpperCase());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      setFormError("Coupon code is required.");
      return;
    }

    const val = parseFloat(discountValue);
    if (isNaN(val) || val <= 0) {
      setFormError("Please enter a discount greater than 0.");
      return;
    }

    if (discountType === "percentage" && val > 100) {
      setFormError("Percentage discount cannot exceed 100%.");
      return;
    }

    onSave({
      code: cleanCode,
      discountType,
      discountValue: val,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
      maxUses: maxUses ? parseInt(maxUses, 10) : null,
      expiresAt: expiresAt ? expiresAt : null,
      isActive,
    });
  };

  if (!isOpen) return null;

  const numVal = parseFloat(discountValue) || 0;
  const sampleSubtotal = 100;
  const sampleDeduction = discountType === "percentage"
    ? Math.round(((sampleSubtotal * numVal) / 100) * 100) / 100
    : Math.min(numVal, sampleSubtotal);
  const sampleFinal = Math.max(0, sampleSubtotal - sampleDeduction);

  return (
    <div className="admin-modal-backdrop" onClick={onClose}>
      <div
        className="admin-modal-window"
        style={{
          maxWidth: "480px",
          maxHeight: "calc(100vh - 36px)",
          overflowY: "auto",
          padding: "18px 22px",
          margin: "auto",
          borderRadius: "14px",
          boxSizing: "border-box"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
          <div>
            <h3 style={{ margin: "0 0 2px", fontSize: "1.1rem", fontWeight: 700, color: "#f8fafc" }}>
              Generate Promotional Coupon
            </h3>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>
              Create a coupon code and configure discount rate.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "1.3rem",
              cursor: "pointer",
              lineHeight: 1,
              padding: "2px 6px"
            }}
          >
            &times;
          </button>
        </div>

        {formError && (
          <div className="admin-login-alert" style={{ marginBottom: "12px", padding: "8px 12px", fontSize: "0.8rem" }}>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {/* Coupon Code Input + Random Generator */}
          <div>
            <label className="admin-form-label" style={{ fontSize: "0.7rem", marginBottom: "4px" }}>
              COUPON CODE *
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ECO20, CLEAN10"
                required
                className="admin-form-input"
                style={{
                  padding: "7px 10px",
                  fontSize: "0.88rem",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  letterSpacing: "0.5px"
                }}
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="admin-refresh-btn"
                style={{
                  flexShrink: 0,
                  padding: "0 10px",
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  color: "#34d399",
                  borderColor: "rgba(16,185,129,0.3)"
                }}
              >
                🎲 Auto-Generate
              </button>
            </div>
          </div>

          {/* Discount Type Selector */}
          <div>
            <label className="admin-form-label" style={{ fontSize: "0.7rem", marginBottom: "4px" }}>
              DISCOUNT TYPE
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setDiscountType("percentage")}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: discountType === "percentage" ? "1px solid #10b981" : "1px solid #334155",
                  background: discountType === "percentage" ? "rgba(16,185,129,0.15)" : "#0f172a",
                  color: discountType === "percentage" ? "#34d399" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  transition: "all 0.15s"
                }}
              >
                <span>% Percentage Off</span>
              </button>

              <button
                type="button"
                onClick={() => setDiscountType("fixed")}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: discountType === "fixed" ? "1px solid #10b981" : "1px solid #334155",
                  background: discountType === "fixed" ? "rgba(16,185,129,0.15)" : "#0f172a",
                  color: discountType === "fixed" ? "#34d399" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                  transition: "all 0.15s"
                }}
              >
                <span>£ Fixed Amount Off</span>
              </button>
            </div>
          </div>

          {/* Discount Value */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
              <label className="admin-form-label" style={{ margin: 0, fontSize: "0.7rem" }}>
                {discountType === "percentage" ? "DISCOUNT PERCENTAGE (%) *" : "DISCOUNT AMOUNT (£ GBP) *"}
              </label>
              <span style={{ fontSize: "0.72rem", color: "#34d399", fontWeight: 600 }}>
                {discountType === "percentage" ? `${numVal}% off` : `£${numVal.toFixed(2)} off`}
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                fontWeight: 700,
                fontSize: "0.88rem"
              }}>
                {discountType === "percentage" ? "%" : "£"}
              </span>
              <input
                type="number"
                step="any"
                min="0"
                max={discountType === "percentage" ? "100" : undefined}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "15" : "10"}
                required
                className="admin-form-input"
                style={{
                  padding: "7px 10px 7px 30px",
                  fontSize: "0.95rem",
                  fontWeight: 700
                }}
              />
            </div>

            {/* Quick Presets */}
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Quick:</span>
              {discountType === "percentage" ? (
                [5, 10, 15, 20, 25, 50].map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => handleApplyPreset("percentage", pct)}
                    style={{
                      background: String(discountValue) === String(pct) ? "#059669" : "rgba(30,41,59,0.8)",
                      border: "1px solid #334155",
                      color: "#f8fafc",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    {pct}%
                  </button>
                ))
              ) : (
                [5, 10, 15, 20, 25, 50].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleApplyPreset("fixed", amt)}
                    style={{
                      background: String(discountValue) === String(amt) ? "#059669" : "rgba(30,41,59,0.8)",
                      border: "1px solid #334155",
                      color: "#f8fafc",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "1px 6px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    £{amt}
                  </button>
                ))
              )}
            </div>

            {/* Live Calculation Preview Banner */}
            <div style={{
              marginTop: "6px",
              padding: "6px 10px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "6px",
              fontSize: "0.75rem",
              color: "#34d399",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>Sample £100 order:</span>
              <span style={{ fontWeight: 700 }}>
                -£{sampleDeduction.toFixed(2)} &rarr; Total £{sampleFinal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Optional Rules Grid: Min Spend & Usage Limit */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div>
              <label className="admin-form-label" style={{ fontSize: "0.7rem", marginBottom: "4px" }}>
                MIN SPEND (£ GBP)
              </label>
              <input
                type="number"
                step="any"
                min="0"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                placeholder="0 (no min)"
                className="admin-form-input"
                style={{ padding: "6px 8px", fontSize: "0.82rem" }}
              />
            </div>

            <div>
              <label className="admin-form-label" style={{ fontSize: "0.7rem", marginBottom: "4px" }}>
                USAGE LIMIT (MAX USES)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="Unlimited"
                className="admin-form-input"
                style={{ padding: "6px 8px", fontSize: "0.82rem" }}
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="admin-form-label" style={{ fontSize: "0.7rem", marginBottom: "4px" }}>
              EXPIRY DATE (OPTIONAL)
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="admin-form-input"
              style={{ padding: "6px 8px", fontSize: "0.82rem" }}
            />
          </div>

          {/* Active Status Checkbox */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
            <input
              type="checkbox"
              id="couponActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ width: "16px", height: "16px", accentColor: "#10b981", cursor: "pointer" }}
            />
            <label htmlFor="couponActive" style={{ fontSize: "0.8rem", color: "#e2e8f0", cursor: "pointer" }}>
              Make coupon active immediately
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "6px",
            borderTop: "1px solid #1e293b",
            paddingTop: "10px"
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="admin-refresh-btn"
              style={{ padding: "7px 14px", fontSize: "0.82rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="admin-login-submit-btn"
              style={{
                width: "auto",
                margin: 0,
                padding: "7px 18px",
                fontSize: "0.82rem",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              {loading ? "Generating..." : "Generate Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

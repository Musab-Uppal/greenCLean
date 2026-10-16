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
        style={{ maxWidth: "560px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <h3 style={{ margin: "0 0 4px", fontSize: "1.3rem", fontWeight: 700, color: "#f8fafc" }}>
              Generate Promotional Coupon
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
              Configure coupon code and how much discount to apply.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "1.4rem",
              cursor: "pointer",
              lineHeight: 1,
              padding: "4px"
            }}
          >
            &times;
          </button>
        </div>

        {formError && (
          <div className="admin-login-alert" style={{ marginBottom: "16px" }}>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Coupon Code Input + Random Generator */}
          <div>
            <label className="admin-form-label">
              COUPON CODE *
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g. ECO20, CLEAN10"
                required
                className="admin-form-input"
                style={{ textTransform: "uppercase", fontWeight: 700, letterSpacing: "1px" }}
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="admin-refresh-btn"
                style={{ flexShrink: 0, padding: "0 14px", fontWeight: 600, fontSize: "0.85rem", color: "#34d399", borderColor: "rgba(16,185,129,0.3)" }}
              >
                🎲 Auto-Generate
              </button>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px", display: "block" }}>
              Customers will enter this code at checkout. Codes are always uppercase.
            </span>
          </div>

          {/* Discount Type Selector */}
          <div>
            <label className="admin-form-label">
              DISCOUNT TYPE
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setDiscountType("percentage")}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: discountType === "percentage" ? "1px solid #10b981" : "1px solid #334155",
                  background: discountType === "percentage" ? "rgba(16,185,129,0.15)" : "#0f172a",
                  color: discountType === "percentage" ? "#34d399" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.15s"
                }}
              >
                <span>% Percentage Off</span>
              </button>

              <button
                type="button"
                onClick={() => setDiscountType("fixed")}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  border: discountType === "fixed" ? "1px solid #10b981" : "1px solid #334155",
                  background: discountType === "fixed" ? "rgba(16,185,129,0.15)" : "#0f172a",
                  color: discountType === "fixed" ? "#34d399" : "#94a3b8",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  transition: "all 0.15s"
                }}
              >
                <span>£ Fixed Amount Off</span>
              </button>
            </div>
          </div>

          {/* Discount Value ("How much discount to apply") */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className="admin-form-label" style={{ margin: 0 }}>
                {discountType === "percentage" ? "HOW MUCH DISCOUNT PERCENTAGE (%) *" : "HOW MUCH DISCOUNT AMOUNT (£ GBP) *"}
              </label>
              <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 600 }}>
                {discountType === "percentage" ? `${numVal}% off booking` : `£${numVal.toFixed(2)} off booking`}
              </span>
            </div>

            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                fontWeight: 700,
                fontSize: "1rem"
              }}>
                {discountType === "percentage" ? "%" : "£"}
              </span>
              <input
                type="number"
                step={discountType === "percentage" ? "1" : "0.5"}
                min="0.1"
                max={discountType === "percentage" ? "100" : undefined}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                placeholder={discountType === "percentage" ? "e.g. 15 for 15%" : "e.g. 10.00 for £10"}
                required
                className="admin-form-input"
                style={{ paddingLeft: "36px", fontSize: "1.05rem", fontWeight: 700 }}
              />
            </div>

            {/* Quick Presets */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Quick discounts:</span>
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
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "6px",
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
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "6px",
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
              marginTop: "10px",
              padding: "10px 14px",
              background: "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.2)",
              borderRadius: "8px",
              fontSize: "0.82rem",
              color: "#34d399",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span>Example £100 order discount:</span>
              <span style={{ fontWeight: 700 }}>
                -£{sampleDeduction.toFixed(2)} &rarr; Total £{sampleFinal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Optional Rules Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label className="admin-form-label">
                MIN SPEND (£ GBP)
              </label>
              <input
                type="number"
                step="5"
                min="0"
                value={minOrderAmount}
                onChange={(e) => setMinOrderAmount(e.target.value)}
                placeholder="0 (no minimum)"
                className="admin-form-input"
              />
            </div>

            <div>
              <label className="admin-form-label">
                USAGE LIMIT (MAX USES)
              </label>
              <input
                type="number"
                min="1"
                step="1"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder="Unlimited if empty"
                className="admin-form-input"
              />
            </div>
          </div>

          {/* Expiry Date */}
          <div>
            <label className="admin-form-label">
              EXPIRY DATE (OPTIONAL)
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="admin-form-input"
            />
            <span style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px", display: "block" }}>
              Leave blank if the coupon should never expire.
            </span>
          </div>

          {/* Active Status Checkbox */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <input
              type="checkbox"
              id="couponActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              style={{ width: "18px", height: "18px", accentColor: "#10b981", cursor: "pointer" }}
            />
            <label htmlFor="couponActive" style={{ fontSize: "0.88rem", color: "#e2e8f0", cursor: "pointer" }}>
              Make coupon active immediately for customer bookings
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px", borderTop: "1px solid #1e293b", paddingTop: "16px" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="admin-refresh-btn"
              style={{ padding: "10px 18px", fontSize: "0.9rem" }}
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
                padding: "10px 24px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              {loading ? "Generating Coupon..." : "Generate & Save Coupon"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

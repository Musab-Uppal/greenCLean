"use client";

import React from "react";

export default function AdminLoginGate({
  usernameInput,
  setUsernameInput,
  passwordInput,
  setPasswordInput,
  showPassword,
  setShowPassword,
  loginLoading,
  loginError,
  handleLogin,
}) {
  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        {/* Top Shield Header */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div className="admin-shield-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.35rem", fontWeight: 700, margin: "0 0 6px", color: "#f8fafc" }}>
            GreenClean Admin Page
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#64748b", margin: 0, letterSpacing: "0.5px" }}>
            AUTHORIZED ADMINISTRATIVE ACCESS ONLY
          </p>
        </div>

        {/* Login Error Notification */}
        {loginError && (
          <div className="admin-login-alert">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{loginError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div>
            <label className="admin-form-label">
              ADMIN USERNAME
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              placeholder="Enter admin username"
              required
              autoComplete="off"
              className="admin-form-input"
            />
          </div>

          <div>
            <label className="admin-form-label">
              ADMIN PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                className="admin-form-input"
                style={{ paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  padding: "4px",
                  fontSize: "0.8rem",
                }}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="admin-login-submit-btn"
          >
            {loginLoading ? "Authenticating Session..." : "Sign In to Admin Page"}
          </button>
        </form>

        <div style={{ marginTop: "24px", textAlign: "center", borderTop: "1px solid #1e293b", paddingTop: "18px" }}>
          <span style={{ fontSize: "0.75rem", color: "#475569" }}>
            Protected 256-bit encrypted administrative gateway
          </span>
        </div>
      </div>
    </div>
  );
}

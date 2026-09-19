"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const isFromBooking = redirectUrl.includes("/book");

  const { login, register, user } = useAuth();

  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  if (user) {
    router.replace(redirectUrl);
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        if (!phone.trim()) {
          throw new Error("Phone number is required for booking confirmations.");
        }
        await register(email, phone, password);
      }
      router.push(redirectUrl);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 450px)", minHeight: "75vh", padding: "36px 16px 60px" }}>
      <div className="container" style={{ maxWidth: "400px" }}>

        {/* Redirect Notice if coming from a booking request */}
        {isFromBooking && (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 14px",
            borderRadius: "var(--radius-sm)",
            background: "var(--emerald-100)",
            border: "1.5px solid var(--emerald-400)",
            color: "var(--emerald-950)",
            fontSize: "0.825rem",
            fontWeight: "600",
            marginBottom: "16px"
          }}>
            <Sparkles size={16} color="#059669" style={{ flexShrink: 0 }} />
            <span>Please log in or create an account to proceed with your booking.</span>
          </div>
        )}

        {/* Card Container */}
        <div className="glass-card" style={{
          padding: "24px 22px",
          border: "1.5px solid var(--border-subtle)",
          boxShadow: "var(--shadow-lg)",
          borderRadius: "var(--radius-md)"
        }}>
          {/* Mode Switcher Tabs */}
          <div style={{
            display: "flex",
            alignItems: "center",
            background: "var(--slate-100)",
            borderRadius: "var(--radius-full)",
            padding: "2px",
            height: "32px",
            marginBottom: "14px"
          }}>
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); }}
              style={{
                flex: 1,
                height: "28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-full)",
                fontSize: "0.78rem",
                fontWeight: "650",
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                background: mode === "login" ? "#ffffff" : "transparent",
                color: mode === "login" ? "var(--emerald-700)" : "var(--slate-600)",
                boxShadow: mode === "login" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s"
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode("register"); setError(""); }}
              style={{
                flex: 1,
                height: "28px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "var(--radius-full)",
                fontSize: "0.78rem",
                fontWeight: "650",
                whiteSpace: "nowrap",
                border: "none",
                cursor: "pointer",
                background: mode === "register" ? "#ffffff" : "transparent",
                color: mode === "register" ? "var(--emerald-700)" : "var(--slate-600)",
                boxShadow: mode === "register" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.2s"
              }}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 12px",
              borderRadius: "var(--radius-xs)",
              background: "var(--danger-50)",
              color: "var(--danger-500)",
              fontSize: "0.8rem",
              fontWeight: "600",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              marginBottom: "14px"
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "13px" }}>

            {/* Email Field */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", marginBottom: "4px" }}>
                <Mail size={13} color="#059669" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.co.uk"
                className="form-input"
                style={{ padding: "8px 12px", fontSize: "0.875rem", borderRadius: "8px" }}
                autoComplete="email"
              />
            </div>

            {/* Phone Field (Only in register mode) */}
            {mode === "register" && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", marginBottom: "4px" }}>
                  <Phone size={13} color="#059669" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 07359068284"
                  className="form-input"
                  style={{ padding: "8px 12px", fontSize: "0.875rem", borderRadius: "8px" }}
                  autoComplete="tel"
                />

              </div>
            )}

            {/* Password Field */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", marginBottom: "4px" }}>
                <Lock size={13} color="#059669" />
                <span>Password</span>
              </label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === "login" ? "Enter your password" : "At least 6 characters"}
                  className="form-input"
                  style={{ padding: "8px 36px 8px 12px", fontSize: "0.875rem", borderRadius: "8px" }}
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--slate-400)",
                    padding: "2px",
                    display: "flex",
                    alignItems: "center"
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-sm"
              style={{ width: "100%", marginTop: "4px", padding: "9px 16px", fontSize: "0.875rem" }}
            >
              <span>{loading ? "Please wait..." : mode === "login" ? "Sign In & Continue" : "Create Account & Continue"}</span>
              <ArrowRight size={15} />
            </button>
          </form>



        </div>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ padding: "80px 0", textAlign: "center" }}>Loading customer portal...</div>}>
      <LoginFormContent />
    </Suspense>
  );
}

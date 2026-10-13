"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Loader2,
  User,
  MessageSquare,
} from "lucide-react";
import JsonLd from "@/components/JsonLd";
import { getLocalBusinessSchema } from "@/lib/schema";
import ServiceAreaMap from "@/components/ServiceAreaMap";

export default function ContactPage() {
  const businessSchema = getLocalBusinessSchema();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    subscribe: false,
  });
  const [errors, setErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState("idle"); // idle | loading | success | error
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email is required";
    if (!form.message.trim() || form.message.trim().length < 10) e.message = "Please enter at least 10 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitStatus("loading");
    setSubmitError("");

    try {
      // If subscribed to newsletter, add them to Mailchimp
      if (form.subscribe) {
        await fetch("/api/mailchimp/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email.trim(),
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            phone: form.phone.trim(),
            source: "contact-form",
          }),
        });
      }

      // Simulate form submission success
      // TODO: Hook this up to your own contact/email sending endpoint if needed
      await new Promise((r) => setTimeout(r, 800));

      setSubmitStatus("success");
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "", subscribe: false });
    } catch {
      setSubmitError("Something went wrong. Please try again or call us directly.");
      setSubmitStatus("error");
    }
  };

  const set = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div style={{ background: "var(--bg-body)", padding: "60px 0 100px" }}>
      <JsonLd data={businessSchema} />
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 56px" }}>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "850", color: "var(--slate-900)", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Contact <span className="gradient-text">Green Clean Group</span>
          </h1>
          <p style={{ fontSize: "1.15rem", color: "var(--slate-600)", lineHeight: "1.65" }}>
            Have a question, need a custom commercial quote, or looking to schedule a clean? Our friendly Liverpool team is here to assist you 7 days a week.
          </p>
        </div>

        {/* Top Grid: Contact Info + Map */}
        <div className="responsive-two-col" style={{ marginBottom: "48px", alignItems: "stretch" }}>
          {/* Left: Direct Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="glass-card responsive-card-padding" style={{ border: "1.5px solid var(--emerald-200)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "20px" }}>
                  Direct Contact Details
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <a href="tel:07359068284" style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--slate-800)", transition: "color 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.color = "var(--emerald-600)"}
                    onMouseOut={(e) => e.currentTarget.style.color = "var(--slate-800)"}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-md)", background: "var(--emerald-100)", color: "var(--emerald-700)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: "600" }}>Phone / WhatsApp</span>
                      <div style={{ fontSize: "1.2rem", fontWeight: "800" }}>07359068284</div>
                    </div>
                  </a>

                  <a href="mailto:info@greencleangroup.co.uk" style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--slate-800)", transition: "color 0.2s" }}
                    onMouseOver={(e) => e.currentTarget.style.color = "var(--emerald-600)"}
                    onMouseOut={(e) => e.currentTarget.style.color = "var(--slate-800)"}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-md)", background: "var(--emerald-100)", color: "var(--emerald-700)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Mail size={20} />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: "600" }}>Email Us</span>
                      <div style={{ fontSize: "1.05rem", fontWeight: "700" }}>info@greencleangroup.co.uk</div>
                    </div>
                  </a>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--slate-800)" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-md)", background: "var(--emerald-100)", color: "var(--emerald-700)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Clock size={20} />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: "600" }}>Operating Hours</span>
                      <div style={{ fontSize: "1rem", fontWeight: "700" }}>Monday – Sunday: 08:00 – 19:00</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--slate-800)" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-md)", background: "var(--emerald-100)", color: "var(--emerald-700)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: "600" }}>Headquarters / Dispatch</span>
                      <div style={{ fontSize: "1rem", fontWeight: "700" }}>Liverpool, Merseyside, United Kingdom</div>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "10px", color: "var(--slate-600)", fontSize: "0.875rem" }}>
                <CheckCircle2 size={18} color="#059669" />
                <span>Dedicated customer care &amp; rapid local response</span>
              </div>
            </div>
          </div>

          {/* Right: Map */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="glass-card responsive-card-padding" style={{ border: "1.5px solid var(--emerald-200)", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px", flexWrap: "wrap", gap: "8px" }}>
                  <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--slate-900)", margin: 0 }}>
                    Service Area Coverage
                  </h3>
                  <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--emerald-800)", background: "var(--emerald-100)", padding: "4px 10px", borderRadius: "var(--radius-full)" }}>
                    40-Mile Radius
                  </span>
                </div>
                <p style={{ fontSize: "0.92rem", color: "var(--slate-600)", marginBottom: "16px", lineHeight: "1.5" }}>
                  House cleaning across Liverpool and Merseyside. Oven cleaning also available in selected parts of Cheshire, Greater Manchester and Lancashire.
                </p>
                <ServiceAreaMap height="290px" />
              </div>
              <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", gap: "10px", color: "var(--slate-600)", fontSize: "0.875rem" }}>
                <MapPin size={18} color="#059669" />
                <span>Daily mobile cleaning routes across Merseyside</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div className="glass-card responsive-card-padding" style={{ border: "1.5px solid var(--emerald-200)" }}>
            <div style={{ marginBottom: "28px" }}>
              <h2 style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "8px" }}>
                Send Us a Message
              </h2>
              <p style={{ color: "var(--slate-600)", fontSize: "0.925rem" }}>
                We reply to all enquiries within 2 hours during business hours.
              </p>
            </div>

            {submitStatus === "success" ? (
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
                padding: "40px 24px", textAlign: "center"
              }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--emerald-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <CheckCircle2 size={32} color="#059669" />
                </div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--slate-900)" }}>Message Sent!</h3>
                <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", maxWidth: "380px" }}>
                  Thanks for reaching out. Our Liverpool team will get back to you within 2 hours. For urgent requests, call us on <strong>07359068284</strong>.
                </p>
                <button
                  onClick={() => setSubmitStatus("idle")}
                  style={{ padding: "10px 24px", background: "var(--emerald-600)", color: "#fff", fontWeight: "700", borderRadius: "var(--radius-full)", border: "none", cursor: "pointer" }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {/* Name row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={set("firstName")}
                      placeholder="e.g. John"
                      className="form-input"
                    />
                    {errors.firstName && <span style={{ color: "var(--danger-500)", fontSize: "0.8rem" }}>{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={set("lastName")}
                      placeholder="e.g. Smith"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Email & Phone */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      placeholder="john@example.com"
                      className="form-input"
                    />
                    {errors.email && <span style={{ color: "var(--danger-500)", fontSize: "0.8rem" }}>{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone (optional)</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      placeholder="07xxx xxxxxx"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Message */}
                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    value={form.message}
                    onChange={set("message")}
                    placeholder="Tell us about your cleaning needs, property type, or any special requirements…"
                    rows={5}
                    className="form-input"
                    style={{ resize: "vertical", fontFamily: "inherit" }}
                  />
                  {errors.message && <span style={{ color: "var(--danger-500)", fontSize: "0.8rem" }}>{errors.message}</span>}
                </div>

                {/* Newsletter opt-in */}
                <label style={{ display: "flex", alignItems: "flex-start", gap: "12px", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={form.subscribe}
                    onChange={set("subscribe")}
                    style={{ marginTop: "3px", accentColor: "var(--emerald-600)", width: "16px", height: "16px", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "0.875rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                    Subscribe me to the Green Clean Group newsletter — exclusive deals, eco-cleaning tips, and priority booking slots. No spam, unsubscribe anytime.
                  </span>
                </label>

                {submitStatus === "error" && submitError && (
                  <div style={{ padding: "12px 16px", background: "var(--danger-50)", color: "var(--danger-500)", borderRadius: "var(--radius-sm)", fontSize: "0.875rem", fontWeight: "600", border: "1px solid rgba(239,68,68,0.2)" }}>
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitStatus === "loading"}
                  className="btn btn-primary"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px 28px", fontSize: "1rem" }}
                >
                  {submitStatus === "loading" ? (
                    <><Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> Sending…</>
                  ) : (
                    <><Send size={18} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



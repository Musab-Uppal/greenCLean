"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  Calendar,
  MessageSquare
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "Oven Cleaning",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitted(true);
  };

  return (
    <div style={{ background: "var(--bg-body)", padding: "60px 0 100px" }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 56px" }}>
          <span className="section-pill">
            <Sparkles size={14} />
            <span>Get in Touch</span>
          </span>

          <h1 style={{ fontSize: "2.8rem", fontWeight: "850", color: "var(--slate-900)", marginBottom: "16px", letterSpacing: "-0.02em" }}>
            Contact <span className="gradient-text">Green Clean Group</span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "var(--slate-600)", lineHeight: "1.65" }}>
            Have a question, need a custom commercial quote, or looking to schedule a clean? Our friendly Liverpool team is here to assist you 7 days a week.
          </p>
        </div>

        {/* Contact Grid: Details on Left, Form on Right */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", marginBottom: "60px" }}>
          {/* Left Column: Direct Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="glass-card" style={{ padding: "32px", border: "1.5px solid var(--emerald-200)" }}>
              <h3 style={{ fontSize: "1.35rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "20px" }}>
                Direct Contact Details
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <a 
                  href="tel:07359068284"
                  style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--slate-800)", transition: "color 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "var(--emerald-600)"}
                  onMouseOut={(e) => e.currentTarget.style.color = "var(--slate-800)"}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-md)", background: "var(--emerald-100)", color: "var(--emerald-700)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Phone size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: "600" }}>Phone / WhatsApp</span>
                    <div style={{ fontSize: "1.2rem", fontWeight: "800" }}>07359068284</div>
                  </div>
                </a>

                <a 
                  href="mailto:contact@greencleangroup.co.uk"
                  style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--slate-800)", transition: "color 0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.color = "var(--emerald-600)"}
                  onMouseOut={(e) => e.currentTarget.style.color = "var(--slate-800)"}
                >
                  <div style={{ width: "44px", height: "44px", borderRadius: "var(--radius-md)", background: "var(--emerald-100)", color: "var(--emerald-700)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Mail size={20} />
                  </div>
                  <div>
                    <span style={{ fontSize: "0.8rem", color: "var(--slate-500)", textTransform: "uppercase", fontWeight: "600" }}>Email Us</span>
                    <div style={{ fontSize: "1.05rem", fontWeight: "700" }}>contact@greencleangroup.co.uk</div>
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

            {/* Quick booking trigger card */}
            <div className="green-card" style={{ padding: "30px 24px" }}>
              <h4 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#ffffff", marginBottom: "8px" }}>
                Need Immediate Booking?
              </h4>
              <p style={{ fontSize: "0.9rem", color: "var(--emerald-100)", marginBottom: "20px", lineHeight: "1.6" }}>
                Skip the inquiry form and book directly onto our calendar in 60 seconds with live slot selection.
              </p>
              <Link href="/book" className="btn btn-primary" style={{ background: "#ffffff", color: "var(--emerald-950)", border: "none", width: "100%" }}>
                <Calendar size={16} color="#059669" />
                <span>Book a Service Online</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Contact & Message Form */}
          <div className="glass-card" style={{ padding: "36px 32px", border: "1.5px solid var(--border-subtle)" }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "6px" }}>
                Send Us a Message
              </h3>
              <p style={{ color: "var(--slate-600)", fontSize: "0.95rem" }}>
                Fill out the quick form below and our team will get back to you within 2 business hours.
              </p>
            </div>

            {submitted ? (
              <div style={{ padding: "36px 20px", textAlign: "center", background: "var(--emerald-50)", borderRadius: "var(--radius-md)", border: "1px solid var(--emerald-300)" }}>
                <CheckCircle2 size={48} color="#059669" style={{ margin: "0 auto 16px" }} />
                <h4 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--emerald-950)", marginBottom: "8px" }}>
                  Message Received!
                </h4>
                <p style={{ color: "var(--slate-700)", fontSize: "0.95rem", lineHeight: "1.6", maxWidth: "420px", margin: "0 auto 20px" }}>
                  Thank you, <strong>{formData.name}</strong>. Our team has received your inquiry and will contact you at <strong>{formData.email}</strong> shortly.
                </p>
                <button 
                  type="button" 
                  onClick={() => setSubmitted(false)} 
                  className="btn btn-secondary btn-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                <div className="form-group">
                  <label className="form-label">Your Full Name *</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Sarah Jenkins"
                    className="form-input"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. sarah@example.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input 
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 07359068284"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Interested Service</label>
                  <select 
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="form-select"
                  >
                    <option>Oven Cleaning</option>
                    <option>Kitchen Deep Cleaning</option>
                    <option>Appliances Cleaning (Fridge / Washing machine)</option>
                    <option>BBQ Cleaning</option>
                    <option>Bathroom Deep Cleaning</option>
                    <option>House &amp; Flat Cleaning</option>
                    <option>End of Tenancy Cleaning</option>
                    <option>General Question / Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message or Query *</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your property, specific appliance models, or any questions..."
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: "100%", marginTop: "8px" }}>
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

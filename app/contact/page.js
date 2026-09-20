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
import JsonLd from "@/components/JsonLd";
import { getLocalBusinessSchema } from "@/lib/schema";

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

  const businessSchema = getLocalBusinessSchema();

  return (
    <div style={{ background: "var(--bg-body)", padding: "60px 0 100px" }}>
      <JsonLd data={businessSchema} />
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
        <div className="responsive-two-col" style={{ marginBottom: "60px" }}>
          {/* Left Column: Direct Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div className="glass-card responsive-card-padding" style={{ border: "1.5px solid var(--emerald-200)" }}>
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


          </div>


        </div>
      </div>
    </div>
  );
}

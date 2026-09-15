"use client";

import React from "react";
import Link from "next/link";
import { 
  Sparkles, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/data/servicesData";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Mission */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div className="brand-logo-badge" style={{ width: "38px", height: "38px" }}>
                <Sparkles size={20} />
              </div>
              <span style={{ fontSize: "1.35rem", fontWeight: "800", color: "#ffffff" }}>
                Green Clean <span style={{ color: "var(--emerald-400)" }}>Group</span>
              </span>
            </div>

            <p style={{ fontSize: "0.925rem", lineHeight: "1.7", color: "var(--slate-400)", marginBottom: "20px" }}>
              Liverpool’s specialist in non-toxic, eco-friendly oven, kitchen, and deep home cleaning. 
              Family-run, fully insured, and dedicated to sparkling perfection without harsh chemical fumes.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.85rem", color: "var(--emerald-300)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>100% Plant-based non-caustic formulas</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Fully insured technicians</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={16} color="#10b981" />
                <span>Card & Cash payments accepted</span>
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="footer-col-title">Our Services</h4>
            <ul className="footer-links-list">
              {SERVICE_CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/services/${cat.slug}`} className="footer-link">
                    {cat.title}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/prices" className="footer-link" style={{ color: "var(--emerald-400)", fontWeight: "600" }}>
                  View All Prices & Packages →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Links & Coverage */}
          <div>
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link href="/" className="footer-link">Home</Link></li>
              <li><Link href="/about" className="footer-link">About Green Clean Group</Link></li>
              <li><Link href="/prices" className="footer-link">Transparent Pricing</Link></li>
              <li><Link href="/book" className="footer-link">Book An Appointment</Link></li>
              <li><Link href="/contact" className="footer-link">Contact & Inquiries</Link></li>
            </ul>

            <h4 className="footer-col-title" style={{ marginTop: "24px" }}>Coverage Regions</h4>
            <p style={{ fontSize: "0.85rem", color: "var(--slate-400)", lineHeight: "1.6" }}>
              Merseyside (Liverpool, Sefton, St Helens, Wirral), plus select parts of Cheshire, Manchester & Lancashire.
            </p>
          </div>

          {/* Col 4: Contact & Working Hours */}
          <div>
            <h4 className="footer-col-title">Direct Contact</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              <a 
                href="tel:07359068284"
                style={{ display: "flex", alignItems: "center", gap: "12px", color: "#ffffff", fontWeight: "700" }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--emerald-900)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald-400)" }}>
                  <Phone size={16} />
                </div>
                <span>07359068284</span>
              </a>

              <a 
                href="mailto:contact@greencleangroup.co.uk"
                style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--slate-300)" }}
              >
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--emerald-900)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald-400)" }}>
                  <Mail size={16} />
                </div>
                <span>contact@greencleangroup.co.uk</span>
              </a>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--slate-300)" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--emerald-900)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald-400)" }}>
                  <MapPin size={16} />
                </div>
                <span>Serving Liverpool & Surrounding Areas</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--slate-300)" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--emerald-900)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald-400)" }}>
                  <Clock size={16} />
                </div>
                <span>Monday – Sunday: 08:00 – 19:00</span>
              </div>
            </div>

            {/* Social connection */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <a 
                href="https://www.facebook.com/people/Green-Clean-Group-Liverpool/100095290844672/" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 14px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "#ffffff",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  transition: "background 0.2s"
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Follow us on Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            Greencleangroup © {new Date().getFullYear()}. All rights reserved. Registered eco-friendly cleaning services in Liverpool, UK.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="footer-link">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

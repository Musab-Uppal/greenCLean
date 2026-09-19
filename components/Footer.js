import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  Clock
} from "lucide-react";

export default function Footer({ categories = [] }) {
  return (
    <footer className="site-footer">
      <div className="container">
        {/* Main horizontal row for Direct Contact */}
        <div className="footer-main-row">

          <a
            href="tel:07359068284"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "0.95rem",
              textDecoration: "none",
              whiteSpace: "nowrap"
            }}
          >
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "var(--emerald-900)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--emerald-400)",
              flexShrink: 0
            }}>
              <Phone size={15} />
            </div>
            <span>07359068284</span>
          </a>

          <a
            href="mailto:contact@greencleangroup.co.uk"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              color: "var(--slate-200)",
              fontSize: "0.875rem",
              textDecoration: "none",
              whiteSpace: "nowrap"
            }}
          >
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "var(--emerald-900)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--emerald-400)",
              flexShrink: 0
            }}>
              <Mail size={15} />
            </div>
            <span>contact@greencleangroup.co.uk</span>
          </a>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              color: "var(--slate-200)",
              fontSize: "0.875rem",
              whiteSpace: "nowrap"
            }}
          >
            <div style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "var(--emerald-900)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--emerald-400)",
              flexShrink: 0
            }}>
              <Clock size={15} />
            </div>
            <span>Monday – Sunday: 08:00 – 19:00</span>
          </div>

          <a
            href="https://www.facebook.com/people/Green-Clean-Group-Liverpool/100095290844672/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-fb-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Follow us on Facebook</span>
          </a>
        </div>

        {/* Footer Bottom: Privacy Policy & Terms and Conditions */}
        <div className="footer-bottom">
          <Link href="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <span style={{ color: "var(--slate-600)" }}>•</span>
          <Link href="/terms-and-conditions" className="footer-link">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}

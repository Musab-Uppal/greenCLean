"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  Phone,
  ChevronDown,
  Menu,
  X,
  Flame,
  UtensilsCrossed,
  Refrigerator,
  Beef,
  Bath,
  Home,
  KeyRound,
  Calendar,
  Tag
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/data/servicesData";

const SERVICE_ICONS = {
  "Flame": Flame,
  "UtensilsCrossed": UtensilsCrossed,
  "Refrigerator": Refrigerator,
  "Beef": Beef,
  "Bath": Bath,
  "Home": Home,
  "KeyRound": KeyRound
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            {/* Brand Logo */}
            <Link href="/" className="brand-logo" style={{ textDecoration: "none" }}>
              <Image
                src="/logo.png"
                alt="Green Clean Group"
                width={190}
                height={45}
                priority
                style={{ height: "42px", width: "auto", objectFit: "contain", display: "block" }}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="nav-links">
              <Link
                href="/"
                className={`nav-link-item ${pathname === "/" ? "active" : ""}`}
              >
                Home
              </Link>

              {/* Services Dropdown */}
              <div className="nav-dropdown-wrapper">
                <button className="nav-link-item nav-dropdown-trigger" style={{ cursor: "pointer" }}>
                  <span>Services</span>
                  <ChevronDown size={15} />
                </button>
                <div className="nav-dropdown-menu">
                  {SERVICE_CATEGORIES.map((cat) => {
                    const IconComponent = SERVICE_ICONS[cat.icon] || Sparkles;
                    return (
                      <Link
                        key={cat.id}
                        href={`/services/${cat.slug}`}
                        className="dropdown-item"
                      >
                        <div className="dropdown-item-icon">
                          <IconComponent size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{cat.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>From £{cat.items[0]?.price}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Link
                href="/prices"
                className={`nav-link-item ${pathname === "/prices" ? "active" : ""}`}
              >
                Prices
              </Link>

              <Link
                href="/about"
                className={`nav-link-item ${pathname === "/about" ? "active" : ""}`}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className={`nav-link-item ${pathname === "/contact" ? "active" : ""}`}
              >
                Contact
              </Link>
            </nav>

            {/* Actions / CTA */}
            <div className="header-actions">
              <a href="tel:07359068284" className="header-phone-link" title="Call Green Clean Group">
                <Phone size={15} color="#059669" />
                <span>07359068284</span>
              </a>

              <Link href="/book" className="btn btn-primary btn-sm">
                <Calendar size={15} />
                <span>Book a Service</span>
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                className="mobile-toggle-btn"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div
        className={`mobile-drawer ${mobileMenuOpen ? "open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div
          className="mobile-drawer-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
            <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ display: "flex", alignItems: "center" }}>
              <Image
                src="/logo.png"
                alt="Green Clean Group"
                width={160}
                height={38}
                style={{ height: "36px", width: "auto", objectFit: "contain", display: "block" }}
              />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: "6px", color: "var(--slate-500)" }}
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                fontWeight: "600",
                background: pathname === "/" ? "var(--emerald-50)" : "transparent",
                color: pathname === "/" ? "var(--emerald-700)" : "var(--slate-800)"
              }}
            >
              Home
            </Link>

            {/* Mobile Services Accordion */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  fontWeight: "600",
                  color: "var(--slate-800)"
                }}
              >
                <span>Cleaning Services</span>
                <ChevronDown
                  size={16}
                  style={{ transform: mobileServicesOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
                />
              </button>

              {mobileServicesOpen && (
                <div style={{ paddingLeft: "14px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/services/${cat.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{
                        padding: "8px 12px",
                        fontSize: "0.9rem",
                        color: "var(--slate-600)",
                        borderRadius: "var(--radius-xs)"
                      }}
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/prices"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                fontWeight: "600",
                background: pathname === "/prices" ? "var(--emerald-50)" : "transparent",
                color: pathname === "/prices" ? "var(--emerald-700)" : "var(--slate-800)"
              }}
            >
              Prices & Packages
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                fontWeight: "600",
                background: pathname === "/about" ? "var(--emerald-50)" : "transparent",
                color: pathname === "/about" ? "var(--emerald-700)" : "var(--slate-800)"
              }}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                padding: "12px 14px",
                borderRadius: "var(--radius-sm)",
                fontWeight: "600",
                background: pathname === "/contact" ? "var(--emerald-50)" : "transparent",
                color: pathname === "/contact" ? "var(--emerald-700)" : "var(--slate-800)"
              }}
            >
              Contact Us
            </Link>
          </div>

          <div style={{ marginTop: "auto", paddingTop: "24px", borderTop: "1px solid var(--border-subtle)" }}>
            <Link
              href="/book"
              className="btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
              style={{ width: "100%", marginBottom: "14px" }}
            >
              <Calendar size={16} />
              <span>Book Appointment Now</span>
            </Link>

            <a
              href="tel:07359068284"
              className="btn btn-secondary"
              style={{ width: "100%" }}
            >
              <Phone size={16} />
              <span>Call: 07359068284</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

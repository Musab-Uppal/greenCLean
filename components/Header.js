"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Tag,
  User,
  LogOut,
  Package,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SERVICE_ICONS = {
  "Flame": Flame,
  "UtensilsCrossed": UtensilsCrossed,
  "Refrigerator": Refrigerator,
  "Beef": Beef,
  "Bath": Bath,
  "Home": Home,
  "KeyRound": KeyRound
};

export default function Header({ categories: initialCategories = [] }) {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState(initialCategories);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetch("/api/services")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCategories(data);
        })
        .catch((err) => console.error("Failed to load header services:", err));
    }
  }, [initialCategories]);

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
                  {categories.map((cat) => {
                    const IconComponent = SERVICE_ICONS[cat.icon] || Sparkles;
                    return (
                      <Link
                        key={cat.id || cat.slug}
                        href={`/services/${cat.slug}`}
                        className="dropdown-item"
                      >
                        <div className="dropdown-item-icon">
                          <IconComponent size={16} />
                        </div>
                        <div>
                          <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>{cat.title}</div>
                          <div style={{ fontSize: "0.75rem", color: "var(--slate-500)" }}>From £{cat.items?.[0]?.price || "--"}</div>
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


              {user ? (
                <div className="user-menu-wrap" ref={userMenuRef}>
                  <button
                    className="user-menu-trigger"
                    onClick={() => setUserMenuOpen((o) => !o)}
                    aria-expanded={userMenuOpen}
                  >
                    <User size={13} color="#059669" />
                    <span>{user.email.split("@")[0]}</span>
                    <ChevronDown
                      size={12}
                      color="#059669"
                      style={{ transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </button>
                  <div className={`user-menu-dropdown${userMenuOpen ? " open" : ""}`}>
                    <Link href="/dashboard" className="user-menu-item" onClick={() => setUserMenuOpen(false)}>
                      <Package size={14} />
                      <span>My Dashboard</span>
                    </Link>
                    <button onClick={() => { setUserMenuOpen(false); logout(); }} className="user-menu-item user-menu-signout">
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--slate-700)",
                    fontWeight: "600",
                    fontSize: "0.875rem"
                  }}
                >
                  <User size={15} color="#059669" />
                  <span>Log In</span>
                </Link>
              )}

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
                  {categories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
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

          <div style={{ marginTop: "auto", paddingTop: "20px", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: "10px" }}>
            {user ? (
              <div style={{ padding: "10px 14px", borderRadius: "var(--radius-sm)", background: "var(--emerald-50)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--emerald-900)" }}>
                  👤 {user.email}
                </span>
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  style={{ color: "var(--danger-500)", fontSize: "0.8rem", fontWeight: "700" }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
                style={{ width: "100%" }}
              >
                <User size={16} />
                <span>Customer Sign In / Register</span>
              </Link>
            )}

            <Link
              href="/book"
              className="btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
              style={{ width: "100%" }}
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

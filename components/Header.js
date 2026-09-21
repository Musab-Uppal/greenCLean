"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Sparkles, Phone, ChevronDown, Menu, X,
  Flame, UtensilsCrossed, Refrigerator, Beef, Bath, Home, KeyRound,
  Calendar, Tag, User, LogOut, Package,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const SERVICE_ICONS = {
  "Flame": Flame, "UtensilsCrossed": UtensilsCrossed, "Refrigerator": Refrigerator,
  "Beef": Beef, "Bath": Bath, "Home": Home, "KeyRound": KeyRound
};

export default function Header({ categories: initialCategories = [] }) {
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState(initialCategories);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!initialCategories || initialCategories.length === 0) {
      fetch("/api/services").then(r => r.json()).then(d => { if (Array.isArray(d)) setCategories(d); }).catch(console.error);
    }
  }, [initialCategories]);

  return (
    <>
      {/* ── Sticky Header ── */}
      <header className="sticky top-0 z-[100] bg-white/[0.92] backdrop-blur-[16px] border-b border-slate-200/80 transition-all duration-200">
        <div className="w-full max-w-[1260px] mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between h-[78px]">

            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-3 text-xl font-extrabold text-slate-900 tracking-tight no-underline">
              <Image src="/logo.png" alt="Green Clean Group" width={190} height={45} priority
                style={{ height: "42px", width: "auto", objectFit: "contain", display: "block" }} />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              <Link href="/" className={`text-[0.95rem] font-semibold text-slate-700 px-1 py-2 relative transition-colors duration-150 hover:text-emerald-600 nav-link-item${pathname === "/" ? " active" : ""}`}>Home</Link>

              {/* Services Dropdown */}
              <div className="nav-dropdown-wrapper relative">
                <button className={`nav-link-item flex items-center gap-1 text-[0.95rem] font-semibold text-slate-700 px-1 py-2 cursor-pointer hover:text-emerald-600 transition-colors duration-150`}>
                  <span>Services</span>
                  <ChevronDown size={15} />
                </button>
                <div className="nav-dropdown-menu absolute top-full left-[-20px] w-[290px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.04)] p-2.5 hidden flex-col gap-0.5 z-[120]" style={{ animation: "dropdownFadeIn 0.2s cubic-bezier(0.16,1,0.3,1)" }}>
                  {categories.map((cat) => {
                    const IconComponent = SERVICE_ICONS[cat.icon] || Sparkles;
                    return (
                      <Link key={cat.id || cat.slug} href={`/services/${cat.slug}`}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-slate-700 text-[0.9rem] font-medium hover:bg-emerald-50 hover:text-emerald-800 transition-all duration-150">
                        <div className="w-8 h-8 rounded-[6px] bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <IconComponent size={16} />
                        </div>
                        <div>
                          <div className="font-semibold text-[0.9rem]">{cat.title}</div>
                          <div className="text-xs text-slate-500">From £{cat.items?.[0]?.price || "--"}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <Link href="/prices" className={`text-[0.95rem] font-semibold text-slate-700 px-1 py-2 hover:text-emerald-600 transition-colors duration-150 nav-link-item${pathname === "/prices" ? " active" : ""}`}>Prices</Link>
              <Link href="/about" className={`text-[0.95rem] font-semibold text-slate-700 px-1 py-2 hover:text-emerald-600 transition-colors duration-150 nav-link-item${pathname === "/about" ? " active" : ""}`}>About Us</Link>
              <Link href="/contact" className={`text-[0.95rem] font-semibold text-slate-700 px-1 py-2 hover:text-emerald-600 transition-colors duration-150 nav-link-item${pathname === "/contact" ? " active" : ""}`}>Contact</Link>
            </nav>

            {/* Header Actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="user-menu-wrap relative" ref={userMenuRef}>
                  <button
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[0.825rem] font-bold cursor-pointer hover:bg-emerald-100 hover:border-emerald-400 transition-colors duration-[0.18s]"
                    onClick={() => setUserMenuOpen(o => !o)}
                    aria-expanded={userMenuOpen}
                  >
                    <User size={13} color="#059669" />
                    <span>{user.email.split("@")[0]}</span>
                    <ChevronDown size={12} color="#059669" style={{ transform: userMenuOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                  </button>
                  <div className={`user-menu-dropdown absolute top-[calc(100%+10px)] right-0 w-[215px] bg-white rounded-2xl border border-slate-200/80 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.04)] p-1.5 flex flex-col z-[120]${userMenuOpen ? " open" : ""}`}>
                    <div className="px-3 py-2.5 border-b border-slate-100 mb-1">
                      <div className="text-[0.68rem] text-slate-400 font-semibold uppercase tracking-[0.06em]">Signed in as</div>
                      <div className="text-[0.8rem] text-slate-900 font-bold mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{user.email}</div>
                    </div>
                    <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-[9px] rounded-[10px] text-[0.855rem] font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors duration-150" onClick={() => setUserMenuOpen(false)}>
                      <Package size={14} /><span>My Dashboard</span>
                    </Link>
                    <button onClick={() => { setUserMenuOpen(false); logout(); }} className="flex items-center gap-2.5 px-3 py-[9px] rounded-[10px] text-[0.855rem] font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-150 w-full text-left border-none bg-transparent">
                      <LogOut size={14} /><span>Sign Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="inline-flex items-center gap-[5px] px-3 py-1.5 rounded-[10px] text-slate-700 font-semibold text-sm">
                  <User size={15} color="#059669" /><span>Log In</span>
                </Link>
              )}

              {/* Mobile hamburger */}
              <button
                className="lg:hidden flex items-center justify-center w-[42px] h-[42px] rounded-[10px] bg-slate-100 text-slate-800"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer ── */}
      <div
        className={`mobile-drawer fixed inset-0 bg-[rgba(2,6,23,0.65)] backdrop-blur-[4px] z-[1000] flex justify-end${mobileMenuOpen ? " open" : ""}`}
        onClick={() => setMobileMenuOpen(false)}
      >
        <div className="mobile-drawer-content w-[85%] max-w-[360px] h-full bg-white px-5 py-6 flex flex-col overflow-y-auto" onClick={e => e.stopPropagation()}>
          {/* Drawer header */}
          <div className="flex items-center justify-between mb-7">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <Image src="/logo.png" alt="Green Clean Group" width={160} height={38} style={{ height: "36px", width: "auto", objectFit: "contain", display: "block" }} />
            </Link>
            <button onClick={() => setMobileMenuOpen(false)} className="p-1.5 text-slate-500" aria-label="Close menu">
              <X size={24} />
            </button>
          </div>

          {/* Nav links */}
          <div className="flex flex-col gap-2.5">
            {[
              { href: "/", label: "Home" },
              { href: "/prices", label: "Prices & Packages" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact Us" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)}
                className={`px-3.5 py-3 rounded-[10px] font-semibold text-[0.95rem] ${pathname === href ? "bg-emerald-50 text-emerald-700" : "text-slate-800"}`}
              >{label}</Link>
            ))}

            {/* Services accordion */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center justify-between w-full px-3.5 py-3 rounded-[10px] font-semibold text-slate-800"
              >
                <span>Cleaning Services</span>
                <ChevronDown size={16} style={{ transform: mobileServicesOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
              </button>
              {mobileServicesOpen && (
                <div className="pl-3.5 mt-1 flex flex-col gap-1">
                  {categories.map(cat => (
                    <Link key={cat.id || cat.slug} href={`/services/${cat.slug}`} onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-[0.9rem] text-slate-600 rounded-[6px]">{cat.title}</Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-auto pt-5 border-t border-slate-200/80 flex flex-col gap-2.5">
            {user ? (
              <div className="px-3.5 py-2.5 rounded-[10px] bg-emerald-50 flex items-center justify-between">
                <span className="text-[0.85rem] font-bold text-emerald-900">👤 {user.email}</span>
                <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="text-red-500 text-[0.8rem] font-bold">Sign Out</button>
              </div>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-full bg-white text-emerald-800 font-semibold text-[0.975rem] border border-emerald-200 shadow-sm hover:bg-emerald-50 hover:border-emerald-300 hover:-translate-y-0.5 transition-all duration-200">
                <User size={16} /><span>Customer Sign In / Register</span>
              </Link>
            )}
            <Link href="/book" onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold text-[0.975rem] shadow-[0_10px_25px_-5px_rgba(16,185,129,0.35)] hover:-translate-y-0.5 transition-all duration-200">
              <Calendar size={16} /><span>Book Appointment Now</span>
            </Link>
            <a href="tel:07359068284"
              className="inline-flex items-center justify-center gap-2.5 w-full px-6 py-3.5 rounded-full bg-white text-emerald-800 font-semibold text-[0.975rem] border border-emerald-200 shadow-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200">
              <Phone size={16} /><span>Call: 07359068284</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

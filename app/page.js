"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Phone,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Star,
  ArrowRight,
  Flame,
  UtensilsCrossed,
  Refrigerator,
  Beef,
  Bath,
  Home,
  KeyRound,
  HeartHandshake,
  Headphones,
  Award,
  ChevronRight,
  MoveHorizontal
} from "lucide-react";
import AreaChecker from "@/components/AreaChecker";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import FaqAccordion from "@/components/FaqAccordion";
import { SERVICE_CATEGORIES } from "@/data/servicesData";

const CATEGORY_ICONS = {
  oven: Flame,
  kitchen: UtensilsCrossed,
  appliances: Refrigerator,
  bbq: Beef,
  bathroom: Bath,
  house: Home,
  tenancy: KeyRound
};

const OVERLAY_TITLES = {
  oven: "Oven",
  kitchen: "Kitchen",
  appliances: "Appliances",
  bbq: "BBQ",
  bathroom: "Bathroom",
  house: "House",
  tenancy: "Tenancy"
};

export default function HomePage() {

  return (
    <div>
      {/* ====================================================================
          HERO SECTION
         ==================================================================== */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Col: Value Proposition */}
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "var(--emerald-100)", color: "var(--emerald-900)", padding: "6px 16px", borderRadius: "var(--radius-full)", fontSize: "0.85rem", fontWeight: "700", marginBottom: "20px", border: "1px solid var(--emerald-300)" }}>
                <span className="pulse-indicator" />
                <span>Liverpool’s #1 Eco-Friendly Cleaning Specialist</span>
              </div>

              <h1 className="hero-headline">
                Professional <span className="gradient-text">Oven &amp; Home</span> Cleaning in Liverpool
              </h1>

              <p className="hero-subtitle">
                Experience spotless perfection without toxic fumes. Our 100% plant-based dipping tank method removes burnt-on carbon and grease while keeping your family, pets, and food completely safe.
              </p>

              {/* CTAs */}
              <div className="hero-cta-group">
                <Link href="/book" className="btn btn-primary btn-lg" id="hero-book-btn">
                  <Calendar size={18} />
                  <span>Book a Service Online</span>
                </Link>

                <a href="tel:07359068284" className="btn btn-secondary btn-lg" id="hero-call-btn">
                  <Phone size={18} />
                  <span>Call 07359068284</span>
                </a>
              </div>

              {/* Trust Badges Row */}
              <div className="hero-trust-row">
                <div className="hero-trust-badge">
                  <div className="hero-trust-icon">
                    <Star size={14} fill="#059669" />
                  </div>
                  <span>4.9★ Rated locally</span>
                </div>

                <div className="hero-trust-badge">
                  <div className="hero-trust-icon">
                    <Sparkles size={14} />
                  </div>
                  <span>100% Non-Toxic</span>
                </div>

                <div className="hero-trust-badge">
                  <div className="hero-trust-icon">
                    <ShieldCheck size={14} />
                  </div>
                  <span>Fully Insured</span>
                </div>

                <div className="hero-trust-badge">
                  <div className="hero-trust-icon">
                    <Clock size={14} />
                  </div>
                  <span>Card &amp; Cash</span>
                </div>
              </div>
            </div>

            {/* Right Col: Real High Quality Transformation Image */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  borderRadius: "var(--radius-lg)",
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(16, 185, 129, 0.2)",
                  background: "#ffffff",
                  position: "relative"
                }}
              >
                <img
                  src="/hero-before-after.jpg"
                  alt="Real Oven Cleaning Before and After in Liverpool"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "520px",
                    objectFit: "cover",
                    display: "block"
                  }}
                />

                {/* Floating Verified Transformation Overlay */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    left: "16px",
                    right: "16px",
                    background: "rgba(15, 23, 42, 0.88)",
                    backdropFilter: "blur(10px)",
                    borderRadius: "var(--radius-md)",
                    padding: "12px 18px",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "var(--radius-full)", background: "var(--emerald-500)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", flexShrink: 0 }}>
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "0.875rem", fontWeight: "700", color: "#ffffff" }}>
                        Real Liverpool Transformation
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "var(--emerald-200)" }}>
                        100% Non-Toxic Van Dip Tank Clean
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "rgba(16, 185, 129, 0.2)", border: "1px solid rgba(52, 211, 153, 0.3)", padding: "4px 10px", borderRadius: "var(--radius-full)", color: "#34d399", fontSize: "0.75rem", fontWeight: "700" }}>
                    <CheckCircle2 size={13} />
                    <span>Verified Result</span>
                  </div>
                </div>
              </div>

              {/* Sub-caption note */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "12px", padding: "0 4px", fontSize: "0.82rem", color: "var(--slate-600)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={15} color="#059669" />
                  <strong>Real Customer Result</strong> • Zero Toxic Fumes
                </span>
                <span style={{ color: "var(--slate-500)" }}>
                  Ready to cook in immediately
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SERVICES SHOWCASE SECTION
         ==================================================================== */}
      <section className="section" style={{ background: "var(--bg-body)" }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-pill">Our Services</span>
            <h2 className="section-title">
              Specialist Cleaning For <span className="gradient-text">Every Need</span>
            </h2>
            <p className="section-desc">
              All services include non-caustic, food-safe sanitization and spotless detailing. Transparent fixed pricing with zero hidden fees.
            </p>
          </div>

          {/* Quick Jump Bar */}
          <div className="service-quick-nav">
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Sparkles;
              return (
                <a
                  key={cat.id}
                  href={`#service-${cat.id}`}
                  className="service-quick-pill"
                >
                  <Icon size={14} color="#059669" />
                  <span>{cat.title}</span>
                </a>
              );
            })}
          </div>

          {/* Sequential Alternating Service Showcase Blocks */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {SERVICE_CATEGORIES.map((category, index) => {
              // Alternating: even indices (0, 2, 4...) have reverse (picture left), odd (1, 3, 5...) have normal (content left)
              // This makes BBQ (index 3) Content Left, Picture Right, and Bathroom (index 4) Picture Left, Content Right (matching user screenshot)
              const isReverse = index % 2 === 0;

              return (
                <div
                  key={category.id}
                  id={`service-${category.id}`}
                  className={`showcase-block ${isReverse ? "reverse" : ""}`}
                >
                  {/* Cleaning Options Grid Side */}
                  <div className="showcase-content">
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <div>
                          <span style={{ fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--emerald-600)" }}>
                            Service Packages
                          </span>
                          <h3 style={{ fontSize: "1.5rem", fontWeight: "800", color: "var(--slate-900)" }}>
                            {category.title}
                          </h3>
                        </div>
                        <span style={{ fontSize: "0.75rem", fontWeight: "700", padding: "4px 10px", borderRadius: "var(--radius-full)", background: "var(--emerald-100)", color: "var(--emerald-800)" }}>
                          {category.badge}
                        </span>
                      </div>

                      {/* 2-Column Options Grid */}
                      <div className="showcase-grid">
                        {category.items.map((item) => (
                          <div key={item.id} className="showcase-item">
                            <div>
                              <div className="showcase-item-title">{item.name}</div>
                              <div className="showcase-item-meta">
                                {item.width && (
                                  <div className="showcase-meta-row">
                                    <MoveHorizontal size={13} />
                                    <span>Width: {item.width}</span>
                                  </div>
                                )}
                                {item.duration && (
                                  <div className="showcase-meta-row">
                                    <Clock size={13} />
                                    <span>Avg. duration: {item.duration}</span>
                                  </div>
                                )}
                                {item.racks ? (
                                  <div className="showcase-meta-row">
                                    <span>🔹 {item.racks} racks, {item.doors} door</span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            <div className="showcase-price-badge">
                              Price: £{item.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="showcase-actions">
                      <Link href={`/services/${category.slug}`} className="showcase-btn-details">
                        <span>More details</span>
                      </Link>
                      <Link href={`/book?service=${category.id}`} className="showcase-btn-book">
                        <span>Book a service</span>
                      </Link>
                    </div>
                  </div>

                  {/* Picture Side with centered typography overlay */}
                  <div className="showcase-media">
                    <img
                      src={category.heroImage}
                      alt={`${category.title} Eco Cleaning Liverpool`}
                      loading="lazy"
                    />
                    <div className="showcase-media-overlay">
                      <div className="showcase-media-title">
                        <span>{OVERLAY_TITLES[category.id] || category.title}</span>
                        <Sparkles size={28} className="sparkle-icon" />
                      </div>
                      <div className="showcase-media-subtitle">cleaning</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: "center", marginTop: "24px" }}>
            <Link href="/prices" className="btn btn-secondary">
              <span>View Full Price List &amp; Comparison Table</span>
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================================
          WHY CHOOSE GREEN CLEAN GROUP
         ==================================================================== */}
      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-pill">Why Green Clean Group</span>
            <h2 className="section-title">
              The Safe, Professional <span className="gradient-text">Liverpool Choice</span>
            </h2>
            <p className="section-desc">
              We started Green Clean Group because harsh chemicals have no place where you cook and live. Here is why thousands of Liverpool homes trust us year after year.
            </p>
          </div>

          <div className="responsive-three-col">
            {[
              {
                icon: Sparkles,
                title: "100% Green & Safe",
                desc: "Our non-toxic, eco-friendly formulas ensure zero caustic fumes or chemical residues. Cook in your oven the moment we finish!"
              },
              {
                icon: Clock,
                title: "Punctual & Flexible",
                desc: "Choose convenient 2-hour arrival windows 7 days a week, fitting seamlessly into your work and family schedule."
              },
              {
                icon: ShieldCheck,
                title: "Fully Insured Guarantee",
                desc: "Every technician carries comprehensive public liability insurance covering your property and appliances for total peace of mind."
              },
              {
                icon: HeartHandshake,
                title: "Pleasant & Trustworthy",
                desc: "Family-run ethos. All technicians are DBS background-checked, polite, respectful, and treat your home like their own."
              },
              {
                icon: Headphones,
                title: "Dedicated Local Support",
                desc: "Our Liverpool customer support team is always just a phone call or message away. Transparent quotes with no surprise extras."
              },
              {
                icon: Award,
                title: "100% Results Guarantee",
                desc: "We stand by our craft. If any corner or rack isn’t completely sparkling clean, we return and re-clean it without charge."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="glass-card glass-card-hover"
                  style={{ padding: "32px 28px" }}
                >
                  <div style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--emerald-100)",
                    color: "var(--emerald-700)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "20px"
                  }}>
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "10px" }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "var(--slate-600)", lineHeight: "1.65" }}>
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SERVICE AREA MAP SECTION
         ==================================================================== */}
      <section className="section" style={{ background: "#f8fafc", paddingTop: "80px", paddingBottom: "80px" }}>
        <div className="container">

          {/* Section Header */}
          <div className="section-title-wrap" style={{ marginBottom: "40px" }}>
            <span className="section-pill">Service Area</span>
            <h2 className="section-title">
              Covering Liverpool &amp; <span className="gradient-text">40 Miles Around</span>
            </h2>
            <p className="section-desc">
              We run daily routes across Merseyside and cover the wider North West within a 40-mile radius of Liverpool city centre. Enter your postcode below to confirm we reach you.
            </p>
          </div>


          {/* Full-width interactive map */}
          <div style={{ marginBottom: "40px" }}>
            <ServiceAreaMap />
          </div>

          {/* Two-column: area list + postcode checker */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "32px",
            alignItems: "start"
          }} className="coverage-grid">

            {/* Left: area breakdown */}
            <div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "18px" }}>
                Areas We Cover
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
                {[
                  { label: "All of Merseyside", detail: "L1–L39, CH41–49, WA postcodes" },
                  { label: "Wirral", detail: "Birkenhead, Wallasey, Heswall, Bebington" },
                  { label: "St Helens &amp; Knowsley", detail: "WA9–WA11, L34–L36" },
                  { label: "Warrington &amp; Halton", detail: "Warrington, Runcorn, Widnes" },
                  { label: "Sefton &amp; West Lancashire", detail: "Southport, Formby, Ormskirk" },
                  { label: "Chester &amp; North Wales border", detail: "Chester, Ellesmere Port" },
                ].map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <CheckCircle2 size={17} color="#059669" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontSize: "0.92rem", color: "var(--slate-700)" }}>
                      <strong style={{ color: "var(--slate-900)" }} dangerouslySetInnerHTML={{ __html: a.label }} />{" — "}<span dangerouslySetInnerHTML={{ __html: a.detail }} />
                    </span>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: "0.87rem", color: "var(--slate-500)", lineHeight: "1.6", padding: "12px 16px", background: "var(--emerald-50)", borderRadius: "10px", border: "1px solid var(--emerald-200)" }}>
                Not sure if we reach you? Call us on <a href="tel:07359068284" style={{ color: "var(--emerald-700)", fontWeight: "700" }}>07359068284</a> and we&apos;ll confirm straight away.
              </p>
            </div>

            {/* Right: postcode checker */}
            <div>
              <AreaChecker />
            </div>

          </div>
        </div>
      </section>

      {/* ====================================================================
          TESTIMONIALS SECTION
         ==================================================================== */}
      <section className="section" style={{ background: "#ffffff" }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-pill">Customer Reviews</span>
            <h2 className="section-title">
              What Our Clients Are <span className="gradient-text">Saying</span>
            </h2>
            <p className="section-desc">
              Over 3,500 glowing transformations and 5-star recommendations across Liverpool.
            </p>
          </div>

          <TestimonialsCarousel />
        </div>
      </section>

      {/* ====================================================================
          FAQS SECTION
         ==================================================================== */}
      <section className="section" style={{ background: "var(--bg-body)" }}>
        <div className="container">
          <div className="section-title-wrap">
            <span className="section-pill">Got Questions?</span>
            <h2 className="section-title">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="section-desc">
              Everything you need to know about our eco-friendly techniques, scheduling, and guarantees.
            </p>
          </div>

          <FaqAccordion />
        </div>
      </section>

      {/* ====================================================================
          FINAL ACTION BANNER
         ==================================================================== */}
      <section style={{ padding: "80px 0", background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #047857 100%)", color: "#ffffff" }}>
        <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255, 255, 255, 0.15)",
            padding: "6px 16px",
            borderRadius: "var(--radius-full)",
            fontSize: "0.85rem",
            fontWeight: "700",
            marginBottom: "20px",
            border: "1px solid rgba(255, 255, 255, 0.25)"
          }}>
            <Sparkles size={16} />
            <span>Ready in Just 60 Seconds</span>
          </span>

          <h2 style={{ fontSize: "2.6rem", fontWeight: "850", lineHeight: "1.2", marginBottom: "18px", letterSpacing: "-0.02em" }}>
            Ready for a Sparkling Clean Space?
          </h2>

          <p style={{ fontSize: "1.15rem", color: "var(--emerald-100)", lineHeight: "1.65", marginBottom: "36px" }}>
            Book online today or call our friendly Liverpool team. No harsh chemicals, flexible arrival slots, and satisfaction guaranteed.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/book" className="btn btn-primary btn-lg" style={{ background: "#ffffff", color: "var(--emerald-900)", border: "none" }}>
              <Calendar size={18} color="#059669" />
              <span>Book an Appointment Now</span>
            </Link>

            <a href="tel:07359068284" className="btn btn-outline-white btn-lg">
              <Phone size={18} />
              <span>Call: 07359068284</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

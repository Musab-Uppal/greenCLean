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
  ChevronRight
} from "lucide-react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import AreaChecker from "@/components/AreaChecker";
import TestimonialsCarousel from "@/components/TestimonialsCarousel";
import FaqAccordion from "@/components/FaqAccordion";
import { SERVICE_CATEGORIES } from "@/data/servicesData";
import { TRUST_METRICS } from "@/data/testimonialsData";

const CATEGORY_ICONS = {
  oven: Flame,
  kitchen: UtensilsCrossed,
  appliances: Refrigerator,
  bbq: Beef,
  bathroom: Bath,
  house: Home,
  tenancy: KeyRound
};

export default function HomePage() {
  const [selectedCategoryTab, setSelectedCategoryTab] = useState("oven");

  const currentCategory = SERVICE_CATEGORIES.find(c => c.id === selectedCategoryTab) || SERVICE_CATEGORIES[0];

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

            {/* Right Col: Interactive Before/After Comparison Showcase */}
            <div>
              <div style={{ marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--emerald-800)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Interactive Live Transformation
                </span>
                <span style={{ fontSize: "0.8rem", color: "var(--slate-500)" }}>
                  Slide left/right to reveal
                </span>
              </div>

              <BeforeAfterSlider />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          TRUST METRICS BANNER
         ==================================================================== */}
      <section style={{ background: "#ffffff", padding: "40px 0", borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px", textAlign: "center" }}>
            {TRUST_METRICS.map((metric, i) => (
              <div key={i} style={{ padding: "10px" }}>
                <div style={{ fontSize: "2.2rem", fontWeight: "850", color: "var(--emerald-700)", letterSpacing: "-0.02em" }}>
                  {metric.value}
                </div>
                <div style={{ fontSize: "0.9rem", color: "var(--slate-600)", fontWeight: "600", marginTop: "4px" }}>
                  {metric.label}
                </div>
              </div>
            ))}
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

          {/* Category Tabs */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "40px" }}>
            {SERVICE_CATEGORIES.map((cat) => {
              const Icon = CATEGORY_ICONS[cat.id] || Sparkles;
              const isActive = selectedCategoryTab === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryTab(cat.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 20px",
                    borderRadius: "var(--radius-full)",
                    background: isActive ? "var(--emerald-600)" : "#ffffff",
                    color: isActive ? "#ffffff" : "var(--slate-700)",
                    fontWeight: "700",
                    fontSize: "0.925rem",
                    border: `1.5px solid ${isActive ? "var(--emerald-600)" : "var(--slate-200)"}`,
                    boxShadow: isActive ? "var(--shadow-green-sm)" : "var(--shadow-sm)",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <Icon size={16} />
                  <span>{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Content Card */}
          <div className="glass-card" style={{ padding: "36px 32px", border: "1.5px solid var(--emerald-200)", marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "28px" }}>
              <div>
                <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", color: "var(--emerald-600)" }}>
                  Category Details
                </span>
                <h3 style={{ fontSize: "1.75rem", fontWeight: "800", color: "var(--slate-900)" }}>
                  {currentCategory.title}
                </h3>
                <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", maxWidth: "600px", marginTop: "4px" }}>
                  {currentCategory.shortDesc}
                </p>
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                <Link href={`/services/${currentCategory.slug}`} className="btn btn-secondary btn-sm">
                  <span>Learn More Details</span>
                  <ArrowRight size={14} />
                </Link>
                <Link href="/book" className="btn btn-primary btn-sm">
                  <span>Book This Service</span>
                </Link>
              </div>
            </div>

            {/* Grid of items in this category */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "18px" }}>
              {currentCategory.items.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    padding: "20px",
                    borderRadius: "var(--radius-md)",
                    background: "#ffffff",
                    border: "1px solid var(--border-subtle)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s, box-shadow 0.2s"
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow = "var(--shadow-md)";
                    e.currentTarget.style.borderColor = "var(--emerald-300)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "var(--border-subtle)";
                  }}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <h4 style={{ fontWeight: "700", fontSize: "1.05rem", color: "var(--slate-900)" }}>
                        {item.name}
                      </h4>
                      {item.popular && (
                        <span style={{ fontSize: "0.7rem", fontWeight: "700", padding: "2px 8px", borderRadius: "4px", background: "var(--emerald-100)", color: "var(--emerald-800)" }}>
                          Popular
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
                      {item.width && <span>📐 {item.width}</span>}
                      {item.duration && <span>⏱️ {item.duration}</span>}
                      {item.racks ? <span>🔹 {item.racks} Racks &amp; {item.doors} Door(s)</span> : null}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "12px", borderTop: "1px solid var(--slate-100)" }}>
                    <div>
                      <span style={{ fontSize: "0.75rem", color: "var(--slate-400)", textTransform: "uppercase" }}>Fixed Price</span>
                      <div style={{ fontSize: "1.35rem", fontWeight: "850", color: "var(--emerald-700)" }}>
                        £{item.price}
                      </div>
                    </div>
                    <Link href="/book" className="btn btn-primary btn-sm" style={{ padding: "8px 16px" }}>
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
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

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
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
          INTERACTIVE POSTCODE COVERAGE CHECKER
         ==================================================================== */}
      <section className="section" style={{ background: "radial-gradient(circle at 10% 20%, #ecfdf5, transparent 50%), #f8fafc" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "48px", alignItems: "center" }} className="coverage-grid">
            <div>
              <span className="section-pill">Service Area</span>
              <h2 className="section-title" style={{ textAlign: "left", marginBottom: "18px" }}>
                Covering Liverpool, <span className="gradient-text">Merseyside &amp; Beyond</span>
              </h2>
              <p style={{ fontSize: "1.1rem", color: "var(--slate-600)", lineHeight: "1.7", marginBottom: "24px" }}>
                We run daily routes across Liverpool City Centre, Sefton, St Helens, Knowsley, and the Wirral, with weekly routes throughout Cheshire and Greater Manchester.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span style={{ fontWeight: "600", color: "var(--slate-800)" }}>All Merseyside (L1 to L39 &amp; CH postcodes)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span style={{ fontWeight: "600", color: "var(--slate-800)" }}>Cheshire (Warrington, Widnes, Runcorn, Chester)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span style={{ fontWeight: "600", color: "var(--slate-800)" }}>Manchester &amp; Lancashire (Select routes)</span>
                </div>
              </div>
            </div>

            {/* Interactive Area Checker Tool */}
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

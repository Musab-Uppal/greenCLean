import Link from "next/link";
import { Sparkles, ShieldCheck, HeartHandshake, Award, Users, Calendar, Phone, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "About Us | Green Clean Group Liverpool",
  description: "Learn about Green Clean Group Liverpool. Family-run, 100% eco-friendly, non-toxic oven and home cleaning across Merseyside.",
};

export default function AboutPage() {
  return (
    <div style={{ background: "var(--bg-body)", padding: "60px 0 100px" }}>
      <div className="container">
        {/* About Header */}
        <div style={{ textAlign: "center", maxWidth: "780px", margin: "0 auto 60px" }}>
          <span className="section-pill">
            <Sparkles size={14} />
            <span>Our Story &amp; Mission</span>
          </span>

          <h1 style={{ fontSize: "2.8rem", fontWeight: "850", color: "var(--slate-900)", marginBottom: "18px", letterSpacing: "-0.02em" }}>
            Clean Homes, <span className="gradient-text">Clean Conscience</span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "var(--slate-600)", lineHeight: "1.7" }}>
            We started Green Clean Group in Liverpool with one clear mission: to provide a truly spotless, high-end cleaning service without bringing dangerous caustic chemicals, stinging fumes, or toxic residues into your family’s kitchen and home.
          </p>
        </div>

        {/* 2-Column Story Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px", alignItems: "center", marginBottom: "80px" }}>
          <div className="glass-card" style={{ padding: "40px 32px", border: "1.5px solid var(--emerald-200)" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "16px" }}>
              The Green Clean Difference
            </h2>
            <p style={{ fontSize: "1rem", color: "var(--slate-700)", lineHeight: "1.7", marginBottom: "16px" }}>
              Traditional oven and deep cleaning services rely on harsh sodium hydroxide and caustic chemicals. These produce choking fumes, damage enamel over time, and leave hazardous residues on cooking surfaces.
            </p>
            <p style={{ fontSize: "1rem", color: "var(--slate-700)", lineHeight: "1.7", marginBottom: "20px" }}>
              At <strong>Green Clean Group</strong>, we invested in custom van-mounted, heated dipping tanks and biodegradable, plant-derived degreasers. Our system gently yet completely dissolves burnt-on carbon, food grease, and baked enamel grime — leaving your appliances looking brand new while keeping children, pets, and food 100% safe.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                "100% Non-Caustic, Fume-Free & Biodegradable",
                "Appliance is safe to use immediately after cleaning",
                "Gentle on enamel, glass seals, and chrome plating",
                "Zero chemical smell or lingering air contamination"
              ].map((point, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={18} color="#059669" />
                  <span style={{ fontWeight: "600", fontSize: "0.925rem", color: "var(--slate-800)" }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div 
            className="green-card" 
            style={{ 
              padding: "44px 36px", 
              background: "linear-gradient(145deg, var(--emerald-900) 0%, #042f2e 100%)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between"
            }}
          >
            <div>
              <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--emerald-400)", marginBottom: "12px", display: "block" }}>
                Our Core Pillars
              </span>
              <h3 style={{ fontSize: "2rem", fontWeight: "850", color: "#ffffff", marginBottom: "20px" }}>
                Why Liverpool Chooses Us
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div>
                  <h4 style={{ fontWeight: "750", fontSize: "1.1rem", color: "var(--emerald-300)", marginBottom: "4px" }}>
                    🌿 Family-Run &amp; Community Proud
                  </h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--slate-300)", lineHeight: "1.6" }}>
                    Based in Liverpool, we treat every home with the utmost respect, care, and attention to detail.
                  </p>
                </div>

                <div>
                  <h4 style={{ fontWeight: "750", fontSize: "1.1rem", color: "var(--emerald-300)", marginBottom: "4px" }}>
                    🛡️ Full Public Liability Cover
                  </h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--slate-300)", lineHeight: "1.6" }}>
                    We carry comprehensive insurance coverage for total customer peace of mind.
                  </p>
                </div>

                <div>
                  <h4 style={{ fontWeight: "750", fontSize: "1.1rem", color: "var(--emerald-300)", marginBottom: "4px" }}>
                    ⭐ 100% Satisfaction Guarantee
                  </h4>
                  <p style={{ fontSize: "0.9rem", color: "var(--slate-300)", lineHeight: "1.6" }}>
                    If you are not completely thrilled with the final result, we return and re-clean free of charge.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "36px", paddingTop: "24px", borderTop: "1px solid rgba(255, 255, 255, 0.15)" }}>
              <Link href="/book" className="btn btn-primary" style={{ width: "100%", background: "#ffffff", color: "var(--emerald-950)", border: "none" }}>
                <Calendar size={16} color="#059669" />
                <span>Book Your Clean Today</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px", textAlign: "center" }}>
          {[
            { num: "3,500+", title: "Ovens & Rooms Cleaned", desc: "Across Liverpool & Merseyside" },
            { num: "100%", title: "Non-Toxic Guarantee", desc: "No harsh fumes or caustic acids" },
            { num: "4.9 / 5.0", title: "Customer Rating", desc: "Top reviews on Google & Social" },
            { num: "7 Days", title: "Flexible Scheduling", desc: "Monday – Sunday 08:00 – 19:00" },
          ].map((s, idx) => (
            <div key={idx} className="glass-card" style={{ padding: "30px 20px" }}>
              <div style={{ fontSize: "2.4rem", fontWeight: "900", color: "var(--emerald-700)", marginBottom: "6px" }}>
                {s.num}
              </div>
              <div style={{ fontWeight: "700", fontSize: "1.05rem", color: "var(--slate-900)", marginBottom: "4px" }}>
                {s.title}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}>
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

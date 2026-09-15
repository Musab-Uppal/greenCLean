import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck, 
  Clock, 
  ArrowRight, 
  Phone,
  Flame,
  UtensilsCrossed,
  Refrigerator,
  Beef,
  Bath,
  Home,
  KeyRound
} from "lucide-react";
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

export async function generateStaticParams() {
  return SERVICE_CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = SERVICE_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return { title: "Service Not Found" };

  return {
    title: `${category.title} in Liverpool | Green Clean Group`,
    description: `Professional eco-friendly ${category.title.toLowerCase()} in Liverpool and Merseyside. Non-toxic formulas, fixed prices from £${category.items[0]?.price}, and 100% satisfaction guarantee.`,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const category = SERVICE_CATEGORIES.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  const IconComponent = CATEGORY_ICONS[category.id] || Sparkles;

  return (
    <div style={{ background: "var(--bg-body)", padding: "50px 0 100px" }}>
      <div className="container">
        {/* Service Hero Banner */}
        <div 
          className="green-card" 
          style={{ 
            padding: "50px 40px", 
            marginBottom: "50px", 
            background: "linear-gradient(135deg, #022c22 0%, #064e3b 60%, #0f766e 100%)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ maxWidth: "760px", position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.15)", padding: "6px 14px", borderRadius: "var(--radius-full)", fontSize: "0.85rem", fontWeight: "700", marginBottom: "16px", color: "#a7f3d0" }}>
              <IconComponent size={16} />
              <span>Eco Cleaning Service • Liverpool</span>
            </div>

            <h1 style={{ fontSize: "2.8rem", fontWeight: "850", color: "#ffffff", lineHeight: "1.15", marginBottom: "16px", letterSpacing: "-0.02em" }}>
              {category.title}
            </h1>

            <p style={{ fontSize: "1.15rem", color: "var(--emerald-100)", lineHeight: "1.65", marginBottom: "32px" }}>
              {category.shortDesc} We use 100% biodegradable, non-caustic treatments that eliminate baked-on carbon, stubborn grease, and residues without harsh chemical fumes.
            </p>

            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <Link href={`/book?service=${category.id}`} className="btn btn-primary btn-lg" style={{ background: "#ffffff", color: "var(--emerald-900)", border: "none" }}>
                <Calendar size={18} color="#059669" />
                <span>Book {category.title} Now</span>
              </Link>

              <a href="tel:07359068284" className="btn btn-outline-white btn-lg">
                <Phone size={18} />
                <span>Call 07359068284</span>
              </a>
            </div>
          </div>
        </div>

        {/* Pricing Options Grid */}
        <div style={{ marginBottom: "60px" }}>
          <div style={{ marginBottom: "24px" }}>
            <span className="section-pill">Packages &amp; Options</span>
            <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--slate-900)" }}>
              Choose Your {category.title} Package
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {category.items.map((item) => (
              <div 
                key={item.id}
                className="glass-card glass-card-hover"
                style={{
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "var(--slate-900)" }}>
                      {item.name}
                    </h3>
                    {item.popular && (
                      <span style={{ fontSize: "0.7rem", fontWeight: "700", padding: "3px 8px", borderRadius: "4px", background: "var(--emerald-100)", color: "var(--emerald-800)" }}>
                        Popular
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
                    {item.width && <span>📐 Dimensions / Capacity: <strong>{item.width}</strong></span>}
                    {item.duration && <span>⏱️ Typical Duration: <strong>{item.duration}</strong></span>}
                    {item.racks ? <span>🔹 Specifications: <strong>{item.racks} racks, {item.doors} door</strong></span> : null}
                  </div>
                </div>

                <div style={{ paddingTop: "16px", borderTop: "1px solid var(--slate-100)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", color: "var(--slate-400)", textTransform: "uppercase" }}>Fixed Price</span>
                    <div style={{ fontSize: "1.5rem", fontWeight: "850", color: "var(--emerald-700)" }}>
                      £{item.price}
                    </div>
                  </div>
                  <Link href={`/book?service=${category.id}`} className="btn btn-primary btn-sm">
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The 5-Step Process */}
        <div className="glass-card" style={{ padding: "40px 32px", border: "1.5px solid var(--emerald-200)", marginBottom: "60px" }}>
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 36px" }}>
            <span className="section-pill">Our Method</span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--slate-900)" }}>
              How Our Eco-Cleaning Process Works
            </h2>
            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem" }}>
              A meticulous, multi-stage restoration that brings appliances and rooms back to showroom condition.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
            {[
              { step: "01", title: "Inspection & Protection", desc: "We inspect the appliance and place protective floor mats to keep your kitchen spotless." },
              { step: "02", title: "Disassembly", desc: "Removable parts (racks, trays, fan covers, seals) are carefully taken apart for deep immersion." },
              { step: "03", title: "Eco Dipping Tank", desc: "Components soak in our specialized, non-toxic van-mounted heated dip tank, dissolving grease." },
              { step: "04", title: "Detailed Interior Clean", desc: "Our specialist details the main body and glass doors by hand with non-caustic paste." },
              { step: "05", title: "Reassembly & Polish", desc: "Everything is reassembled, polished to a sparkling mirror finish, and safety checked." },
            ].map((st) => (
              <div key={st.step} style={{ padding: "20px", borderRadius: "var(--radius-md)", background: "#ffffff", border: "1px solid var(--slate-200)" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: "900", color: "var(--emerald-500)", marginBottom: "8px" }}>
                  {st.step}
                </div>
                <h4 style={{ fontSize: "1.05rem", fontWeight: "700", color: "var(--slate-900)", marginBottom: "6px" }}>
                  {st.title}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.6" }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Checklist */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "30px", alignItems: "center" }}>
          <div>
            <span className="section-pill">Peace of Mind</span>
            <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "14px" }}>
              Included With Every Clean
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "100% biodegradable and non-caustic cleaning solutions",
                "Completely safe for asthma sufferers, babies, and pets",
                "Ready to use immediately — zero chemical fumes or residual odors",
                "Fully insured DBS-checked technicians",
                "Transparent fixed pricing without hidden fees",
                "100% Satisfaction Guarantee: Free re-clean if anything is missed"
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: "0.95rem", color: "var(--slate-700)" }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card" style={{ padding: "32px", textAlign: "center", background: "var(--emerald-50)", border: "1.5px solid var(--emerald-300)" }}>
            <h3 style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--emerald-950)", marginBottom: "10px" }}>
              Book in Just 60 Seconds
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--slate-600)", marginBottom: "24px" }}>
              Pick your time slot, enter your address, and our professional Liverpool cleaner will be at your door.
            </p>
            <Link href={`/book?service=${category.id}`} className="btn btn-primary" style={{ width: "100%" }}>
              <Calendar size={16} />
              <span>Book Online Now</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

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
  KeyRound,
  Star,
  Award,
  Leaf,
  Lock
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

const SERVICE_GALLERIES = {
  "oven-cleaning": [
    { src: "/services/oven.jpg", title: "Spotless Oven Range & Glass Door", desc: "Burnt-on carbon dissolved without caustic fumes" },
    { src: "/services/gas_hob.jpg", title: "Degreased Burners & Gas Hob", desc: "Full carbon removal and sparkling chrome finish" },
    { src: "/services/kitchen.jpg", title: "Showroom Kitchen Finish", desc: "Eco-friendly treatments safe for cooking right away" },
  ],
  "kitchen-cleaning": [
    { src: "/services/kitchen.jpg", title: "Complete Kitchen Sanitization", desc: "Deep degreasing of cabinets, tiles, and hood" },
    { src: "/services/kitchen_island.jpg", title: "Island Countertop & Sink", desc: "Mirror finish stainless steel and polished surfaces" },
    { src: "/services/oven.jpg", title: "Appliance Detailing", desc: "Spotless exteriors and sanitised handles" },
  ],
  "appliances-cleaning": [
    { src: "/services/appliances.jpg", title: "American Style Fridge / Freezer", desc: "Internal deep sanitisation and odor elimination" },
    { src: "/services/kitchen_island.jpg", title: "Dishwasher & Washing Machine", desc: "Limescale de-scaling and filter clearout" },
    { src: "/services/gas_hob.jpg", title: "Hobs & Extractor Degreasing", desc: "Grease-free filters and crystal-clear lights" },
  ],
  "bbq-cleaning": [
    { src: "/services/bbq.jpg", title: "Deep Carbon Removal", desc: "Heavy-duty eco dipping tank grill restoration" },
    { src: "/services/bbq_grill.jpg", title: "Full Grill & Burner Detail", desc: "Food-safe sanitization, zero harsh residues" },
    { src: "/services/gas_hob.jpg", title: "Igniters & Burner Rails", desc: "Optimised gas flow and spotless metal" },
  ],
  "bathroom-cleaning": [
    { src: "/services/bathroom.jpg", title: "Luxury Tile & Vanity Sparkle", desc: "100% limescale and soap scum removal" },
    { src: "/services/bathroom_shower.jpg", title: "Streak-Free Glass Shower Screen", desc: "Anti-fog mold prevention treatment" },
    { src: "/services/house.jpg", title: "Hygienic Home Standard", desc: "Hospital-grade, eco-friendly sanitization" },
  ],
  "house-cleaning": [
    { src: "/services/house.jpg", title: "Pristine Living Space & Floors", desc: "Top-to-bottom dusting, vacuuming and polishing" },
    { src: "/services/house_bedroom.jpg", title: "Fresh & Allergen-Free Bedrooms", desc: "HEPA filtered vacuuming and eco-sprays" },
    { src: "/services/kitchen.jpg", title: "Sanitized Kitchen & Living", desc: "Plant-based formulas safe for children & pets" },
  ],
  "end-of-tenancy-cleaning": [
    { src: "/services/tenancy.jpg", title: "100% Deposit Return Standard", desc: "Full agency checklist certified deep clean" },
    { src: "/services/kitchen.jpg", title: "Deep Cleaned Kitchen & Oven", desc: "Landlord inspection approved sanitization" },
    { src: "/services/bathroom.jpg", title: "Descaled Bathroom & Grout", desc: "Spotless chrome, gleaming tiles and sanitary ware" },
  ]
};

const SERVICE_PROCESSES = {
  "bathroom-cleaning": [
    { step: "01", title: "Inspection & Protection", desc: "We inspect sanitary ware, tiles, and grout, applying protective waterproof floor coverings." },
    { step: "02", title: "Limescale & Mold Breakdown", desc: "Targeted eco-friendly descaling agents dissolve tough limescale, soap scum, and mineral stains." },
    { step: "03", title: "Deep Grout & Tile Scrub", desc: "High-temperature detailing and non-caustic treatments lift grime from grout lines and corners." },
    { step: "04", title: "Sanitization & Screen Detailing", desc: "Showers, glass screens, bath basins, and sanitary ware are deeply sanitized and degreased." },
    { step: "05", title: "Streak-Free Mirror Polish", desc: "Chrome taps, shower heads, glass, and mirrors are polished to a crystal-clear showroom shine." },
    { step: "06", title: "Final Quality Sign-Off", desc: "We inspect the finished bathroom with you to ensure 100% hygienic perfection before leaving." }
  ],
  "oven-cleaning": [
    { step: "01", title: "Inspection & Floor Protection", desc: "We inspect your oven and place protective floor mats to keep your kitchen completely spotless." },
    { step: "02", title: "Safe Disassembly", desc: "Removable parts (racks, side runners, fan cover, seals, doors) are taken out for deep immersion." },
    { step: "03", title: "Van-Mounted Dip Tank", desc: "Components soak in our van-mounted heated dip tank with 100% non-toxic, food-safe formula." },
    { step: "04", title: "Interior Body Detailing", desc: "Our specialist details the main oven cavity and split door glass by hand with non-caustic paste." },
    { step: "05", title: "Reassembly & Polish", desc: "Everything is reassembled, buffed to a sparkling showroom shine, and safety checked." },
    { step: "06", title: "Final Quality Sign-Off", desc: "We inspect the gleaming oven together with you. It is ready to cook in immediately!" }
  ],
  "kitchen-cleaning": [
    { step: "01", title: "Assessment & Surface Prep", desc: "We survey surfaces, splashbacks, and appliances, preparing non-toxic degreasing solutions." },
    { step: "02", title: "High-Level Degreasing", desc: "Top of cupboards, extractor fan covers, and light fixtures are thoroughly degreased." },
    { step: "03", title: "Cabinet & Drawer Detailing", desc: "Cupboard doors, handles, and framework are wiped down and sanitized inside and out." },
    { step: "04", title: "Tiles, Hobs & Splashbacks", desc: "Cooktop burners, tiles, and splashbacks are scrubbed free of grease and baked-on food." },
    { step: "05", title: "Countertop & Sink Buffing", desc: "Countertops and stainless steel sink units are deep sanitized, descaled, and polished." },
    { step: "06", title: "Floor Clean & Final Inspection", desc: "Floors are vacuumed, sanitized, and mopped to leave your kitchen fresh and spotless." }
  ],
  "bbq-cleaning": [
    { step: "01", title: "Initial Inspection & Setup", desc: "We inspect the burners, ignition, and grill body, placing protective ground sheets." },
    { step: "02", title: "Disassembly of Grates & Trays", desc: "Cooking grates, flavorizer bars, heat shields, and drip trays are disassembled." },
    { step: "03", title: "Eco Dip Tank Immersion", desc: "Parts soak in our van-mounted eco dip tank to dissolve stubborn baked-on carbon." },
    { step: "04", title: "Firebox & Hood Detailing", desc: "The internal hood and firebox are scraped, degreased, and detailed with food-safe formulas." },
    { step: "05", title: "Reassembly & Gas Flow Test", desc: "Clean grates and shields are reassembled, exterior polished, and burners flame-tested." },
    { step: "06", title: "Quality Check & Handover", desc: "Final inspection with you. Your BBQ is completely food-safe and ready to grill on!" }
  ],
  "appliances-cleaning": [
    { step: "01", title: "Appliance Safety Check", desc: "We inspect the appliance, seals, and power before placing protective work mats." },
    { step: "02", title: "Component Disassembly", desc: "Shelves, drawers, filters, and trays are removed for individual deep sanitization." },
    { step: "03", title: "Internal Bio-Sanitization", desc: "Interior walls, air ducts, and seals are treated with odor-eliminating, food-safe solution." },
    { step: "04", title: "Limescale & Debris Removal", desc: "Water nozzles, spray arms, and drainage filters are cleared of calcification and residue." },
    { step: "05", title: "Reassembly & Exterior Polish", desc: "Shelves reinstalled, and exterior stainless steel or enamel polished to a mirror finish." },
    { step: "06", title: "Operational Test & Handover", desc: "Final cycle/cooling check to ensure optimal function and fresh, hygienic results." }
  ],
  "house-cleaning": [
    { step: "01", title: "Walkthrough & Custom Checklist", desc: "We review priority rooms and personal cleaning requests with you before starting." },
    { step: "02", title: "High-to-Low Dusting", desc: "Ceiling corners, light fixtures, picture frames, and baseboards are dusted systematically." },
    { step: "03", title: "Surface & Furniture Polish", desc: "Surfaces, tables, and doors are detailed using eco-friendly, non-toxic polishes." },
    { step: "04", title: "Kitchen & Bathroom Detailing", desc: "Deep cleaning and sanitization of high-touch kitchen and bathroom fixtures." },
    { step: "05", title: "HEPA Vacuuming & Mopping", desc: "All carpets and hard floors vacuumed with allergen-trapping HEPA filters and mopped." },
    { step: "06", title: "Room-by-Room Inspection", desc: "We review every room against our standards to ensure complete satisfaction." }
  ],
  "end-of-tenancy-cleaning": [
    { step: "01", title: "Agency Checklist Review", desc: "We cross-reference our clean against UK estate agent and landlord inventory checklists." },
    { step: "02", title: "Kitchen & Oven Deep Immersion", desc: "Oven, hob, extractor, cupboards, and appliances detailed to move-in standard." },
    { step: "03", title: "Bathroom Limescale & Grout", desc: "Sanitary ware, shower screens, and tiles descaled and mold-treated." },
    { step: "04", title: "Internal Windows & Woodwork", desc: "Interior window glass, frames, sills, doors, skirting boards, and switches detailed." },
    { step: "05", title: "Flooring & Edge Detailing", desc: "Intensive vacuuming along edges, hardwood cleaning, and damp sanitizing mop." },
    { step: "06", title: "Deposit Guarantee Sign-Off", desc: "Final sign-off with our 100% Deposit Return Guarantee backing the clean." }
  ]
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
  const galleryItems = SERVICE_GALLERIES[category.slug] || [
    { src: category.heroImage, title: `${category.title} Results`, desc: "Spotless showroom finish" }
  ];
  const processSteps = SERVICE_PROCESSES[category.slug] || SERVICE_PROCESSES["oven-cleaning"];

  return (
    <div style={{ background: "var(--bg-body)", padding: "40px 0 100px" }}>
      <div className="container">
        {/* Service Hero Banner with Split Image Layout */}
        <div 
          className="green-card service-hero-padding" 
          style={{ 
            marginBottom: "50px", 
            background: "linear-gradient(135deg, #022c22 0%, #064e3b 60%, #0f766e 100%)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "36px", alignItems: "center" }} className="responsive-two-col">
            {/* Left: Headline and Value Props */}
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.15)", padding: "6px 14px", borderRadius: "var(--radius-full)", fontSize: "0.85rem", fontWeight: "700", marginBottom: "16px", color: "#a7f3d0" }}>
                <IconComponent size={16} />
                <span>Eco Cleaning Service • Liverpool</span>
              </div>

              <h1 style={{ fontSize: "clamp(1.85rem, 4.5vw, 2.7rem)", fontWeight: "850", color: "#ffffff", lineHeight: "1.15", marginBottom: "16px", letterSpacing: "-0.02em" }}>
                {category.title}
              </h1>

              <p style={{ fontSize: "1.05rem", color: "var(--emerald-100)", lineHeight: "1.65", marginBottom: "24px" }}>
                {category.shortDesc} We use 100% biodegradable, non-caustic treatments that eliminate baked-on carbon, stubborn grease, and residues without harsh chemical fumes.
              </p>

              {/* Trust Badges Pill Row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.12)", padding: "5px 12px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", color: "#ffffff", fontWeight: "600" }}>
                  <Star size={13} fill="#10b981" color="#10b981" />
                  <span>4.9★ Rated locally</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.12)", padding: "5px 12px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", color: "#ffffff", fontWeight: "600" }}>
                  <Leaf size={13} color="#34d399" />
                  <span>100% Non-Toxic</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.12)", padding: "5px 12px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", color: "#ffffff", fontWeight: "600" }}>
                  <ShieldCheck size={13} color="#34d399" />
                  <span>DBS Checked Specialists</span>
                </div>
              </div>

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

            {/* Right: Real Visual Photo with Trust Overlay */}
            <div style={{ 
              position: "relative", 
              borderRadius: "var(--radius-lg)", 
              overflow: "hidden", 
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.5)", 
              border: "2px solid rgba(255,255,255,0.2)", 
              width: "100%",
              aspectRatio: "4 / 3",
              maxHeight: "380px"
            }}>
              <img 
                src={category.heroImage} 
                alt={`${category.title} by Green Clean Group Liverpool`} 
                style={{ 
                  width: "100%", 
                  height: "100%", 
                  objectFit: "cover",
                  objectPosition: "center"
                }}
              />
              <div style={{ position: "absolute", bottom: "16px", left: "16px", right: "16px", background: "rgba(15, 23, 42, 0.85)", backdropFilter: "blur(8px)", padding: "12px 16px", borderRadius: "var(--radius-md)", border: "1px solid rgba(255, 255, 255, 0.2)", display: "flex", alignItems: "center", gap: "10px" }}>
                <Sparkles size={18} color="#34d399" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ffffff" }}>
                    Verified Eco-Clean Standard
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#cbd5e1" }}>
                    100% Satisfaction Guarantee • Free Re-Clean if not spotless
                  </div>
                </div>
              </div>
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

          <div className="responsive-card-grid" style={{ gap: "20px" }}>
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
                    {item.width && <span>📐 Width: <strong>{item.width}</strong></span>}
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

        {/* Real Results & Visual Trust Gallery */}
        <div style={{ marginBottom: "60px" }}>
          <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 32px" }}>
            <span className="section-pill">Real Results &amp; Proof</span>
            <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--slate-900)" }}>
              Showroom Standard In Every Clean
            </h2>
            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem" }}>
              See the immaculate results our Liverpool eco-cleaning specialists deliver every day. Zero toxic fumes, complete food safety.
            </p>
          </div>

          {/* 3 Real Result Photos */}
          <div className="service-gallery-grid">
            {galleryItems.map((item, idx) => (
              <div key={idx} className="gallery-photo-card">
                <img src={item.src} alt={item.title} loading="lazy" />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)", padding: "20px 16px 14px", color: "#ffffff" }}>
                  <div style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "2px" }}>{item.title}</div>
                  <div style={{ fontSize: "0.78rem", color: "#cbd5e1" }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* 4 Core Trust Guarantees */}
          <div className="detail-trust-grid" style={{ marginTop: "32px" }}>
            <div className="trust-proof-card">
              <div style={{ display: "inline-flex", padding: "10px", borderRadius: "10px", background: "var(--emerald-100)", color: "var(--emerald-700)", width: "fit-content" }}>
                <Leaf size={20} />
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>100% Plant-Based &amp; Non-Toxic</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                Zero caustic soda or fumes. Safe for children, asthma sufferers, pets, and immediate food prep.
              </p>
            </div>

            <div className="trust-proof-card">
              <div style={{ display: "inline-flex", padding: "10px", borderRadius: "10px", background: "var(--emerald-100)", color: "var(--emerald-700)", width: "fit-content" }}>
                <ShieldCheck size={20} />
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>£2M Insured &amp; DBS Checked</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                Every technician is fully vetted, police-checked, certified, and insured for total peace of mind.
              </p>
            </div>

            <div className="trust-proof-card">
              <div style={{ display: "inline-flex", padding: "10px", borderRadius: "10px", background: "var(--emerald-100)", color: "var(--emerald-700)", width: "fit-content" }}>
                <Award size={20} />
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>100% Satisfaction Guarantee</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                If anything is not completely spotless to your satisfaction, we will return and re-clean free of charge.
              </p>
            </div>

            <div className="trust-proof-card">
              <div style={{ display: "inline-flex", padding: "10px", borderRadius: "10px", background: "var(--emerald-100)", color: "var(--emerald-700)", width: "fit-content" }}>
                <Lock size={20} />
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>Transparent Fixed Pricing</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                No surprise call-out fees, parking surcharges, or hourly surprises. The price you book is the price you pay.
              </p>
            </div>
          </div>
        </div>

        {/* The 6-Step Process (3 by 3 Balanced Grid) */}
        <div className="glass-card responsive-card-padding" style={{ border: "1.5px solid var(--emerald-200)", marginBottom: "60px" }}>
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 36px" }}>
            <span className="section-pill">Our Method</span>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--slate-900)" }}>
              How Our Eco-Cleaning Process Works
            </h2>
            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem" }}>
              A meticulous, multi-stage restoration that brings appliances and rooms back to showroom condition.
            </p>
          </div>

          <div className="responsive-three-col" style={{ gap: "20px" }}>
            {processSteps.map((st) => (
              <div key={st.step} style={{ padding: "24px 20px", borderRadius: "var(--radius-md)", background: "#ffffff", border: "1px solid var(--slate-200)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
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
              </div>
            ))}
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="responsive-two-col" style={{ alignItems: "center" }}>
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

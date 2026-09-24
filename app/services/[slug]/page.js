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
import { getDbCategoriesWithServices, getDbCategoryBySlug } from "@/lib/servicesDb";
import JsonLd from "@/components/JsonLd";
import { getServiceSchema } from "@/lib/schema";

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
    { src: "/services/appliances.jpg", title: "American Style Fridge / Freezer", desc: "Internal deep sanitisation and odour elimination" },
    { src: "/services/kitchen_island.jpg", title: "Dishwasher & Washing Machine", desc: "Limescale de-scaling and filter clearout" },
    { src: "/services/gas_hob.jpg", title: "Hobs & Extractor Degreasing", desc: "Grease-free filters and crystal-clear lights" },
  ],
  "bbq-cleaning": [
    { src: "/services/bbq.jpg", title: "Deep Carbon Removal", desc: "Heavy-duty eco dipping tank grill restoration" },
    { src: "/services/bbq_grill.jpg", title: "Full Grill & Burner Detail", desc: "Food-safe sanitisation, zero harsh residues" },
    { src: "/services/gas_hob.jpg", title: "Igniters & Burner Rails", desc: "Optimised gas flow and spotless metal" },
  ],
  "bathroom-cleaning": [
    { src: "/services/bathroom.jpg", title: "Luxury Tile & Vanity Sparkle", desc: "100% limescale and soap scum removal" },
    { src: "/services/bathroom_shower.jpg", title: "Streak-Free Glass Shower Screen", desc: "Anti-fog mould prevention treatment" },
    { src: "/services/house.jpg", title: "Hygienic Home Standard", desc: "Hospital-grade, eco-friendly sanitisation" },
  ],
  "house-cleaning": [
    { src: "/services/house.jpg", title: "Pristine Living Space & Floors", desc: "Top-to-bottom dusting, vacuuming and polishing" },
    { src: "/services/house_bedroom.jpg", title: "Fresh & Allergen-Free Bedrooms", desc: "HEPA filtered vacuuming and eco-sprays" },
    { src: "/services/kitchen.jpg", title: "Sanitised Kitchen & Living", desc: "Plant-based formulas safe for children & pets" },
  ],
  "end-of-tenancy-cleaning": [
    { src: "/services/tenancy.jpg", title: "100% Deposit Return Standard", desc: "Full agency checklist certified deep clean" },
    { src: "/services/kitchen.jpg", title: "Deep Cleaned Kitchen & Oven", desc: "Landlord inspection approved sanitisation" },
    { src: "/services/bathroom.jpg", title: "Descaled Bathroom & Grout", desc: "Spotless chrome, gleaming tiles and sanitary ware" },
  ]
};

const SERVICE_PROCESSES = {
  "bathroom-cleaning": [
    { step: "01", title: "Inspection & Protection", desc: "We inspect sanitary ware, tiles, and grout, applying protective waterproof floor coverings." },
    { step: "02", title: "Limescale & Mould Breakdown", desc: "Targeted eco-friendly descaling agents dissolve tough limescale, soap scum, and mineral stains." },
    { step: "03", title: "Deep Grout & Tile Scrub", desc: "High-temperature detailing and non-caustic treatments lift grime from grout lines and corners." },
    { step: "04", title: "Sanitisation & Screen Detailing", desc: "Showers, glass screens, bath basins, and sanitary ware are deeply sanitised and degreased." },
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
    { step: "03", title: "Cabinet & Drawer Detailing", desc: "Cupboard doors, handles, and framework are wiped down and sanitised inside and out." },
    { step: "04", title: "Tiles, Hobs & Splashbacks", desc: "Cooktop burners, tiles, and splashbacks are scrubbed free of grease and baked-on food." },
    { step: "05", title: "Countertop & Sink Buffing", desc: "Countertops and stainless steel sink units are deep sanitised, descaled, and polished." },
    { step: "06", title: "Floor Clean & Final Inspection", desc: "Floors are vacuumed, sanitised, and mopped to leave your kitchen fresh and spotless." }
  ],
  "bbq-cleaning": [
    { step: "01", title: "Initial Inspection & Setup", desc: "We inspect the burners, ignition, and grill body, placing protective ground sheets." },
    { step: "02", title: "Disassembly of Grates & Trays", desc: "Cooking grates, flavouriser bars, heat shields, and drip trays are disassembled." },
    { step: "03", title: "Eco Dip Tank Immersion", desc: "Parts soak in our van-mounted eco dip tank to dissolve stubborn baked-on carbon." },
    { step: "04", title: "Firebox & Hood Detailing", desc: "The internal hood and firebox are scraped, degreased, and detailed with food-safe formulas." },
    { step: "05", title: "Reassembly & Gas Flow Test", desc: "Clean grates and shields are reassembled, exterior polished, and burners flame-tested." },
    { step: "06", title: "Quality Check & Handover", desc: "Final inspection with you. Your BBQ is completely food-safe and ready to grill on!" }
  ],
  "appliances-cleaning": [
    { step: "01", title: "Appliance Safety Check", desc: "We inspect the appliance, seals, and power before placing protective work mats." },
    { step: "02", title: "Component Disassembly", desc: "Shelves, drawers, filters, and trays are removed for individual deep sanitisation." },
    { step: "03", title: "Internal Bio-Sanitisation", desc: "Interior walls, air ducts, and seals are treated with odour-eliminating, food-safe solution." },
    { step: "04", title: "Limescale & Debris Removal", desc: "Water nozzles, spray arms, and drainage filters are cleared of calcification and residue." },
    { step: "05", title: "Reassembly & Exterior Polish", desc: "Shelves reinstalled, and exterior stainless steel or enamel polished to a mirror finish." },
    { step: "06", title: "Operational Test & Handover", desc: "Final cycle/cooling check to ensure optimal function and fresh, hygienic results." }
  ],
  "house-cleaning": [
    { step: "01", title: "Walkthrough & Custom Checklist", desc: "We review priority rooms and personal cleaning requests with you before starting." },
    { step: "02", title: "High-to-Low Dusting", desc: "Ceiling corners, light fixtures, picture frames, and baseboards are dusted systematically." },
    { step: "03", title: "Surface & Furniture Polish", desc: "Surfaces, tables, and doors are detailed using eco-friendly, non-toxic polishes." },
    { step: "04", title: "Kitchen & Bathroom Detailing", desc: "Deep cleaning and sanitisation of high-touch kitchen and bathroom fixtures." },
    { step: "05", title: "HEPA Vacuuming & Mopping", desc: "All carpets and hard floors vacuumed with allergen-trapping HEPA filters and mopped." },
    { step: "06", title: "Room-by-Room Inspection", desc: "We review every room against our standards to ensure complete satisfaction." }
  ],
  "end-of-tenancy-cleaning": [
    { step: "01", title: "Agency Checklist Review", desc: "We cross-reference our clean against UK estate agent and landlord inventory checklists." },
    { step: "02", title: "Kitchen & Oven Deep Immersion", desc: "Oven, hob, extractor, cupboards, and appliances detailed to move-in standard." },
    { step: "03", title: "Bathroom Limescale & Grout", desc: "Sanitary ware, shower screens, and tiles descaled and mould-treated." },
    { step: "04", title: "Internal Windows & Woodwork", desc: "Interior window glass, frames, sills, doors, skirting boards, and switches detailed." },
    { step: "05", title: "Flooring & Edge Detailing", desc: "Intensive vacuuming along edges, hardwood cleaning, and damp sanitising mop." },
    { step: "06", title: "Deposit Guarantee Sign-Off", desc: "Final sign-off with our 100% Deposit Return Guarantee backing the clean." }
  ]
};

export async function generateStaticParams() {
  const categories = await getDbCategoriesWithServices();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getDbCategoryBySlug(slug);
  if (!category) return { title: "Service Not Found" };

  return {
    title: `${category.title} in Liverpool & Merseyside | Green Clean Group`,
    description: `${category.title} in Liverpool, Wirral, Warrington, St Helens, Southport, Chester and surrounding areas. Non-caustic, fume-free cleaning — safe for families and pets. Fixed prices from £${category.items[0]?.price}. Book online or call 07359068284.`,
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const category = await getDbCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const IconComponent = CATEGORY_ICONS[category.id] || Sparkles;
  const galleryItems = SERVICE_GALLERIES[category.slug] || [
    { src: category.heroImage, title: `${category.title} Results`, desc: "Spotless showroom finish" }
  ];
  const processSteps = SERVICE_PROCESSES[category.slug] || SERVICE_PROCESSES["oven-cleaning"];
  const serviceSchema = getServiceSchema(category);

  return (
    <div style={{ background: "var(--bg-body)", padding: "40px 0 100px" }}>
      <JsonLd data={serviceSchema} />
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


              <h1 style={{ fontSize: "clamp(1.85rem, 4.5vw, 2.7rem)", fontWeight: "850", color: "#ffffff", lineHeight: "1.15", marginBottom: "16px", letterSpacing: "-0.02em" }}>
                {category.title}
              </h1>

              <p style={{ fontSize: "1.05rem", color: "var(--emerald-100)", lineHeight: "1.65", marginBottom: "24px" }}>
                {category.shortDesc}
              </p>

              {/* Trust Badges Pill Row */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "30px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.12)", padding: "5px 12px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", color: "#ffffff", fontWeight: "600" }}>
                  <Star size={13} fill="#10b981" color="#10b981" />
                  <span>4.9★ Rated locally</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.12)", padding: "5px 12px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", color: "#ffffff", fontWeight: "600" }}>
                  <Leaf size={13} color="#34d399" />
                  <span>Non-Caustic &amp; Fume-Free</span>
                </div>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255, 255, 255, 0.12)", padding: "5px 12px", borderRadius: "var(--radius-full)", fontSize: "0.8rem", color: "#ffffff", fontWeight: "600" }}>
                  <ShieldCheck size={13} color="#34d399" />
                  <span>Fully Insured</span>
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
              Recent Work in Liverpool &amp; Surrounding Areas
            </h2>
            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem" }}>
              Photos from recent jobs across Liverpool, Merseyside and nearby areas. Every clean uses fume-free, non-caustic products.
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
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>Non-Caustic, Fume-Free &amp; Biodegradable</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                We don&apos;t use caustic soda or harsh chemicals. Our cleaning products are biodegradable and won&apos;t leave chemical smells in your home.
              </p>
            </div>

            <div className="trust-proof-card">
              <div style={{ display: "inline-flex", padding: "10px", borderRadius: "10px", background: "var(--emerald-100)", color: "var(--emerald-700)", width: "fit-content" }}>
                <Clock size={20} />
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>Safe to Use Straight After</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                Your oven, fridge or appliance can be used again immediately. No waiting for fumes to clear or surfaces to dry out.
              </p>
            </div>

            <div className="trust-proof-card">
              <div style={{ display: "inline-flex", padding: "10px", borderRadius: "10px", background: "var(--emerald-100)", color: "var(--emerald-700)", width: "fit-content" }}>
                <ShieldCheck size={20} />
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>Fully Insured</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                We carry full public liability insurance, so you can have us in your home with complete peace of mind.
              </p>
            </div>

            <div className="trust-proof-card">
              <div style={{ display: "inline-flex", padding: "10px", borderRadius: "10px", background: "var(--emerald-100)", color: "var(--emerald-700)", width: "fit-content" }}>
                <Award size={20} />
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>Gentle on Enamel, Glass &amp; Chrome</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                Our products won&apos;t damage enamel linings, rubber seals, glass or chrome fittings &mdash; common with caustic cleaning.
              </p>
            </div>
          </div>
        </div>

        {/* The 6-Step Process (3 by 3 Balanced Grid) */}
        <div className="glass-card responsive-card-padding" style={{ border: "1.5px solid var(--emerald-200)", marginBottom: "60px" }}>
          <div style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto 36px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--slate-900)" }}>
              How We Clean
            </h2>
            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem" }}>
              We follow the same careful process on every job, from protecting your floors to a final check with you before we leave.
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
            <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--slate-900)", marginBottom: "14px" }}>
              Included With Every Clean
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "Non-caustic, fume-free and biodegradable cleaning",
                "Appliances are safe to use immediately after cleaning",
                "Gentle on enamel, glass, seals and chrome",
                "No harsh chemical smells",
                "Suitable for family homes and pets",
                "Fully insured",
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
              Book Online
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--slate-600)", marginBottom: "24px" }}>
              Choose a date and time, enter your address and we&apos;ll confirm your booking. We cover Liverpool and surrounding areas up to 40 miles.
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

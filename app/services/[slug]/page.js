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
    { src: "/services/kitchen.jpg", title: "Kitchen Deep Cleaning", desc: "Thorough cleaning of cupboard fronts, worktops and tiles" },
    { src: "/services/kitchen_island.jpg", title: "Island Countertop & Sink", desc: "Mirror finish stainless steel and polished surfaces" },
    { src: "/services/oven.jpg", title: "Appliance Detailing", desc: "Spotless exteriors and sanitised handles" },
  ],
  "appliances-cleaning": [
    { src: "/services/appliances.jpg", title: "American-Style Fridge Freezer", desc: "Internal deep sanitisation and odour elimination" },
    { src: "/services/dishwasher.jpg", title: "Dishwasher & Washing Machine", desc: "Limescale de-scaling and filter clearout" },
    { src: "/services/standard_fridge.jpg", title: "Standard Fridge Freezer", desc: "Interior cleaning of both the fridge and freezer compartments." },
  ],
  "bbq-cleaning": [
    { src: "/services/bbq.jpg", title: "Deep Carbon Removal", desc: "Heavy-duty eco dipping tank grill restoration" },
    { src: "/services/bbq_grill.jpg", title: "Full Grill & Burner Detail", desc: "Food-safe sanitisation, zero harsh residues" },
    { src: "/services/bbq_detail.jpg", title: "BBQ Detail Cleaning", desc: "Careful cleaning of accessible BBQ parts." },
  ],
  "bathroom-cleaning": [
    { src: "/services/bathroom.jpg", title: "Bathroom Tiles & Basin Cleaning", desc: "Limescale and soap residue removal." },
    { src: "/services/bathroom_shower.jpg", title: "Shower Screen Cleaning", desc: "Removal of limescale and soap marks from glass." },
    { src: "/services/bath_toilet.jpg", title: "Bath & Toilet Cleaning", desc: "Thorough cleaning of baths, toilets and surrounding surfaces." },
  ],
  "house-cleaning": [
    { src: "/services/house.jpg", title: "Pristine Living Space & Floors", desc: "Top-to-bottom dusting, vacuuming and polishing" },
    { src: "/services/house_bedroom.jpg", title: "Fresh & Clean Bedrooms", desc: "Dusting, vacuuming and surface cleaning." },
    { src: "/services/kitchen.jpg", title: "Sanitised Kitchen & Living", desc: "Plant-based formulas safe for children & pets" },
  ],
  "end-of-tenancy-cleaning": [
    { src: "/services/tenancy.jpg", title: "Property Handover Cleaning", desc: "Thorough cleaning ready for the next occupants." },
    { src: "/services/kitchen.jpg", title: "Deep Kitchen Cleaning", desc: "Oven, hob and extractor cleaning available at an extra charge." },
    { src: "/services/bathroom.jpg", title: "Descaled Bathroom & Grout", desc: "Spotless chrome, gleaming tiles and sanitary ware" },
  ]
};

const GALLERY_CONFIG = {
  "bathroom-cleaning": {
    title: "Bathroom Cleaning in Liverpool & Merseyside",
    subtitle: "Thorough cleaning of baths, showers, toilets, basins and bathroom surfaces. Images are for illustration only.",
  },
  "house-cleaning": {
    title: "House Cleaning Services",
    subtitle: "We clean living areas, bedrooms and kitchens using eco-friendly cleaning products.",
  },
  "end-of-tenancy-cleaning": {
    title: "End of Tenancy Cleaning Services",
    subtitle: "Thorough cleaning of living areas, kitchens and bathrooms to prepare your property for handover.",
  },
  "bbq-cleaning": {
    title: "BBQ Cleaning Gallery",
    subtitle: "Examples of the types of BBQs we clean.",
  },
};

const PROCESS_SUBTITLES = {
  "bathroom-cleaning": "We clean your bathroom carefully, using suitable products for each surface. We check our work before we leave.",
};

const SERVICE_PROCESSES = {
  "bathroom-cleaning": [
    { step: "01", title: "Initial Check", desc: "We check the bathroom surfaces and identify areas that need extra attention. We choose suitable products for each material." },
    { step: "02", title: "Limescale & Soap Residue", desc: "We treat limescale and soap residue with suitable cleaning products. Results depend on the condition of the surfaces and the build-up." },
    { step: "03", title: "Tiles & Grout Cleaning", desc: "We scrub tiles and grout to remove dirt and build-up. Some permanent stains may remain." },
    { step: "04", title: "Bath, Shower & Toilet Cleaning", desc: "We thoroughly clean the bath, shower, basin and toilet. Surfaces are rinsed and wiped clean." },
    { step: "05", title: "Mirrors, Glass & Taps", desc: "We clean mirrors, shower screens and taps. We polish them to remove water marks and streaks." },
    { step: "06", title: "Final Check", desc: "We check the cleaned areas and finish any remaining details. Your bathroom is left tidy and ready to use." }
  ],
  "oven-cleaning": [
    { step: "01", title: "Inspection & Floor Protection", desc: "We inspect your oven and place protective floor mats to keep your kitchen completely spotless." },
    { step: "02", title: "Safe Disassembly", desc: "We carefully remove the oven door and removable parts where appropriate. The door itself is cleaned separately and is not soaked." },
    { step: "03", title: "Van-Mounted Dip Tank", desc: "When needed, glass panels and rubber seals are soaked in our van-mounted dip tank. Lightly soiled glass is cleaned by hand." },
    { step: "04", title: "Interior Body Detailing", desc: "Our specialist details the main oven cavity and split door glass by hand with non-caustic paste." },
    { step: "05", title: "Reassembly & Polish", desc: "Everything is reassembled, buffed to a sparkling showroom shine, and safety checked." },
    { step: "06", title: "Final Quality Sign-Off", desc: "We inspect the gleaming oven together with you. It is ready to cook in immediately!" }
  ],
  "kitchen-cleaning": [
    { step: "01", title: "Assessment & Surface Prep", desc: "We survey surfaces, splashbacks, and appliances, preparing non-toxic degreasing solutions." },
    { step: "02", title: "High-Level Degreasing", desc: "We remove grease and dust from accessible cupboard tops and other high-level kitchen surfaces." },
    { step: "03", title: "Cabinet & Drawer Detailing", desc: "We clean cupboard and drawer fronts, handles and interiors. Interior cleaning is included provided cupboards and drawers are empty before we arrive." },
    { step: "04", title: "Tiles & Splashbacks", desc: "We thoroughly clean tiles and splashbacks to remove grease and food residue." },
    { step: "05", title: "Countertop & Sink Buffing", desc: "Countertops and stainless steel sink units are deep sanitised, descaled, and polished." },
    { step: "06", title: "Floor Clean & Final Inspection", desc: "Floors are vacuumed, sanitised, and mopped to leave your kitchen fresh and spotless." }
  ],
  "bbq-cleaning": [
    { step: "01", title: "Initial Inspection & Setup", desc: "We inspect the burners, ignition, and grill body, placing protective ground sheets." },
    { step: "02", title: "Disassembly of Grates & Trays", desc: "Cooking grates, flavouriser bars, heat shields, and drip trays are disassembled." },
    { step: "03", title: "Eco Dip Tank Immersion", desc: "Parts soak in our van-mounted eco dip tank to dissolve stubborn baked-on carbon." },
    { step: "04", title: "Firebox & Hood Detailing", desc: "The internal hood and firebox are scraped, degreased, and detailed with food-safe formulas." },
    { step: "05", title: "Reassembly & Final Clean", desc: "Clean grates, trays and removable parts are put back in place. We wipe down the exterior for a clean finish." },
    { step: "06", title: "Quality Check & Handover", desc: "We carry out a final check with you. We make sure everything is clean and properly reassembled." }
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
    { step: "05", title: "Vacuuming & Floor Mopping", desc: "We vacuum carpets and hard floors, then mop suitable hard floors." },
    { step: "06", title: "Room-by-Room Inspection", desc: "We review every room against our standards to ensure complete satisfaction." }
  ],
  "end-of-tenancy-cleaning": [
    { step: "01", title: "Cleaning Requirements Review", desc: "We discuss your cleaning requirements and any checklist you provide before starting." },
    { step: "02", title: "Deep Kitchen Cleaning", desc: "We clean kitchen surfaces and cupboards inside and out when empty. Oven, hob and extractor cleaning are charged separately." },
    { step: "03", title: "Bathroom Cleaning & Descaling", desc: "We clean toilets, sinks, baths, showers and tiles, removing limescale where possible." },
    { step: "04", title: "Internal Windows & Woodwork", desc: "Interior window glass, frames, sills, doors, skirting boards, and switches detailed." },
    { step: "05", title: "Vacuuming & Floor Mopping", desc: "We vacuum carpets and hard floors, including edges, then mop suitable hard floors." },
    { step: "06", title: "Final Cleaning Check", desc: "We check the completed work before leaving to make sure the agreed cleaning tasks have been carried out." }
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
          {category.slug === "house-cleaning" && (
            <div style={{ marginBottom: "40px" }}>
              <div style={{ marginBottom: "20px" }}>
                <span className="section-pill">Regular Cleaning</span>
                <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--slate-900)" }}>
                  Regular House Cleaning
                </h2>
              </div>

              <div
                className="glass-card"
                style={{
                  padding: "32px",
                  borderRadius: "var(--radius-lg)",
                  border: "2px solid var(--emerald-400)",
                  background: "linear-gradient(135deg, rgba(236,253,245,0.8) 0%, #ffffff 100%)",
                  boxShadow: "0 10px 30px -5px rgba(5,150,105,0.12)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                  maxWidth: "680px"
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", padding: "4px 10px", borderRadius: "var(--radius-full)", background: "var(--emerald-100)", color: "var(--emerald-800)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Hourly Rate
                    </span>
                    <h3 style={{ fontSize: "1.45rem", fontWeight: "800", color: "var(--slate-900)", marginTop: "10px" }}>
                      Regular House Cleaning
                    </h3>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "2rem", fontWeight: "900", color: "var(--emerald-700)", lineHeight: 1 }}>
                      £22
                      <span style={{ fontSize: "1rem", fontWeight: "600", color: "var(--slate-600)", marginLeft: "4px" }}>
                        per hour
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.95rem", color: "var(--slate-700)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Clock size={18} color="#059669" style={{ flexShrink: 0 }} />
                    <span><strong>Minimum booking:</strong> 2 hours</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <CheckCircle2 size={18} color="#059669" style={{ flexShrink: 0 }} />
                    <span>We bring our own equipment and eco-friendly cleaning products.</span>
                  </div>
                </div>

                <div style={{ paddingTop: "18px", borderTop: "1px solid var(--emerald-100)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "14px" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--slate-500)" }}>
                    Flexible recurring or one-off sessions
                  </span>
                  <Link href={`/book?service=${category.id}`} className="btn btn-primary btn-md">
                    <span>Book Now</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div style={{ marginBottom: "24px" }}>
            <span className="section-pill">Packages &amp; Options</span>
            <h2 style={{ fontSize: "2rem", fontWeight: "800", color: "var(--slate-900)" }}>
              {category.slug === "house-cleaning"
                ? "Choose Your Deep Cleaning Package"
                : `Choose Your ${category.title} Package`}
            </h2>
            {category.slug === "end-of-tenancy-cleaning" && (
              <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", marginTop: "6px" }}>
                Oven, hob and extractor cleaning are optional extras charged separately.
              </p>
            )}
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
                    {item.width && (
                      <span>
                        {item.width.toLowerCase().startsWith("includes") ? item.width : (
                          category.slug === "end-of-tenancy-cleaning" || category.slug === "house-cleaning" ? (
                            <>Property type: <strong>{item.width}</strong></>
                          ) : (
                            <>📐 Width: <strong>{item.width}</strong></>
                          )
                        )}
                      </span>
                    )}
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
          <div style={{ marginBottom: "24px" }}>
            <span className="section-pill">Gallery</span>
            <h2 style={{ fontSize: "1.85rem", fontWeight: "800", color: "var(--slate-900)" }}>
              {GALLERY_CONFIG[category.slug]?.title || `${category.title} Gallery`}
            </h2>
            <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", marginTop: "6px" }}>
              {GALLERY_CONFIG[category.slug]?.subtitle || "Examples of our professional cleaning results."}
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
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>Eco-Friendly &amp; Non-Caustic</h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                We use eco-friendly oven cleaning products without caustic soda. They help remove grease and burnt-on residue without harsh chemical fumes.
              </p>
            </div>

            <div className="trust-proof-card">
              <div style={{ display: "inline-flex", padding: "10px", borderRadius: "10px", background: "var(--emerald-100)", color: "var(--emerald-700)", width: "fit-content" }}>
                <Clock size={20} />
              </div>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>
                {category.slug === "house-cleaning" || category.slug === "end-of-tenancy-cleaning"
                  ? "All Equipment Provided"
                  : category.slug === "bbq-cleaning"
                  ? "Safe to Use Straight After"
                  : "Ready to Use After Cleaning"}
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                {category.slug === "house-cleaning" || category.slug === "end-of-tenancy-cleaning"
                  ? "We bring our own cleaning equipment and eco-friendly products, so you don’t need to supply anything."
                  : category.slug === "bbq-cleaning"
                  ? "Your BBQ can be used straight after cleaning. We use non-caustic products that leave no harsh chemical smells."
                  : category.slug === "bathroom-cleaning"
                  ? "Your bathroom is ready to use straight after cleaning."
                  : "Your kitchen is ready to use once cleaning is complete and surfaces are dry."}
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
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "var(--slate-900)" }}>
                {category.slug === "end-of-tenancy-cleaning"
                  ? "Care for Your Property"
                  : category.slug === "house-cleaning"
                  ? "Care for Your Home"
                  : "Gentle on Enamel, Glass & Chrome"}
              </h4>
              <p style={{ fontSize: "0.85rem", color: "var(--slate-600)", lineHeight: "1.5" }}>
                {category.slug === "end-of-tenancy-cleaning"
                  ? "We choose suitable cleaning products for each surface and take care of floors, furniture and fittings."
                  : category.slug === "house-cleaning"
                  ? "We choose suitable cleaning products for each surface and take care of your furniture, floors and fittings."
                  : "We choose suitable products for each surface and take care around enamel, glass, chrome and rubber seals."}
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
              {PROCESS_SUBTITLES[category.slug] || "We follow the same careful process on every job, from protecting your floors to a final check with you before we leave."}
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
                category.slug === "house-cleaning" || category.slug === "end-of-tenancy-cleaning"
                  ? "All cleaning equipment and products provided"
                  : category.slug === "bathroom-cleaning"
                  ? "Your bathroom is ready to use straight after cleaning."
                  : category.slug === "bbq-cleaning"
                  ? "Your BBQ is ready to use immediately after cleaning."
                  : "Your kitchen is ready to use once cleaning is complete and surfaces are dry.",
                category.slug === "house-cleaning" || category.slug === "end-of-tenancy-cleaning"
                  ? "Suitable products for furniture, floors and surfaces"
                  : category.slug === "bathroom-cleaning"
                  ? "Suitable cleaning products for enamel, glass and chrome."
                  : "Gentle on enamel, glass, seals and chrome",
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
              Choose a date and time, enter your address and we&apos;ll confirm your booking. House cleaning across Liverpool and Merseyside. Oven cleaning also available in selected parts of Cheshire, Greater Manchester and Lancashire — contact us to check availability.
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

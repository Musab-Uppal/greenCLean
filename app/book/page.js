import BookingEngine from "@/components/BookingEngine";
import { Sparkles, ShieldCheck, CreditCard, Clock } from "lucide-react";
import { getDbCategoriesWithServices } from "@/lib/servicesDb";

export const metadata = {
  title: "Book a Service Online | Green Clean Group Liverpool",
  description: "Book your eco-friendly oven and home cleaning in Liverpool in 5 simple steps. Real-time availability, instant pricing, and flexible time slots.",
};

export default async function BookPage({ searchParams }) {
  const sp = await searchParams;
  const serviceQuery = sp?.service || "oven";
  const categories = getDbCategoriesWithServices();

  return (
    <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 400px)", padding: "50px 0 90px" }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 40px" }}>
          <span className="section-pill">
            <Sparkles size={14} />
            <span>Online Booking Engine</span>
          </span>

          <h1 style={{ fontSize: "2.6rem", fontWeight: "850", color: "var(--slate-900)", marginBottom: "14px", letterSpacing: "-0.02em" }}>
            Book Your <span className="gradient-text">Eco Clean</span>
          </h1>

          <p style={{ fontSize: "1.1rem", color: "var(--slate-600)", lineHeight: "1.6" }}>
            Select your cleaning services below, pick your preferred arrival slot, and we&apos;ll handle the rest with 100% non-toxic care.
          </p>

          {/* Value Badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: "20px", flexWrap: "wrap", marginTop: "20px", fontSize: "0.85rem", color: "var(--slate-600)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={16} color="#059669" />
              <span>£50 Minimum Order Value</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <CreditCard size={16} color="#059669" />
              <span>Pay Card or Cash on Arrival</span>
            </span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Clock size={16} color="#059669" />
              <span>Instant Confirmation</span>
            </span>
          </div>
        </div>

        {/* 5-Step Booking Engine */}
        <BookingEngine initialCategory={serviceQuery} initialCategories={categories} />
      </div>
    </div>
  );
}

import BookingEngine from "@/components/BookingEngine";
import { getDbCategoriesWithServices } from "@/lib/servicesDb";

export const metadata = {
  title: "Book a Service Online | Green Clean Group Liverpool",
  description: "Book your eco-friendly oven and home cleaning in Liverpool in 5 simple steps. Real-time availability, instant pricing, and flexible time slots.",
};

export default async function BookPage({ searchParams }) {
  const sp = await searchParams;
  const serviceQuery = sp?.service || "oven";
  const categories = await getDbCategoriesWithServices();

  return (
    <div style={{ background: "linear-gradient(180deg, #f0fdf4 0%, #f8fafc 400px)", padding: "28px 0 80px" }}>
      <div className="container">
        {/* 5-Step Booking Engine */}
        <BookingEngine initialCategory={serviceQuery} initialCategories={categories} />
      </div>
    </div>
  );
}

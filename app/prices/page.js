import Link from "next/link";
import { Sparkles, Calendar, Check, ShieldCheck, ArrowRight, HelpCircle } from "lucide-react";
import { getDbCategoriesWithServices } from "@/lib/servicesDb";

export const metadata = {
  title: "Transparent Prices & Cleaning Packages | Green Clean Group Liverpool",
  description: "View our full transparent price list for oven, kitchen, BBQ, and domestic cleaning in Liverpool. No hidden fees, fixed prices, and satisfaction guaranteed.",
};

export default async function PricesPage() {
  const categories = await getDbCategoriesWithServices();

  return (
    <div style={{ background: "var(--bg-body)", padding: "60px 0 100px" }}>
      <div className="container">
        {/* Page Header */}


        {/* Pricing Tables Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {categories.map((category) => (
            <div
              key={category.id}
              id={category.id}
              className="glass-card responsive-card-padding"
              style={{ border: "1.5px solid var(--border-subtle)" }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                <div>
                  <span style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase", color: "var(--emerald-600)" }}>
                    {category.badge || "Service Category"}
                  </span>
                  <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--slate-900)" }}>
                    {category.title}
                  </h2>
                  <p style={{ color: "var(--slate-600)", fontSize: "0.95rem", marginTop: "4px" }}>
                    {category.shortDesc}
                  </p>
                </div>

                <Link
                  href={`/book?service=${category.id}`}
                  className="btn btn-primary btn-sm"
                >
                  <span>Book {category.title}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              {/* Responsive Table */}
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", minWidth: "620px", borderCollapse: "collapse", textAlign: "left", fontSize: "0.95rem" }}>
                  <thead>
                    <tr style={{ background: "var(--emerald-600)", color: "#ffffff" }}>
                      <th style={{ padding: "14px 20px", borderTopLeftRadius: "10px", fontWeight: "700" }}>Service Name</th>
                      <th style={{ padding: "14px 20px", fontWeight: "700" }}>Specifications / Size</th>
                      <th style={{ padding: "14px 20px", fontWeight: "700" }}>Average Duration</th>
                      <th style={{ padding: "14px 20px", fontWeight: "700" }}>Fixed Price</th>
                      <th style={{ padding: "14px 20px", borderTopRightRadius: "10px", textAlign: "right", fontWeight: "700" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {category.items.map((item, idx) => (
                      <tr
                        key={item.id}
                        style={{
                          background: idx % 2 === 0 ? "#ffffff" : "var(--emerald-50)",
                          borderBottom: "1px solid var(--slate-200)",
                          transition: "background 0.2s"
                        }}
                      >
                        <td style={{ padding: "14px 20px", fontWeight: "700", color: "var(--slate-900)" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span>{item.name}</span>
                            {item.popular && (
                              <span style={{ fontSize: "0.68rem", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", background: "var(--emerald-200)", color: "var(--emerald-800)" }}>
                                Popular
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", color: "var(--slate-600)" }}>
                          {item.width || "Standard specification"}
                          {item.racks ? ` (${item.racks} racks, ${item.doors} door)` : ""}
                        </td>
                        <td style={{ padding: "14px 20px", color: "var(--slate-600)" }}>
                          {item.duration}
                        </td>
                        <td style={{ padding: "14px 20px", fontWeight: "800", color: "var(--emerald-700)", fontSize: "1.15rem" }}>
                          £{item.price}
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "right" }}>
                          <Link
                            href={`/book?service=${category.id}`}
                            style={{
                              display: "inline-block",
                              padding: "6px 14px",
                              borderRadius: "var(--radius-full)",
                              background: "var(--emerald-100)",
                              color: "var(--emerald-800)",
                              fontWeight: "700",
                              fontSize: "0.85rem",
                              transition: "all 0.2s"
                            }}
                          >
                            Book →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>


      </div>
    </div>
  );
}

"use client";

import React from "react";

export default function CategoriesTab({
  categories,
  pendingCategories,
  setShowAddCategoryModal,
  setEditingCategory,
  handleDeleteCategory,
}) {
  return (
    <section>
      <div className="admin-section-card">
        <div className="admin-section-header" style={{ marginBottom: "20px" }}>
          <div>
            <h2 className="admin-section-title">Categories Dashboard</h2>
            <p className="admin-section-subtitle">
              Organize service classification hierarchy across the catalog.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddCategoryModal(true)}
            style={{
              background: "linear-gradient(135deg, #059669, #10b981)",
              color: "#ffffff",
              border: "none",
              padding: "9px 16px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ padding: "12px 14px" }}>Image</th>
                <th style={{ padding: "12px 14px" }}>Category ID</th>
                <th style={{ padding: "12px 14px" }}>Category Name</th>
                <th style={{ padding: "12px 14px" }}>Linked Services</th>
                <th style={{ padding: "12px 14px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => {
                const isCatPending = Boolean(pendingCategories[cat.id]);
                return (
                  <tr
                    key={cat.id}
                    className={isCatPending ? "row-pending-stage" : ""}
                  >
                    <td style={{ padding: "12px 14px" }}>
                      <img
                        src={cat.image || "/services/oven.jpg"}
                        alt={cat.name}
                        style={{
                          width: "44px",
                          height: "44px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: isCatPending ? "2px solid #f59e0b" : "1px solid #334155",
                          display: "block",
                        }}
                      />
                    </td>
                    <td style={{ padding: "12px 14px", color: "#94a3b8" }}>#{cat.id}</td>
                    <td style={{ padding: "12px 14px", fontWeight: 600, color: "#f8fafc" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span>{cat.name}</span>
                        {isCatPending && (
                          <span className="admin-tag-unsaved">
                            Unsaved
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{
                        background: "rgba(51, 65, 85, 0.5)",
                        color: "#cbd5e1",
                        padding: "3px 10px",
                        borderRadius: "999px",
                        fontSize: "0.78rem",
                      }}>
                        {cat.service_count || 0} services
                      </span>
                    </td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                        <button
                          type="button"
                          onClick={() => setEditingCategory({ ...cat })}
                          style={{
                            background: "rgba(59, 130, 246, 0.15)",
                            border: "1px solid rgba(59, 130, 246, 0.3)",
                            color: "#60a5fa",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteCategory(cat.id, cat.service_count)}
                          style={{
                            background: "rgba(239, 68, 68, 0.15)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            color: "#f87171",
                            padding: "5px 10px",
                            borderRadius: "6px",
                            fontSize: "0.78rem",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

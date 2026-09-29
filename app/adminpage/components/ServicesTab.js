"use client";

import React from "react";

export default function ServicesTab({
  categories,
  serviceCatFilter,
  setServiceCatFilter,
  serviceSearch,
  setServiceSearch,
  setShowAddServiceModal,
  filteredServices,
  pendingServices,
  handleStageServicePrice,
  setEditingService,
  handleDeleteService,
}) {
  return (
    <section>
      <div className="admin-section-card">
        {/* Header & Controls */}
        <div className="admin-section-header">
          <div>
            <h2 className="admin-section-title">Services & Products Dashboard</h2>
            <p className="admin-section-subtitle">
              Configure service rates, durations, category mappings, and featured highlights.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {/* Category filter */}
            <select
              value={serviceCatFilter}
              onChange={(e) => setServiceCatFilter(e.target.value)}
              style={{
                background: "#020617",
                border: "1px solid #334155",
                color: "#f8fafc",
                padding: "8px 12px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                cursor: "pointer",
              }}
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Search box */}
            <input
              type="text"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              placeholder="Search services..."
              style={{
                background: "#020617",
                border: "1px solid #334155",
                color: "#f8fafc",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.85rem",
              }}
            />

            {/* Add button */}
            <button
              type="button"
              onClick={() => setShowAddServiceModal(true)}
              style={{
                background: "linear-gradient(135deg, #059669, #10b981)",
                color: "#ffffff",
                border: "none",
                padding: "8px 16px",
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
              <span>Add Service</span>
            </button>
          </div>
        </div>

        {/* Services Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Service Name</th>
                <th>Category</th>
                <th>Price (£)</th>
                <th>Duration</th>
                <th>Scope / Area</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "36px", textAlign: "center", color: "#64748b" }}>
                    No services found.
                  </td>
                </tr>
              ) : (
                filteredServices.map((service) => {
                  const isServicePending = Boolean(pendingServices[service.id]);
                  return (
                    <tr
                      key={service.id}
                      className={isServicePending ? "row-pending-stage" : ""}
                    >
                      <td style={{ color: "#94a3b8" }}>#{service.id}</td>
                      <td style={{ fontWeight: 600, color: "#f8fafc" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span>{service.name}</span>
                          {isServicePending && (
                            <span className="admin-tag-unsaved">
                              Unsaved
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span style={{
                          background: "rgba(16, 185, 129, 0.12)",
                          color: "#34d399",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontSize: "0.78rem",
                        }}>
                          {service.category_name}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ color: "#10b981", fontWeight: 700 }}>£</span>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={service.price ?? ""}
                            onChange={(e) => handleStageServicePrice(service.id, e.target.value)}
                            placeholder="0.00"
                            style={{
                              background: isServicePending && pendingServices[service.id]?.price !== undefined ? "#1e1b4b" : "#020617",
                              border: isServicePending && pendingServices[service.id]?.price !== undefined ? "1px solid #818cf8" : "1px solid #334155",
                              color: "#10b981",
                              fontWeight: 700,
                              padding: "6px 10px",
                              borderRadius: "6px",
                              width: "80px",
                              fontSize: "0.85rem",
                              outline: "none",
                            }}
                          />
                        </div>
                      </td>
                      <td style={{ color: "#cbd5e1" }}>
                        {service.time}
                      </td>
                      <td style={{ color: "#94a3b8", fontSize: "0.82rem" }}>
                        {service.width || "—"}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                          <button
                            type="button"
                            onClick={() => setEditingService({ ...service })}
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
                            onClick={() => handleDeleteService(service.id)}
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
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

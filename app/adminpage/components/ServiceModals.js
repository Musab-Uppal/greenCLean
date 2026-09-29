"use client";

import React from "react";

export default function ServiceModals({
  showAddServiceModal,
  setShowAddServiceModal,
  serviceForm,
  setServiceForm,
  handleAddService,
  serviceActionLoading,
  editingService,
  setEditingService,
  handleStageServiceEdit,
  categories,
}) {
  return (
    <>
      {/* Add Service Modal */}
      {showAddServiceModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-window" style={{ maxWidth: "480px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px", color: "#f8fafc" }}>Add New Service / Product</h3>
            <form onSubmit={handleAddService} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label className="admin-form-label">Service Name *</label>
                <input
                  type="text"
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="e.g. Deluxe Carpet Deep Wash"
                  required
                  className="admin-form-input"
                  style={{ padding: "10px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="admin-form-label">Category *</label>
                  <select
                    value={serviceForm.category_id}
                    onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                    required
                    className="admin-form-input"
                    style={{ padding: "10px" }}
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="admin-form-label">Price (£) *</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="e.g. 120"
                    required
                    className="admin-form-input"
                    style={{ padding: "10px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="admin-form-label">Estimated Time *</label>
                  <input
                    type="text"
                    value={serviceForm.time}
                    onChange={(e) => setServiceForm({ ...serviceForm, time: e.target.value })}
                    placeholder="e.g. 1h 30m"
                    required
                    className="admin-form-input"
                    style={{ padding: "10px" }}
                  />
                </div>

                <div>
                  <label className="admin-form-label">Scope / Dimensions</label>
                  <input
                    type="text"
                    value={serviceForm.width}
                    onChange={(e) => setServiceForm({ ...serviceForm, width: e.target.value })}
                    placeholder="e.g. 15-25 sq.m"
                    className="admin-form-input"
                    style={{ padding: "10px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "16px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddServiceModal(false)}
                  style={{
                    background: "transparent",
                    border: "1px solid #475569",
                    color: "#cbd5e1",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={serviceActionLoading}
                  style={{
                    background: "#10b981",
                    border: "none",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {serviceActionLoading ? "Adding..." : "Add Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-window" style={{ maxWidth: "480px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px", color: "#f8fafc" }}>Edit Service #{editingService.id}</h3>
            <form onSubmit={handleStageServiceEdit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label className="admin-form-label">Service Name</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  required
                  className="admin-form-input"
                  style={{ padding: "10px" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="admin-form-label">Category</label>
                  <select
                    value={editingService.category_id}
                    onChange={(e) => setEditingService({ ...editingService, category_id: e.target.value })}
                    required
                    className="admin-form-input"
                    style={{ padding: "10px" }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="admin-form-label">Price (£)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={editingService.price ?? ""}
                    onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                    required
                    className="admin-form-input"
                    style={{ padding: "10px" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label className="admin-form-label">Estimated Time</label>
                  <input
                    type="text"
                    value={editingService.time}
                    onChange={(e) => setEditingService({ ...editingService, time: e.target.value })}
                    required
                    className="admin-form-input"
                    style={{ padding: "10px" }}
                  />
                </div>

                <div>
                  <label className="admin-form-label">Scope / Dimensions</label>
                  <input
                    type="text"
                    value={editingService.width || ""}
                    onChange={(e) => setEditingService({ ...editingService, width: e.target.value })}
                    className="admin-form-input"
                    style={{ padding: "10px" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginTop: "16px" }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginRight: "auto" }}>
                  Staged changes must be saved in header.
                </span>
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  style={{
                    background: "transparent",
                    border: "1px solid #475569",
                    color: "#cbd5e1",
                    padding: "8px 14px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: "linear-gradient(135deg, #059669, #10b981)",
                    border: "none",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

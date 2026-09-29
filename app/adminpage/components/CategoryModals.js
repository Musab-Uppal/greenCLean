"use client";

import React from "react";

export default function CategoryModals({
  showAddCategoryModal,
  setShowAddCategoryModal,
  newCatName,
  setNewCatName,
  newCatImage,
  setNewCatImage,
  handleAddCategory,
  catActionLoading,
  editingCategory,
  setEditingCategory,
  handleStageCategoryEdit,
  handleCategoryFileUpload,
  uploadingImage,
  CATEGORY_IMAGE_PRESETS,
}) {
  return (
    <>
      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-window" style={{ maxWidth: "420px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px", color: "#f8fafc" }}>Create New Category</h3>
            <form onSubmit={handleAddCategory} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="admin-form-label">Category Name *</label>
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Steam Sanitization"
                  required
                  className="admin-form-input"
                  style={{ padding: "10px" }}
                />
              </div>

              {/* Category Image Selector via File Upload */}
              <div>
                <label className="admin-form-label">Category Picture *</label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: "rgba(2, 6, 23, 0.6)",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px dashed #334155",
                  marginBottom: "10px",
                }}>
                  <img
                    src={newCatImage || "/services/oven.jpg"}
                    alt="Preview"
                    style={{
                      width: "64px",
                      height: "64px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #10b981",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: uploadingImage ? "#334155" : "linear-gradient(135deg, #059669, #10b981)",
                      color: "#ffffff",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: uploadingImage ? "not-allowed" : "pointer",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{uploadingImage ? "Uploading..." : "Upload Image File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleCategoryFileUpload(e.target.files[0], false);
                          }
                        }}
                        style={{ display: "none" }}
                      />
                    </label>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "#64748b", marginTop: "4px" }}>
                      PNG, JPG, WEBP from your device
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block", marginBottom: "6px" }}>
                  Or choose from existing pictures:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {CATEGORY_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setNewCatImage(preset.path)}
                      style={{
                        background: newCatImage === preset.path ? "rgba(16, 185, 129, 0.25)" : "#020617",
                        border: `1px solid ${newCatImage === preset.path ? "#10b981" : "#334155"}`,
                        color: newCatImage === preset.path ? "#34d399" : "#94a3b8",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" }}>
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
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
                  disabled={catActionLoading}
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
                  {catActionLoading ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal-window" style={{ maxWidth: "420px", padding: "24px" }}>
            <h3 style={{ margin: "0 0 16px", color: "#f8fafc" }}>Edit Category #{editingCategory.id}</h3>
            <form onSubmit={handleStageCategoryEdit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label className="admin-form-label">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                  className="admin-form-input"
                  style={{ padding: "10px" }}
                />
              </div>

              {/* Edit Category Image via File Upload */}
              <div>
                <label className="admin-form-label">Category Picture</label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  background: "rgba(2, 6, 23, 0.6)",
                  padding: "12px",
                  borderRadius: "8px",
                  border: "1px dashed #334155",
                  marginBottom: "10px",
                }}>
                  <img
                    src={editingCategory.image || "/services/oven.jpg"}
                    alt="Preview"
                    style={{
                      width: "64px",
                      height: "64px",
                      objectFit: "cover",
                      borderRadius: "8px",
                      border: "2px solid #10b981",
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <label style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: uploadingImage ? "#334155" : "linear-gradient(135deg, #059669, #10b981)",
                      color: "#ffffff",
                      padding: "8px 14px",
                      borderRadius: "6px",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      cursor: uploadingImage ? "not-allowed" : "pointer",
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>{uploadingImage ? "Uploading..." : "Change Image File"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={uploadingImage}
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleCategoryFileUpload(e.target.files[0], true);
                          }
                        }}
                        style={{ display: "none" }}
                      />
                    </label>
                    <span style={{ display: "block", fontSize: "0.72rem", color: "#64748b", marginTop: "4px" }}>
                      Upload new photo from device
                    </span>
                  </div>
                </div>

                <span style={{ fontSize: "0.72rem", color: "#64748b", display: "block", marginBottom: "6px" }}>
                  Or choose from existing pictures:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {CATEGORY_IMAGE_PRESETS.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setEditingCategory({ ...editingCategory, image: preset.path })}
                      style={{
                        background: editingCategory.image === preset.path ? "rgba(16, 185, 129, 0.25)" : "#020617",
                        border: `1px solid ${editingCategory.image === preset.path ? "#10b981" : "#334155"}`,
                        color: editingCategory.image === preset.path ? "#34d399" : "#94a3b8",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px", marginTop: "14px" }}>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", marginRight: "auto" }}>
                  Staged changes must be saved in header.
                </span>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
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

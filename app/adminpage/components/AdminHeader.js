"use client";

import React from "react";

export default function AdminHeader({
  adminUsername,
  activeTab,
  setActiveTab,
  ordersCount,
  categoriesCount,
  servicesCount,
  handleSaveChanges,
  savingChanges,
  totalPendingCount,
  fetchAdminData,
  dataLoading,
  handleLogout,
}) {
  return (
    <header className="admin-header">
      <div className="admin-header-inner">
        {/* Branding & Status */}
        <div className="admin-brand">
          <div className="admin-brand-logo">
            GC
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#f8fafc" }}>GreenClean Admin</span>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>Admin: {adminUsername}</span>
          </div>
        </div>

        {/* DASHBOARD SELECTOR TABS IN HEADER */}
        <nav className="admin-nav-tabs">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`admin-nav-tab ${activeTab === "orders" ? "active" : ""}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Orders ({ordersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("categories")}
            className={`admin-nav-tab ${activeTab === "categories" ? "active" : ""}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Categories ({categoriesCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("services")}
            className={`admin-nav-tab ${activeTab === "services" ? "active" : ""}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Services & Products ({servicesCount})</span>
          </button>
        </nav>

        {/* Right: Save Changes, Refresh & Logout */}
        <div className="admin-header-actions">
          {/* MASTER SAVE CHANGES BUTTON IN HEADER */}
          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={savingChanges || totalPendingCount === 0}
            title={totalPendingCount > 0 ? "Click to save all pending changes to database" : "No unsaved changes"}
            className={`admin-save-changes-btn ${totalPendingCount > 0 ? "has-pending" : "no-pending"}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>
              {savingChanges
                ? "Saving Changes..."
                : totalPendingCount > 0
                  ? `Save Changes (${totalPendingCount})`
                  : "Save Changes"}
            </span>
          </button>

          <button
            type="button"
            onClick={fetchAdminData}
            title="Refresh Data from Server"
            disabled={dataLoading}
            className="admin-refresh-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            <span>{dataLoading ? "Updating..." : "Refresh"}</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="admin-exit-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Exit Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}

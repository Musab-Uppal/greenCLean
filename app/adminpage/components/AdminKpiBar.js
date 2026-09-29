"use client";

import React from "react";

export default function AdminKpiBar({ computedKpis }) {
  return (
    <div className="admin-kpi-bar">
      {/* 1. Total Orders */}
      <div className="admin-kpi-card">
        <span className="admin-kpi-title" style={{ color: "#818cf8" }}>
          Total Orders
        </span>
        <div className="admin-kpi-num" style={{ color: "#a5b4fc" }}>
          {computedKpis.totalOrders}
        </div>
      </div>

      {/* 2. Total Revenue */}
      <div className="admin-kpi-card">
        <span className="admin-kpi-title" style={{ color: "#34d399" }}>
          Total Order Revenue
        </span>
        <div className="admin-kpi-num" style={{ color: "#10b981" }}>
          £{computedKpis.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      </div>

      {/* 3. Pending Orders */}
      <div className="admin-kpi-card">
        <span className="admin-kpi-title" style={{ color: "#fbbf24" }}>
          Pending Action
        </span>
        <div className="admin-kpi-num" style={{ color: "#fbbf24" }}>
          {computedKpis.pendingCount}
        </div>
      </div>

      {/* 4. Completed Jobs */}
      <div className="admin-kpi-card">
        <span className="admin-kpi-title" style={{ color: "#34d399" }}>
          Completed Jobs
        </span>
        <div className="admin-kpi-num" style={{ color: "#34d399" }}>
          {computedKpis.completedCount}
        </div>
      </div>
    </div>
  );
}

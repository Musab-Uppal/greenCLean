"use client";

import React, { useState, useMemo } from "react";
import { formatUkDate, getUkDateString, getUkTomorrowDateString } from "@/lib/dateUtils";

export default function LeaveTab({
  blockedDates = [],
  onAddBlockedDate,
  onDeleteBlockedDate,
  loading = false,
}) {
  const [mode, setMode] = useState("single"); // single | range
  const [singleDate, setSingleDate] = useState(() => getUkTomorrowDateString());
  const [startDate, setStartDate] = useState(() => getUkTomorrowDateString());
  const [endDate, setEndDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return getUkDateString(d);
  });
  const [reason, setReason] = useState("Annual Leave");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("upcoming"); // upcoming | all | past
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const todayStr = useMemo(() => getUkDateString(new Date()), []);

  const COMMON_REASONS = [
    "Annual Leave",
    "Holiday",
    "Personal Day",
    "Equipment Maintenance",
    "Fully Booked",
    "Bank Holiday",
  ];

  // Presets for quick leave booking
  const applyPreset = (presetType) => {
    const base = new Date();
    if (presetType === "tomorrow") {
      setMode("single");
      base.setDate(base.getDate() + 1);
      setSingleDate(getUkDateString(base));
    } else if (presetType === "weekend") {
      setMode("range");
      // Find upcoming Saturday
      const dayOfWeek = base.getDay(); // 0 is Sun, 6 is Sat
      const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;
      const sat = new Date(base);
      sat.setDate(base.getDate() + daysUntilSat);
      const sun = new Date(sat);
      sun.setDate(sat.getDate() + 1);

      setStartDate(getUkDateString(sat));
      setEndDate(getUkDateString(sun));
      setReason("Weekend Off");
    } else if (presetType === "week") {
      setMode("range");
      const nextDay = new Date(base);
      nextDay.setDate(base.getDate() + 1);
      const nextWeek = new Date(base);
      nextWeek.setDate(base.getDate() + 7);

      setStartDate(getUkDateString(nextDay));
      setEndDate(getUkDateString(nextWeek));
      setReason("Annual Leave (1 Week)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (mode === "single") {
      if (!singleDate) {
        setFormError("Please select a date to block.");
        return;
      }
      setSubmitting(true);
      try {
        await onAddBlockedDate({ date: singleDate, reason });
      } catch (err) {
        setFormError(err.message || "Failed to block date.");
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!startDate || !endDate) {
        setFormError("Both start and end dates are required.");
        return;
      }
      if (startDate > endDate) {
        setFormError("Start date cannot be after end date.");
        return;
      }
      setSubmitting(true);
      try {
        await onAddBlockedDate({ startDate, endDate, reason });
      } catch (err) {
        setFormError(err.message || "Failed to block date range.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const processedList = useMemo(() => {
    return blockedDates
      .map((item) => {
        const isPast = item.date < todayStr;
        const isToday = item.date === todayStr;
        return {
          ...item,
          isPast,
          isToday,
          isUpcoming: item.date >= todayStr,
        };
      })
      .filter((item) => {
        const matchesSearch =
          item.date.includes(searchTerm) ||
          (item.reason && item.reason.toLowerCase().includes(searchTerm.toLowerCase()));

        if (filter === "upcoming") return matchesSearch && item.isUpcoming;
        if (filter === "past") return matchesSearch && item.isPast;
        return matchesSearch;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [blockedDates, todayStr, searchTerm, filter]);

  const upcomingCount = blockedDates.filter((d) => d.date >= todayStr).length;
  const nextLeave = blockedDates
    .filter((d) => d.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <div className="admin-section-card">
      {/* Header */}
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Admin Leave &amp; Booking Blackout Dates</h2>
          <p className="admin-section-subtitle">
            Block specific days or full date ranges when you are on leave or unavailable. These dates will automatically be disabled on the customer booking calendar.
          </p>
        </div>
      </div>

      {/* Mini KPIs Bar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          marginBottom: "24px",
        }}
      >
        <div className="admin-kpi-card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
            Upcoming Leave Days
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "6px" }}>
            <span style={{ fontSize: "1.7rem", fontWeight: 800, color: upcomingCount > 0 ? "#f59e0b" : "#10b981" }}>
              {upcomingCount}
            </span>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
              {upcomingCount === 1 ? "day scheduled" : "days scheduled"}
            </span>
          </div>
        </div>

        <div className="admin-kpi-card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
            Next Upcoming Leave
          </span>
          <div style={{ marginTop: "6px" }}>
            <span style={{ fontSize: "1.05rem", fontWeight: 700, color: nextLeave ? "#38bdf8" : "#94a3b8" }}>
              {nextLeave ? formatUkDate(nextLeave.date, true) : "None scheduled"}
            </span>
            {nextLeave?.reason && (
              <span style={{ display: "block", fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>
                {nextLeave.reason}
              </span>
            )}
          </div>
        </div>

        <div className="admin-kpi-card" style={{ padding: "16px 20px" }}>
          <span style={{ fontSize: "0.78rem", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>
            Total Blackout Records
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "6px" }}>
            <span style={{ fontSize: "1.7rem", fontWeight: 800, color: "#f8fafc" }}>
              {blockedDates.length}
            </span>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>total logged</span>
          </div>
        </div>
      </div>

      {/* Leave Scheduler Box */}
      <div
        style={{
          background: "linear-gradient(145deg, rgba(30,41,59,0.7) 0%, rgba(15,23,42,0.85) 100%)",
          border: "1px solid #334155",
          borderRadius: "14px",
          padding: "20px",
          marginBottom: "28px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                background: "rgba(16,185,129,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#10b981",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#f8fafc" }}>
                Schedule Leave / Block Dates
              </h3>
              <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                Select a single day or consecutive days to stop taking bookings.
              </span>
            </div>
          </div>

          {/* Quick Presets */}
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => applyPreset("tomorrow")}
              className="admin-filter-pill"
              style={{ padding: "4px 10px", fontSize: "0.75rem" }}
            >
              Block Tomorrow
            </button>
            <button
              type="button"
              onClick={() => applyPreset("weekend")}
              className="admin-filter-pill"
              style={{ padding: "4px 10px", fontSize: "0.75rem" }}
            >
              Block This Weekend
            </button>
            <button
              type="button"
              onClick={() => applyPreset("week")}
              className="admin-filter-pill"
              style={{ padding: "4px 10px", fontSize: "0.75rem" }}
            >
              Block Next 7 Days
            </button>
          </div>
        </div>

        {formError && (
          <div className="admin-login-alert" style={{ marginBottom: "14px", padding: "8px 12px", fontSize: "0.82rem" }}>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Mode Selector */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <button
              type="button"
              onClick={() => setMode("single")}
              style={{
                padding: "7px 16px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                border: mode === "single" ? "1px solid #10b981" : "1px solid #334155",
                background: mode === "single" ? "rgba(16,185,129,0.18)" : "#0f172a",
                color: mode === "single" ? "#34d399" : "#94a3b8",
                transition: "all 0.15s",
              }}
            >
              Single Date
            </button>
            <button
              type="button"
              onClick={() => setMode("range")}
              style={{
                padding: "7px 16px",
                borderRadius: "8px",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
                border: mode === "range" ? "1px solid #10b981" : "1px solid #334155",
                background: mode === "range" ? "rgba(16,185,129,0.18)" : "#0f172a",
                color: mode === "range" ? "#34d399" : "#94a3b8",
                transition: "all 0.15s",
              }}
            >
              Date Range (Multiple Days)
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: mode === "single" ? "1fr 1.5fr auto" : "1fr 1fr 1.5fr auto",
              gap: "12px",
              alignItems: "flex-end",
            }}
          >
            {mode === "single" ? (
              <div>
                <label className="admin-form-label" style={{ fontSize: "0.72rem", marginBottom: "4px" }}>
                  DATE TO BLOCK *
                </label>
                <input
                  type="date"
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="admin-form-input"
                  style={{ padding: "8px 10px", fontSize: "0.88rem" }}
                  required
                />
              </div>
            ) : (
              <>
                <div>
                  <label className="admin-form-label" style={{ fontSize: "0.72rem", marginBottom: "4px" }}>
                    FROM (START DATE) *
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="admin-form-input"
                    style={{ padding: "8px 10px", fontSize: "0.88rem" }}
                    required
                  />
                </div>
                <div>
                  <label className="admin-form-label" style={{ fontSize: "0.72rem", marginBottom: "4px" }}>
                    TO (END DATE) *
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="admin-form-input"
                    style={{ padding: "8px 10px", fontSize: "0.88rem" }}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="admin-form-label" style={{ fontSize: "0.72rem", marginBottom: "4px" }}>
                REASON / NOTE (OPTIONAL)
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Annual Leave, Holiday, Bank Holiday"
                className="admin-form-input"
                style={{ padding: "8px 10px", fontSize: "0.88rem" }}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={submitting || loading}
                className="admin-login-submit-btn"
                style={{
                  width: "auto",
                  margin: 0,
                  padding: "8px 20px",
                  fontSize: "0.88rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  whiteSpace: "nowrap",
                }}
              >
                {submitting ? "Blocking..." : "Block Selected Date(s)"}
              </button>
            </div>
          </div>

          {/* Quick reason suggestions */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Quick reasons:</span>
            {COMMON_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setReason(r)}
                style={{
                  background: reason === r ? "#059669" : "rgba(30,41,59,0.8)",
                  border: "1px solid #334155",
                  color: "#f8fafc",
                  fontSize: "0.7rem",
                  fontWeight: 600,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setFilter("upcoming")}
            className={`admin-filter-pill ${filter === "upcoming" ? "active" : ""}`}
          >
            Upcoming Leave ({upcomingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`admin-filter-pill ${filter === "all" ? "active" : ""}`}
          >
            All Dates ({blockedDates.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("past")}
            className={`admin-filter-pill ${filter === "past" ? "active" : ""}`}
          >
            Past Dates
          </button>
        </div>

        <div style={{ position: "relative", minWidth: "240px" }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dates or reasons..."
            className="admin-search-input"
            style={{ width: "100%", padding: "7px 12px 7px 32px", fontSize: "0.82rem" }}
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
            style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
      </div>

      {/* Blocked Dates Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: "220px" }}>Blocked Date</th>
              <th style={{ width: "130px" }}>Status</th>
              <th>Reason / Purpose</th>
              <th style={{ width: "150px" }}>Added On</th>
              <th style={{ width: "110px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedList.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "48px 16px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#94a3b8" }}>
                      No blocked dates found
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {filter === "upcoming"
                        ? "You have no upcoming leave scheduled. All dates are currently open for customer bookings."
                        : "No blackout dates match your search filter."}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              processedList.map((item) => {
                return (
                  <tr key={item.id || item.date}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "8px",
                            background: item.isPast ? "rgba(100,116,139,0.15)" : "rgba(239,68,68,0.15)",
                            color: item.isPast ? "#94a3b8" : "#f87171",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: 800,
                            lineHeight: 1,
                          }}
                        >
                          <span style={{ fontSize: "0.62rem", textTransform: "uppercase" }}>
                            {new Date(item.date).toLocaleDateString("en-GB", { weekday: "short" })}
                          </span>
                          <span style={{ fontSize: "0.95rem" }}>
                            {item.date.split("-")[2]}
                          </span>
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#f8fafc", fontSize: "0.88rem" }}>
                            {formatUkDate(item.date, true)}
                          </div>
                          <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "monospace" }}>
                            {item.date}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      {item.isToday ? (
                        <span
                          style={{
                            background: "rgba(239,68,68,0.2)",
                            color: "#f87171",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          Today (Blocked)
                        </span>
                      ) : item.isPast ? (
                        <span
                          style={{
                            background: "rgba(100,116,139,0.2)",
                            color: "#94a3b8",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                          }}
                        >
                          Past
                        </span>
                      ) : (
                        <span
                          style={{
                            background: "rgba(245,158,11,0.18)",
                            color: "#fbbf24",
                            padding: "3px 8px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                          }}
                        >
                          Upcoming Leave
                        </span>
                      )}
                    </td>

                    <td>
                      <span
                        style={{
                          background: "rgba(30,41,59,0.8)",
                          border: "1px solid #334155",
                          color: "#e2e8f0",
                          padding: "3px 10px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          fontWeight: 500,
                        }}
                      >
                        {item.reason || "Leave / Unavailable"}
                      </span>
                    </td>

                    <td style={{ fontSize: "0.8rem", color: "#64748b" }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString("en-GB") : "—"}
                    </td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        type="button"
                        onClick={() => onDeleteBlockedDate(item.id, item.date)}
                        title="Unblock this date and make available for customer bookings"
                        style={{
                          background: "rgba(239,68,68,0.12)",
                          border: "1px solid rgba(239,68,68,0.3)",
                          color: "#f87171",
                          borderRadius: "6px",
                          padding: "5px 10px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#dc2626";
                          e.currentTarget.style.color = "#ffffff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(239,68,68,0.12)";
                          e.currentTarget.style.color = "#f87171";
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        <span>Unblock</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

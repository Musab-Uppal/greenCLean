"use client";

import React from "react";
import { UK_TIME_SLOTS, getUkDateString, getUkTomorrowDateString } from "@/lib/dateUtils";

export default function RescheduleOrderModal({
  rescheduleOrder,
  setRescheduleOrder,
  rescheduleDate,
  setRescheduleDate,
  rescheduleTimeSlot,
  setRescheduleTimeSlot,
  rescheduleCustomTime,
  setRescheduleCustomTime,
  isCustomTime,
  setIsCustomTime,
  rescheduleSaving,
  handleSaveReschedule,
}) {
  if (!rescheduleOrder) return null;

  return (
    <div className="admin-modal-backdrop">
      <div className="admin-modal-window" style={{ maxWidth: "520px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(56, 189, 248, 0.15)",
              border: "1px solid rgba(56, 189, 248, 0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#38bdf8"
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 700, color: "#f8fafc" }}>
                Reschedule Order #{rescheduleOrder.order_id}
              </h3>
              <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                Change arrival time window for pending order
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRescheduleOrder(null)}
            style={{
              background: "transparent",
              border: "none",
              color: "#64748b",
              cursor: "pointer",
              padding: "4px",
              borderRadius: "6px"
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Order Info Card */}
        <div style={{
          background: "rgba(2, 6, 23, 0.7)",
          border: "1px solid #1e293b",
          borderRadius: "10px",
          padding: "12px 14px",
          marginBottom: "18px",
          fontSize: "0.82rem",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "10px"
        }}>
          <div>
            <span style={{ color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", display: "block", fontWeight: 600 }}>Customer</span>
            <div style={{ color: "#e2e8f0", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {rescheduleOrder.customer_email || "Customer"}
            </div>
            <div style={{ color: "#10b981", fontSize: "0.75rem", marginTop: "2px" }}>
              📞 {rescheduleOrder.order_phone || "—"}
            </div>
          </div>
          <div>
            <span style={{ color: "#64748b", fontSize: "0.72rem", textTransform: "uppercase", display: "block", fontWeight: 600 }}>Service</span>
            <div style={{ color: "#e2e8f0", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {rescheduleOrder.service_name}
            </div>
            <div style={{ color: "#fbbf24", fontSize: "0.75rem", fontWeight: 700, marginTop: "2px" }}>
              ● Status: Pending
            </div>
          </div>
        </div>

        {/* Date Input */}
        <div style={{ marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <label style={{ fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8" }}>
              Appointment Date (Liverpool, UK)
            </label>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setRescheduleDate(getUkDateString())}
                style={{
                  background: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid #334155",
                  color: "#cbd5e1",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  cursor: "pointer"
                }}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setRescheduleDate(getUkTomorrowDateString())}
                style={{
                  background: "rgba(30, 41, 59, 0.8)",
                  border: "1px solid #334155",
                  color: "#cbd5e1",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  cursor: "pointer"
                }}
              >
                Tomorrow
              </button>
            </div>
          </div>
          <input
            type="date"
            value={rescheduleDate}
            onChange={(e) => setRescheduleDate(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 12px",
              background: "#020617",
              border: "1px solid #334155",
              borderRadius: "8px",
              color: "#f8fafc",
              fontSize: "0.9rem",
              outline: "none",
              boxSizing: "border-box"
            }}
          />
        </div>

        {/* Arrival Window (Time Slot) */}
        <div style={{ marginBottom: "22px" }}>
          <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#94a3b8", marginBottom: "8px" }}>
            Select Arrival Time Window
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
            {UK_TIME_SLOTS.map((slot) => {
              const isSelected = !isCustomTime && rescheduleTimeSlot === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setRescheduleTimeSlot(slot);
                    setIsCustomTime(false);
                  }}
                  style={{
                    padding: "10px 12px",
                    borderRadius: "8px",
                    border: isSelected ? "1.5px solid #38bdf8" : "1px solid #334155",
                    background: isSelected ? "rgba(14, 165, 233, 0.15)" : "#020617",
                    color: isSelected ? "#38bdf8" : "#cbd5e1",
                    fontSize: "0.82rem",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    transition: "all 0.15s ease"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{slot}</span>
                </button>
              );
            })}
          </div>

          {/* Custom Time Option */}
          <div>
            <button
              type="button"
              onClick={() => setIsCustomTime(!isCustomTime)}
              style={{
                background: "transparent",
                border: "none",
                color: isCustomTime ? "#38bdf8" : "#94a3b8",
                fontSize: "0.78rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 0"
              }}
            >
              <span>{isCustomTime ? "▼ Custom Time Window Active" : "+ Enter Custom Arrival Window"}</span>
            </button>
            {isCustomTime && (
              <input
                type="text"
                value={rescheduleCustomTime}
                onChange={(e) => setRescheduleCustomTime(e.target.value)}
                placeholder="e.g. 08:30 – 10:30 or 16:00 – 18:00"
                style={{
                  width: "100%",
                  marginTop: "6px",
                  padding: "8px 12px",
                  background: "#020617",
                  border: "1px solid #38bdf8",
                  borderRadius: "8px",
                  color: "#f8fafc",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          paddingTop: "16px",
          borderTop: "1px solid #1e293b",
          flexWrap: "wrap"
        }}>
          <button
            type="button"
            onClick={() => setRescheduleOrder(null)}
            disabled={rescheduleSaving}
            style={{
              background: "transparent",
              border: "1px solid #475569",
              color: "#cbd5e1",
              padding: "9px 16px",
              borderRadius: "8px",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveReschedule}
            disabled={rescheduleSaving}
            title="Save scheduled arrival time directly to database"
            style={{
              background: "linear-gradient(135deg, #0284c7, #38bdf8)",
              border: "none",
              color: "#ffffff",
              padding: "9px 18px",
              borderRadius: "8px",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: rescheduleSaving ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(56, 189, 248, 0.4)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            <span>{rescheduleSaving ? "Saving to Database..." : "Save Changes"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

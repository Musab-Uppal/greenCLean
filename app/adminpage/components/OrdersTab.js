"use client";

import React from "react";
import { UK_TIME_SLOTS } from "@/lib/dateUtils";

export default function OrdersTab({
  orders,
  orderStatusFilter,
  setOrderStatusFilter,
  orderSearch,
  setOrderSearch,
  filteredOrders,
  computedKpis,
  pendingOrders,
  handleStageOrderStatus,
  handleStageOrderScheduleTime,
  handleOpenRescheduleModal,
  parseOrderDateTime,
}) {
  return (
    <section>
      {/* Header & Controls */}
      <div className="admin-section-card">
        <div className="admin-section-header">
          <div>
            <h2 className="admin-section-title">Orders Dashboard</h2>
            <p className="admin-section-subtitle">
              Manage customer service requests, schedules, and fulfillment statuses.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {/* Status filter */}
            <select
              value={orderStatusFilter}
              onChange={(e) => setOrderStatusFilter(e.target.value)}
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
              <option value="all">All Statuses ({orders.length})</option>
              <option value="pending">Pending ({computedKpis.pendingCount})</option>
              <option value="completed">Completed ({computedKpis.completedCount})</option>
            </select>

            {/* Search box */}
            <input
              type="text"
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              placeholder="Search order ID, email, phone..."
              style={{
                background: "#020617",
                border: "1px solid #334155",
                color: "#f8fafc",
                padding: "8px 14px",
                borderRadius: "8px",
                fontSize: "0.85rem",
                minWidth: "240px",
              }}
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Service</th>
                <th>Customer Contact</th>
                <th>Price</th>
                <th>Payment</th>
                <th>Scheduled Date & Time</th>
                <th>Service Address</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Update Status & Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} style={{ padding: "36px", textAlign: "center", color: "#64748b" }}>
                    No orders found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const currentStatus = (pendingOrders[order.order_id]?.status || order.status || "pending").toLowerCase();
                  const isPending = currentStatus === "pending";
                  const parsedSchedule = parseOrderDateTime(order.scheduled_date);

                  const statusColors = {
                    pending: { bg: "rgba(245, 158, 11, 0.15)", text: "#fbbf24", border: "rgba(245, 158, 11, 0.3)" },
                    completed: { bg: "rgba(16, 185, 129, 0.15)", text: "#34d399", border: "rgba(16, 185, 129, 0.3)" },
                  };
                  const sc = statusColors[currentStatus] || statusColors.pending;

                  const isOrderPending = Boolean(pendingOrders[order.order_id]);
                  const isTimeChanged = Boolean(pendingOrders[order.order_id]?.scheduled_date);
                  const isStatusChanged = Boolean(pendingOrders[order.order_id]?.status);

                  return (
                    <tr
                      key={order.order_id}
                      className={isOrderPending ? "row-pending-stage" : ""}
                    >
                      <td style={{ fontWeight: 700, color: "#e2e8f0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>#{order.order_id}</span>
                          {isOrderPending && (
                            <span className="admin-tag-unsaved">
                              Unsaved
                            </span>
                          )}
                        </div>
                      </td>
                      <td style={{ maxWidth: "260px" }}>
                        {Array.isArray(order.items) && order.items.length > 1 ? (
                          <div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                              <span style={{ fontWeight: 700, color: "#f8fafc" }}>
                                {order.items.length} Services Booked
                              </span>
                              <span style={{
                                fontSize: "0.68rem",
                                background: "rgba(16, 185, 129, 0.15)",
                                color: "#34d399",
                                padding: "1px 6px",
                                borderRadius: "99px",
                                border: "1px solid rgba(16, 185, 129, 0.3)",
                              }}>
                                Multi-Service
                              </span>
                            </div>
                            <div style={{ fontSize: "0.76rem", color: "#94a3b8", lineHeight: 1.4 }}>
                              {order.items.map((it) => it.service_name).join(" · ")}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontWeight: 600, color: "#f8fafc" }}>{order.service_name}</div>
                            <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{order.category_name}</span>
                          </div>
                        )}
                      </td>
                      <td>
                        <div style={{ color: "#f8fafc" }}>{order.customer_email}</div>
                        <div style={{ fontSize: "0.78rem", color: "#10b981", fontWeight: 600 }}>
                          📞 {order.order_phone}
                        </div>
                      </td>
                      <td style={{ fontWeight: 700, color: "#10b981", fontSize: "0.95rem" }}>
                        £{Number(order.total_amount ?? order.service_price ?? 0).toFixed(2)}
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                          <span style={{
                            fontSize: "0.72rem",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background: order.payment_method === "creditcard" ? "rgba(16, 185, 129, 0.15)" : "rgba(148, 163, 184, 0.15)",
                            color: order.payment_method === "creditcard" ? "#34d399" : "#cbd5e1",
                            border: `1px solid ${order.payment_method === "creditcard" ? "rgba(16, 185, 129, 0.3)" : "rgba(148, 163, 184, 0.3)"}`,
                            width: "fit-content",
                            whiteSpace: "nowrap",
                          }}>
                            {order.payment_method === "creditcard" ? "💳 Stripe Card" : "💵 Pay Locally"}
                          </span>
                          <span style={{
                            fontSize: "0.68rem",
                            fontWeight: 600,
                            color: order.payment_status === "paid" ? "#34d399" : "#fbbf24",
                          }}>
                            {order.payment_status === "paid" ? "● Paid Online" : "○ Pending Collection"}
                          </span>
                        </div>
                      </td>
                      <td style={{ minWidth: "210px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          {/* Date Line */}
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                            <span style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "5px",
                              padding: "3px 8px",
                              background: "rgba(15, 23, 42, 0.85)",
                              border: "1px solid #334155",
                              borderRadius: "6px",
                              fontSize: "0.78rem",
                              color: "#e2e8f0",
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                            }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                <line x1="16" y1="2" x2="16" y2="6" />
                                <line x1="8" y1="2" x2="8" y2="6" />
                                <line x1="3" y1="10" x2="21" y2="10" />
                              </svg>
                              <span>{parsedSchedule.date || "—"}</span>
                            </span>

                            {isTimeChanged && (
                              <span className="admin-tag-time-edited">
                                Time Edited
                              </span>
                            )}
                          </div>

                          {/* Arrival Time Slot Controls */}
                          {isPending ? (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
                                <select
                                  value={parsedSchedule.time}
                                  onChange={(e) => handleStageOrderScheduleTime(order.order_id, e.target.value)}
                                  title="Quickly change arrival time window for this pending order"
                                  style={{
                                    background: isTimeChanged ? "#082f49" : "#020617",
                                    border: isTimeChanged ? "1px solid #38bdf8" : "1px solid #334155",
                                    color: isTimeChanged ? "#7dd3fc" : "#38bdf8",
                                    padding: "4px 8px 4px 22px",
                                    borderRadius: "6px",
                                    fontSize: "0.78rem",
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    outline: "none",
                                  }}
                                >
                                  {UK_TIME_SLOTS.map((slot) => (
                                    <option key={slot} value={slot}>
                                      {slot}
                                    </option>
                                  ))}
                                  {!UK_TIME_SLOTS.includes(parsedSchedule.time) && parsedSchedule.time && (
                                    <option value={parsedSchedule.time}>
                                      {parsedSchedule.time} (Custom)
                                    </option>
                                  )}
                                </select>
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke={isTimeChanged ? "#38bdf8" : "#0ea5e9"}
                                  strokeWidth="2.2"
                                  style={{ position: "absolute", left: "6px", pointerEvents: "none" }}
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                              </div>

                              <button
                                type="button"
                                onClick={() => handleOpenRescheduleModal(order)}
                                title="Open detailed reschedule modal (date & time)"
                                style={{
                                  background: "rgba(56, 189, 248, 0.12)",
                                  border: "1px solid rgba(56, 189, 248, 0.35)",
                                  color: "#38bdf8",
                                  borderRadius: "6px",
                                  padding: "4px 7px",
                                  fontSize: "0.72rem",
                                  cursor: "pointer",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "3px",
                                  fontWeight: 600,
                                  transition: "all 0.15s ease",
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M12 20h9" />
                                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                                </svg>
                                <span>Edit</span>
                              </button>
                            </div>
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                              <span
                                title="Completed orders cannot be rescheduled. Set status to Pending first to change time."
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "4px",
                                  padding: "3px 8px",
                                  borderRadius: "6px",
                                  background: "rgba(51, 65, 85, 0.3)",
                                  border: "1px solid rgba(71, 85, 105, 0.4)",
                                  color: "#64748b",
                                  fontSize: "0.75rem",
                                  fontWeight: 600,
                                }}
                              >
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span>{parsedSchedule.time || "Completed (Locked)"}</span>
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ color: "#94a3b8", maxWidth: "220px", fontSize: "0.82rem" }}>
                        {order.address}
                      </td>
                      <td>
                        <span style={{
                          background: sc.bg,
                          color: sc.text,
                          border: `1px solid ${sc.border}`,
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textTransform: "capitalize",
                        }}>
                          {currentStatus}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
                          <select
                            value={currentStatus}
                            onChange={(e) => handleStageOrderStatus(order.order_id, e.target.value)}
                            title="Change Order Status"
                            style={{
                              background: isStatusChanged ? "#1e1b4b" : "#020617",
                              border: isStatusChanged ? "1px solid #818cf8" : "1px solid #334155",
                              color: "#f8fafc",
                              padding: "6px 8px",
                              borderRadius: "6px",
                              fontSize: "0.8rem",
                              fontWeight: 600,
                              cursor: "pointer",
                            }}
                          >
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                          </select>

                          {isPending ? (
                            <button
                              type="button"
                              onClick={() => handleOpenRescheduleModal(order)}
                              title="Change arrival time / date for this pending order"
                              style={{
                                background: "linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(2, 132, 199, 0.25))",
                                border: "1px solid rgba(56, 189, 248, 0.4)",
                                color: "#38bdf8",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                fontSize: "0.78rem",
                                fontWeight: 600,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                whiteSpace: "nowrap",
                                transition: "all 0.15s ease",
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <polyline points="12 6 12 12 16 14" />
                              </svg>
                              <span>Change Time</span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              title="Time cannot be changed for completed orders. Switch status to Pending first."
                              style={{
                                background: "rgba(15, 23, 42, 0.5)",
                                border: "1px solid #1e293b",
                                color: "#475569",
                                padding: "6px 10px",
                                borderRadius: "6px",
                                fontSize: "0.78rem",
                                fontWeight: 500,
                                cursor: "not-allowed",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                              </svg>
                              <span>Time Locked</span>
                            </button>
                          )}
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

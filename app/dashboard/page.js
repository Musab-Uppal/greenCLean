"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
  Calendar,
  ChevronRight,
  Sparkles,
  Pencil,
  X,
  Check,
  Ban,
  CreditCard,
} from "lucide-react";

import {
  UK_TIME_SLOTS,
  getUkDateString,
  getUkTomorrowDateString,
  normalizeTimeSlot,
  formatUkDate,
} from "@/lib/dateUtils";

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: Clock, color: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  completed: { label: "Completed", icon: CheckCircle2, color: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
};

const TIME_SLOTS = UK_TIME_SLOTS;

function isToday(dateStr) {
  if (!dateStr) return false;
  const datePart = dateStr.split(" ")[0];
  return datePart === getUkDateString();
}

function isPastDate(dateStr) {
  if (!dateStr) return false;
  const datePart = dateStr.split(" ")[0];
  return datePart < getUkDateString();
}

function extractDatePart(dateStr) {
  if (!dateStr) return "";
  const firstSpace = dateStr.indexOf(" ");
  return firstSpace !== -1 ? dateStr.slice(0, firstSpace) : dateStr;
}

function getMinScheduleDate() {
  return getUkTomorrowDateString();
}

function extractTimeSlot(dateStr) {
  if (!dateStr) return TIME_SLOTS[0];
  const firstSpace = dateStr.indexOf(" ");
  if (firstSpace === -1) return TIME_SLOTS[0];
  const rawAfter = dateStr.slice(firstSpace + 1).trim();
  return rawAfter.includes(" - ") || rawAfter.includes(" – ")
    ? normalizeTimeSlot(rawAfter)
    : TIME_SLOTS[0];
}

function formatDateOnly(dateStr) {
  return formatUkDate(dateStr, false);
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const firstSpace = dateStr.indexOf(" ");
  const datePart = firstSpace !== -1 ? dateStr.slice(0, firstSpace) : dateStr;
  const rawAfter = firstSpace !== -1 ? dateStr.slice(firstSpace + 1).trim() : "";
  const timePart = rawAfter.includes(" - ") || rawAfter.includes(" – ")
    ? normalizeTimeSlot(rawAfter)
    : "";
  const formattedDate = formatUkDate(datePart, false);
  return timePart ? `${formattedDate}, ${timePart}` : formattedDate;
}

function OrderCard({ order, onSaved }) {
  const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = status.icon;

  const isCompleted = order.status === "completed";
  const bookedToday = isToday(order.scheduled_date);
  const pastDate    = isPastDate(order.scheduled_date);
  const canEdit     = !isCompleted && !bookedToday && !pastDate;

  const [editing, setEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => extractDatePart(order.scheduled_date || order.created_at));
  const [selectedTime, setSelectedTime] = useState(() => extractTimeSlot(order.scheduled_date));
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState(null);

  useEffect(() => {
    setSelectedDate(extractDatePart(order.scheduled_date || order.created_at));
    setSelectedTime(extractTimeSlot(order.scheduled_date));
  }, [order.scheduled_date, order.created_at]);

  const handleSave = async () => {
    setSaving(true);
    setSaveErr(null);
    try {
      const res = await fetch(`/api/dashboard/orders/${order.order_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, time: selectedTime }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save");
      setEditing(false);
      onSaved({ ...order, scheduled_date: data.scheduled_date });
    } catch (err) {
      setSaveErr(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedDate(extractDatePart(order.scheduled_date || order.created_at));
    setSelectedTime(extractTimeSlot(order.scheduled_date));
    setSaveErr(null);
    setEditing(false);
  };


  return (
    <div
      style={{
        background: "#fff",
        border: `1.5px solid ${editing ? "#6ee7b7" : "#e2e8f0"}`,
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        boxShadow: editing ? "0 8px 28px rgba(47,184,167,0.12)" : "0 2px 12px rgba(15,23,42,0.05)",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.2s",
      }}
      onMouseEnter={(e) => { if (!editing) { e.currentTarget.style.borderColor = "#6ee7b7"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(47,184,167,0.12)"; e.currentTarget.style.transform = "translateY(-2px)"; } }}
      onMouseLeave={(e) => { if (!editing) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "0 2px 12px rgba(15,23,42,0.05)"; e.currentTarget.style.transform = "translateY(0)"; } }}
    >
      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "linear-gradient(135deg, #059669, #2fb8a7)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Package size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: "700", fontSize: "1rem", color: "#0f172a" }}>
              {Array.isArray(order.items) && order.items.length > 1
                ? `${order.items.length} Services Booked`
                : (order.service_name || "Eco Cleaning Service")}
            </div>
            <div style={{ fontSize: "0.78rem", color: "#64748b", marginTop: "2px" }}>
              Order #{order.order_id} · {order.category_name}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          {/* Status badge */}
          <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "99px", background: status.bg, color: status.color, border: `1px solid ${status.border}`, fontSize: "0.75rem", fontWeight: "700", flexShrink: 0 }}>
            <StatusIcon size={12} />
            {status.label}
          </span>

          {/* Edit / lock action */}
          {isCompleted ? null : bookedToday ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "99px", background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0", fontSize: "0.72rem", fontWeight: "700", flexShrink: 0 }}>
              <Ban size={11} />
              Can&apos;t change today&apos;s order
            </span>
          ) : pastDate ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "99px", background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0", fontSize: "0.72rem", fontWeight: "700", flexShrink: 0 }}>
              <Ban size={11} />
              Service date has passed
            </span>
          ) : !editing ? (

            <button
              onClick={() => setEditing(true)}
              style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "99px", background: "#eff6ff", color: "#2563eb", border: "1px solid #93c5fd", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer", flexShrink: 0 }}
            >
              <Calendar size={11} />
              Reschedule
            </button>
          ) : (
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "99px", background: "#ecfdf5", color: "#059669", border: "1px solid #6ee7b7", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}
              >
                <Check size={11} />
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                onClick={handleCancel}
                disabled={saving}
                style={{ display: "inline-flex", alignItems: "center", gap: "5px", padding: "5px 12px", borderRadius: "99px", background: "#f8fafc", color: "#64748b", border: "1px solid #e2e8f0", fontSize: "0.72rem", fontWeight: "700", cursor: "pointer" }}
              >
                <X size={11} />
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Itemized Services Breakdown if multiple */}
      {Array.isArray(order.items) && order.items.length > 1 && (
        <div style={{
          background: "#f8fafc",
          borderRadius: "10px",
          padding: "10px 14px",
          border: "1px solid #f1f5f9",
          display: "flex",
          flexDirection: "column",
          gap: "6px"
        }}>
          <div style={{ fontSize: "0.7rem", fontWeight: "700", textTransform: "uppercase", color: "#94a3b8" }}>
            Included Services ({order.items.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {order.items.map((it, idx) => (
              <span key={idx} style={{
                fontSize: "0.78rem",
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                padding: "3px 8px",
                borderRadius: "6px",
                color: "#334155"
              }}>
                {it.service_name} (£{Number(it.price).toFixed(2)})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {saveErr && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 14px", borderRadius: "10px", background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626", fontSize: "0.82rem", fontWeight: "600" }}>
          <AlertCircle size={14} />
          {saveErr}
        </div>
      )}

      {/* Details grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>

        {/* Address (Read-only) */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <MapPin size={14} color="#94a3b8" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</div>
            <div style={{ fontSize: "0.85rem", color: "#334155", fontWeight: "500", marginTop: "2px" }}>{order.address || "—"}</div>
          </div>
        </div>

        {/* Phone (Read-only) */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <Phone size={14} color="#94a3b8" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</div>
            <div style={{ fontSize: "0.85rem", color: "#334155", fontWeight: "500", marginTop: "2px" }}>{order.order_phone || "—"}</div>
          </div>
        </div>

        {/* Appointment date & time (Date & time are editable, address & phone are not) */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <Calendar size={14} color={editing ? "#059669" : "#94a3b8"} style={{ marginTop: editing ? "3px" : "2px", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.7rem", color: editing ? "#059669" : "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Booked For
            </div>
            {editing ? (
              <div style={{ marginTop: "6px", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", marginBottom: "3px" }}>Date</div>
                  <input
                    type="date"
                    min={getMinScheduleDate()}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{
                      width: "100%",
                      maxWidth: "180px",
                      padding: "5px 8px",
                      borderRadius: "8px",
                      border: "1.5px solid #6ee7b7",
                      fontSize: "0.82rem",
                      color: "#0f172a",
                      background: "#fff",
                      outline: "none",
                      fontWeight: "600",
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontSize: "0.68rem", color: "#64748b", fontWeight: "600", marginBottom: "3px" }}>Arrival Window</div>
                  <div style={{ position: "relative", display: "inline-block", width: "100%", maxWidth: "180px" }}>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "5px 26px 5px 8px",
                        borderRadius: "8px",
                        border: "1.5px solid #6ee7b7",
                        fontSize: "0.82rem",
                        color: "#0f172a",
                        background: "#fff",
                        outline: "none",
                        cursor: "pointer",
                        fontWeight: "600",
                        appearance: "none",
                      }}
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                      {!TIME_SLOTS.includes(selectedTime) && (
                        <option value={selectedTime}>{selectedTime}</option>
                      )}
                    </select>
                    <Clock size={12} color="#059669" style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ fontSize: "0.85rem", color: "#334155", fontWeight: "500", marginTop: "2px" }}>
                {formatDate(order.scheduled_date || order.created_at)}
              </div>
            )}
          </div>
        </div>


        {/* Price (Read-only) */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "700", marginTop: "2px", flexShrink: 0, lineHeight: 1 }}>£</span>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Total Price</div>
            <div style={{ fontSize: "0.85rem", color: "#059669", fontWeight: "700", marginTop: "2px" }}>
              £{Number(order.total_amount ?? order.service_price ?? 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
          <CreditCard size={14} color="#94a3b8" style={{ marginTop: "2px", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "0.7rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.05em" }}>Payment</div>
            <div style={{ fontSize: "0.82rem", color: order.payment_status === "paid" ? "#059669" : "#d97706", fontWeight: "600", marginTop: "2px" }}>
              {order.payment_method === "creditcard"
                ? (order.payment_status === "paid" ? "Paid via Card ✓" : "Card (Pending)")
                : order.payment_method === "paypal"
                ? (order.payment_status === "paid" ? "Paid via PayPal ✓" : "PayPal (Pending)")
                : "Pay on Arrival"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/dashboard/orders")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => setOrders(d.orders || []))
      .catch(() => setError("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [user]);

  const handleSaved = (updated) => {
    setOrders((prev) => prev.map((o) => (o.order_id === updated.order_id ? updated : o)));
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "36px", height: "36px", border: "3px solid #e2e8f0", borderTopColor: "#059669", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .dashboard-container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
        .empty-state { text-align: center; padding: 60px 20px; color: #94a3b8; }
        @keyframes fadein { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .order-card-anim { animation: fadein 0.35s ease both; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
      `}</style>

      <div style={{ background: "#f8fafc", minHeight: "60vh", paddingBottom: "80px" }}>
        <div className="dashboard-container" style={{ paddingTop: "32px" }}>

          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#0f172a", margin: "0 0 20px" }}>
            Order History
          </h2>

          {loadingOrders ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ height: "140px", borderRadius: "16px", background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
              ))}
            </div>
          ) : error ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "16px 20px", borderRadius: "12px", background: "#fef2f2", border: "1px solid #fca5a5", color: "#dc2626" }}>
              <AlertCircle size={18} />
              <span style={{ fontWeight: "600" }}>{error}</span>
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <Package size={56} color="#cbd5e1" style={{ marginBottom: "16px" }} />
              <h3 style={{ color: "#475569", fontWeight: "700", margin: "0 0 8px" }}>No orders yet</h3>
              <p style={{ margin: "0 0 24px", fontSize: "0.9rem" }}>You haven&apos;t placed any bookings yet. Get started below!</p>
              <Link href="/book" className="btn btn-primary">
                <Calendar size={16} />
                Book Your First Service
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {orders.map((order, i) => (
                <div key={order.order_id} className="order-card-anim" style={{ animationDelay: `${i * 0.06}s` }}>
                  <OrderCard order={order} onSaved={handleSaved} />
                </div>
              ))}
            </div>
          )}



        </div>
      </div>
    </>
  );
}

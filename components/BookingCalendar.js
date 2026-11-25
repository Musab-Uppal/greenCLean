"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { getUkTomorrowDateString, getUkDateString, formatUkDate } from "@/lib/dateUtils";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BookingCalendar({
  selectedDate,
  onSelectDate,
  blockedDates = [],
  fullyBookedDates = [],
  maxMonthsAhead = 6,
}) {
  const minDateStr = useMemo(() => getUkTomorrowDateString(), []);
  const todayStr = useMemo(() => getUkDateString(), []);

  // Determine initial month from selectedDate or today
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate && /^\d{4}-\d{2}-\d{2}$/.test(selectedDate)) {
      const [y, m] = selectedDate.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    return new Date(tmrw.getFullYear(), tmrw.getMonth(), 1);
  });

  const viewYear = viewDate.getFullYear();
  const viewMonth = viewDate.getMonth();

  // Calculate current month boundaries
  const currentMonthDate = useMemo(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }, []);

  const maxMonthDate = useMemo(() => {
    const max = new Date(currentMonthDate);
    max.setMonth(max.getMonth() + maxMonthsAhead);
    return max;
  }, [currentMonthDate, maxMonthsAhead]);

  const canGoPrev = viewDate > currentMonthDate;
  const canGoNext = viewDate < maxMonthDate;

  const handlePrevMonth = () => {
    if (!canGoPrev) return;
    setViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    if (!canGoNext) return;
    setViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const monthName = viewDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  // Compute days for the month view
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const firstDayRaw = new Date(viewYear, viewMonth, 1).getDay();
    const firstDayIndex = (firstDayRaw + 6) % 7; // Monday = 0, Sunday = 6

    const days = [];

    // Empty leading padding cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ key: `pad-${i}`, isPadding: true });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isPast = dateStr < minDateStr;
      const isBlocked = blockedDates.includes(dateStr);
      const isFullyBooked = fullyBookedDates.includes(dateStr);
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === todayStr;
      const disabled = isPast || isBlocked || isFullyBooked;

      days.push({
        key: dateStr,
        dayNum: d,
        dateStr,
        isPast,
        isBlocked,
        isFullyBooked,
        isSelected,
        isToday,
        disabled,
        isPadding: false,
      });
    }

    return days;
  }, [viewYear, viewMonth, minDateStr, todayStr, blockedDates, fullyBookedDates, selectedDate]);

  return (
    <div className="booking-calendar-root" style={{ width: "100%", maxWidth: "560px", margin: "0 auto 32px" }}>
      {/* Month Navigation Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
          padding: "4px 2px",
        }}
      >
        <button
          type="button"
          onClick={handlePrevMonth}
          disabled={!canGoPrev}
          aria-label="Previous month"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            border: "1.5px solid var(--slate-200)",
            background: canGoPrev ? "#ffffff" : "#f1f5f9",
            color: canGoPrev ? "var(--slate-800)" : "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: canGoPrev ? "pointer" : "not-allowed",
            transition: "all 0.15s ease",
            boxShadow: canGoPrev ? "0 2px 4px rgba(0,0,0,0.04)" : "none",
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <div style={{ textAlign: "center" }}>
          <h4
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: "800",
              color: "var(--slate-900)",
              letterSpacing: "-0.01em",
            }}
          >
            {monthName}
          </h4>
          <span style={{ fontSize: "0.78rem", color: "var(--slate-500)", fontWeight: "500" }}>
            Book appointments up to {maxMonthsAhead} months in advance
          </span>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          disabled={!canGoNext}
          aria-label="Next month"
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            border: "1.5px solid var(--slate-200)",
            background: canGoNext ? "#ffffff" : "#f1f5f9",
            color: canGoNext ? "var(--slate-800)" : "#94a3b8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: canGoNext ? "pointer" : "not-allowed",
            transition: "all 0.15s ease",
            boxShadow: canGoNext ? "0 2px 4px rgba(0,0,0,0.04)" : "none",
          }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Weekdays Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
          marginBottom: "8px",
          textAlign: "center",
        }}
      >
        {WEEKDAYS.map((w, idx) => (
          <div
            key={w}
            style={{
              fontSize: "0.78rem",
              fontWeight: "700",
              color: idx >= 5 ? "#059669" : "var(--slate-500)",
              textTransform: "uppercase",
              padding: "4px 0",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "6px",
          marginBottom: "16px",
        }}
      >
        {calendarDays.map((cell) => {
          if (cell.isPadding) {
            return <div key={cell.key} style={{ minHeight: "44px" }} />;
          }

          const { dayNum, dateStr, disabled, isBlocked, isFullyBooked, isPast, isSelected, isToday } = cell;

          return (
            <button
              key={cell.key}
              type="button"
              disabled={disabled}
              onClick={() => {
                if (!disabled) onSelectDate(dateStr);
              }}
              title={
                isBlocked
                  ? "Unavailable — Admin Leave / Booked Out"
                  : isFullyBooked
                  ? "Unavailable — All time slots are already booked"
                  : isPast
                  ? "Past date — unavailable"
                  : `Book for ${formatUkDate(dateStr, true)}`
              }
              style={{
                minHeight: "46px",
                borderRadius: "10px",
                border: isSelected
                  ? "2px solid var(--emerald-600)"
                  : isToday
                  ? "1.5px solid #a7f3d0"
                  : isBlocked || isFullyBooked
                  ? "1px dashed #cbd5e1"
                  : "1px solid #e2e8f0",
                background: isSelected
                  ? "var(--emerald-600)"
                  : isBlocked || isFullyBooked
                  ? "#f8fafc"
                  : isPast
                  ? "#f1f5f9"
                  : isToday
                  ? "#ecfdf5"
                  : "#ffffff",
                color: isSelected
                  ? "#ffffff"
                  : isBlocked || isFullyBooked
                  ? "#94a3b8"
                  : isPast
                  ? "#cbd5e1"
                  : "var(--slate-800)",
                fontWeight: isSelected ? "800" : isToday ? "700" : "600",
                fontSize: "0.95rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.6 : 1,
                position: "relative",
                transition: "all 0.15s ease",
                boxShadow: isSelected ? "0 4px 12px rgba(5, 150, 105, 0.35)" : "none",
                padding: "4px 2px",
              }}
            >
              <span>{dayNum}</span>
              {isBlocked && (
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: "700",
                    color: "#dc2626",
                    lineHeight: 1,
                    marginTop: "2px",
                  }}
                >
                  Leave
                </span>
              )}
              {!isBlocked && isFullyBooked && (
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: "700",
                    color: "#d97706",
                    lineHeight: 1,
                    marginTop: "2px",
                  }}
                >
                  Booked
                </span>
              )}
              {isToday && !isSelected && !isBlocked && !isFullyBooked && (
                <span
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: "700",
                    color: "#059669",
                    lineHeight: 1,
                    marginTop: "2px",
                  }}
                >
                  Today
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Legend & Selected Date Summary */}
      <div
        style={{
          background: "var(--emerald-50)",
          border: "1px solid var(--emerald-200)",
          borderRadius: "12px",
          padding: "12px 16px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarIcon size={18} color="#059669" />
          <span style={{ fontSize: "0.9rem", color: "var(--slate-700)" }}>
            Selected Date:{" "}
            <strong style={{ color: "var(--emerald-800)", fontWeight: "800" }}>
              {formatUkDate(selectedDate, true)}
            </strong>
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "0.75rem",
            color: "var(--slate-500)",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--emerald-600)" }} />
            Selected
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#ffffff", border: "1px solid #cbd5e1" }} />
            Available
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f1f5f9", border: "1px dashed #94a3b8" }} />
            Unavailable
          </span>
        </div>
      </div>
    </div>
  );
}

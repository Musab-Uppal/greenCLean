/**
 * Date and Time utilities for Green Clean Group (Liverpool, UK)
 * Ensures all dates and times are strictly locked to Europe/London (GMT/BST).
 * Prevents UTC day-shifting and midnight mismatch issues.
 */

export const UK_TIMEZONE = "Europe/London";

/**
 * Returns today's date in Liverpool UK as 'YYYY-MM-DD'
 * @param {Date} [dateObj=new Date()]
 * @returns {string} e.g. "2026-09-20"
 */
export function getUkDateString(dateObj = new Date()) {
  // 'en-CA' locale produces ISO format YYYY-MM-DD in the target timezone
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: UK_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
}

/**
 * Returns tomorrow's date in Liverpool UK as 'YYYY-MM-DD'
 */
export function getUkTomorrowDateString() {
  const d = new Date();
  // Add 24 hours in milliseconds, then format in UK time
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
  return getUkDateString(d);
}

/**
 * Formats a date string ('YYYY-MM-DD' or 'YYYY-MM-DD HH:MM - HH:MM')
 * to British standard readable format e.g. "Sunday, 20 September 2026"
 * or "20 September 2026"
 */
export function formatUkDate(dateStr, includeWeekday = false) {
  if (!dateStr) return "—";
  const datePart = dateStr.includes(" ") ? dateStr.split(" ")[0] : dateStr;
  const parts = datePart.split("-");
  if (parts.length !== 3) return dateStr;

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const d = new Date(Date.UTC(year, month, day, 12, 0, 0));

  const options = {
    timeZone: UK_TIMEZONE,
    day: "numeric",
    month: "long",
    year: "numeric",
  };
  if (includeWeekday) {
    options.weekday = "short";
  }

  return new Intl.DateTimeFormat("en-GB", options).format(d);
}

/**
 * Standard UK Booking arrival windows (24-hour clock with leading zeros)
 */
export const UK_TIME_SLOTS = [
  "08:00 – 10:00",
  "10:00 – 12:00",
  "12:00 – 14:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
];

/**
 * Normalizes legacy, unpadded or shorthand slot strings (e.g. "8-10", "8:00 - 10:00") to standard "08:00 – 10:00"
 */
export function normalizeTimeSlot(slotStr) {
  if (!slotStr) return UK_TIME_SLOTS[0];
  const cleaned = slotStr.replace(" - ", " – ").trim();

  // Shorthand formats
  if (cleaned === "8-10" || cleaned === "8 - 10" || cleaned === "8 – 10") return "08:00 – 10:00";
  if (cleaned === "10-12" || cleaned === "10 - 12" || cleaned === "10 – 12") return "10:00 – 12:00";
  if (cleaned === "12-14" || cleaned === "12 - 14" || cleaned === "12 – 14") return "12:00 – 14:00";
  if (cleaned === "14-16" || cleaned === "14 - 16" || cleaned === "14 – 16") return "14:00 – 16:00";
  if (cleaned === "16-18" || cleaned === "16 - 18" || cleaned === "16 – 18") return "16:00 – 18:00";

  if (/^[0-9]:[0-9]{2}/.test(cleaned)) {
    return "0" + cleaned;
  }
  return cleaned;
}

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
  "09:00 – 11:00",
  "11:00 – 13:00",
  "13:00 – 15:00",
  "15:00 – 17:00",
];

/**
 * Normalizes legacy or unpadded slot strings like "9:00 - 11:00" to "09:00 – 11:00"
 */
export function normalizeTimeSlot(slotStr) {
  if (!slotStr) return UK_TIME_SLOTS[0];
  const cleaned = slotStr.replace(" - ", " – ").trim();
  if (cleaned.startsWith("9:00")) {
    return "0" + cleaned;
  }
  return cleaned;
}

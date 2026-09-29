import { toGregorian, toJalaali } from "jalaali-js";

/**
 * Jalali (Persian) calendar helpers. Storage is Gregorian `date` columns;
 * input and display are Jalali, e.g. `1404/07/15`.
 */

const JALALI_RE = /^[1-9]\d{3}\/(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])$/;

/** Parses `1404/07/15` (or with Persian digits) into a Gregorian Date (UTC noon). */
export function parseJalali(value: string | null | undefined): Date | null {
  if (!value) return null;
  const normalized = normalizeDigits(value.trim()).replace(/-/g, "/");
  if (!JALALI_RE.test(normalized)) return null;
  const [jy, jm, jd] = normalized.split("/").map(Number);
  try {
    const { gy, gm, gd } = toGregorian(jy, jm, jd);
    // Noon UTC avoids timezone shifts when stored as a bare date.
    return new Date(Date.UTC(gy, gm - 1, gd, 12));
  } catch {
    return null;
  }
}

const FA_DIGITS = "۰۱۲۳۴۵۶۷۸۹";
function normalizeDigits(s: string): string {
  return s.replace(/[۰-۹]/g, (d) => String(FA_DIGITS.indexOf(d)));
}

/** ISO `YYYY-MM-DD` (for <input type=date> and date columns) → Date (UTC noon). */
export function parseIsoDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Date → ISO `YYYY-MM-DD` for `<input type="date">` values. */
export function toIsoInput(value: Date | string | null | undefined): string {
  if (!value) return "";
  const d = typeof value === "string" ? parseIsoDate(value) : value;
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

/** Formats a Date as Jalali `1404/07/15`. */
export function formatJalali(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? parseIsoDate(value) : value;
  if (!d) return "—";
  const { jy, jm, jd } = toJalaali(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
  return `${jy}/${String(jm).padStart(2, "0")}/${String(jd).padStart(2, "0")}`;
}

/** Days from now until the given date (negative = past). Null-safe. */
export function daysUntil(value: Date | string | null | undefined): number | null {
  if (!value) return null;
  const d = typeof value === "string" ? parseIsoDate(value) : value;
  if (!d) return null;
  const today = new Date();
  const a = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const b = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((a - b) / 86_400_000);
}

/** 12500000 → «۱۲,۵۰۰,۰۰۰» (Persian digits, thousands separators). */
export function formatToman(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("fa-IR").format(value);
}

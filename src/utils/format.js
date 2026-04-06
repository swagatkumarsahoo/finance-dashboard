// src/utils/format.js
// Shared formatting utilities used across Dashboard, Transactions, and Insights.
// Centralised here so any display change is a single edit.

/**
 * Short month labels used by both chart components.
 * Defined once so chart components don't each maintain their own copy.
 */
export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

/**
 * Format a number as Indian Rupee currency.
 * Uses Math.abs so callers don't need to strip the sign before formatting;
 * the sign (+/-) is added separately in the UI for semantic clarity.
 *
 * @param {number} amount
 * @returns {string}  e.g. "₹1,23,456"
 */
export function formatCurrency(amount) {
  return '₹' + Math.abs(amount).toLocaleString('en-IN');
}

/**
 * Parse a YYYY-MM-DD date string in LOCAL time (not UTC).
 *
 * WHY: `new Date('2024-01-05')` is treated as UTC midnight by the spec.
 * In a UTC-5 timezone, that resolves to Jan 4 locally — an off-by-one bug
 * that silently corrupts chart groupings and sort order.
 * Splitting manually and using the Date(year, month, day) constructor
 * always creates a local-timezone date.
 *
 * @param {string} dateStr  'YYYY-MM-DD'
 * @returns {Date}
 */
export function parseLocalDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed in JS
}

/**
 * Format a YYYY-MM-DD string for display.
 * Wraps parseLocalDate so callers don't import both utilities.
 *
 * @param {string} dateStr  'YYYY-MM-DD'
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export function formatDate(dateStr, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  return parseLocalDate(dateStr).toLocaleDateString('en-IN', options);
}

/**
 * Return today's date as a YYYY-MM-DD string in LOCAL time.
 *
 * WHY NOT new Date().toISOString().split('T')[0]?
 * toISOString() is always UTC. At 11 pm in UTC+5:30, UTC is already the next
 * day — so the default date field would show tomorrow's date.
 *
 * @returns {string}  e.g. "2024-03-15"
 */
export function getTodayLocal() {
  const d  = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

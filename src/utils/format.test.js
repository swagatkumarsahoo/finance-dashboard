// src/utils/format.test.js
// Unit tests for pure utility functions.
// These have zero React dependencies — fast, reliable, easy to reason about.

import { describe, it, expect } from 'vitest';
import { formatCurrency, parseLocalDate, formatDate, getTodayLocal, MONTHS } from './format';

// ── formatCurrency ────────────────────────────────────────────────────────────

describe('formatCurrency', () => {
  it('formats a whole number with the rupee symbol', () => {
    expect(formatCurrency(1200)).toBe('₹1,200');
  });

  it('uses Indian locale grouping (e.g. 1,23,456)', () => {
    // en-IN uses 2-2-3 grouping above 99,999
    expect(formatCurrency(123456)).toBe('₹1,23,456');
  });

  it('strips the negative sign — callers add +/- separately', () => {
    expect(formatCurrency(-850)).toBe('₹850');
  });

  it('handles zero', () => {
    expect(formatCurrency(0)).toBe('₹0');
  });
});

// ── parseLocalDate ────────────────────────────────────────────────────────────

describe('parseLocalDate', () => {
  it('returns the correct calendar day regardless of timezone', () => {
    const d = parseLocalDate('2024-03-15');
    // If parsed as UTC, in a UTC-5 environment this would be March 14.
    // Correct local parsing always gives March 15.
    expect(d.getDate()).toBe(15);
    expect(d.getMonth()).toBe(2); // 0-indexed: 2 = March
    expect(d.getFullYear()).toBe(2024);
  });

  it('handles the first day of the year', () => {
    const d = parseLocalDate('2024-01-01');
    expect(d.getDate()).toBe(1);
    expect(d.getMonth()).toBe(0);
  });

  it('handles the last day of the year', () => {
    const d = parseLocalDate('2024-12-31');
    expect(d.getDate()).toBe(31);
    expect(d.getMonth()).toBe(11);
  });
});

// ── formatDate ────────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats with default options (dd Mon yyyy)', () => {
    // Default: { day: '2-digit', month: 'short', year: 'numeric' }
    const result = formatDate('2024-03-15');
    expect(result).toContain('Mar');
    expect(result).toContain('2024');
  });

  it('accepts custom options', () => {
    const result = formatDate('2024-03-15', { day: 'numeric', month: 'short' });
    expect(result).toContain('Mar');
    expect(result).not.toContain('2024');
  });
});

// ── getTodayLocal ─────────────────────────────────────────────────────────────

describe('getTodayLocal', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const today = getTodayLocal();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('matches the local date (not UTC date)', () => {
    const today = getTodayLocal();
    const now   = new Date();
    const localDay = String(now.getDate()).padStart(2, '0');
    // The day component of our local string should match local getDate()
    expect(today.slice(8, 10)).toBe(localDay);
  });
});

// ── MONTHS constant ───────────────────────────────────────────────────────────

describe('MONTHS', () => {
  it('has exactly 12 entries', () => {
    expect(MONTHS).toHaveLength(12);
  });

  it('starts with Jan and ends with Dec', () => {
    expect(MONTHS[0]).toBe('Jan');
    expect(MONTHS[11]).toBe('Dec');
  });
});

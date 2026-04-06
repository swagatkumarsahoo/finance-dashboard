// src/utils/transactions.test.js
// Unit tests for the pure filter/sort/search logic.
// These have zero React dependency — fast and deterministic.

import { describe, it, expect } from 'vitest';
import { applyFiltersAndSort } from './transactions';

// ── Fixtures ──────────────────────────────────────────────────────────────────
// A minimal, predictable dataset. Real transaction IDs, real date strings.

const TX = [
  { id: '1', date: '2024-01-10', description: 'Monthly Salary',    category: 'Salary',        amount: 5000, type: 'income'  },
  { id: '2', date: '2024-01-15', description: 'Apartment Rent',    category: 'Rent',           amount: 1200, type: 'expense' },
  { id: '3', date: '2024-02-05', description: 'Freelance Project', category: 'Freelance',      amount: 800,  type: 'income'  },
  { id: '4', date: '2024-02-20', description: 'Grocery Shopping',  category: 'Food & Dining',  amount: 210,  type: 'expense' },
  { id: '5', date: '2024-03-01', description: 'Netflix',           category: 'Entertainment',  amount: 15,   type: 'expense' },
];

// Default opts that apply no filtering or sorting changes
const defaults = { filter: 'all', search: '', sortKey: 'date', sortDir: 'desc' };

// ── Type filter ───────────────────────────────────────────────────────────────

describe('type filter', () => {
  it('returns all transactions when filter is "all"', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, filter: 'all' });
    expect(result).toHaveLength(5);
  });

  it('returns only income transactions', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, filter: 'income' });
    expect(result).toHaveLength(2);
    expect(result.every((t) => t.type === 'income')).toBe(true);
  });

  it('returns only expense transactions', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, filter: 'expense' });
    expect(result).toHaveLength(3);
    expect(result.every((t) => t.type === 'expense')).toBe(true);
  });

  it('returns empty array when no transactions match the filter', () => {
    const incomeOnly = [TX[0], TX[2]]; // only income rows
    const result = applyFiltersAndSort(incomeOnly, { ...defaults, filter: 'expense' });
    expect(result).toHaveLength(0);
  });
});

// ── Search ────────────────────────────────────────────────────────────────────

describe('search', () => {
  it('matches by description (case-insensitive)', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, search: 'salary' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('matches by category (case-insensitive)', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, search: 'rent' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('matches partial strings', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, search: 'free' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });

  it('returns all rows when search is empty', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, search: '' });
    expect(result).toHaveLength(5);
  });

  it('trims whitespace from the search query', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, search: '  netflix  ' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('5');
  });

  it('returns empty array when nothing matches', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, search: 'zzznomatch' });
    expect(result).toHaveLength(0);
  });
});

// ── Filter + search combined ──────────────────────────────────────────────────

describe('filter + search combined', () => {
  it('applies type filter first, then search', () => {
    // "grocery" only exists in expenses; searching income+grocery should return nothing
    const result = applyFiltersAndSort(TX, { ...defaults, filter: 'income', search: 'grocery' });
    expect(result).toHaveLength(0);
  });

  it('returns the intersection of filter and search', () => {
    // "freelance" is income — filter=income, search=freelance → 1 result
    const result = applyFiltersAndSort(TX, { ...defaults, filter: 'income', search: 'freelance' });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('3');
  });
});

// ── Date sort ─────────────────────────────────────────────────────────────────

describe('sort by date', () => {
  it('sorts descending by default (newest first)', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, sortKey: 'date', sortDir: 'desc' });
    const dates = result.map((t) => t.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  it('sorts ascending (oldest first)', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, sortKey: 'date', sortDir: 'asc' });
    const dates = result.map((t) => t.date);
    expect(dates).toEqual([...dates].sort());
  });

  it('does not mutate the original array', () => {
    const original = TX.map((t) => t.date);
    applyFiltersAndSort(TX, { ...defaults, sortKey: 'date', sortDir: 'asc' });
    expect(TX.map((t) => t.date)).toEqual(original);
  });
});

// ── Amount sort ───────────────────────────────────────────────────────────────

describe('sort by amount', () => {
  it('sorts descending (highest first)', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, sortKey: 'amount', sortDir: 'desc' });
    const amounts = result.map((t) => t.amount);
    for (let i = 0; i < amounts.length - 1; i++) {
      expect(amounts[i]).toBeGreaterThanOrEqual(amounts[i + 1]);
    }
  });

  it('sorts ascending (lowest first)', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, sortKey: 'amount', sortDir: 'asc' });
    const amounts = result.map((t) => t.amount);
    for (let i = 0; i < amounts.length - 1; i++) {
      expect(amounts[i]).toBeLessThanOrEqual(amounts[i + 1]);
    }
  });

  it('puts the most expensive transaction first in desc order', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, sortKey: 'amount', sortDir: 'desc' });
    expect(result[0].id).toBe('1'); // Salary ₹5000
  });

  it('puts the cheapest transaction first in asc order', () => {
    const result = applyFiltersAndSort(TX, { ...defaults, sortKey: 'amount', sortDir: 'asc' });
    expect(result[0].id).toBe('5'); // Netflix ₹15
  });
});

// ── Edge cases ────────────────────────────────────────────────────────────────

describe('edge cases', () => {
  it('handles an empty transaction array', () => {
    const result = applyFiltersAndSort([], { ...defaults });
    expect(result).toEqual([]);
  });

  it('handles a single transaction', () => {
    const result = applyFiltersAndSort([TX[0]], { ...defaults });
    expect(result).toHaveLength(1);
  });

  it('returns a new array, never the original reference', () => {
    const result = applyFiltersAndSort(TX, { ...defaults });
    expect(result).not.toBe(TX);
  });
});

// src/utils/transactions.js
//
// Pure functions for filtering, searching, and sorting transactions.
// Extracted from Transactions.jsx so they can be unit-tested independently
// of any React rendering.

/**
 * Apply type filter, search query, and sort to a transaction array.
 *
 * @param {Array}  transactions  - Raw transaction objects
 * @param {Object} opts
 * @param {string} opts.filter   - 'all' | 'income' | 'expense'
 * @param {string} opts.search   - Free-text query (matches description + category)
 * @param {string} opts.sortKey  - 'date' | 'amount'
 * @param {string} opts.sortDir  - 'asc' | 'desc'
 * @returns {Array} New sorted/filtered array (original is never mutated)
 */
export function applyFiltersAndSort(transactions, { filter, search, sortKey, sortDir }) {
  let list = [...transactions];

  // 1. Type filter
  if (filter !== 'all') {
    list = list.filter((t) => t.type === filter);
  }

  // 2. Text search — case-insensitive match on description OR category
  const q = search.trim().toLowerCase();
  if (q) {
    list = list.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }

  // 3. Sort
  list.sort((a, b) => {
    const mul = sortDir === 'asc' ? 1 : -1;
    if (sortKey === 'date') {
      // YYYY-MM-DD strings are lexicographically identical to chronological order.
      // String comparison avoids creating Date objects on every comparator call.
      return mul * a.date.localeCompare(b.date);
    }
    if (sortKey === 'amount') {
      return mul * (a.amount - b.amount);
    }
    return 0;
  });

  return list;
}

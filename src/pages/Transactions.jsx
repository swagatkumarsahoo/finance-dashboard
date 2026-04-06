// src/pages/Transactions.jsx
// Full CRUD table: search, type filter, column sorting.
// Admin can add / edit / delete; Viewer is read-only.

import { useState, useMemo } from 'react';
import {
  Search, Plus, Pencil, Trash2, ArrowUpDown,
  ArrowUp, ArrowDown, Filter, X,
} from 'lucide-react';
import { useUI, useTransactions } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/format';
import { applyFiltersAndSort } from '../utils/transactions';
import { cn } from '../utils/cn';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import TransactionForm from '../components/ui/TransactionForm';
import EmptyState from '../components/ui/EmptyState';

// ── Sub-components ────────────────────────────────────────────────────────────

function SortIcon({ field, sortKey, sortDir }) {
  if (sortKey !== field) return <ArrowUpDown size={13} className="opacity-30" />;
  return sortDir === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Transactions() {
  const { darkMode, isAdmin } = useUI();
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useTransactions();

  // ── Local UI state ──────────────────────────────────────────────────────────
  const [search,     setSearch]     = useState('');
  const [filter,     setFilter]     = useState('all'); // 'all' | 'income' | 'expense'
  const [sortKey,    setSortKey]    = useState('date'); // 'date' | 'amount'
  const [sortDir,    setSortDir]    = useState('desc'); // 'asc' | 'desc'
  const [showAdd,    setShowAdd]    = useState(false);
  const [editTarget, setEditTarget] = useState(null);  // transaction being edited
  const [deleteId,   setDeleteId]   = useState(null);  // id pending delete confirmation

  // ── Derived list: filter → search → sort ───────────────────────────────────
  const displayed = useMemo(
    () => applyFiltersAndSort(transactions, { filter, search, sortKey, sortDir }),
    [transactions, filter, search, sortKey, sortDir]
  );

  // Clicking the active column flips direction; clicking a new column resets to desc
  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  // ── Shared class fragments ──────────────────────────────────────────────────
  const card   = cn('rounded-2xl border shadow-card', darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200');
  const input  = cn(
    'px-3 py-2.5 rounded-xl text-sm border outline-none transition-colors',
    darkMode
      ? 'bg-dark-300 border-dark-border text-white placeholder:text-dark-muted focus:border-accent'
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-accent'
  );
  const thBase = cn('px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider select-none', darkMode ? 'text-dark-muted' : 'text-gray-400');
  const tdBase = 'px-4 py-3.5 text-sm';

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">

        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={15}
            className={cn('absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none', darkMode ? 'text-dark-muted' : 'text-gray-400')}
          />
          <input
            className={cn(input, 'pl-9 w-full')}
            placeholder="Search by description or category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              aria-label="Clear search"
              onClick={() => setSearch('')}
              className={cn('absolute right-3 top-1/2 -translate-y-1/2 transition-colors', darkMode ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-700')}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div className={cn('flex items-center gap-1 p-1 rounded-xl border', darkMode ? 'bg-dark-300 border-dark-border' : 'bg-gray-100 border-transparent')}>
          {['all', 'income', 'expense'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all',
                filter === f
                  ? f === 'all'    ? 'bg-accent text-dark-300'
                  : f === 'income' ? 'bg-success text-white'
                                   : 'bg-danger text-white'
                  : darkMode ? 'text-dark-muted hover:text-white' : 'text-gray-500 hover:text-gray-800'
              )}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Add button — admin only */}
        {isAdmin && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-400 text-dark-300 text-sm font-semibold transition-colors shadow-glow"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Result count */}
      <p className={cn('text-xs', darkMode ? 'text-dark-muted' : 'text-gray-400')}>
        Showing{' '}
        <span className="font-semibold text-accent">{displayed.length}</span>
        {' '}of {transactions.length} transactions
        {search && <> matching "<span className="italic">{search}</span>"</>}
      </p>

      {/* ── Table ────────────────────────────────────────────────────────── */}
      <div className={cn(card, 'overflow-hidden')}>
        {displayed.length === 0 ? (
          <EmptyState
            icon={<Filter size={28} />}
            title="No transactions found"
            description={
              search
                ? `No results for "${search}". Try a different search term.`
                : 'No transactions match the current filter.'
            }
            action={
              (search || filter !== 'all') && (
                <button
                  onClick={() => { setSearch(''); setFilter('all'); }}
                  className="px-4 py-2 rounded-xl bg-accent text-dark-300 text-sm font-semibold"
                >
                  Clear Filters
                </button>
              )
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={cn('border-b', darkMode ? 'border-dark-border' : 'border-gray-100')}>
                <tr>
                  <th
                    className={cn(thBase, 'cursor-pointer hover:text-accent')}
                    onClick={() => handleSort('date')}
                  >
                    <span className="flex items-center gap-1.5">
                      Date <SortIcon field="date" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  <th className={thBase}>Description</th>
                  <th className={thBase}>Category</th>
                  <th className={thBase}>Type</th>
                  <th
                    className={cn(thBase, 'text-right cursor-pointer hover:text-accent')}
                    onClick={() => handleSort('amount')}
                  >
                    <span className="flex items-center justify-end gap-1.5">
                      Amount <SortIcon field="amount" sortKey={sortKey} sortDir={sortDir} />
                    </span>
                  </th>
                  {isAdmin && <th className={cn(thBase, 'text-right')}>Actions</th>}
                </tr>
              </thead>

              <tbody>
                {displayed.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={cn(
                      'transition-colors',
                      darkMode ? 'hover:bg-dark-border/30' : 'hover:bg-gray-50',
                      i !== displayed.length - 1 && (darkMode ? 'border-b border-dark-border' : 'border-b border-gray-100')
                    )}
                  >
                    <td className={cn(tdBase, 'font-mono text-xs whitespace-nowrap', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
                      {formatDate(tx.date)}
                    </td>

                    <td className={cn(tdBase, 'font-medium max-w-[180px] truncate', darkMode ? 'text-white' : 'text-gray-800')}>
                      {tx.description}
                    </td>

                    <td className={cn(tdBase, 'text-xs whitespace-nowrap', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
                      <span className={cn('px-2 py-1 rounded-lg text-xs font-medium', darkMode ? 'bg-dark-border/60' : 'bg-gray-100')}>
                        {tx.category}
                      </span>
                    </td>

                    <td className={tdBase}>
                      <Badge type={tx.type} />
                    </td>

                    <td className={cn(tdBase, 'text-right font-mono font-semibold whitespace-nowrap', tx.type === 'income' ? 'text-success' : 'text-danger')}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </td>

                    {isAdmin && (
                      <td className={cn(tdBase, 'text-right')}>
                        <div className="flex items-center justify-end gap-1">
                          <button
                            aria-label={`Edit ${tx.description}`}
                            onClick={() => setEditTarget(tx)}
                            className={cn('p-1.5 rounded-lg transition-colors', darkMode ? 'text-dark-muted hover:text-accent hover:bg-accent/10' : 'text-gray-400 hover:text-accent hover:bg-accent/10')}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            aria-label={`Delete ${tx.description}`}
                            onClick={() => setDeleteId(tx.id)}
                            className={cn('p-1.5 rounded-lg transition-colors', darkMode ? 'text-dark-muted hover:text-danger hover:bg-danger/10' : 'text-gray-400 hover:text-danger hover:bg-danger/10')}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Add Modal ────────────────────────────────────────────────────── */}
      {showAdd && (
        <Modal title="Add Transaction" onClose={() => setShowAdd(false)}>
          <TransactionForm
            onSave={(tx) => { addTransaction(tx); setShowAdd(false); }}
            onCancel={() => setShowAdd(false)}
          />
        </Modal>
      )}

      {/* ── Edit Modal ───────────────────────────────────────────────────── */}
      {editTarget && (
        <Modal title="Edit Transaction" onClose={() => setEditTarget(null)}>
          <TransactionForm
            initial={editTarget}
            onSave={(tx) => { updateTransaction(tx.id, tx); setEditTarget(null); }}
            onCancel={() => setEditTarget(null)}
          />
        </Modal>
      )}

      {/* ── Delete Confirmation Modal ────────────────────────────────────── */}
      {deleteId && (
        <Modal title="Delete Transaction" onClose={() => setDeleteId(null)}>
          <div className="space-y-4">
            <p className={cn('text-sm', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
              Are you sure? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors',
                  darkMode ? 'border-dark-border text-dark-muted hover:text-white' : 'border-gray-200 text-gray-500 hover:text-gray-800'
                )}
              >
                Cancel
              </button>
              <button
                onClick={() => { deleteTransaction(deleteId); setDeleteId(null); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-danger hover:bg-red-500 text-white transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

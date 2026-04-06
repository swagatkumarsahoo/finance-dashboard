// src/pages/Dashboard.jsx
// Landing page: 3 summary cards + monthly trend + category pie + recent list.

import { useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useUI, useTransactions } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/format';
import { cn } from '../utils/cn';
import SummaryCard from '../components/ui/SummaryCard';
import MonthlyLineChart from '../components/charts/MonthlyLineChart';
import CategoryPieChart from '../components/charts/CategoryPieChart';

export default function Dashboard() {
  const { darkMode } = useUI();
  const { totals, transactions } = useTransactions();

  // 5 most-recent transactions for the quick-list widget.
  // YYYY-MM-DD strings are lexicographically sortable — no Date() needed.
  const recent = useMemo(
    () => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [transactions]
  );

  const card = cn(
    'rounded-2xl p-5 border shadow-card',
    darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'
  );

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Summary Cards ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          label="Total Balance"
          value={formatCurrency(totals.balance)}
          icon={<Wallet size={18} />}
          variant="balance"
          delay={0}
        />
        <SummaryCard
          label="Total Income"
          value={formatCurrency(totals.income)}
          icon={<TrendingUp size={18} />}
          variant="income"
          delay={80}
        />
        <SummaryCard
          label="Total Expenses"
          value={formatCurrency(totals.expense)}
          icon={<TrendingDown size={18} />}
          variant="expense"
          delay={160}
        />
      </div>

      {/* ── Charts Row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        <div className={cn(card, 'lg:col-span-2 stagger')} style={{ '--delay': '240ms' }}>
          <div className="mb-5">
            <h2 className={cn('font-display font-semibold text-base', darkMode ? 'text-white' : 'text-gray-900')}>
              Monthly Trend
            </h2>
            <p className={cn('text-xs mt-0.5', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
              Income vs Expenses over 12 months
            </p>
          </div>
          <MonthlyLineChart />
        </div>

        <div className={cn(card, 'stagger')} style={{ '--delay': '320ms' }}>
          <div className="mb-4">
            <h2 className={cn('font-display font-semibold text-base', darkMode ? 'text-white' : 'text-gray-900')}>
              Expense Breakdown
            </h2>
            <p className={cn('text-xs mt-0.5', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
              By category
            </p>
          </div>
          <CategoryPieChart />
        </div>
      </div>

      {/* ── Recent Transactions ──────────────────────────────────────────── */}
      <div className={cn(card, 'stagger')} style={{ '--delay': '400ms' }}>
        <div className="flex items-center gap-2 mb-5">
          <Clock size={16} className="text-accent" />
          <h2 className={cn('font-display font-semibold text-base', darkMode ? 'text-white' : 'text-gray-900')}>
            Recent Transactions
          </h2>
        </div>

        {recent.length === 0 ? (
          <p className={cn('text-sm text-center py-8', darkMode ? 'text-dark-muted' : 'text-gray-400')}>
            No transactions yet.
          </p>
        ) : (
          <ul className="space-y-3">
            {recent.map((tx) => (
              <li
                key={tx.id}
                className={cn(
                  'flex items-center justify-between py-2.5 border-b last:border-0',
                  darkMode ? 'border-dark-border' : 'border-gray-100'
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Coloured dot acts as income/expense indicator */}
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: tx.type === 'income' ? '#00D4AA' : '#FF4D6A',
                      boxShadow: tx.type === 'income'
                        ? '0 0 6px rgba(0,212,170,0.6)'
                        : '0 0 6px rgba(255,77,106,0.6)',
                    }}
                  />
                  <div className="min-w-0">
                    <p className={cn('text-sm font-medium truncate', darkMode ? 'text-white' : 'text-gray-800')}>
                      {tx.description}
                    </p>
                    <p className={cn('text-xs', darkMode ? 'text-dark-muted' : 'text-gray-400')}>
                      {tx.category} · {formatDate(tx.date, { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>

                <span className={cn(
                  'font-mono text-sm font-semibold flex-shrink-0 ml-4',
                  tx.type === 'income' ? 'text-success' : 'text-danger'
                )}>
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

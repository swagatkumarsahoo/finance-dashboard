// src/pages/Insights.jsx
// Spending analysis: KPI strip, monthly bar chart, category breakdown, smart insights.

import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertTriangle,
  Award, PiggyBank, Zap, ArrowRight,
} from 'lucide-react';
import { useUI, useTransactions } from '../context/AppContext';
import { MONTHS, formatCurrency, parseLocalDate } from '../utils/format';
import { cn } from '../utils/cn';
import { CATEGORY_COLORS } from '../data/mockData';

// ── Pure helpers (no React) ───────────────────────────────────────────────────

/** Percentage change from b to a, guarded against divide-by-zero. */
const pctChange = (a, b) => (b === 0 ? 0 : Math.round(((a - b) / b) * 100));

/**
 * Build the list of insight messages from computed metrics.
 * Kept as a plain function (not a component) — it returns data, not JSX,
 * so it can be tested independently without a render.
 */
function buildInsights(savingsRate, topCategory, momChange, highestMonth) {
  const insights = [];

  if (savingsRate >= 30) {
    insights.push({ id: 'savings-good', icon: PiggyBank,     color: 'text-success', text: `You saved ${savingsRate}% of your income — excellent discipline!` });
  } else if (savingsRate >= 15) {
    insights.push({ id: 'savings-ok',   icon: TrendingUp,    color: 'text-accent',  text: `Savings rate is ${savingsRate}%. Aim for 30%+ by trimming discretionary spend.` });
  } else {
    insights.push({ id: 'savings-low',  icon: AlertTriangle, color: 'text-warning', text: `Savings rate is low at ${savingsRate}%. Review your recurring expenses.` });
  }

  if (topCategory) {
    insights.push({ id: 'top-category', icon: Zap, color: 'text-warning', text: `"${topCategory.name}" is your biggest expense at ${formatCurrency(topCategory.value)}.` });
  }

  if (momChange > 10) {
    insights.push({ id: 'mom-up',     icon: TrendingDown, color: 'text-danger',  text: `Expenses rose ${momChange}% vs last month — review what drove the increase.` });
  } else if (momChange < -10) {
    insights.push({ id: 'mom-down',   icon: TrendingUp,   color: 'text-success', text: `Expenses fell ${Math.abs(momChange)}% vs last month. Keep it up!` });
  } else {
    insights.push({ id: 'mom-stable', icon: Award,        color: 'text-accent',  text: `Spending is stable month-over-month (${momChange > 0 ? '+' : ''}${momChange}%).` });
  }

  if (highestMonth) {
    insights.push({ id: 'highest-month', icon: AlertTriangle, color: 'text-danger', text: `${highestMonth} was your highest-spend month — worth reviewing.` });
  }

  return insights;
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

function BarTooltip({ active, payload, label, darkMode }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={cn('rounded-xl px-4 py-3 text-sm shadow-card border', darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200')}>
      <p className={cn('font-medium mb-1.5', darkMode ? 'text-white' : 'text-gray-800')}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} className="font-mono" style={{ color: p.fill }}>
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function Insights() {
  const { darkMode } = useUI();
  const { transactions } = useTransactions();
  // useNavigate wires up the "View All Transactions" CTA to the real route
  const navigate = useNavigate();

  // ── All analytics in one memo — avoids multiple passes over transactions ────
  const analytics = useMemo(() => {
    const totalIncome  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    const savingsRate  = totalIncome === 0
      ? 0
      : Math.round(((totalIncome - totalExpense) / totalIncome) * 100);

    // Category totals (expenses only)
    const catMap = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => { catMap[t.category] = (catMap[t.category] ?? 0) + t.amount; });
    const catList = Object.entries(catMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // Monthly totals — uses parseLocalDate for timezone-safe month extraction
    const monthly = MONTHS.map((month, idx) => {
      const monthTxs = transactions.filter((t) => parseLocalDate(t.date).getMonth() === idx);
      const income  = monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { month, income, expense };
    });

    // MoM change: compare the two most recent months that have any data
    const activeMonths = monthly.filter((m) => m.income > 0 || m.expense > 0);
    let momChange = 0;
    if (activeMonths.length >= 2) {
      const last = activeMonths[activeMonths.length - 1];
      const prev = activeMonths[activeMonths.length - 2];
      momChange = pctChange(last.expense, prev.expense);
    }

    const highestMonth = monthly.reduce(
      (best, m) => (m.expense > (best?.expense ?? 0) ? m : best),
      null
    );

    const topCategory = catList[0] ?? null;
    // buildInsights called inside the memo so it only re-runs when transactions change
    const insights = buildInsights(savingsRate, topCategory, momChange, highestMonth?.month);

    return { savingsRate, catList, topCategory, monthly, momChange, highestMonth, insights };
  }, [transactions]);

  const { savingsRate, catList, topCategory, monthly, momChange, highestMonth, insights } = analytics;

  const card      = cn('rounded-2xl p-5 border shadow-card', darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200');
  const gridColor = darkMode ? '#2A2E3F' : '#E5E7EB';
  const textColor = darkMode ? '#6B7280' : '#9CA3AF';

  // KPI strip data — built here so the JSX stays clean
  const kpis = [
    {
      id: 'savings', label: 'Savings Rate', value: `${savingsRate}%`, icon: PiggyBank,
      color: savingsRate >= 20 ? 'text-success' : savingsRate >= 10 ? 'text-warning' : 'text-danger',
      bg:    savingsRate >= 20 ? 'bg-success/10' : savingsRate >= 10 ? 'bg-warning/10' : 'bg-danger/10',
    },
    { id: 'top-expense', label: 'Top Expense',   value: topCategory?.name ?? '–', icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10' },
    {
      id: 'mom', label: 'MoM Change', value: `${momChange > 0 ? '+' : ''}${momChange}%`,
      icon:  momChange > 0 ? TrendingDown : TrendingUp,
      color: momChange > 10 ? 'text-danger' : momChange < -10 ? 'text-success' : 'text-accent',
      bg:    momChange > 10 ? 'bg-danger/10' : momChange < -10 ? 'bg-success/10' : 'bg-accent/10',
    },
    { id: 'highest-month', label: 'Highest Month', value: highestMonth?.month ?? '–', icon: Zap, color: 'text-danger', bg: 'bg-danger/10' },
  ];

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── KPI Strip ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {kpis.map(({ id, label, value, icon: Icon, color, bg }, i) => (
          <div
            key={id}
            className={cn(card, 'stagger flex items-center gap-4')}
            style={{ '--delay': `${i * 60}ms` }}
          >
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', bg)}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className={cn('text-xs', darkMode ? 'text-dark-muted' : 'text-gray-400')}>{label}</p>
              <p className={cn('font-display font-bold text-base', darkMode ? 'text-white' : 'text-gray-900')}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Monthly Comparison Bar Chart ────────────────────────────────────── */}
      <div className={cn(card, 'stagger')} style={{ '--delay': '240ms' }}>
        <h2 className={cn('font-display font-semibold text-base mb-1', darkMode ? 'text-white' : 'text-gray-900')}>
          Monthly Comparison
        </h2>
        <p className={cn('text-xs mb-5', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
          Income vs expenses side by side
        </p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthly} margin={{ top: 4, right: 16, bottom: 0, left: 0 }} barGap={3}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis
              tick={{ fill: textColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              width={50}
            />
            <Tooltip content={<BarTooltip darkMode={darkMode} />} />
            <Bar dataKey="income"  name="Income"  fill="#00D4AA" radius={[4,4,0,0]} maxBarSize={28} />
            <Bar dataKey="expense" name="Expense" fill="#FF4D6A" radius={[4,4,0,0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Two-column: Category Breakdown + Smart Insights ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top spending categories with proportional bars */}
        <div className={cn(card, 'stagger')} style={{ '--delay': '320ms' }}>
          <h2 className={cn('font-display font-semibold text-base mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
            Highest Spending Categories
          </h2>
          {catList.length === 0 ? (
            <p className={cn('text-sm', darkMode ? 'text-dark-muted' : 'text-gray-400')}>
              No expense data yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {catList.slice(0, 7).map((cat, i) => {
                const barPct = Math.round((cat.value / catList[0].value) * 100);
                const color  = CATEGORY_COLORS[cat.name] ?? '#6B7280';
                return (
                  <li key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn('text-sm font-medium flex items-center gap-2', darkMode ? 'text-white' : 'text-gray-700')}>
                        {i === 0 && <Award size={13} className="text-warning" />}
                        {cat.name}
                      </span>
                      <span className="font-mono text-sm font-semibold" style={{ color }}>
                        {formatCurrency(cat.value)}
                      </span>
                    </div>
                    <div className={cn('h-1.5 rounded-full overflow-hidden', darkMode ? 'bg-dark-border' : 'bg-gray-100')}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${barPct}%`, background: color }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Dynamic insights panel */}
        <div className={cn(card, 'stagger')} style={{ '--delay': '400ms' }}>
          <h2 className={cn('font-display font-semibold text-base mb-4', darkMode ? 'text-white' : 'text-gray-900')}>
            Smart Insights
          </h2>
          <ul className="space-y-3">
            {insights.map(({ id, icon: Icon, color, text }) => (
              <li
                key={id}
                className={cn('flex items-start gap-3 p-3 rounded-xl', darkMode ? 'bg-dark-300' : 'bg-gray-50')}
              >
                <div className={cn('mt-0.5 flex-shrink-0', color)}>
                  <Icon size={16} />
                </div>
                <p className={cn('text-sm leading-relaxed', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                  {text}
                </p>
              </li>
            ))}
          </ul>

          {/* CTA — wired to real route via useNavigate, not a dead onClick */}
          <button
            onClick={() => navigate('/transactions')}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-accent/30 text-accent text-sm font-medium hover:bg-accent/10 transition-colors"
          >
            View All Transactions <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

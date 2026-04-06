// src/components/charts/MonthlyLineChart.jsx
// Line chart: income vs expense aggregated per calendar month.

import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { useMemo } from 'react';
import { useUI, useTransactions } from '../../context/AppContext';
import { MONTHS, parseLocalDate, formatCurrency } from '../../utils/format';
import { cn } from '../../utils/cn';

function CustomTooltip({ active, payload, label, darkMode }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={cn(
      'rounded-xl px-4 py-3 text-sm shadow-card border',
      darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'
    )}>
      <p className={cn('font-medium mb-2', darkMode ? 'text-white' : 'text-gray-800')}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-mono">
          {p.name}: {formatCurrency(p.value)}
        </p>
      ))}
    </div>
  );
}

export default function MonthlyLineChart() {
  const { darkMode } = useUI();
  const { transactions } = useTransactions();

  // Aggregate income & expense per month using timezone-safe date parsing
  const data = useMemo(() => {
    return MONTHS.map((month, idx) => {
      const monthTxs = transactions.filter((t) => parseLocalDate(t.date).getMonth() === idx);
      const income  = monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = monthTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      return { month, income, expense };
    });
  }, [transactions]);

  const gridColor = darkMode ? '#2A2E3F' : '#E5E7EB';
  const textColor = darkMode ? '#6B7280' : '#9CA3AF';

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fill: textColor, fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: textColor, fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
          width={50}
        />
        <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
        <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12, color: textColor }} />
        <Line
          type="monotone" dataKey="income" name="Income"
          stroke="#00D4AA" strokeWidth={2.5}
          dot={{ r: 3, fill: '#00D4AA', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone" dataKey="expense" name="Expense"
          stroke="#FF4D6A" strokeWidth={2.5}
          dot={{ r: 3, fill: '#FF4D6A', strokeWidth: 0 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

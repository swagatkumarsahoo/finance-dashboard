// src/components/charts/CategoryPieChart.jsx
// Donut-style pie chart breaking down expenses by category.

import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend,
} from 'recharts';
import { useMemo } from 'react';
import { useUI, useTransactions } from '../../context/AppContext';
import { CATEGORY_COLORS } from '../../data/mockData';
import { cn } from '../../utils/cn';

function CustomTooltip({ active, payload, darkMode }) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: { percent } } = payload[0];
  return (
    <div className={cn(
      'rounded-xl px-4 py-3 text-sm shadow-card border',
      darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'
    )}>
      <p className={cn('font-medium mb-1', darkMode ? 'text-white' : 'text-gray-800')}>{name}</p>
      <p className="font-mono text-accent">₹{value.toLocaleString()}</p>
      <p className={cn('text-xs mt-0.5', darkMode ? 'text-dark-muted' : 'text-gray-400')}>
        {(percent * 100).toFixed(1)}% of expenses
      </p>
    </div>
  );
}

function CustomLegend({ payload, darkMode }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3 px-2">
      {payload.map((entry) => (
        <li key={entry.value} className="flex items-center gap-2 text-xs">
          <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: entry.color }} />
          <span className={cn('truncate', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
            {entry.value}
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function CategoryPieChart() {
  const { darkMode } = useUI();
  const { transactions } = useTransactions();

  const data = useMemo(() => {
    const map = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => { map[t.category] = (map[t.category] ?? 0) + t.amount; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={65}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell
              key={entry.name}
              fill={CATEGORY_COLORS[entry.name] ?? '#6B7280'}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
        <Legend content={<CustomLegend darkMode={darkMode} />} verticalAlign="bottom" />
      </PieChart>
    </ResponsiveContainer>
  );
}

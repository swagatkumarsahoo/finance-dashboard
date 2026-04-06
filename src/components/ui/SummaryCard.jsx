// src/components/ui/SummaryCard.jsx
// Reusable stat card with icon, label, value, and optional trend badge.

import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useUI } from '../../context/AppContext';
import { cn } from '../../utils/cn';

SummaryCard.propTypes = {
  label:   PropTypes.string.isRequired,
  value:   PropTypes.string.isRequired,
  icon:    PropTypes.element.isRequired,
  variant: PropTypes.oneOf(['default', 'income', 'expense', 'balance']),
  trend:   PropTypes.number,
  delay:   PropTypes.number,
};

export default function SummaryCard({ label, value, icon, variant = 'default', trend, delay = 0 }) {
  const { darkMode } = useUI();

  const variantStyles = {
    default: {
      bg:     darkMode ? 'bg-dark-card' : 'bg-white',
      icon:   'bg-dark-border text-dark-muted',
      accent: darkMode ? 'border-dark-border' : 'border-gray-200',
    },
    income: {
      bg:     darkMode ? 'bg-dark-card' : 'bg-white',
      icon:   'bg-success/15 text-success',
      accent: 'border-success/20',
    },
    expense: {
      bg:     darkMode ? 'bg-dark-card' : 'bg-white',
      icon:   'bg-danger/15 text-danger',
      accent: 'border-danger/20',
    },
    balance: {
      bg:     'bg-gradient-to-br from-accent/20 to-accent/5',
      icon:   'bg-accent/20 text-accent',
      accent: 'border-accent/20',
    },
  };

  const s = variantStyles[variant];

  const trendColor = trend > 0 ? 'text-success' : trend < 0 ? 'text-danger' : 'text-dark-muted';
  const TrendIcon  = trend > 0 ? TrendingUp   : trend < 0 ? TrendingDown  : Minus;

  return (
    <div
      className={cn('stagger rounded-2xl p-5 border shadow-card', s.bg, s.accent)}
      style={{ '--delay': `${delay}ms` }}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.icon)}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={cn('flex items-center gap-1 text-xs font-medium', trendColor)}>
            <TrendIcon size={13} />
            {Math.abs(trend)}%
          </span>
        )}
      </div>

      {/* Value */}
      <p className={cn('font-mono text-2xl font-bold tracking-tight mb-1', darkMode ? 'text-white' : 'text-gray-900')}>
        {value}
      </p>

      {/* Label */}
      <p className={cn('text-sm', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
        {label}
      </p>
    </div>
  );
}

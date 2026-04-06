// src/components/ui/Badge.jsx
// Small inline label. Supports 'income', 'expense', and generic variants.
//
// Wrapped in React.memo: Badge renders once per table row (80+ rows).
// Both props are primitives, so the shallow comparison is always reliable.
// Without memo, every sort/filter/search re-renders all 80+ badges unnecessarily.

import { memo } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/cn';

// Defined outside the component so the object reference is stable across renders —
// no need to recreate this lookup table on every call.
const STYLES = {
  income:  'bg-success/15 text-success border border-success/20',
  expense: 'bg-danger/15 text-danger border border-danger/20',
  neutral: 'bg-gray-500/15 text-gray-400 border border-gray-500/20',
};

Badge.propTypes = {
  type:  PropTypes.oneOf(['income', 'expense', 'neutral']).isRequired,
  label: PropTypes.string,
};

function Badge({ type, label }) {
  const text = label ?? (type === 'income' ? 'Income' : 'Expense');
  // Resolve the variant class before passing to cn() — cn() cannot evaluate ?? itself
  const variantClass = STYLES[type] ?? STYLES.neutral;
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold', variantClass)}>
      {text}
    </span>
  );
}

export default memo(Badge);

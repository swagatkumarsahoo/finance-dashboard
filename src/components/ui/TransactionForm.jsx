// src/components/ui/TransactionForm.jsx
// Controlled form for creating or editing a transaction.
// Shared between the "Add" and "Edit" modals.

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useUI } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { getTodayLocal } from '../../utils/format';
import { cn } from '../../utils/cn';

// Date is intentionally excluded from this constant.
// It is injected fresh inside the useState lazy initializer so the default
// date is always "today when the form opens" — not "today when the module loaded".
const EMPTY_FORM = {
  description: '',
  category:    CATEGORIES[0],
  amount:      '',
  type:        'expense',
};

TransactionForm.propTypes = {
  /** Pre-filled transaction object for edit mode. Omit for add mode. */
  initial:  PropTypes.object,
  /** Called with the completed transaction object on valid submit. */
  onSave:   PropTypes.func.isRequired,
  /** Called when the user clicks Cancel. */
  onCancel: PropTypes.func.isRequired,
};

export default function TransactionForm({ initial, onSave, onCancel }) {
  const { darkMode } = useUI();

  // Lazy initializer — the function runs on mount, not at module load time.
  // This ensures the default date is always the current local date, even if
  // the component is rendered hours after the module was first imported.
  const [form, setForm] = useState(() => initial ?? { ...EMPTY_FORM, date: getTodayLocal() });
  const [errors, setErrors] = useState({});

  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const validate = () => {
    const e = {};
    if (!form.description.trim())
      e.description = 'Description is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid positive amount';
    if (!form.date)
      e.date = 'Date is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({
      // crypto.randomUUID() — available Chrome 92+, FF 95+, Safari 15.4+.
      // Unlike a module-level counter it is stable across HMR reloads.
      id:          initial?.id ?? crypto.randomUUID(),
      description: form.description.trim(),
      category:    form.category,
      amount:      parseFloat(Number(form.amount).toFixed(2)),
      type:        form.type,
      date:        form.date,
    });
  };

  const inputCls = cn(
    'w-full rounded-xl px-3 py-2.5 text-sm border outline-none transition-colors',
    darkMode
      ? 'bg-dark-300 border-dark-border text-white placeholder:text-dark-muted focus:border-accent'
      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-accent'
  );
  const labelCls = cn('block text-xs font-medium mb-1.5', darkMode ? 'text-dark-muted' : 'text-gray-500');
  const errCls   = 'text-danger text-xs mt-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Type toggle — button group, no single input to link, labelled via fieldset */}
      <fieldset>
        <legend className={labelCls}>Type</legend>
        <div className={cn('flex rounded-xl overflow-hidden border', darkMode ? 'border-dark-border' : 'border-gray-200')}>
          {['income', 'expense'].map((t) => (
            <button
              type="button"
              key={t}
              aria-pressed={form.type === t}
              onClick={() => set('type', t)}
              className={cn(
                'flex-1 py-2 text-sm font-medium capitalize transition-all',
                form.type === t
                  ? t === 'income' ? 'bg-success text-white' : 'bg-danger text-white'
                  : darkMode ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-700'
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Description */}
      <div>
        <label htmlFor="tx-description" className={labelCls}>Description</label>
        <input
          id="tx-description"
          className={inputCls}
          placeholder="e.g. Netflix subscription"
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
        />
        {errors.description && <p className={errCls}>{errors.description}</p>}
      </div>

      {/* Amount + Category */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="tx-amount" className={labelCls}>Amount (₹)</label>
          <input
            id="tx-amount"
            className={inputCls}
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) => set('amount', e.target.value)}
          />
          {errors.amount && <p className={errCls}>{errors.amount}</p>}
        </div>
        <div>
          <label htmlFor="tx-category" className={labelCls}>Category</label>
          <select
            id="tx-category"
            className={inputCls}
            value={form.category}
            onChange={(e) => set('category', e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="tx-date" className={labelCls}>Date</label>
        <input
          id="tx-date"
          className={inputCls}
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
        />
        {errors.date && <p className={errCls}>{errors.date}</p>}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className={cn(
            'flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors border',
            darkMode
              ? 'border-dark-border text-dark-muted hover:text-white hover:border-white/30'
              : 'border-gray-200 text-gray-500 hover:text-gray-800'
          )}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-accent hover:bg-accent-400 text-dark-300 transition-colors"
        >
          {initial ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}

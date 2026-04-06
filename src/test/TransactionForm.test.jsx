// src/test/TransactionForm.test.jsx
// Component tests for the Add/Edit transaction form.
// These test user-visible behaviour — not implementation details.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TransactionForm from '../components/ui/TransactionForm';

// ── Mock AppContext ────────────────────────────────────────────────────────────
// TransactionForm only needs darkMode from useUI — we provide a minimal mock
// so we don't have to mount the full provider tree.
vi.mock('../context/AppContext', () => ({
  useUI: () => ({ darkMode: false }),
}));

// ── Helpers ───────────────────────────────────────────────────────────────────
function renderForm(props = {}) {
  const onSave   = props.onSave   ?? vi.fn();
  const onCancel = props.onCancel ?? vi.fn();
  render(<TransactionForm onSave={onSave} onCancel={onCancel} {...props} />);
  return { onSave, onCancel };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('TransactionForm — validation', () => {
  it('shows an error when description is empty on submit', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
    expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
  });

  it('shows an error when amount is zero', async () => {
    renderForm();
    await userEvent.type(screen.getByPlaceholderText(/e\.g\. Netflix/i), 'Test');
    await userEvent.clear(screen.getByPlaceholderText('0.00'));
    await userEvent.type(screen.getByPlaceholderText('0.00'), '0');
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
    expect(await screen.findByText(/valid positive amount/i)).toBeInTheDocument();
  });

  it('does not call onSave when validation fails', async () => {
    const { onSave } = renderForm();
    // Submit without filling anything in
    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));
    expect(onSave).not.toHaveBeenCalled();
  });
});

describe('TransactionForm — valid submission', () => {
  it('calls onSave with the correct shape on a valid submission', async () => {
    const { onSave } = renderForm();

    await userEvent.type(screen.getByPlaceholderText(/e\.g\. Netflix/i), 'Grocery run');
    await userEvent.type(screen.getByPlaceholderText('0.00'), '350');

    fireEvent.click(screen.getByRole('button', { name: /add transaction/i }));

    expect(onSave).toHaveBeenCalledOnce();
    const saved = onSave.mock.calls[0][0];
    expect(saved.description).toBe('Grocery run');
    expect(saved.amount).toBe(350);
    expect(saved.type).toBe('expense'); // default type
    expect(saved.id).toBeTruthy();      // crypto.randomUUID() produced a value
  });
});

describe('TransactionForm — edit mode', () => {
  it('pre-fills fields from the initial prop', () => {
    const initial = {
      id: 'abc',
      description: 'Existing item',
      category: 'Rent',
      amount: 1200,
      type: 'expense',
      date: '2024-06-01',
    };
    renderForm({ initial });

    expect(screen.getByDisplayValue('Existing item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1200')).toBeInTheDocument();
  });

  it('shows "Save Changes" label in edit mode', () => {
    const initial = {
      id: 'abc',
      description: 'Edit me',
      category: 'Rent',
      amount: 100,
      type: 'expense',
      date: '2024-06-01',
    };
    renderForm({ initial });
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});

describe('TransactionForm — cancel', () => {
  it('calls onCancel when the Cancel button is clicked', async () => {
    const { onCancel } = renderForm();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalledOnce();
  });
});

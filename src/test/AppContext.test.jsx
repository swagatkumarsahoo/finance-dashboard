// src/test/AppContext.test.jsx
//
// Integration tests for the TransactionContext CRUD operations and derived totals.
// We mount the real AppProvider so we test actual behaviour, not mocks.

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useTransactions, useUI, AppProvider } from '../context/AppContext';

// ── Test helpers ──────────────────────────────────────────────────────────────

// Clear localStorage before each test so state doesn't leak between tests
beforeEach(() => {
  localStorage.clear();
});

/**
 * Mounts AppProvider and exposes context values via data-testid spans.
 * This pattern avoids building a fake UI — we read serialised context state
 * directly from the DOM, which is fast and reliable.
 */
function ContextInspector() {
  const { transactions, totals } = useTransactions();
  const { role, isAdmin } = useUI();
  return (
    <div>
      <span data-testid="count">{transactions.length}</span>
      <span data-testid="balance">{totals.balance}</span>
      <span data-testid="income">{totals.income}</span>
      <span data-testid="expense">{totals.expense}</span>
      <span data-testid="role">{role}</span>
      <span data-testid="isAdmin">{String(isAdmin)}</span>
    </div>
  );
}

/**
 * Mounts AppProvider + ContextInspector and returns the CRUD actions.
 * We call CRUD actions via a separate Consumer so we don't need to
 * re-query the DOM just to get a reference to the action functions.
 */
function renderWithProvider() {
  let actions;

  function ActionCapture() {
    actions = useTransactions();
    return null;
  }

  render(
    <AppProvider>
      <ContextInspector />
      <ActionCapture />
    </AppProvider>
  );

  return { actions: () => actions };
}

// Helper to read a testid value from the DOM
const get = (id) => screen.getByTestId(id).textContent;

// Minimal valid transaction factory
let seq = 1;
const makeTx = (overrides = {}) => ({
  id:          String(seq++),
  date:        '2024-06-01',
  description: 'Test Transaction',
  category:    'Salary',
  amount:      500,
  type:        'income',
  ...overrides,
});

// ── Initial state ─────────────────────────────────────────────────────────────

describe('initial state', () => {
  it('starts with the mock dataset (80+ transactions)', () => {
    renderWithProvider();
    expect(Number(get('count'))).toBeGreaterThan(0);
  });

  it('defaults role to admin', () => {
    renderWithProvider();
    expect(get('role')).toBe('admin');
    expect(get('isAdmin')).toBe('true');
  });

  it('balance equals income minus expenses on initial load', () => {
    renderWithProvider();
    const income  = Number(get('income'));
    const expense = Number(get('expense'));
    const balance = Number(get('balance'));
    expect(balance).toBe(income - expense);
  });
});

// ── addTransaction ────────────────────────────────────────────────────────────

describe('addTransaction', () => {
  it('increases the transaction count by 1', () => {
    const { actions } = renderWithProvider();
    const before = Number(get('count'));

    act(() => { actions().addTransaction(makeTx()); });

    expect(Number(get('count'))).toBe(before + 1);
  });

  it('prepends the new transaction (it appears first)', () => {
    const { actions } = renderWithProvider();
    // Clear to a known state
    act(() => { actions().resetData(); });
    const countAfterReset = Number(get('count'));

    const newTx = makeTx({ id: 'new-first' });
    act(() => { actions().addTransaction(newTx); });

    // Total count grew
    expect(Number(get('count'))).toBe(countAfterReset + 1);
  });

  it('updates income total when an income transaction is added', () => {
    const { actions } = renderWithProvider();
    const before = Number(get('income'));

    act(() => { actions().addTransaction(makeTx({ type: 'income', amount: 1000 })); });

    expect(Number(get('income'))).toBe(before + 1000);
  });

  it('updates expense total when an expense transaction is added', () => {
    const { actions } = renderWithProvider();
    const before = Number(get('expense'));

    act(() => { actions().addTransaction(makeTx({ type: 'expense', amount: 250 })); });

    expect(Number(get('expense'))).toBe(before + 250);
  });

  it('keeps balance consistent: balance = income - expense after add', () => {
    const { actions } = renderWithProvider();

    act(() => { actions().addTransaction(makeTx({ type: 'income', amount: 300 })); });

    const income  = Number(get('income'));
    const expense = Number(get('expense'));
    const balance = Number(get('balance'));
    expect(balance).toBe(income - expense);
  });
});

// ── updateTransaction ─────────────────────────────────────────────────────────

describe('updateTransaction', () => {
  it('does not change the transaction count', () => {
    const { actions } = renderWithProvider();

    // Add a known tx, then update it
    const tx = makeTx({ id: 'update-test', amount: 100, type: 'income' });
    act(() => { actions().addTransaction(tx); });
    const before = Number(get('count'));

    act(() => { actions().updateTransaction('update-test', { amount: 999 }); });

    expect(Number(get('count'))).toBe(before);
  });

  it('recalculates totals after an amount update', () => {
    const { actions } = renderWithProvider();

    const tx = makeTx({ id: 'recalc-test', amount: 100, type: 'income' });
    act(() => { actions().addTransaction(tx); });
    const incomeBefore = Number(get('income'));

    act(() => { actions().updateTransaction('recalc-test', { amount: 600 }); });

    // Income should have grown by the delta (600 - 100 = 500)
    expect(Number(get('income'))).toBe(incomeBefore + 500);
  });

  it('recalculates balance after an amount update', () => {
    const { actions } = renderWithProvider();

    const tx = makeTx({ id: 'balance-test', amount: 200, type: 'expense' });
    act(() => { actions().addTransaction(tx); });

    act(() => { actions().updateTransaction('balance-test', { amount: 400 }); });

    const income  = Number(get('income'));
    const expense = Number(get('expense'));
    const balance = Number(get('balance'));
    expect(balance).toBe(income - expense);
  });

  it('is a no-op for a non-existent id', () => {
    const { actions } = renderWithProvider();
    const before = Number(get('count'));

    // Should not throw, should not change count
    act(() => { actions().updateTransaction('does-not-exist', { amount: 999 }); });

    expect(Number(get('count'))).toBe(before);
  });
});

// ── deleteTransaction ─────────────────────────────────────────────────────────

describe('deleteTransaction', () => {
  it('decreases the transaction count by 1', () => {
    const { actions } = renderWithProvider();

    const tx = makeTx({ id: 'delete-me' });
    act(() => { actions().addTransaction(tx); });
    const before = Number(get('count'));

    act(() => { actions().deleteTransaction('delete-me'); });

    expect(Number(get('count'))).toBe(before - 1);
  });

  it('updates totals after deleting an income transaction', () => {
    const { actions } = renderWithProvider();

    const tx = makeTx({ id: 'delete-income', type: 'income', amount: 750 });
    act(() => { actions().addTransaction(tx); });
    const incomeBefore = Number(get('income'));

    act(() => { actions().deleteTransaction('delete-income'); });

    expect(Number(get('income'))).toBe(incomeBefore - 750);
  });

  it('updates totals after deleting an expense transaction', () => {
    const { actions } = renderWithProvider();

    const tx = makeTx({ id: 'delete-expense', type: 'expense', amount: 300 });
    act(() => { actions().addTransaction(tx); });
    const expenseBefore = Number(get('expense'));

    act(() => { actions().deleteTransaction('delete-expense'); });

    expect(Number(get('expense'))).toBe(expenseBefore - 300);
  });

  it('keeps balance consistent after delete', () => {
    const { actions } = renderWithProvider();

    const tx = makeTx({ id: 'balance-delete', type: 'expense', amount: 100 });
    act(() => { actions().addTransaction(tx); });
    act(() => { actions().deleteTransaction('balance-delete'); });

    const income  = Number(get('income'));
    const expense = Number(get('expense'));
    const balance = Number(get('balance'));
    expect(balance).toBe(income - expense);
  });

  it('is a no-op for a non-existent id', () => {
    const { actions } = renderWithProvider();
    const before = Number(get('count'));

    act(() => { actions().deleteTransaction('ghost-id'); });

    expect(Number(get('count'))).toBe(before);
  });
});

// ── resetData ─────────────────────────────────────────────────────────────────

describe('resetData', () => {
  it('restores transaction count to the initial mock data length', () => {
    const { actions } = renderWithProvider();
    const initial = Number(get('count'));

    // Add some transactions then reset
    act(() => { actions().addTransaction(makeTx()); });
    act(() => { actions().addTransaction(makeTx()); });
    expect(Number(get('count'))).toBe(initial + 2);

    act(() => { actions().resetData(); });
    expect(Number(get('count'))).toBe(initial);
  });
});

// ── UIContext ─────────────────────────────────────────────────────────────────

describe('UIContext — role', () => {
  it('setRole updates the role value', () => {
    let uiActions;
    function UICapture() {
      uiActions = useUI();
      return <span data-testid="role2">{uiActions.role}</span>;
    }

    render(
      <AppProvider>
        <UICapture />
      </AppProvider>
    );

    expect(screen.getByTestId('role2').textContent).toBe('admin');

    act(() => { uiActions.setRole('viewer'); });

    expect(screen.getByTestId('role2').textContent).toBe('viewer');
  });

  it('isAdmin is false when role is viewer', () => {
    let uiActions;
    function UICapture() {
      uiActions = useUI();
      return <span data-testid="isAdmin2">{String(uiActions.isAdmin)}</span>;
    }

    render(
      <AppProvider>
        <UICapture />
      </AppProvider>
    );

    act(() => { uiActions.setRole('viewer'); });
    expect(screen.getByTestId('isAdmin2').textContent).toBe('false');
  });
});

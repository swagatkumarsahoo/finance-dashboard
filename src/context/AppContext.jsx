// src/context/AppContext.jsx
//
// Split into two focused contexts to avoid unnecessary re-renders:
//
//   UIContext          — darkMode, role (UI preferences, change rarely)
//   TransactionContext — transactions, totals, CRUD (data, changes on user action)
//
// Each context value is wrapped in useMemo so consumers only re-render
// when their specific slice of state actually changes.
//
// Usage:
//   import { useUI, useTransactions } from '../context/AppContext';

import {
  createContext,
  useContext,
  useMemo,
  useCallback,
} from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

// ── 1. UI Context ─────────────────────────────────────────────────────────────
const UIContext = createContext(null);

// ── 2. Transaction Context ────────────────────────────────────────────────────
const TransactionContext = createContext(null);

// ── Combined Provider (single wrapper in the tree) ────────────────────────────
export function AppProvider({ children }) {

  // ── UI preferences ──────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useLocalStorage('finflow_dark', true);
  // 'admin' | 'viewer'  — UI-only mock; in production this comes from an auth token
  const [role, setRole] = useLocalStorage('finflow_role', 'admin');

  const uiValue = useMemo(() => ({
    darkMode,
    setDarkMode,
    role,
    setRole,
    isAdmin: role === 'admin',
  }), [darkMode, setDarkMode, role, setRole]);

  // ── Transaction data ─────────────────────────────────────────────────────────
  const [transactions, setTransactions] = useLocalStorage(
    'finflow_transactions',
    INITIAL_TRANSACTIONS
  );

  const addTransaction = useCallback((tx) => {
    setTransactions((prev) => [tx, ...prev]);
  }, [setTransactions]);

  const updateTransaction = useCallback((id, updates) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === id ? { ...tx, ...updates } : tx))
    );
  }, [setTransactions]);

  const deleteTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
  }, [setTransactions]);

  const resetData = useCallback(() => {
    setTransactions(INITIAL_TRANSACTIONS);
  }, [setTransactions]);

  // Totals are derived — memoised so they don't recalculate on every render
  const totals = useMemo(() => {
    const income  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [transactions]);

  const transactionValue = useMemo(() => ({
    transactions,
    totals,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    resetData,
  }), [transactions, totals, addTransaction, updateTransaction, deleteTransaction, resetData]);

  return (
    <UIContext.Provider value={uiValue}>
      <TransactionContext.Provider value={transactionValue}>
        {children}
      </TransactionContext.Provider>
    </UIContext.Provider>
  );
}

// ── Custom hooks ──────────────────────────────────────────────────────────────

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error('useUI must be used within AppProvider');
  return ctx;
}

export function useTransactions() {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be used within AppProvider');
  return ctx;
}

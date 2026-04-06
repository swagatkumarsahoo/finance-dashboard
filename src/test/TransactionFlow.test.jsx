// src/test/TransactionFlow.test.jsx
//
// End-to-end style integration test.
// Mounts the real AppProvider + Transactions page — no mocking.
//
// Scenario: add a transaction → verify it appears in the table
//           → delete it → verify it is removed.
//
// Why this test is valuable:
//   The AppContext and Transactions page tests verify their layers in isolation.
//   This test verifies they work together: that the form calls addTransaction,
//   that the table re-renders with the new row, that the delete confirmation
//   calls deleteTransaction, and that the row disappears from the DOM.

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AppProvider } from '../context/AppContext';
import Transactions from '../pages/Transactions';

// Reset localStorage before each test so the mock dataset is always fresh
beforeEach(() => {
  localStorage.clear();
});

// ── Test wrapper ──────────────────────────────────────────────────────────────
// MemoryRouter instead of BrowserRouter: no DOM history API needed in tests.
// Real AppProvider: we test actual state transitions, not mocked ones.

function renderPage() {
  render(
    <MemoryRouter>
      <AppProvider>
        <Transactions />
      </AppProvider>
    </MemoryRouter>
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('Transaction flow: add → verify → delete → verify gone', () => {
  it('adds a new transaction, shows it in the table, then deletes it', async () => {
    const user = userEvent.setup();
    renderPage();

    // ── 1. Open the Add Transaction modal ────────────────────────────────────
    await user.click(screen.getByRole('button', { name: /add transaction/i }));

    // Modal should now be visible
    expect(screen.getByRole('heading', { name: /add transaction/i })).toBeInTheDocument();

    // ── 2. Fill in the form ──────────────────────────────────────────────────
    // Label selectors match the htmlFor/id pairs set in TransactionForm.jsx
    await user.type(screen.getByLabelText(/description/i), 'Integration Test Payment');
    await user.type(screen.getByLabelText(/amount/i), '250');

    // ── 3. Submit the form ───────────────────────────────────────────────────
    // There are two "Add Transaction" buttons at this point:
    // the toolbar button (now behind the modal overlay) and the form submit button.
    // The form submit button is inside the modal — target by its specific role within the form.
    const submitBtn = screen.getAllByRole('button', { name: /add transaction/i })
      .find(btn => btn.getAttribute('type') === 'submit');
    await user.click(submitBtn);

    // ── 4. Verify the new row appears in the table ───────────────────────────
    expect(await screen.findByText('Integration Test Payment')).toBeInTheDocument();

    // ── 5. Click the delete button for that specific row ─────────────────────
    // The aria-label is set dynamically: `Delete ${tx.description}` in Transactions.jsx
    await user.click(screen.getByRole('button', { name: /delete integration test payment/i }));

    // ── 6. Confirm deletion in the modal ─────────────────────────────────────
    // The confirmation modal has a "Delete" button (text only, no aria-label)
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    // ── 7. Verify the row is removed from the DOM ─────────────────────────────
    await waitFor(() => {
      expect(screen.queryByText('Integration Test Payment')).not.toBeInTheDocument();
    });
  });
});

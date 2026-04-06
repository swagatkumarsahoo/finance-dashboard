# FinFlow — Finance Dashboard

A modern finance dashboard built as a frontend assessment, focused on clean architecture, state management, and testable UI logic.

![FinFlow Dashboard](https://placehold.co/900x500/1E2130/00D4AA?text=FinFlow+Finance+Dashboard&font=sora)

---

## Overview

FinFlow is a responsive dashboard that allows users to:

- Track income and expenses
- Manage transactions (add, edit, delete)
- View insights through charts and KPIs
- Experience role-based UI behavior

The project emphasizes **maintainability, performance, and testability** over visual complexity.

---

## Tech Stack

| Layer       | Choice                                       |
| ----------- | -------------------------------------------- |
| Framework   | React 18 + Vite                              |
| Routing     | React Router v6                              |
| Styling     | Tailwind CSS (custom dark/light theme)       |
| Charts      | Recharts                                     |
| Icons       | Lucide React                                 |
| State       | Context API (UIContext + TransactionContext) |
| Persistence | localStorage via custom hook                 |
| Testing     | Vitest + React Testing Library               |
| Tooling     | ESLint                                       |

---

## Getting Started

```bash
npm install
npm run dev        # start dev server
npm test           # run tests
npm run test:watch # watch mode
npm run build      # production build
```

---

## Project Structure

```
src/
├── components/
│   ├── charts/
│   ├── layout/
│   └── ui/
├── context/
│   └── AppContext.jsx
├── data/
│   └── mockData.js
├── hooks/
│   ├── useLocalStorage.js
│   └── useLocalStorage.test.js
├── pages/
│   ├── Dashboard.jsx
│   ├── Insights.jsx
│   └── Transactions.jsx
├── test/
│   ├── AppContext.test.jsx
│   ├── TransactionFlow.test.jsx
│   ├── TransactionForm.test.jsx
│   └── setup.js
└── utils/
    ├── cn.js
    ├── format.js
    ├── format.test.js
    ├── transactions.js
    └── transactions.test.js
```

---

## Key Decisions

### 1. Split Context for Performance

UI state (`darkMode`, `role`) and data state (`transactions`, CRUD) are separated.

This prevents unnecessary re-renders:

- UI changes don’t re-render heavy data components
- Data updates don’t affect layout components

---

### 2. Extracted Business Logic (Testability First)

Filtering, searching, and sorting logic is extracted into:

```
src/utils/transactions.js
```

This allows:

- Fast unit testing (no React dependency)
- Cleaner components
- Better separation of concerns

---

### 3. Tailwind Class Safety (`cn()`)

Dynamic template strings can break Tailwind’s purge step.

A small `cn()` utility ensures:

- Classes remain statically analyzable
- Cleaner conditional styling
- Consistent usage across components

---

### 4. Timezone-safe Date Handling

Native parsing of `YYYY-MM-DD` uses UTC and can shift dates.

`parseLocalDate` ensures correct local interpretation using:

```js
new Date(year, month - 1, day);
```

---

### 5. Efficient Date Sorting

Dates are sorted using:

```js
a.date.localeCompare(b.date);
```

This avoids unnecessary `Date` object creation while remaining correct.

---

### 6. Role-based UI (Simulated)

Role switching is UI-only:

- Viewer → read-only
- Admin → full CRUD

In production, roles would come from backend authentication (e.g., JWT claims).

---

## Testing Approach

The test suite focuses on **behavior, not implementation details**:

- **Utilities** → pure logic (fast, isolated)
- **Hooks** → state + persistence behavior
- **Context** → real provider integration
- **Components** → validation and UI contracts
- **Flow test** → add → render → delete cycle

This layered approach keeps tests:

- Fast
- Reliable
- Maintainable

---

## Known Limitations

- No backend (localStorage used for persistence)
- Partial E2E coverage (single flow test)
- Modal does not implement full focus trap
- Pagination not implemented for large datasets

---

## Future Improvements

- Backend integration with API (React Query)
- Full E2E testing (Playwright)
- Accessibility improvements (focus trap, ARIA refinements)
- Pagination and advanced filtering
- Export transactions (CSV)

---

## Live Demo

https://finance-dashboard-iota-tan.vercel.app/

---

## Author

- Swagat Kumar Sahoo
- G-mail: swagatksahoo.dev@gmail.com
- Website: https://friendly-sherbet-50f474.netlify.app/


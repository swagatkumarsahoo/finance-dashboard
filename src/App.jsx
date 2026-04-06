// src/App.jsx

import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout       from './components/layout/Layout';
import Dashboard    from './pages/Dashboard';
import Transactions from './pages/Transactions';

// Insights is the only page that imports Recharts' BarChart (~400 KB parsed).
// Lazy-loading it means that code is excluded from the initial bundle and is
// only fetched when the user navigates to /insights for the first time.
// Dashboard and Transactions are loaded eagerly because one of them is always
// the landing page.
const Insights = lazy(() => import('./pages/Insights'));

// Minimal fallback shown while the Insights chunk downloads.
// Reuses the app's existing dark background so there's no flash of white.
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-full py-24">
      <div className="text-dark-muted text-sm animate-pulse">Loading…</div>
    </div>
  );
}

export default function App() {
  return (
    // BrowserRouter must wrap everything so NavLink/useNavigate/useLocation work
    <BrowserRouter>
      {/*
        AppProvider sits inside BrowserRouter so context consumers
        can safely call useNavigate() if needed (e.g. the Insights CTA).
      */}
      <AppProvider>
        <Layout>
          <Routes>
            <Route path="/"             element={<Dashboard />}    />
            <Route path="/transactions" element={<Transactions />} />
            <Route
              path="/insights"
              element={
                <Suspense fallback={<PageLoader />}>
                  <Insights />
                </Suspense>
              }
            />
            {/* Redirect any unknown URL back to home instead of a blank screen */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AppProvider>
    </BrowserRouter>
  );
}

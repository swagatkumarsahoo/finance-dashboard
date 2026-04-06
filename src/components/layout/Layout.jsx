// src/components/layout/Layout.jsx

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useUI } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import Sidebar from './Sidebar';
import Header  from './Header';

export default function Layout({ children }) {
  const { darkMode } = useUI();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Sync dark-mode class on <html> so Tailwind's 'dark:' utilities apply globally
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.body.classList.toggle('light', !darkMode);
  }, [darkMode]);

  // Close mobile drawer whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <div className={cn('flex h-screen overflow-hidden', darkMode ? 'bg-dark-300' : 'bg-dark-50')}>

      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* ── Mobile Sidebar Drawer ───────────────────────────────────────── */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full z-50 md:hidden animate-slide-up">
            <Sidebar />
          </div>
        </>
      )}

      {/* ── Right Column: Header + Content ─────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center px-4 py-3 border-b border-dark-border bg-dark-200">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-dark-muted hover:text-white transition-colors mr-3"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <span className="font-display font-bold text-accent text-lg">FinFlow</span>
        </div>

        <Header />

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// src/components/layout/Sidebar.jsx

import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ArrowLeftRight, Lightbulb,
  ChevronLeft, ChevronRight, Moon, Sun,
  ShieldCheck, Eye, RotateCcw, Zap,
} from 'lucide-react';
import { useUI, useTransactions } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import Modal from '../ui/Modal';

// Each item maps a display label to a real URL path.
// NavLink reads the URL and handles active state automatically.
const NAV_ITEMS = [
  { path: '/',             label: 'Dashboard',    icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight  },
  { path: '/insights',     label: 'Insights',     icon: Lightbulb       },
];

export default function Sidebar() {
  const { darkMode, setDarkMode, role, setRole } = useUI();
  const { resetData } = useTransactions();
  const [collapsed, setCollapsed] = useState(false);
  // Replace window.confirm() with a proper in-component modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleConfirmReset = () => {
    resetData();
    setShowResetConfirm(false);
  };

  return (
    <>
      <aside
        className={cn(
          'relative flex flex-col h-screen z-30 transition-all duration-300 ease-in-out border-r flex-shrink-0',
          collapsed ? 'w-[72px]' : 'w-[220px]',
          darkMode ? 'bg-dark-200 border-dark-border' : 'bg-white border-gray-200'
        )}
      >
        {/* ── Logo ───────────────────────────────────────────────────────── */}
        <div className={cn('flex items-center gap-3 px-4 py-5 border-b', darkMode ? 'border-dark-border' : 'border-gray-200')}>
          <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0 shadow-glow">
            <Zap size={16} className="text-dark-300 fill-dark-300" />
          </div>
          {!collapsed && (
            <span className="font-display font-bold text-lg tracking-tight text-gradient">
              FinFlow
            </span>
          )}
        </div>

        {/* ── Navigation ─────────────────────────────────────────────────── */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              // NavLink's `end` prop on "/" prevents it matching every route
              end={path === '/'}
              title={collapsed ? label : undefined}
              className={({ isActive }) => cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : darkMode
                    ? 'text-dark-muted hover:text-white hover:bg-dark-border/50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-accent rounded-r-full" />
                  )}
                  <Icon size={18} className="flex-shrink-0" strokeWidth={isActive ? 2.5 : 1.8} />
                  {!collapsed && <span>{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Bottom controls ─────────────────────────────────────────────── */}
        <div className={cn('p-3 border-t space-y-2', darkMode ? 'border-dark-border' : 'border-gray-200')}>

          {/* Role Switcher — expanded */}
          {!collapsed && (
            <div className={cn('rounded-xl p-3', darkMode ? 'bg-dark-300' : 'bg-gray-50')}>
              <p className={cn('text-xs font-medium mb-2', darkMode ? 'text-dark-muted' : 'text-gray-400')}>
                Active Role
              </p>
              <p className={cn('text-xs mb-2', darkMode ? 'text-dark-muted/60' : 'text-gray-300')}>
                UI-only mock. In production, role derives from an auth token.
              </p>
              <div className="flex rounded-lg overflow-hidden border border-dark-border/50">
                {['admin', 'viewer'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium transition-all duration-150 capitalize',
                      role === r
                        ? r === 'admin' ? 'bg-accent text-dark-300' : 'bg-blue-500 text-white'
                        : darkMode ? 'text-dark-muted hover:text-white' : 'text-gray-400 hover:text-gray-700'
                    )}
                  >
                    {r === 'admin' ? <ShieldCheck size={12} /> : <Eye size={12} />}
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Role Switcher — collapsed icon */}
          {collapsed && (
            <button
              onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
              title={`Switch to ${role === 'admin' ? 'viewer' : 'admin'}`}
              className="w-full flex items-center justify-center p-2 rounded-xl transition-colors hover:bg-dark-border/50"
            >
              {role === 'admin'
                ? <ShieldCheck size={18} className="text-accent" />
                : <Eye size={18} className="text-blue-400" />
              }
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              darkMode
                ? 'text-dark-muted hover:text-white hover:bg-dark-border/50'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            )}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            {!collapsed && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          {/* Reset Data — opens modal instead of window.confirm() */}
          {!collapsed && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-150 text-dark-muted hover:text-danger',
                darkMode ? 'hover:bg-danger/10' : 'hover:bg-red-50'
              )}
            >
              <RotateCcw size={14} />
              Reset Data
            </button>
          )}
        </div>

        {/* ── Collapse toggle ─────────────────────────────────────────────── */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'absolute -right-3 top-[72px] w-6 h-6 rounded-full border flex items-center justify-center transition-colors z-40 shadow-card',
            darkMode
              ? 'bg-dark-200 border-dark-border text-dark-muted hover:text-white'
              : 'bg-white border-gray-200 text-gray-400 hover:text-gray-700'
          )}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* ── Reset Confirmation Modal ───────────────────────────────────────── */}
      {showResetConfirm && (
        <Modal title="Reset all data?" onClose={() => setShowResetConfirm(false)}>
          <div className="space-y-4">
            <p className={cn('text-sm', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
              This will restore all transactions to the original demo data. Any changes you have
              made will be permanently lost.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className={cn(
                  'flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors',
                  darkMode
                    ? 'border-dark-border text-dark-muted hover:text-white'
                    : 'border-gray-200 text-gray-500 hover:text-gray-800'
                )}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-danger hover:bg-red-500 text-white transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

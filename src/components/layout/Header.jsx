// src/components/layout/Header.jsx

import { useLocation } from 'react-router-dom';
import { ShieldCheck, Eye } from 'lucide-react';
import { useUI } from '../../context/AppContext';
import { cn } from '../../utils/cn';

// Map URL pathnames to display metadata
const PAGE_META = {
  '/':             { title: 'Dashboard',    subtitle: 'Overview of your financial health'        },
  '/transactions': { title: 'Transactions', subtitle: 'Manage and review your transactions'      },
  '/insights':     { title: 'Insights',     subtitle: 'Smart analysis of your spending patterns' },
};

export default function Header() {
  // useLocation gives us the current URL without touching context at all
  const { pathname } = useLocation();
  const { role, darkMode } = useUI();

  const { title, subtitle } = PAGE_META[pathname] ?? PAGE_META['/'];

  return (
    <header
      className={cn(
        'sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm',
        darkMode ? 'bg-dark-300/90 border-dark-border' : 'bg-white/90 border-gray-200'
      )}
    >
      <div>
        <h1 className={cn('font-display font-bold text-xl', darkMode ? 'text-white' : 'text-gray-900')}>
          {title}
        </h1>
        <p className={cn('text-sm mt-0.5', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
          {subtitle}
        </p>
      </div>

      <div
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border',
          role === 'admin'
            ? 'border-accent/30 bg-accent/10 text-accent'
            : 'border-blue-500/30 bg-blue-500/10 text-blue-400'
        )}
      >
        {role === 'admin' ? <ShieldCheck size={13} /> : <Eye size={13} />}
        {role === 'admin' ? 'Admin' : 'Viewer'}
      </div>
    </header>
  );
}

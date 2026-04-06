// src/components/ui/EmptyState.jsx
// Shown when a list/table has no items to display.

import { useUI } from '../../context/AppContext';
import { cn } from '../../utils/cn';

export default function EmptyState({ icon, title, description, action }) {
  const { darkMode } = useUI();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className={cn(
        'w-16 h-16 rounded-2xl flex items-center justify-center mb-4',
        darkMode ? 'bg-dark-border text-dark-muted' : 'bg-gray-100 text-gray-400'
      )}>
        {icon}
      </div>

      <h3 className={cn('font-display font-semibold text-lg mb-2', darkMode ? 'text-white' : 'text-gray-800')}>
        {title}
      </h3>

      <p className={cn('text-sm max-w-xs', darkMode ? 'text-dark-muted' : 'text-gray-500')}>
        {description}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
}

// src/components/ui/Modal.jsx
//
// Overlay modal with keyboard (Escape) dismiss and backdrop-click to close.
// Note: this does not implement a full focus trap. In a production app you
// would use focus-trap-react or the native <dialog> element to constrain
// keyboard focus inside the modal.

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { useUI } from '../../context/AppContext';
import { cn } from '../../utils/cn';

Modal.propTypes = {
  title:    PropTypes.string.isRequired,
  onClose:  PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};

export default function Modal({ title, onClose, children }) {
  const { darkMode } = useUI();

  // Close when the user presses Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className={cn(
          'relative w-full max-w-md rounded-2xl shadow-card border animate-slide-up',
          darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-gray-200'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between px-6 py-4 border-b',
          darkMode ? 'border-dark-border' : 'border-gray-200'
        )}>
          <h2 className={cn('font-display font-semibold text-base', darkMode ? 'text-white' : 'text-gray-900')}>
            {title}
          </h2>
          <button
            aria-label="Close modal"
            onClick={onClose}
            className={cn(
              'p-1.5 rounded-lg transition-colors',
              darkMode
                ? 'text-dark-muted hover:text-white hover:bg-dark-border'
                : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
            )}
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {children}
        </div>
      </div>
    </div>
  );
}

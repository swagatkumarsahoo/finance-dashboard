// src/hooks/useLocalStorage.js
// Custom hook that syncs state with localStorage for persistence across reloads.

import { useState, useEffect, useRef } from 'react';

/**
 * Drop-in replacement for useState that persists to localStorage.
 *
 * LIMITATION: key is read once on mount. If the key prop changes between
 * renders the old key is written to but never cleaned up, causing a storage
 * leak. All callers in this app pass hardcoded string literals so this is
 * safe, but a dev-mode warning fires immediately if the rule is violated.
 *
 * @param {string} key      - The localStorage key to read/write. Must be stable.
 * @param {*}      initial  - Default value if key is not in storage yet.
 */
function useLocalStorage(key, initial) {
  // Track the key we were first called with so we can warn on change
  const mountedKeyRef = useRef(key);

  if (process.env.NODE_ENV !== 'production' && mountedKeyRef.current !== key) {
    // This fires synchronously during render — intentional, matches React's
    // own "rules of hooks" warning pattern. Use a stable key string.
    console.warn(
      `[useLocalStorage] key changed from "${mountedKeyRef.current}" to "${key}". ` +
      'The old key remains in storage. Pass a stable key (e.g. a module-level constant).'
    );
  }

  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : initial;
    } catch {
      // JSON.parse failed — corrupt storage entry, fall back to initial
      return initial;
    }
  });

  // Sync to localStorage whenever value changes.
  // Also re-syncs if key changes (writes to the new key).
  // The old key is deliberately NOT removed — callers must pass stable keys.
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Silently ignore — e.g. private browsing mode, storage quota exceeded
    }
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;

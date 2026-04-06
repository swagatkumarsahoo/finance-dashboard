// src/utils/cn.js
//
// className helper — merges class strings, ignoring falsy values.
// Self-contained implementation so there's no external dependency.
// Drop-in compatible with the clsx API used throughout the codebase.
//
// Usage:
//   cn('base', condition && 'extra', darkMode ? 'dark' : 'light')
//   → "base extra dark"  (falsy values are skipped)
//
// Why not template literals?
// Template literals like `base ${cond ? 'a' : 'b'}` cannot be statically
// analysed by Tailwind's content scanner — classes inside ternary expressions
// may be purged in production builds. cn() takes plain string literals that
// the scanner can always find.

/**
 * Merge class names, filtering out falsy values.
 * @param {...(string|boolean|null|undefined)} inputs
 * @returns {string}
 */
export function cn(...inputs) {
  return inputs
    .filter(Boolean)
    .join(' ');
}

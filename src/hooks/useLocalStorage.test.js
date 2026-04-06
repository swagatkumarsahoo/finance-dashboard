// src/hooks/useLocalStorage.test.js
// Tests for the useLocalStorage hook — persistence, fallback, and key-change guard.

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useLocalStorage from './useLocalStorage';

// Isolate localStorage state between tests
beforeEach(() => {
  localStorage.clear();
});

describe('useLocalStorage', () => {
  it('returns the initial value when key is not in storage', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'hello'));
    expect(result.current[0]).toBe('hello');
  });

  it('persists a new value to localStorage on set', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

    act(() => { result.current[1]('updated'); });

    expect(result.current[0]).toBe('updated');
    expect(JSON.parse(localStorage.getItem('test-key'))).toBe('updated');
  });

  it('reads an existing value from localStorage on mount', () => {
    localStorage.setItem('pre-seeded', JSON.stringify('from-storage'));
    const { result } = renderHook(() => useLocalStorage('pre-seeded', 'fallback'));
    expect(result.current[0]).toBe('from-storage');
  });

  it('works with objects, not just primitives', () => {
    const { result } = renderHook(() => useLocalStorage('obj-key', { a: 1 }));
    act(() => { result.current[1]({ a: 99, b: 'updated' }); });
    expect(result.current[0]).toEqual({ a: 99, b: 'updated' });
  });

  it('falls back to initial value when stored JSON is corrupt', () => {
    localStorage.setItem('corrupt-key', 'not valid json {{{');
    const { result } = renderHook(() => useLocalStorage('corrupt-key', 'safe-default'));
    expect(result.current[0]).toBe('safe-default');
  });

  it('warns in dev when the key changes between renders', () => {
    // Intercept console.warn — the guard fires synchronously during render
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    let currentKey = 'key-a';
    const { rerender } = renderHook(() => useLocalStorage(currentKey, 'value'));

    currentKey = 'key-b';
    rerender();

    expect(warnSpy).toHaveBeenCalledOnce();
    expect(warnSpy.mock.calls[0][0]).toContain('key-a');
    expect(warnSpy.mock.calls[0][0]).toContain('key-b');

    warnSpy.mockRestore();
  });
});

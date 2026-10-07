import { useState, useCallback } from 'react';

/** localStorage-backed array of strings, with push (dedupe + cap) and toggle. */
export function useLocalArray(key, max = 30) {
  const [items, setItems] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(window.localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  });

  const write = useCallback((next) => {
    try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* noop */ }
  }, [key]);

  const push = useCallback((value) => {
    setItems(prev => {
      const filtered = prev.filter(v => v.toLowerCase() !== value.toLowerCase());
      const next = [...filtered, value].slice(-max);
      write(next);
      return next;
    });
  }, [write, max]);

  const toggle = useCallback((value) => {
    setItems(prev => {
      const exists = prev.some(v => v.toLowerCase() === value.toLowerCase());
      const next = exists
        ? prev.filter(v => v.toLowerCase() !== value.toLowerCase())
        : [...prev, value];
      write(next);
      return next;
    });
  }, [write]);

  return { items, push, toggle };
}

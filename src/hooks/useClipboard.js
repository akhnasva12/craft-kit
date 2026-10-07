import { useState, useCallback, useRef } from 'react';

export function useClipboard(timeout = 1600) {
  const [copiedValue, setCopiedValue] = useState(null);
  const timer = useRef(null);

  const copy = useCallback(async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(label ?? value);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopiedValue(null), timeout);
      return true;
    } catch {
      return false;
    }
  }, [timeout]);

  return { copy, copiedValue };
}

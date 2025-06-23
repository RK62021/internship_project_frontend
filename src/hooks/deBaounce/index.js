import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any fast-changing value
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in ms (default: 500ms)
 * @returns The debounced value
 */
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;

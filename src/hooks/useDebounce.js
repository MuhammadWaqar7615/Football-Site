import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any value (e.g. search input) by specified delay in milliseconds.
 *
 * @param {*} value - The input value to debounce
 * @param {number} [delay=300] - Delay in milliseconds (defaults to 300ms as per SRS)
 * @returns {*} The debounced value
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;


'use client';
import { useState, useEffect } from 'react';

/**
 * Helper to safely get the initial state from localStorage.
 */
function getInitialState<T>(key: string, defaultValue: T): T {
  // Can't access localStorage on the server
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  const savedValue = localStorage.getItem(key);
  if (savedValue !== null) {
    try {
      return JSON.parse(savedValue);
    } catch (e) {
      console.error(`Error parsing localStorage key "${key}":`, e);
      return defaultValue;
    }
  }

  return defaultValue;
}

/**
 * useLocalStorageState
 * A custom hook that persists state to localStorage.
 * It's a reactive wrapper around `useState` that automatically
 * syncs with localStorage on state changes.
 * @param key The key to use in localStorage.
 * @param defaultValue The default value if nothing is found in localStorage.
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() =>
    getInitialState(key, defaultValue)
  );

  // Effect to update localStorage when the state changes
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.error(`Error setting localStorage key "${key}":`, e);
    }
  }, [key, state]);

  // Listen for changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setState(JSON.parse(e.newValue));
        } catch (error) {
           console.error(`Error parsing localStorage key "${key}" from storage event:`, error);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [state, setState];
}

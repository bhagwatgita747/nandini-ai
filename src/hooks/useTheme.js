import { useState, useEffect } from 'react';

const THEME_KEY = 'nandini-ai-theme';

// Get initial theme from localStorage or system preference
const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;

  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored !== null) {
      return stored === 'dark';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
};

export const useTheme = () => {
  const [isDark, setIsDark] = useState(getInitialTheme);
  const [mounted, setMounted] = useState(false);

  // Apply theme class immediately on mount
  useEffect(() => {
    setMounted(true);
    const initialDark = getInitialTheme();
    setIsDark(initialDark);

    // Apply the class immediately
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Update document class and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;

    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDark, mounted]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
};

export default useTheme;

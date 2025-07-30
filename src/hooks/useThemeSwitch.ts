'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export const useThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return {
    theme: mounted ? resolvedTheme : undefined,
    setTheme,
    toggleTheme,
    mounted,
  };
};
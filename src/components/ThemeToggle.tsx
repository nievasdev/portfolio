'use client';

import React, { useState, useEffect } from 'react';
import { Button } from './ui';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize based on system preference if no localStorage
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default fallback
  });

  useEffect(() => {
    // Check if there's a saved theme preference
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Use saved preference
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.remove('light-theme');
      } else {
        document.documentElement.classList.add('light-theme');
      }
    } else {
      // No saved preference, detect system theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      
      if (prefersDark) {
        document.documentElement.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      }
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-change if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        const isDark = e.matches;
        setIsDarkMode(isDark);
        
        if (isDark) {
          document.documentElement.classList.remove('light-theme');
        } else {
          document.documentElement.classList.add('light-theme');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Cleanup
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    
    // Update the document class
    if (newIsDarkMode) {
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light-theme');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
  };

  return (
    <Button
      className="group bg-spacial-3 hover:bg-spacial-2 text-white font-semibold px-4 py-3 transition-all duration-200 relative overflow-hidden"
      size="lg"
      variant="solid"
      onClick={toggleTheme}
    >
      <span className="button-text relative z-10">
        {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Light' : 'Dark'}
      </span>
      <div className="shimmer-effect absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"></div>
    </Button>
  );
}
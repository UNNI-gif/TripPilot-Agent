import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  terracotta: {
    id: 'terracotta',
    name: 'Sahara & Terracotta',
    icon: '☀️',
    badge: 'Editorial',
  },
  alpine: {
    id: 'alpine',
    name: 'Alpine & Sage',
    icon: '🌲',
    badge: 'Organic',
  },
  amalfi: {
    id: 'amalfi',
    name: 'Amalfi Coast',
    icon: '🍋',
    badge: 'Coastal',
  },
  dusk: {
    id: 'dusk',
    name: 'Desert Dusk',
    icon: '🌌',
    badge: 'Twilight',
  },
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('trippilot_theme') || 'terracotta';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('trippilot_theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

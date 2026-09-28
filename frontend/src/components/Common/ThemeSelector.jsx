import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, ChevronDown } from 'lucide-react';

export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeTheme = themes[theme] || themes.terracotta;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold theme-btn transition-all shadow-sm"
        title="Change Visual Theme"
      >
        <span className="text-sm">{activeTheme.icon}</span>
        <span className="hidden md:inline">{activeTheme.name}</span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-52 rounded-xl theme-card border shadow-xl p-1.5 z-50">
          <div className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 theme-text-muted">
            Curated Color Palettes
          </div>
          <div className="space-y-1">
            {Object.values(themes).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                  theme === t.id
                    ? 'theme-active-item font-bold'
                    : 'hover:bg-sand-200/50 text-slate-700 dark:hover:bg-stone-800 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-base">{t.icon}</span>
                  <span>{t.name}</span>
                </div>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded border border-current opacity-70">
                  {t.badge}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

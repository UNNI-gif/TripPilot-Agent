import React from 'react';
import { Compass, Plus, Bookmark, Download, Sparkles, Navigation } from 'lucide-react';
import { ThemeSelector } from './ThemeSelector';

export function Navbar({ onNewTrip, savedCount, onOpenSaved, onOpenExport, hasActiveTrip }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md" style={{ backgroundColor: 'var(--theme-nav-bg)', borderColor: 'var(--theme-border)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewTrip}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-terracotta-600 to-ochre-500 flex items-center justify-center shadow-md shadow-terracotta-500/25 ring-1 ring-white/30">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight font-serif" style={{ color: 'var(--theme-text)' }}>
                TripPilot
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded theme-badge font-sans">
                Curator
              </span>
            </div>
            <p className="text-[11px] theme-text-muted font-medium">Bespoke Travel Copilot</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Visual Theme Selector */}
          <ThemeSelector />

          <button
            onClick={onNewTrip}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg theme-btn transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
            <span>New Trip</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg theme-btn transition-all shadow-sm"
          >
            <Bookmark className="w-4 h-4" style={{ color: 'var(--theme-gold)' }} />
            <span>Saved ({savedCount})</span>
          </button>

          {hasActiveTrip && (
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-white theme-primary-btn transition-all shadow-md shadow-terracotta-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
}

import React from 'react';
import { Compass, Plus, Bookmark, Download, Sparkles, Plane } from 'lucide-react';

export function Navbar({ onNewTrip, savedCount, onOpenSaved, onOpenExport, hasActiveTrip }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={onNewTrip}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/25 ring-1 ring-white/20">
            <Plane className="w-5 h-5 text-white transform -rotate-45" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent">
                TripPilot
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Agent 2.0
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Autonomous Travel Copilot</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onNewTrip}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 transition-all hover:border-slate-600 shadow-sm"
          >
            <Plus className="w-4 h-4 text-sky-400" />
            <span>New Trip</span>
          </button>

          <button
            onClick={onOpenSaved}
            className="relative flex items-center space-x-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-200 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 transition-all hover:border-slate-600"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>Saved ({savedCount})</span>
          </button>

          {hasActiveTrip && (
            <button
              onClick={onOpenExport}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-lg text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all shadow-md shadow-sky-500/20"
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

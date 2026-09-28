import React from 'react';
import { Sun, CloudRain, CheckSquare, ShieldAlert, Sparkles, MapPin, Calendar } from 'lucide-react';

export function TripOverviewCard({ overview, title, durationDays }) {
  if (!overview) return null;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 mb-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{overview.destination}</span>
            <span>•</span>
            <Calendar className="w-3.5 h-3.5" />
            <span>{durationDays || overview.duration_days} Days Journey</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {title || overview.tagline}
          </h2>
          {overview.tagline && (
            <p className="text-xs sm:text-sm text-slate-300 mt-1 italic">
              "{overview.tagline}"
            </p>
          )}
        </div>
      </div>

      {/* Quick context cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Climate & Season */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-1.5">
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Best Season & Climate</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-slate-200">{overview.best_season}:</span> {overview.weather_summary}
          </p>
        </div>

        {/* Local Customs & Tips */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-1.5">
            <ShieldAlert className="w-4 h-4 text-emerald-400" />
            <span>Local Culture & Etiquette</span>
          </div>
          <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
            {(overview.local_customs_and_safety || []).slice(0, 3).map((tip, idx) => (
              <li key={idx} className="line-clamp-1">{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Packing Essentials */}
      {overview.packing_list && overview.packing_list.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-slate-800">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 mb-2">
            <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
            <span>Smart Packing Checklist:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {overview.packing_list.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800/80 text-slate-300 border border-slate-700/60"
              >
                ✓ {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Sun, CloudRain, CheckSquare, ShieldAlert, Sparkles, MapPin, Calendar } from 'lucide-react';

export function TripOverviewCard({ overview, title, durationDays }) {
  if (!overview) return null;

  return (
    <div className="theme-card rounded-2xl p-5 sm:p-7 mb-6 shadow-warm border relative overflow-hidden">
      {/* Decorative ambient warm gradient */}
      <div 
        className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ background: 'radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)' }}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 relative z-10">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: 'var(--theme-primary)' }}>
            <MapPin className="w-3.5 h-3.5" />
            <span>{overview.destination}</span>
            <span>•</span>
            <Calendar className="w-3.5 h-3.5" />
            <span>{durationDays || overview.duration_days} Days Journey</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif theme-text tracking-tight">
            {title || overview.tagline}
          </h2>
          {overview.tagline && (
            <p className="text-xs sm:text-sm theme-text-muted mt-1 italic font-serif">
              "{overview.tagline}"
            </p>
          )}
        </div>
      </div>

      {/* Quick context cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 relative z-10">
        {/* Climate & Live Weather */}
        <div className="p-4 rounded-xl theme-card-subtle border shadow-warm-sm">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-gold)' }}>
            <Sun className="w-4 h-4" />
            <span>Live Weather & Optimal Season</span>
          </div>
          <p className="text-xs theme-text leading-relaxed">
            <strong className="block font-semibold mb-1" style={{ color: 'var(--theme-text)' }}>
              {overview.best_season}
            </strong>
            <span className="theme-text-muted">{overview.weather_summary}</span>
          </p>
        </div>

        {/* Local Customs & Tips */}
        <div className="p-4 rounded-xl theme-card-subtle border shadow-warm-sm">
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-accent)' }}>
            <ShieldAlert className="w-4 h-4" />
            <span>Culture, Customs & Etiquette</span>
          </div>
          <ul className="text-xs theme-text-muted space-y-1 list-disc list-inside">
            {(overview.local_customs_and_safety || []).slice(0, 3).map((tip, idx) => (
              <li key={idx} className="line-clamp-1">{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Packing Essentials */}
      {overview.packing_list && overview.packing_list.length > 0 && (
        <div className="mt-5 pt-4 border-t relative z-10" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider theme-text-muted mb-2.5">
            <CheckSquare className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
            <span>Smart Packing Checklist:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {overview.packing_list.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-[11px] theme-card-subtle border theme-text shadow-warm-sm"
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

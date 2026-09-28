import React from 'react';
import { ActivityCard } from './ActivityCard';
import { Utensils, Navigation, Calendar, Plus } from 'lucide-react';

export function DayCard({ day, onEditActivity, onAddActivity }) {
  if (!day) return null;

  return (
    <div className="theme-card rounded-2xl p-4 sm:p-6 mb-6 shadow-warm border">
      
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b gap-2" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl theme-primary-btn flex flex-col items-center justify-center font-bold text-white shadow-warm-sm">
            <span className="text-[10px] uppercase leading-none font-medium opacity-80">Day</span>
            <span className="text-lg leading-none font-serif">{day.day_number}</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif theme-text tracking-tight">
              {day.theme}
            </h3>
            {day.date && (
              <div className="flex items-center text-xs theme-text-muted space-x-1 mt-0.5">
                <Calendar className="w-3 h-3" />
                <span>{day.date}</span>
              </div>
            )}
          </div>
        </div>

        {/* Transit Tip */}
        {day.transit_tips && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl theme-card-subtle border text-[11px] theme-text-muted" style={{ borderColor: 'var(--theme-border)' }}>
            <Navigation className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary)' }} />
            <span className="line-clamp-1">{day.transit_tips}</span>
          </div>
        )}
      </div>

      {/* Activities Timeline */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3.5">
          <h5 className="text-xs font-bold uppercase tracking-wider theme-text-muted">
            Curated Highlights & Schedule
          </h5>
          {onAddActivity && (
            <button
              onClick={() => onAddActivity(day.day_number)}
              className="flex items-center space-x-1 text-xs font-bold transition-colors"
              style={{ color: 'var(--theme-primary)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Activity</span>
            </button>
          )}
        </div>

        <div className="space-y-1">
          {(day.activities || []).map((act, idx) => (
            <ActivityCard
              key={idx}
              activity={act}
              onEdit={onEditActivity ? () => onEditActivity(day.day_number, idx, act) : undefined}
            />
          ))}
        </div>
      </div>

      {/* Culinary Recommendations */}
      {day.meals && day.meals.length > 0 && (
        <div className="pt-4 border-t" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'var(--theme-gold)' }}>
            <Utensils className="w-3.5 h-3.5" />
            <span>Regional Flavors & Dining</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {day.meals.map((meal, idx) => (
              <div key={idx} className="p-3 rounded-xl theme-card-subtle border shadow-warm-sm" style={{ borderColor: 'var(--theme-border)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--theme-gold)' }}>
                    {meal.meal_type}
                  </span>
                  <span className="text-[10px] theme-text-muted font-mono">
                    {meal.price_range}
                  </span>
                </div>
                <div className="text-xs font-bold font-serif theme-text line-clamp-1">
                  {meal.name}
                </div>
                <div className="text-[11px] theme-text-muted line-clamp-1">
                  {meal.cuisine}
                </div>
                {meal.recommended_dish && (
                  <div className="mt-1 text-[10px] font-medium line-clamp-1" style={{ color: 'var(--theme-primary)' }}>
                    Try: {meal.recommended_dish}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

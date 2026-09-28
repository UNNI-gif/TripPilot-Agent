import React from 'react';
import { ActivityCard } from './ActivityCard';
import { Utensils, Navigation, Calendar } from 'lucide-react';

export function DayCard({ day }) {
  if (!day) return null;

  return (
    <div className="glass-panel rounded-2xl p-4 sm:p-6 mb-6 shadow-lg border border-slate-800">
      
      {/* Day Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-slate-800 gap-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex flex-col items-center justify-center font-bold text-white shadow-md shadow-sky-500/20">
            <span className="text-[10px] uppercase leading-none font-medium text-sky-200">Day</span>
            <span className="text-base leading-none">{day.day_number}</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              {day.theme}
            </h3>
            {day.date && (
              <div className="flex items-center text-xs text-slate-400 space-x-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{day.date}</span>
              </div>
            )}
          </div>
        </div>

        {/* Transit Tip */}
        {day.transit_tips && (
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300">
            <Navigation className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="line-clamp-1">{day.transit_tips}</span>
          </div>
        )}
      </div>

      {/* Activities Timeline */}
      <div className="mb-6">
        <h5 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Daily Schedule & Highlights
        </h5>
        <div className="space-y-1">
          {(day.activities || []).map((act, idx) => (
            <ActivityCard key={idx} activity={act} />
          ))}
        </div>
      </div>

      {/* Culinary Recommendations */}
      {day.meals && day.meals.length > 0 && (
        <div className="pt-4 border-t border-slate-800/80">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">
            <Utensils className="w-3.5 h-3.5" />
            <span>Recommended Dining & Flavors</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {day.meals.map((meal, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                    {meal.meal_type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {meal.price_range}
                  </span>
                </div>
                <div className="text-xs font-bold text-white line-clamp-1">
                  {meal.name}
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1">
                  {meal.cuisine}
                </div>
                {meal.recommended_dish && (
                  <div className="mt-1 text-[10px] text-sky-300 line-clamp-1">
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

import React, { useState } from 'react';
import { ActivityCard } from './ActivityCard';
import { Utensils, Navigation, Calendar, Plus, Sun, CloudRain, Footprints, Umbrella, ShieldCheck } from 'lucide-react';

export function DayCard({ day, onEditActivity, onAddActivity }) {
  const [isRainyPivot, setIsRainyPivot] = useState(false);

  if (!day) return null;

  // Travel Pacing Barometer calculations
  const walkingKm = typeof day.estimated_walking_km === 'number' && day.estimated_walking_km > 0
    ? day.estimated_walking_km
    : 5.5;
  const estimatedSteps = Math.round(walkingKm * 1400);
  const pacingScore = day.pacing_score || (walkingKm < 5.5 ? 'Relaxed' : walkingKm < 9.0 ? 'Balanced' : 'Ambitious');

  const getPacingStyle = (score) => {
    switch (score?.toLowerCase()) {
      case 'relaxed':
        return {
          bg: 'rgba(34, 197, 94, 0.12)',
          text: '#15803d',
          border: 'rgba(34, 197, 94, 0.3)',
          label: 'Relaxed Pace',
          dot: 'bg-emerald-500'
        };
      case 'ambitious':
        return {
          bg: 'rgba(225, 29, 72, 0.12)',
          text: '#be123c',
          border: 'rgba(225, 29, 72, 0.3)',
          label: 'Ambitious Pace',
          dot: 'bg-rose-500'
        };
      default:
        return {
          bg: 'rgba(217, 119, 6, 0.12)',
          text: '#b45309',
          border: 'rgba(217, 119, 6, 0.3)',
          label: 'Balanced Pace',
          dot: 'bg-amber-500'
        };
    }
  };

  const pacingInfo = getPacingStyle(pacingScore);
  const hasRainyPlan = Boolean(day.rainy_day_activities && day.rainy_day_activities.length > 0);
  const displayActivities = isRainyPivot && hasRainyPlan ? day.rainy_day_activities : (day.activities || []);

  return (
    <div className="theme-card rounded-2xl p-4 sm:p-6 mb-6 shadow-warm border transition-all">
      
      {/* Day Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-4 mb-4 border-b gap-3" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-xl theme-primary-btn flex flex-col items-center justify-center font-bold text-white shadow-warm-sm shrink-0">
            <span className="text-[10px] uppercase leading-none font-medium opacity-80">Day</span>
            <span className="text-lg leading-none font-serif">{day.day_number}</span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold font-serif theme-text tracking-tight">
              {day.theme}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs theme-text-muted">
              {day.date && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{day.date}</span>
                </div>
              )}
              {day.date && <span>•</span>}
              
              {/* Pacing & Walking Distance Barometer Badge */}
              <div 
                className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md border text-[11px] font-medium"
                style={{ 
                  backgroundColor: pacingInfo.bg, 
                  color: pacingInfo.text, 
                  borderColor: pacingInfo.border 
                }}
                title="Pacing Barometer: Geodesic walking footprint between stops + estimated urban steps"
              >
                <Footprints className="w-3 h-3" />
                <span className="font-bold">{walkingKm} km</span>
                <span className="opacity-75 font-mono">(~{estimatedSteps.toLocaleString()} steps)</span>
                <span>•</span>
                <span className="font-semibold">{pacingInfo.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Header Controls: Transit Tip & Weather Pivot Toggle */}
        <div className="flex flex-wrap items-center gap-2">
          {day.transit_tips && (
            <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl theme-card-subtle border text-[11px] theme-text-muted max-w-xs" style={{ borderColor: 'var(--theme-border)' }}>
              <Navigation className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary)' }} />
              <span className="truncate">{day.transit_tips}</span>
            </div>
          )}

          {/* Weather Contingency Pivot Switch */}
          <div className="inline-flex items-center p-1 rounded-xl theme-card-subtle border" style={{ borderColor: 'var(--theme-border)' }}>
            <button
              type="button"
              onClick={() => setIsRainyPivot(false)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                !isRainyPivot
                  ? 'theme-primary-btn shadow-warm-sm'
                  : 'theme-text-muted hover:theme-text'
              }`}
              title="Show standard outdoor & landmark itinerary"
            >
              <Sun className="w-3 h-3" />
              <span>Standard</span>
            </button>
            <button
              type="button"
              onClick={() => setIsRainyPivot(true)}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                isRainyPivot
                  ? 'bg-blue-600 text-white shadow-warm-sm'
                  : 'theme-text-muted hover:text-blue-600'
              }`}
              title="Switch to sheltered indoor & covered cultural contingency plan"
            >
              <CloudRain className="w-3 h-3" />
              <span>Rain Pivot</span>
              {hasRainyPlan && (
                <span className="text-[9px] px-1 py-0.2 rounded font-sans uppercase font-bold tracking-wider bg-blue-500 text-white">
                  Sheltered
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Rainy Day Contingency Notice Banner when Pivot is Active */}
      {isRainyPivot && (
        <div className="mb-4 p-3 rounded-xl border flex items-start space-x-2.5 text-xs transition-all bg-blue-50/80 text-blue-900 border-blue-200">
          <Umbrella className="w-4 h-4 mt-0.5 shrink-0 text-blue-600" />
          <div className="flex-1">
            <span className="font-bold text-blue-800">🌧️ Weather Contingency Activated:</span> Outdoor stops have been dynamically replaced with sheltered covered arcades, prestigious indoor galleries, and authentic subterranean tastings to keep your day flawless despite bad weather.
          </div>
          <button
            onClick={() => setIsRainyPivot(false)}
            className="text-[11px] underline font-semibold text-blue-700 hover:text-blue-900 shrink-0"
          >
            Revert to Sun Plan
          </button>
        </div>
      )}

      {/* Activities Timeline */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center space-x-2">
            <h5 className="text-xs font-bold uppercase tracking-wider theme-text-muted">
              {isRainyPivot ? 'Sheltered Indoor Contingency Schedule' : 'Curated Highlights & Schedule'}
            </h5>
            {isRainyPivot && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200">
                Rain-Proof Plan
              </span>
            )}
          </div>
          
          {!isRainyPivot && onAddActivity && (
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
          {displayActivities.map((act, idx) => (
            <ActivityCard
              key={`${isRainyPivot ? 'rain' : 'std'}-${idx}`}
              activity={act}
              onEdit={!isRainyPivot && onEditActivity ? () => onEditActivity(day.day_number, idx, act) : undefined}
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

import React from 'react';
import { Clock, MapPin, Lightbulb, Edit3 } from 'lucide-react';

export function ActivityCard({ activity, onEdit }) {
  if (!activity) return null;

  const getSlotStyle = (slot) => {
    switch (slot?.toLowerCase()) {
      case 'morning':
        return 'theme-badge-gold';
      case 'afternoon':
        return 'theme-badge';
      case 'evening':
      case 'night':
        return 'theme-badge-accent';
      default:
        return 'theme-btn';
    }
  };

  return (
    <div className="relative pl-6 pb-6 last:pb-0 group">
      {/* Timeline connector line */}
      <div 
        className="absolute left-2.5 top-3 bottom-0 w-[2px] group-last:hidden" 
        style={{ backgroundColor: 'var(--theme-border)' }} 
      />
      
      {/* Timeline dot */}
      <div 
        className="absolute left-1 top-2.5 w-3.5 h-3.5 rounded-full border-2 group-hover:scale-125 transition-transform"
        style={{ 
          backgroundColor: 'var(--theme-card)', 
          borderColor: 'var(--theme-primary)' 
        }} 
      />

      {/* Card Content */}
      <div className="p-4 rounded-xl theme-card border hover:border-current transition-all shadow-warm-sm relative group/card">
        
        {/* Time Slot & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${getSlotStyle(activity.time_slot)}`}>
              {activity.time_slot}
            </span>
            <div className="flex items-center text-xs theme-text-muted space-x-1">
              <Clock className="w-3 h-3" />
              <span>{activity.time}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-medium rounded theme-card-subtle border" style={{ borderColor: 'var(--theme-border)' }}>
              {activity.category}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded theme-badge-accent">
              {activity.estimated_cost}
            </span>
            {onEdit && (
              <button
                onClick={onEdit}
                className="opacity-0 group-hover/card:opacity-100 p-1 theme-text-muted hover:theme-text rounded transition-all"
                title="Edit Activity"
              >
                <Edit3 className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
              </button>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-bold font-serif theme-text mb-1">
          {activity.title}
        </h4>

        {/* Description */}
        <p className="text-xs sm:text-sm theme-text-muted leading-relaxed mb-2.5">
          {activity.description}
        </p>

        {/* Location */}
        {activity.location && (
          <div className="flex items-center text-xs theme-text-muted space-x-1 mb-2">
            <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary)' }} />
            <span className="truncate">{activity.location}</span>
          </div>
        )}

        {/* Insider Tips */}
        {activity.tips && (
          <div className="p-2.5 rounded-lg theme-card-subtle border text-[11px] flex items-start space-x-2" style={{ borderColor: 'var(--theme-border)' }}>
            <Lightbulb className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--theme-gold)' }} />
            <span className="leading-tight theme-text">
              <strong className="font-bold" style={{ color: 'var(--theme-gold)' }}>Local Tip:</strong> {activity.tips}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}

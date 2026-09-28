import React from 'react';
import { Clock, MapPin, Tag, Lightbulb, DollarSign } from 'lucide-react';

export function ActivityCard({ activity }) {
  if (!activity) return null;

  const getSlotColor = (slot) => {
    switch (slot?.toLowerCase()) {
      case 'morning':
        return 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-300';
      case 'afternoon':
        return 'from-sky-500/20 to-blue-500/10 border-sky-500/30 text-sky-300';
      case 'evening':
      case 'night':
        return 'from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300';
      default:
        return 'from-slate-700/20 to-slate-800/10 border-slate-700 text-slate-300';
    }
  };

  return (
    <div className="relative pl-6 pb-6 last:pb-0 group">
      {/* Timeline connector line */}
      <div className="absolute left-2.5 top-3 bottom-0 w-[2px] bg-slate-800 group-last:hidden" />
      
      {/* Timeline dot */}
      <div className="absolute left-1 top-2.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-sky-400 group-hover:scale-125 transition-transform" />

      {/* Card Content */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all shadow-sm">
        
        {/* Time Slot & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded border bg-gradient-to-r ${getSlotColor(activity.time_slot)}`}>
              {activity.time_slot}
            </span>
            <div className="flex items-center text-xs text-slate-400 space-x-1">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{activity.time}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-300 border border-slate-700">
              {activity.category}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {activity.estimated_cost}
            </span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm sm:text-base font-bold text-white mb-1">
          {activity.title}
        </h4>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-2.5">
          {activity.description}
        </p>

        {/* Location */}
        {activity.location && (
          <div className="flex items-center text-xs text-slate-400 space-x-1 mb-2">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="truncate">{activity.location}</span>
          </div>
        )}

        {/* Insider Tips */}
        {activity.tips && (
          <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800/40 text-[11px] text-sky-200 flex items-start space-x-2">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span className="leading-tight">
              <strong className="text-amber-300">Local Tip:</strong> {activity.tips}
            </span>
          </div>
        )}

      </div>
    </div>
  );
}

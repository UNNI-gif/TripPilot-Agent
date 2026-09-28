import React from 'react';
import { Sparkles, MapPin } from 'lucide-react';

const SUGGESTIONS = [
  {
    title: '🌸 Kyoto, Japan',
    prompt: 'Plan a 5-day cultural trip to Kyoto with peaceful shrines, bamboo groves, and authentic tea houses under $2,200',
    dest: 'Kyoto',
    days: 5,
    style: 'cultural'
  },
  {
    title: '🍕 Rome & Tuscany',
    prompt: 'Create a 4-day culinary escape to Rome featuring artisan pasta workshops and sunset vistas',
    dest: 'Rome',
    days: 4,
    style: 'culinary'
  },
  {
    title: '🌅 Santorini, Greece',
    prompt: 'Design a 3-day romantic retreat to Santorini with cliffside boutique stays and sunset catamaran cruise',
    dest: 'Santorini',
    days: 3,
    style: 'romantic'
  },
  {
    title: '🎒 Bangkok, Thailand',
    prompt: 'Build a 5-day vibrant street food and temple backpacking adventure in Bangkok on a budget',
    dest: 'Bangkok',
    days: 5,
    style: 'budget'
  }
];

export function PromptSuggestions({ onSelectPrompt }) {
  return (
    <div className="py-2">
      <div className="flex items-center space-x-2 mb-2 text-xs font-semibold text-slate-400">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        <span>Try these popular trip ideas:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt, { destination: item.dest, durationDays: item.days, travelStyle: item.style })}
            className="flex items-start text-left p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/50 transition-all group"
          >
            <MapPin className="w-4 h-4 text-sky-400 mt-0.5 mr-2 shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 transition-colors">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {item.prompt}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

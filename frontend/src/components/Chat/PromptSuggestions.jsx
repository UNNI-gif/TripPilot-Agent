import React from 'react';
import { Sparkles, MapPin } from 'lucide-react';

const SUGGESTIONS = [
  {
    title: '🌸 Kyoto & Arashiyama',
    prompt: 'Plan a 5-day cultural trip to Kyoto with peaceful shrines, bamboo groves, and authentic tea houses under $2,200',
    dest: 'Kyoto',
    days: 5,
    style: 'cultural'
  },
  {
    title: '🍷 Rome & Tuscan Hills',
    prompt: 'Create a 4-day culinary escape to Rome and Tuscan vineyards featuring artisan pasta workshops and sunset vistas',
    dest: 'Rome',
    days: 4,
    style: 'culinary'
  },
  {
    title: '🌅 Santorini Cliffside',
    prompt: 'Design a 3-day romantic retreat to Santorini with whitewashed boutique stays and sunset catamaran cruise',
    dest: 'Santorini',
    days: 3,
    style: 'romantic'
  },
  {
    title: '🥥 Bali Spiritual Haven',
    prompt: 'Build a 5-day wellness and temple retreat in Ubud with waterfall hikes and organic artisan cuisine',
    dest: 'Bali',
    days: 5,
    style: 'wellness'
  }
];

export function PromptSuggestions({ onSelectPrompt }) {
  return (
    <div className="py-2">
      <div className="flex items-center space-x-2 mb-2 text-xs font-semibold theme-text-muted">
        <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
        <span>Handcrafted Trip Inspirations:</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {SUGGESTIONS.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.prompt, { destination: item.dest, durationDays: item.days, travelStyle: item.style })}
            className="flex items-start text-left p-3 rounded-xl theme-card-subtle border hover:border-current transition-all group shadow-warm-sm"
          >
            <MapPin className="w-4 h-4 mt-0.5 mr-2 shrink-0 group-hover:scale-110 transition-transform" style={{ color: 'var(--theme-primary)' }} />
            <div>
              <div className="text-xs font-bold font-serif theme-text group-hover:underline">
                {item.title}
              </div>
              <div className="text-[11px] theme-text-muted line-clamp-1 mt-0.5">
                {item.prompt}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

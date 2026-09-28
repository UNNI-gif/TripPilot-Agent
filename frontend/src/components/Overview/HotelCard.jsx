import React from 'react';
import { Building2, Star, MapPin, Check } from 'lucide-react';

export function HotelCard({ hotel }) {
  if (!hotel) return null;

  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all shadow-md flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="inline-block px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-1.5">
              {hotel.tier}
            </span>
            <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{hotel.name}</h4>
          </div>
          <div className="flex items-center space-x-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{hotel.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-xs text-slate-400 space-x-1 mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span className="line-clamp-1">{hotel.location}</span>
        </div>

        {hotel.neighborhood && (
          <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
            {hotel.neighborhood}
          </p>
        )}

        {/* Highlights */}
        {hotel.highlights && hotel.highlights.length > 0 && (
          <div className="space-y-1 mb-3">
            {hotel.highlights.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-[11px] text-slate-300">
                <Check className="w-3 h-3 text-sky-400 shrink-0" />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between mt-auto">
        <div>
          <span className="text-base font-bold text-indigo-400">${hotel.price_per_night_usd}</span>
          <span className="text-[10px] text-slate-400"> / night</span>
        </div>
        <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-1 rounded">
          Verified Option
        </span>
      </div>
    </div>
  );
}

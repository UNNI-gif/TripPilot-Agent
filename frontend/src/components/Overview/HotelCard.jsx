import React from 'react';
import { Star, MapPin, Check } from 'lucide-react';

export function HotelCard({ hotel }) {
  if (!hotel) return null;

  return (
    <div className="p-4 rounded-xl theme-card border hover:border-current transition-all shadow-warm-sm flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded theme-badge mb-1.5">
              {hotel.tier}
            </span>
            <h4 className="text-sm font-bold font-serif theme-text line-clamp-1">{hotel.name}</h4>
          </div>
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded theme-badge-gold text-xs font-bold shrink-0">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span>{hotel.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-xs theme-text-muted space-x-1 mb-2.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--theme-primary)' }} />
          <span className="line-clamp-1">{hotel.location}</span>
        </div>

        {hotel.neighborhood && (
          <p className="text-[11px] theme-text-muted line-clamp-2 mb-3 leading-relaxed">
            {hotel.neighborhood}
          </p>
        )}

        {/* Highlights */}
        {hotel.highlights && hotel.highlights.length > 0 && (
          <div className="space-y-1 mb-3">
            {hotel.highlights.slice(0, 3).map((item, idx) => (
              <div key={idx} className="flex items-center space-x-1.5 text-[11px] theme-text">
                <Check className="w-3 h-3 shrink-0" style={{ color: 'var(--theme-accent)' }} />
                <span className="line-clamp-1">{item}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-2.5 border-t flex items-center justify-between mt-auto" style={{ borderColor: 'var(--theme-border)' }}>
        <div>
          <span className="text-base font-bold font-serif" style={{ color: 'var(--theme-primary)' }}>
            {hotel.currency_symbol || '$'}{Number(hotel.price_per_night || hotel.price_per_night_usd).toLocaleString()}
          </span>
          <span className="text-[10px] theme-text-muted"> / night ({hotel.currency || 'USD'})</span>
        </div>
        <span className="text-[10px] theme-text-muted theme-card-subtle px-2 py-0.5 rounded border" style={{ borderColor: 'var(--theme-border)' }}>
          Curated Stay
        </span>
      </div>
    </div>
  );
}

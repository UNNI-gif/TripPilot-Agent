import React from 'react';
import { Plane, Clock, ShieldCheck } from 'lucide-react';

export function FlightCard({ flight }) {
  if (!flight) return null;

  return (
    <div className="p-4 rounded-xl theme-card border hover:border-current transition-all shadow-warm-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg theme-badge flex items-center justify-center">
              <Plane className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
            </div>
            <div>
              <div className="text-xs font-bold font-serif theme-text">{flight.airline}</div>
              <div className="text-[10px] theme-text-muted font-mono">{flight.flight_number}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-base font-bold font-serif" style={{ color: 'var(--theme-primary)' }}>
              ${flight.price_usd}
            </div>
            <div className="text-[10px] theme-text-muted">est. per traveler</div>
          </div>
        </div>

        {/* Flight Route Diagram */}
        <div className="flex items-center justify-between py-2.5 border-y my-2" style={{ borderColor: 'var(--theme-border)' }}>
          <div className="text-left">
            <div className="text-xs font-semibold theme-text">{flight.departure_time}</div>
            <div className="text-[11px] theme-text-muted">{flight.origin}</div>
          </div>
          
          <div className="flex-1 px-4 flex flex-col items-center">
            <div className="text-[10px] theme-text-muted flex items-center space-x-1 mb-1">
              <Clock className="w-3 h-3" />
              <span>{flight.duration}</span>
            </div>
            <div className="w-full relative flex items-center justify-center">
              <div className="w-full h-[1.5px]" style={{ backgroundColor: 'var(--theme-border)' }} />
              <div className="absolute w-2.5 h-2.5 rounded-full ring-2" style={{ backgroundColor: 'var(--theme-primary)', ringColor: 'var(--theme-card)' }} />
            </div>
            <div className="text-[10px] font-medium mt-1" style={{ color: 'var(--theme-accent)' }}>
              {flight.stops}
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs font-semibold theme-text">{flight.arrival_time}</div>
            <div className="text-[11px] theme-text-muted">{flight.destination}</div>
          </div>
        </div>
      </div>

      {flight.booking_tip && (
        <div className="text-[11px] theme-text-muted flex items-start space-x-1.5 mt-2">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }} />
          <span>{flight.booking_tip}</span>
        </div>
      )}
    </div>
  );
}

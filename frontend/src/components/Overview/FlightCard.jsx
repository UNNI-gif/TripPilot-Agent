import React from 'react';
import { Plane, ArrowRight, Clock, ShieldCheck } from 'lucide-react';

export function FlightCard({ flight }) {
  if (!flight) return null;

  return (
    <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-sky-500/40 transition-all shadow-md">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center text-sky-400">
            <Plane className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100">{flight.airline}</div>
            <div className="text-[10px] text-slate-400 font-mono">{flight.flight_number}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm sm:text-base font-bold text-sky-400">${flight.price_usd}</div>
          <div className="text-[10px] text-slate-400">est. per ticket</div>
        </div>
      </div>

      {/* Flight Route Diagram */}
      <div className="flex items-center justify-between py-2 border-y border-slate-800/80 my-2">
        <div className="text-left">
          <div className="text-xs font-semibold text-slate-200">{flight.departure_time}</div>
          <div className="text-[11px] text-slate-400">{flight.origin}</div>
        </div>
        
        <div className="flex-1 px-4 flex flex-col items-center">
          <div className="text-[10px] text-slate-400 flex items-center space-x-1 mb-1">
            <Clock className="w-3 h-3 text-slate-500" />
            <span>{flight.duration}</span>
          </div>
          <div className="w-full relative flex items-center justify-center">
            <div className="w-full h-[1px] bg-slate-700" />
            <div className="absolute w-2 h-2 rounded-full bg-sky-400 ring-2 ring-slate-900" />
          </div>
          <div className="text-[10px] text-emerald-400 mt-1">{flight.stops}</div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-slate-200">{flight.arrival_time}</div>
          <div className="text-[11px] text-slate-400">{flight.destination}</div>
        </div>
      </div>

      {flight.booking_tip && (
        <div className="text-[11px] text-slate-400 flex items-start space-x-1.5 mt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
          <span>{flight.booking_tip}</span>
        </div>
      )}
    </div>
  );
}

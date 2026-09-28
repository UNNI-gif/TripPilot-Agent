import React, { useState } from 'react';
import { DayCard } from './DayCard';
import { TripOverviewCard } from '../Overview/TripOverviewCard';
import { FlightCard } from '../Overview/FlightCard';
import { HotelCard } from '../Overview/HotelCard';
import { BudgetBreakdownCard } from '../Budget/BudgetBreakdownCard';
import { Plane, Building2, Calendar, DollarSign, Compass, Layers } from 'lucide-react';

export function ItineraryBoard({ tripPlan }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', or 'day-X'
  const [activeSection, setActiveSection] = useState('itinerary'); // 'itinerary', 'stays_flights', 'budget'

  if (!tripPlan) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/20">
        <div className="w-16 h-16 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center mb-4 text-sky-400">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-1">
          No Active Itinerary Loaded
        </h3>
        <p className="text-xs text-slate-400 max-w-md">
          Chat with the TripPilot Copilot on the left or select a sample destination to generate your complete travel dossier.
        </p>
      </div>
    );
  }

  const { overview, title, duration_days, flights, hotels, itinerary, budget } = tripPlan;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Overview Banner */}
      <TripOverviewCard overview={overview} title={title} durationDays={duration_days} />

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveSection('itinerary')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'itinerary'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Itinerary ({itinerary?.length || 0} Days)</span>
          </button>

          <button
            onClick={() => setActiveSection('stays_flights')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'stays_flights'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Flights & Stays</span>
          </button>

          <button
            onClick={() => setActiveSection('budget')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'budget'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Budget & Costs</span>
          </button>
        </div>

        {/* Day Pills (only if in Itinerary section) */}
        {activeSection === 'itinerary' && itinerary && itinerary.length > 1 && (
          <div className="flex items-center space-x-1 overflow-x-auto py-1">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Days
            </button>
            {itinerary.map((d) => (
              <button
                key={d.day_number}
                onClick={() => setActiveTab(`day-${d.day_number}`)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                  activeTab === `day-${d.day_number}`
                    ? 'bg-slate-700 text-white border border-slate-600'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Day {d.day_number}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {activeSection === 'itinerary' && (
        <div className="space-y-4">
          {(itinerary || [])
            .filter((d) => activeTab === 'all' || activeTab === `day-${d.day_number}`)
            .map((day) => (
              <DayCard key={day.day_number} day={day} />
            ))}
        </div>
      )}

      {activeSection === 'stays_flights' && (
        <div className="space-y-6">
          {/* Flights */}
          {flights && flights.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-sm font-bold text-white mb-3">
                <Plane className="w-4 h-4 text-sky-400" />
                <span>Recommended Flight Options</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {flights.map((f, idx) => (
                  <FlightCard key={idx} flight={f} />
                ))}
              </div>
            </div>
          )}

          {/* Stays */}
          {hotels && hotels.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-sm font-bold text-white mb-3">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>Curated Hotels & Boutique Stays</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {hotels.map((h, idx) => (
                  <HotelCard key={idx} hotel={h} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeSection === 'budget' && (
        <BudgetBreakdownCard budget={budget} durationDays={duration_days} />
      )}
    </div>
  );
}

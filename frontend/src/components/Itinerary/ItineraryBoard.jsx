import React, { useState } from 'react';
import { DayCard } from './DayCard';
import { TripOverviewCard } from '../Overview/TripOverviewCard';
import { FlightCard } from '../Overview/FlightCard';
import { HotelCard } from '../Overview/HotelCard';
import { BudgetBreakdownCard } from '../Budget/BudgetBreakdownCard';
import { TripMap } from '../Map/TripMap';
import { ActivityEditModal } from './ActivityEditModal';
import { Plane, Building2, Calendar, DollarSign, Compass, MapPin, Layers } from 'lucide-react';

export function ItineraryBoard({ tripPlan, onUpdateTripPlan }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', or 'day-X'
  const [activeSection, setActiveSection] = useState('itinerary'); // 'itinerary', 'map', 'stays_flights', 'budget'

  // Activity Edit Modal State
  const [editModalState, setEditModalState] = useState({
    isOpen: false,
    activity: null,
    dayNumber: 1,
    activityIndex: 0,
  });

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

  const { overview, title, duration_days, destination, flights, hotels, itinerary, budget } = tripPlan;

  const handleOpenEdit = (dayNumber, activityIndex, activity) => {
    setEditModalState({
      isOpen: true,
      activity,
      dayNumber,
      activityIndex,
    });
  };

  const handleOpenAdd = (dayNumber) => {
    setEditModalState({
      isOpen: true,
      activity: {
        title: 'New Activity',
        time_slot: 'Afternoon',
        time: '02:00 PM - 04:00 PM',
        description: 'Explore local sights or enjoy a relaxing stroll.',
        location: destination,
        category: 'Leisure',
        estimated_cost: '$0',
        tips: 'Enjoy at your own pace.'
      },
      dayNumber,
      activityIndex: -1, // Indicates a new activity
    });
  };

  const handleSaveActivity = (dayNumber, activityIndex, updatedActivity) => {
    if (!onUpdateTripPlan) return;
    const newItinerary = (itinerary || []).map((day) => {
      if (day.day_number === dayNumber) {
        let newActivities = [...(day.activities || [])];
        if (activityIndex === -1) {
          // Add new
          newActivities.push(updatedActivity);
        } else {
          // Update existing
          newActivities[activityIndex] = updatedActivity;
        }
        return { ...day, activities: newActivities };
      }
      return day;
    });

    onUpdateTripPlan({
      ...tripPlan,
      itinerary: newItinerary,
    });
  };

  const handleDeleteActivity = (dayNumber, activityIndex) => {
    if (!onUpdateTripPlan) return;
    const newItinerary = (itinerary || []).map((day) => {
      if (day.day_number === dayNumber) {
        const newActivities = (day.activities || []).filter((_, idx) => idx !== activityIndex);
        return { ...day, activities: newActivities };
      }
      return day;
    });

    onUpdateTripPlan({
      ...tripPlan,
      itinerary: newItinerary,
    });
  };

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
            onClick={() => setActiveSection('map')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeSection === 'map'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Route Map</span>
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
              <DayCard
                key={day.day_number}
                day={day}
                onEditActivity={handleOpenEdit}
                onAddActivity={handleOpenAdd}
              />
            ))}
        </div>
      )}

      {activeSection === 'map' && (
        <TripMap itinerary={itinerary} destination={destination} />
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

      {/* Activity Edit / Add Modal */}
      <ActivityEditModal
        isOpen={editModalState.isOpen}
        onClose={() => setEditModalState({ ...editModalState, isOpen: false })}
        activity={editModalState.activity}
        dayNumber={editModalState.dayNumber}
        activityIndex={editModalState.activityIndex}
        onSaveActivity={handleSaveActivity}
        onDeleteActivity={handleDeleteActivity}
      />
    </div>
  );
}

import React, { useState } from 'react';
import { DayCard } from './DayCard';
import { TripOverviewCard } from '../Overview/TripOverviewCard';
import { FlightCard } from '../Overview/FlightCard';
import { HotelCard } from '../Overview/HotelCard';
import { BudgetBreakdownCard } from '../Budget/BudgetBreakdownCard';
import { TripMap } from '../Map/TripMap';
import { SightseeingHubs } from '../Sightseeing/SightseeingHubs';
import { ActivityEditModal } from './ActivityEditModal';
import { Plane, Building2, Calendar, DollarSign, Compass, MapPin } from 'lucide-react';

export function ItineraryBoard({ tripPlan, onUpdateTripPlan, onSendMessage }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', or 'day-X'
  const [activeSection, setActiveSection] = useState('itinerary'); // 'itinerary', 'map', 'sightseeing', 'stays_flights', 'budget'
  const [focusedLocation, setFocusedLocation] = useState(null);


  // Activity Edit Modal State
  const [editModalState, setEditModalState] = useState({
    isOpen: false,
    activity: null,
    dayNumber: 1,
    activityIndex: 0,
  });

  if (!tripPlan) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-2xl theme-card-subtle" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="w-16 h-16 rounded-2xl theme-badge flex items-center justify-center mb-4 shadow-warm-sm">
          <Compass className="w-8 h-8 animate-pulse" style={{ color: 'var(--theme-primary)' }} />
        </div>
        <h3 className="text-xl font-bold font-serif theme-text mb-1.5">
          No Active Journey Loaded
        </h3>
        <p className="text-xs theme-text-muted max-w-md leading-relaxed">
          Chat with the TripPilot Copilot on the left or select one of our curated trip inspirations to generate your comprehensive travel dossier.
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
        estimated_cost: (tripPlan.budget?.currency_symbol || '$') + '0',
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
          newActivities.push(updatedActivity);
        } else {
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
      <TripOverviewCard 
        overview={overview} 
        title={title} 
        durationDays={duration_days} 
        origin={tripPlan.origin}
        totalDistanceKm={tripPlan.total_distance_km}
        estimatedTravelTime={tripPlan.estimated_travel_time}
      />

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center space-x-1 sm:space-x-2">
          <button
            onClick={() => setActiveSection('itinerary')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSection === 'itinerary'
                ? 'theme-primary-btn shadow-warm-sm'
                : 'theme-btn'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Itinerary ({itinerary?.length || 0} Days)</span>
          </button>

          <button
            onClick={() => setActiveSection('map')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSection === 'map'
                ? 'theme-primary-btn shadow-warm-sm'
                : 'theme-btn'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Route Map</span>
          </button>

          <button
            onClick={() => setActiveSection('sightseeing')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSection === 'sightseeing'
                ? 'theme-primary-btn shadow-warm-sm'
                : 'theme-btn'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Must-Visit Places</span>
            {tripPlan.sightseeing_hubs?.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full theme-badge font-sans font-bold">
                {tripPlan.sightseeing_hubs.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveSection('stays_flights')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSection === 'stays_flights'
                ? 'theme-primary-btn shadow-warm-sm'
                : 'theme-btn'
            }`}
          >
            <Plane className="w-4 h-4" />
            <span>Flights & Stays</span>
          </button>

          <button
            onClick={() => setActiveSection('budget')}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeSection === 'budget'
                ? 'theme-primary-btn shadow-warm-sm'
                : 'theme-btn'
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
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'theme-active-item font-bold'
                  : 'theme-text-muted hover:theme-text'
              }`}
            >
              All Days
            </button>
            {itinerary.map((d) => (
              <button
                key={d.day_number}
                onClick={() => setActiveTab(`day-${d.day_number}`)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === `day-${d.day_number}`
                    ? 'theme-active-item font-bold'
                    : 'theme-text-muted hover:theme-text'
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
        <TripMap 
          itinerary={itinerary} 
          destination={destination} 
          origin={tripPlan.origin}
          originLatitude={tripPlan.origin_latitude}
          originLongitude={tripPlan.origin_longitude}
          destinationLatitude={tripPlan.destination_latitude}
          destinationLongitude={tripPlan.destination_longitude}
          totalDistanceKm={tripPlan.total_distance_km}
          estimatedTravelTime={tripPlan.estimated_travel_time}
          focusedLocation={focusedLocation}
          onClearFocus={() => setFocusedLocation(null)}
          onPlanRoute={(src, dst) => {
            if (onSendMessage) {
              onSendMessage(`Plan a complete trip from ${src} to ${dst}`);
            }
          }}
        />
      )}

      {activeSection === 'sightseeing' && (
        <SightseeingHubs
          hubs={tripPlan.sightseeing_hubs}
          destination={destination}
          onSelectHub={(hub) => {
            if (onSendMessage) {
              onSendMessage(`Plan my holiday around ${hub.name} in ${destination}. Include its key sights like ${hub.must_see_landmarks?.slice(0, 2).join(' and ')}.`);
            }
          }}
          onShowOnMap={(hub) => {
            setFocusedLocation(hub);
            setActiveSection('map');
          }}
        />
      )}


      {activeSection === 'stays_flights' && (
        <div className="space-y-6">
          {/* Flights */}
          {flights && flights.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 text-sm font-bold font-serif theme-text mb-3">
                <Plane className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
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
              <div className="flex items-center space-x-2 text-sm font-bold font-serif theme-text mb-3">
                <Building2 className="w-4 h-4" style={{ color: 'var(--theme-accent)' }} />
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

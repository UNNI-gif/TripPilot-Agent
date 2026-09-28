import React from 'react';
import { Compass, MapPin, Calendar, Sparkles, CheckCircle2, ArrowRight, Heart } from 'lucide-react';

export function SightseeingHubs({ hubs = [], destination = 'Destination', onSelectHub }) {
  if (!hubs || hubs.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-2xl theme-card-subtle" style={{ borderColor: 'var(--theme-border)' }}>
        <Compass className="w-10 h-10 mx-auto mb-2 opacity-50" style={{ color: 'var(--theme-primary)' }} />
        <h4 className="text-sm font-bold theme-text">No Sightseeing Hubs Available</h4>
        <p className="text-xs theme-text-muted mt-1">
          Ask the TripPilot Copilot for top places to visit in {destination}.
        </p>
      </div>
    );
  }

  const handlePlanAroundHub = (hub) => {
    if (onSelectHub) {
      onSelectHub(hub);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header Banner */}
      <div className="p-5 rounded-2xl theme-card border shadow-warm" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider theme-badge">
                Essential Destinations
              </span>
              <span className="text-xs font-semibold theme-text-muted">
                {hubs.length} Key Hubs Mapped
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-serif theme-text">
              Top Sightseeing Places to Visit in {destination}
            </h3>
            <p className="text-xs sm:text-sm theme-text-muted mt-1 max-w-2xl leading-relaxed">
              When traveling to <strong>{destination}</strong>, these are the essential cities, cultural centers, and scenic regions to build your holiday around. Select any destination to focus your itinerary or explore highlights.
            </p>
          </div>
          <div className="shrink-0 flex items-center space-x-2 px-3 py-2 rounded-xl theme-card-subtle border text-xs" style={{ borderColor: 'var(--theme-border)' }}>
            <Sparkles className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
            <span className="font-medium theme-text">Curated by Location</span>
          </div>
        </div>
      </div>

      {/* Grid of Must-Visit Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hubs.map((hub, idx) => (
          <div
            key={idx}
            className="theme-card rounded-2xl border p-5 flex flex-col justify-between shadow-warm hover:shadow-warm-lg transition-all group"
            style={{ borderColor: 'var(--theme-border)' }}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                    <h4 className="text-base font-bold font-serif theme-text group-hover:underline">
                      {hub.name}
                    </h4>
                  </div>
                  <span className="text-[11px] theme-text-muted font-medium ml-6 block">
                    {hub.region}
                  </span>
                </div>
                {hub.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wide shrink-0 theme-badge">
                    {hub.badge}
                  </span>
                )}
              </div>

              {/* Tagline / Summary */}
              <p className="text-xs theme-text mb-4 leading-relaxed italic" style={{ color: 'var(--theme-text)' }}>
                "{hub.tagline}"
              </p>

              {/* Quick Specs Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4 text-[11px]">
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg theme-card-subtle border" style={{ borderColor: 'var(--theme-border)' }}>
                  <Calendar className="w-3 h-3 theme-text-muted" />
                  <span className="font-medium theme-text">Stay: {hub.recommended_stay}</span>
                </div>
                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-lg theme-card-subtle border" style={{ borderColor: 'var(--theme-border)' }}>
                  <Heart className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
                  <span className="font-medium theme-text">{hub.best_for}</span>
                </div>
              </div>

              {/* Must-See Landmarks Checklist */}
              <div className="mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider theme-text-muted block mb-2">
                  Must-See Sightseeing Highlights:
                </span>
                <ul className="space-y-1.5 text-xs">
                  {(hub.must_see_landmarks || []).map((landmark, lIdx) => (
                    <li key={lIdx} className="flex items-start space-x-2">
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                      <span className="theme-text font-medium">{landmark}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="pt-3 border-t flex items-center justify-between mt-2" style={{ borderColor: 'var(--theme-border)' }}>
              <span className="text-[11px] theme-text-muted italic">
                Vibe: <strong className="theme-text">{hub.vibe || 'Cultural'}</strong>
              </span>
              <button
                onClick={() => handlePlanAroundHub(hub)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold theme-btn transition-all group-hover:theme-primary-btn"
              >
                <span>Plan Around {hub.name.split(' ')[0]}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

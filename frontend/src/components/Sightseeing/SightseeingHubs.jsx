import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Heart, 
  Film, 
  Clapperboard, 
  Video, 
  Filter, 
  Globe 
} from 'lucide-react';
import { apiService } from '../../services/api';

const DIRECTION_BADGES = {
  North: { icon: '🏔️', label: 'North India', color: 'bg-sky-50 text-sky-800 border-sky-200' },
  South: { icon: '🌴', label: 'South India', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  West: { icon: '🏰', label: 'West India', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  East: { icon: '🌿', label: 'East & Northeast', color: 'bg-teal-50 text-teal-800 border-teal-200' },
};

export function SightseeingHubs({ hubs = [], destination = 'Destination', onSelectHub, onShowOnMap }) {
  const isIndiaDest = destination?.toLowerCase().includes('india') ||
    ['delhi', 'mumbai', 'goa', 'kerala', 'manali', 'ladakh', 'kashmir', 'hampi', 'ooty', 'jaipur', 'udaipur', 'kolkata'].some(
      (k) => destination?.toLowerCase().includes(k)
    );

  const [activeDirection, setActiveDirection] = useState('all'); // 'all', 'North', 'South', 'West', 'East'
  const [onlyMovies, setOnlyMovies] = useState(false);
  const [showIndiaCinemaExplorer, setShowIndiaCinemaExplorer] = useState(isIndiaDest);
  const [indiaHubs, setIndiaHubs] = useState([]);
  const [loadingIndia, setLoadingIndia] = useState(false);

  // If user toggles India Cinema Explorer or destination is India, fetch rich India locations
  useEffect(() => {
    if (showIndiaCinemaExplorer && indiaHubs.length === 0) {
      setLoadingIndia(true);
      apiService.getCinemaLocations()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setIndiaHubs(data);
          }
        })
        .catch((err) => console.warn('Could not fetch cinema locations:', err))
        .finally(() => setLoadingIndia(false));
    }
  }, [showIndiaCinemaExplorer, indiaHubs.length]);

  const displayedHubs = showIndiaCinemaExplorer && indiaHubs.length > 0 
    ? indiaHubs 
    : hubs;

  // Filter by direction and movies
  const filteredHubs = displayedHubs.filter((hub) => {
    if (activeDirection !== 'all' && hub.direction && hub.direction.toLowerCase() !== activeDirection.toLowerCase()) {
      return false;
    }
    if (onlyMovies && !hub.featured_movie && (!hub.movie_locations || hub.movie_locations.length === 0)) {
      return false;
    }
    return true;
  });

  const handlePlanAroundHub = (hub) => {
    if (onSelectHub) {
      onSelectHub(hub);
    }
  };

  const handleShowOnMap = (hub) => {
    if (onShowOnMap) {
      onShowOnMap(hub);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header Banner */}
      <div className="p-5 rounded-2xl theme-card border shadow-warm" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider theme-badge">
                {showIndiaCinemaExplorer ? '🎬 Iconic Cinema & Sightseeing Hubs' : 'Essential Destinations'}
              </span>
              <span className="text-xs font-semibold theme-text-muted">
                {filteredHubs.length} Places Mapped
              </span>
              {showIndiaCinemaExplorer && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 border border-amber-200">
                  All 4 Directions (North, South, East, West)
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-serif theme-text">
              {showIndiaCinemaExplorer 
                ? 'Best Sightseeing & Legendary Movie Shooting Locations in India'
                : `Top Sightseeing Places to Visit in ${destination}`}
            </h3>

            <p className="text-xs sm:text-sm theme-text-muted mt-1 max-w-2xl leading-relaxed">
              {showIndiaCinemaExplorer
                ? 'From the freezing turquoise waters of Pangong Tso (3 Idiots) to the thunderous Athirappilly cascades (Baahubali) and the clifftop ramparts of Chapora Fort (Dil Chahta Hai) — explore India across North, South, West, and East with exact GPS coordinates.'
                : `When traveling to ${destination}, these are the essential cities, cultural centers, and scenic regions to build your holiday around.`}
            </p>
          </div>

          {/* Toggle Explorer Mode Button */}
          <div className="shrink-0 flex items-center space-x-2">
            {!isIndiaDest && (
              <button
                type="button"
                onClick={() => setShowIndiaCinemaExplorer(!showIndiaCinemaExplorer)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-warm-sm border ${
                  showIndiaCinemaExplorer
                    ? 'theme-primary-btn'
                    : 'theme-btn'
                }`}
              >
                <Clapperboard className="w-3.5 h-3.5" />
                <span>
                  {showIndiaCinemaExplorer
                    ? `Back to ${destination} Hubs`
                    : '🇮🇳 India Movie & Sightseeing Explorer'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Filter Controls: Direction Tabs & Cinema Mode Toggle */}
        <div className="mt-4 pt-4 border-t flex flex-wrap items-center justify-between gap-3" style={{ borderColor: 'var(--theme-border)' }}>
          {/* Direction Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider theme-text-muted mr-1 flex items-center space-x-1">
              <Compass className="w-3 h-3" />
              <span>Direction:</span>
            </span>

            <button
              onClick={() => setActiveDirection('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeDirection === 'all'
                  ? 'theme-active-item font-bold'
                  : 'theme-card-subtle border theme-text-muted hover:theme-text'
              }`}
            >
              All Regions ({displayedHubs.length})
            </button>

            {['North', 'South', 'West', 'East'].map((dir) => {
              const meta = DIRECTION_BADGES[dir];
              const count = displayedHubs.filter((h) => h.direction?.toLowerCase() === dir.toLowerCase()).length;
              if (count === 0 && !showIndiaCinemaExplorer) return null;

              return (
                <button
                  key={dir}
                  onClick={() => setActiveDirection(dir)}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activeDirection === dir
                      ? 'theme-active-item font-bold'
                      : 'theme-card-subtle border theme-text-muted hover:theme-text'
                  }`}
                >
                  <span>{meta.icon}</span>
                  <span>{meta.label}</span>
                  <span className="text-[10px] opacity-75 font-mono">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Movie Filming Spots Toggle */}
          <button
            type="button"
            onClick={() => setOnlyMovies(!onlyMovies)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border ${
              onlyMovies
                ? 'bg-amber-600 text-white border-amber-700 shadow-warm-sm'
                : 'theme-card-subtle border theme-text-muted hover:theme-text'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>🎬 Movie Filming Spots Only</span>
          </button>
        </div>
      </div>

      {loadingIndia && (
        <div className="p-8 text-center theme-text-muted text-xs">
          Loading iconic Indian cinema & sightseeing catalog...
        </div>
      )}

      {/* Grid of Must-Visit Hub Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHubs.map((hub, idx) => {
          const dirMeta = hub.direction ? DIRECTION_BADGES[hub.direction] : null;

          return (
            <div
              key={idx}
              className="theme-card rounded-2xl border p-5 flex flex-col justify-between shadow-warm hover:shadow-warm-lg transition-all group"
              style={{ borderColor: 'var(--theme-border)' }}
            >
              <div>
                {/* Card Top: Direction, Badges & Title */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                      <h4 className="text-base font-bold font-serif theme-text group-hover:underline">
                        {hub.name}
                      </h4>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] theme-text-muted font-medium ml-6 mt-0.5">
                      <span>{hub.region}</span>
                      {hub.direction && (
                        <>
                          <span>•</span>
                          <span className="font-semibold" style={{ color: 'var(--theme-primary)' }}>
                            {hub.direction} India
                          </span>
                        </>
                      )}
                      {hub.latitude && hub.longitude && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[10px] opacity-75">
                            {hub.latitude.toFixed(2)}°N, {hub.longitude.toFixed(2)}°E
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {hub.badge && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold tracking-wide theme-badge">
                        {hub.badge}
                      </span>
                    )}
                    {dirMeta && (
                      <span className={`text-[9px] px-1.5 py-0.2 rounded border font-bold uppercase tracking-wider ${dirMeta.color}`}>
                        {dirMeta.icon} {hub.direction}
                      </span>
                    )}
                  </div>
                </div>

                {/* Featured Movie Callout Box */}
                {(hub.featured_movie || (hub.movie_locations && hub.movie_locations.length > 0)) && (
                  <div className="mb-3.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                    <div className="flex items-center space-x-1.5 font-bold text-amber-800 dark:text-amber-300 mb-1">
                      <Clapperboard className="w-3.5 h-3.5 text-amber-600" />
                      <span>Famous Movie Filming Landmark:</span>
                      {hub.featured_movie && (
                        <span className="underline decoration-amber-500 underline-offset-2">
                          {hub.featured_movie}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-1 text-[11px] theme-text-muted list-disc list-inside">
                      {(hub.movie_locations || []).slice(0, 2).map((scene, sIdx) => (
                        <li key={sIdx} className="leading-snug">
                          {scene}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

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
                    Must-See Highlights & Stops:
                  </span>
                  <ul className="space-y-1.5 text-xs">
                    {(hub.must_see_landmarks || []).slice(0, 4).map((landmark, lIdx) => (
                      <li key={lIdx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                        <span className="theme-text font-medium">{landmark}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bottom Action Footer with Show on Map & Plan buttons */}
              <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-2 mt-2" style={{ borderColor: 'var(--theme-border)' }}>
                <div className="flex items-center space-x-1 text-[11px] theme-text-muted">
                  <span>Vibe:</span>
                  <strong className="theme-text font-semibold">{hub.vibe || 'Cultural'}</strong>
                </div>

                <div className="flex items-center space-x-1.5">
                  {hub.latitude && hub.longitude && (
                    <button
                      type="button"
                      onClick={() => handleShowOnMap(hub)}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold theme-btn hover:border-amber-500 transition-all text-amber-700 dark:text-amber-400"
                      title="Pin & focus this exact location on the interactive route map"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>View on Map</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handlePlanAroundHub(hub)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold theme-btn transition-all group-hover:theme-primary-btn"
                  >
                    <span>Plan Around {hub.name.split(' ')[0]}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Maximize2, Compass, Film, Clapperboard, Layers, Eye } from 'lucide-react';
import { apiService } from '../../services/api';

const WARM_DAY_COLORS = ['#C84B26', '#3B684D', '#C98D25', '#A96E1D', '#832E16', '#20362A', '#D9532F'];

const DIRECTION_COLORS = {
  North: '#0284c7', // Sky Blue
  South: '#059669', // Emerald Green
  West: '#d97706',  // Amber Terracotta
  East: '#0d9488',  // Teal
};

export function TripMap({ itinerary, destination, focusedLocation, onClearFocus }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routesLayerRef = useRef(null);
  const cinemaMarkersRef = useRef({});

  const isIndiaDest = destination?.toLowerCase().includes('india') ||
    ['delhi', 'mumbai', 'goa', 'kerala', 'manali', 'ladakh', 'kashmir', 'hampi', 'ooty', 'jaipur', 'udaipur', 'kolkata'].some(
      (k) => destination?.toLowerCase().includes(k)
    );

  const [mapMode, setMapMode] = useState(focusedLocation ? 'cinema' : (isIndiaDest ? 'cinema' : 'itinerary')); // 'itinerary' | 'cinema'
  const [selectedDay, setSelectedDay] = useState('all');
  const [cinemaDirection, setCinemaDirection] = useState('all'); // 'all', 'North', 'South', 'West', 'East'
  const [cinemaLocations, setCinemaLocations] = useState([]);

  // Extract all itinerary points with coordinates
  const itineraryPoints = [];
  (itinerary || []).forEach((day) => {
    (day.activities || []).forEach((act, actIdx) => {
      if (act.latitude && act.longitude) {
        itineraryPoints.push({
          ...act,
          dayNumber: day.day_number,
          actIndex: actIdx + 1,
          color: WARM_DAY_COLORS[(day.day_number - 1) % WARM_DAY_COLORS.length],
        });
      }
    });
  });

  // Fetch India cinema locations for mapping
  useEffect(() => {
    apiService.getCinemaLocations()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setCinemaLocations(data);
        }
      })
      .catch((e) => console.warn('Could not load cinema map locations', e));
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      let defaultCenter = [20.5937, 78.9629]; // Geographic center of India
      let defaultZoom = 5;

      if (itineraryPoints.length > 0 && mapMode === 'itinerary') {
        defaultCenter = [itineraryPoints[0].latitude, itineraryPoints[0].longitude];
        defaultZoom = 12;
      }

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abc',
        maxZoom: 19,
      }).addTo(map);

      routesLayerRef.current = L.layerGroup().addTo(map);
      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Render Markers and Routes whenever mapMode, selectedDay, cinemaDirection, or locations change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routesLayerRef.current) return;

    const map = mapInstanceRef.current;
    markersLayerRef.current.clearLayers();
    routesLayerRef.current.clearLayers();
    cinemaMarkersRef.current = {};

    const latLngs = [];

    // MODE 1: ITINERARY ROUTE MAP
    if (mapMode === 'itinerary') {
      const activePoints = selectedDay === 'all' 
        ? itineraryPoints 
        : itineraryPoints.filter((p) => p.dayNumber === parseInt(selectedDay, 10));

      if (activePoints.length > 0) {
        // Group points by day to draw sequential route polyline
        const pointsByDay = {};
        activePoints.forEach((pt) => {
          if (!pointsByDay[pt.dayNumber]) pointsByDay[pt.dayNumber] = [];
          pointsByDay[pt.dayNumber].push(pt);
        });

        // Draw route lines connecting sequential stops
        Object.entries(pointsByDay).forEach(([dayNum, dayPts]) => {
          if (dayPts.length >= 2) {
            const routeCoords = dayPts.map((p) => [p.latitude, p.longitude]);
            const dayColor = WARM_DAY_COLORS[(parseInt(dayNum, 10) - 1) % WARM_DAY_COLORS.length];

            const shadowPolyline = L.polyline(routeCoords, {
              color: '#ffffff',
              weight: 6,
              opacity: 0.9,
              lineJoin: 'round',
              lineCap: 'round',
            });
            routesLayerRef.current.addLayer(shadowPolyline);

            const routePolyline = L.polyline(routeCoords, {
              color: dayColor,
              weight: 3.5,
              opacity: 0.95,
              dashArray: '7, 8',
              lineJoin: 'round',
              lineCap: 'round',
            });
            routesLayerRef.current.addLayer(routePolyline);
          }
        });

        // Add Markers for each stop
        activePoints.forEach((pt) => {
          latLngs.push([pt.latitude, pt.longitude]);

          const customIcon = L.divIcon({
            className: 'custom-leaflet-pin',
            html: `
              <div style="
                background-color: ${pt.color};
                width: 32px;
                height: 32px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2.5px solid #ffffff;
                box-shadow: 0 4px 12px rgba(60,30,10,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
              ">
                <span style="
                  transform: rotate(45deg);
                  color: #ffffff;
                  font-size: 10px;
                  font-weight: 800;
                  font-family: 'Plus Jakarta Sans', sans-serif;
                ">D${pt.dayNumber}</span>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32],
          });

          const popupContent = `
            <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #231F20; min-width: 210px; max-width: 270px; padding: 4px;">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${pt.color};">
                  Day ${pt.dayNumber} • Stop ${pt.actIndex} (${pt.time_slot})
                </span>
                <span style="font-size: 9px; background: #FAF5F0; border: 1px solid #E4D8CE; border-radius: 4px; padding: 1px 4px; color: #8C5338; font-weight: 600;">
                  ${pt.category || 'Sightseeing'}
                </span>
              </div>
              <div style="font-size: 14px; font-family: 'Playfair Display', Georgia, serif; font-weight: bold; margin-bottom: 4px; color: #1C1917;">
                ${pt.title}
              </div>
              <div style="font-size: 11px; color: #44403C; margin-bottom: 6px;">
                ${pt.description}
              </div>
              ${pt.tips ? `
                <div style="font-size: 10px; color: #C84B26; background: #FFF7ED; border-left: 2.5px solid #C84B26; padding: 4px 6px; border-radius: 0 4px 4px 0;">
                  <strong>Insider Tip:</strong> ${pt.tips}
                </div>` : ''}
            </div>
          `;

          const marker = L.marker([pt.latitude, pt.longitude], { icon: customIcon })
            .bindPopup(popupContent);
          markersLayerRef.current.addLayer(marker);
        });

        if (latLngs.length > 0 && !focusedLocation) {
          map.fitBounds(L.latLngBounds(latLngs), { padding: [45, 45], maxZoom: 14 });
        }
      }
    }

    // MODE 2: INDIA MOVIE & SIGHTSEEING MAP
    if (mapMode === 'cinema') {
      const activeCinema = cinemaLocations.filter((loc) => {
        if (!loc.latitude || !loc.longitude) return false;
        if (cinemaDirection !== 'all' && loc.direction?.toLowerCase() !== cinemaDirection.toLowerCase()) {
          return false;
        }
        return true;
      });

      activeCinema.forEach((loc) => {
        latLngs.push([loc.latitude, loc.longitude]);
        const dirColor = DIRECTION_COLORS[loc.direction] || '#d97706';
        const isFocused = focusedLocation && focusedLocation.name === loc.name;

        const cinemaIcon = L.divIcon({
          className: 'cinema-leaflet-pin',
          html: `
            <div style="
              background-color: ${isFocused ? '#e11d48' : dirColor};
              width: ${isFocused ? '38px' : '32px'};
              height: ${isFocused ? '38px' : '32px'};
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              border: ${isFocused ? '3px solid #ffedd5' : '2.5px solid #ffffff'};
              box-shadow: 0 5px 15px ${isFocused ? 'rgba(225, 29, 72, 0.6)' : 'rgba(0,0,0,0.35)'};
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.2s ease;
            ">
              <span style="transform: rotate(45deg); font-size: ${isFocused ? '16px' : '13px'};">🎬</span>
            </div>
          `,
          iconSize: [34, 34],
          iconAnchor: [17, 34],
          popupAnchor: [0, -34],
        });

        const movieScenesHtml = (loc.movie_locations || [])
          .slice(0, 2)
          .map((s) => `<li style="margin-bottom: 2px;">${s}</li>`)
          .join('');

        const landmarksHtml = (loc.must_see_landmarks || [])
          .slice(0, 3)
          .map((lm) => `<li style="margin-bottom: 2px;">✓ ${lm}</li>`)
          .join('');

        const popupContent = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1c1917; min-width: 230px; max-width: 290px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${dirColor};">
                🧭 ${loc.direction || 'India'} • ${loc.region || ''}
              </span>
              <span style="font-size: 9px; font-family: monospace; opacity: 0.8;">
                ${loc.latitude.toFixed(2)}°N, ${loc.longitude.toFixed(2)}°E
              </span>
            </div>

            <div style="font-size: 15px; font-family: 'Playfair Display', Georgia, serif; font-weight: bold; margin-bottom: 4px; color: #111827;">
              ${loc.name}
            </div>

            ${loc.featured_movie ? `
              <div style="background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 6px; padding: 4px 6px; margin-bottom: 6px;">
                <div style="font-size: 11px; font-weight: 700; color: #92400E; display: flex; align-items: center; gap: 4px;">
                  🎬 <span>Filmed In: <strong>${loc.featured_movie}</strong></span>
                </div>
                ${movieScenesHtml ? `<ul style="font-size: 10px; color: #78350F; margin: 3px 0 0 14px; padding: 0;">${movieScenesHtml}</ul>` : ''}
              </div>
            ` : ''}

            <p style="font-size: 11px; color: #4b5563; line-height: 1.35; margin-bottom: 6px; font-style: italic;">
              "${loc.tagline || ''}"
            </p>

            ${landmarksHtml ? `
              <div style="font-size: 10px; color: #374151; margin-bottom: 6px;">
                <strong>Top Highlights:</strong>
                <ul style="margin: 2px 0 0 0; padding-left: 0; list-style: none;">${landmarksHtml}</ul>
              </div>
            ` : ''}

            <div style="font-size: 10px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 4px; display: flex; justify-content: space-between;">
              <span>Stay: <strong>${loc.recommended_stay || '3 Days'}</strong></span>
              <span>Vibe: <strong>${loc.vibe || 'Iconic'}</strong></span>
            </div>
          </div>
        `;

        const marker = L.marker([loc.latitude, loc.longitude], { icon: cinemaIcon })
          .bindPopup(popupContent);

        cinemaMarkersRef.current[loc.name] = marker;
        markersLayerRef.current.addLayer(marker);
      });

      // Fit bounds for cinema locations
      if (latLngs.length > 0 && !focusedLocation) {
        map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40] });
      }
    }

    // Auto-focus on specific location if requested
    if (focusedLocation && focusedLocation.latitude && focusedLocation.longitude) {
      setMapMode('cinema');
      map.flyTo([focusedLocation.latitude, focusedLocation.longitude], 12, { duration: 1.2 });
      setTimeout(() => {
        if (cinemaMarkersRef.current[focusedLocation.name]) {
          cinemaMarkersRef.current[focusedLocation.name].openPopup();
        }
      }, 1300);
    }
  }, [mapMode, selectedDay, cinemaDirection, cinemaLocations, focusedLocation]);

  const handleFitBounds = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    if (mapMode === 'itinerary' && itineraryPoints.length > 0) {
      const latLngs = itineraryPoints.map((p) => [p.latitude, p.longitude]);
      map.fitBounds(L.latLngBounds(latLngs), { padding: [45, 45] });
    } else if (mapMode === 'cinema' && cinemaLocations.length > 0) {
      const active = cinemaLocations.filter((loc) => {
        if (!loc.latitude || !loc.longitude) return false;
        if (cinemaDirection !== 'all' && loc.direction?.toLowerCase() !== cinemaDirection.toLowerCase()) return false;
        return true;
      });
      if (active.length > 0) {
        map.fitBounds(L.latLngBounds(active.map((l) => [l.latitude, l.longitude])), { padding: [40, 40] });
      }
    }
  };

  const uniqueDays = Array.from(new Set(itineraryPoints.map((p) => p.dayNumber)));

  return (
    <div className="theme-card rounded-2xl overflow-hidden border shadow-warm">
      {/* Map Header & Multi-Mode Navigation */}
      <div className="p-3.5 border-b flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>
        
        {/* Mode Selector */}
        <div className="flex items-center space-x-1 p-1 rounded-xl theme-card-subtle border" style={{ borderColor: 'var(--theme-border)' }}>
          <button
            type="button"
            onClick={() => {
              setMapMode('itinerary');
              if (onClearFocus) onClearFocus();
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapMode === 'itinerary'
                ? 'theme-primary-btn shadow-warm-sm'
                : 'theme-text-muted hover:theme-text'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Itinerary Route ({itineraryPoints.length} Stops)</span>
          </button>

          <button
            type="button"
            onClick={() => setMapMode('cinema')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapMode === 'cinema'
                ? 'bg-amber-600 text-white shadow-warm-sm'
                : 'theme-text-muted hover:theme-text'
            }`}
          >
            <Clapperboard className="w-3.5 h-3.5" />
            <span>🎬 India Movie & Sightseeing Pins ({cinemaLocations.length})</span>
          </button>
        </div>

        {/* Dynamic Controls based on Map Mode */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          {mapMode === 'itinerary' && (
            <>
              <button
                onClick={() => setSelectedDay('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  selectedDay === 'all'
                    ? 'theme-primary-btn shadow-warm-sm'
                    : 'theme-btn'
                }`}
              >
                All Days
              </button>
              {uniqueDays.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(String(d))}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                    selectedDay === String(d)
                      ? 'theme-primary-btn shadow-warm-sm'
                      : 'theme-btn'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: WARM_DAY_COLORS[(d - 1) % WARM_DAY_COLORS.length] }}
                  />
                  <span>Day {d}</span>
                </button>
              ))}
            </>
          )}

          {mapMode === 'cinema' && (
            <>
              <button
                onClick={() => setCinemaDirection('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  cinemaDirection === 'all'
                    ? 'bg-amber-600 text-white font-bold'
                    : 'theme-btn'
                }`}
              >
                All Directions
              </button>
              {['North', 'South', 'West', 'East'].map((dir) => (
                <button
                  key={dir}
                  onClick={() => setCinemaDirection(dir)}
                  className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                    cinemaDirection === dir
                      ? 'bg-amber-600 text-white font-bold'
                      : 'theme-btn'
                  }`}
                >
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: DIRECTION_COLORS[dir] }}
                  />
                  <span>{dir}</span>
                </button>
              ))}
            </>
          )}

          <button
            onClick={handleFitBounds}
            className="p-1.5 rounded-lg theme-btn transition-all text-xs shrink-0"
            title="Fit Map to View All Pins"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Focused Location Notice Bar if active */}
      {focusedLocation && (
        <div className="px-4 py-2 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center space-x-2">
            <Eye className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
            <span>
              Focused on <strong>{focusedLocation.name}</strong> ({focusedLocation.direction} India) • Exact GPS: {focusedLocation.latitude}°N, {focusedLocation.longitude}°E
            </span>
          </div>
          {onClearFocus && (
            <button
              onClick={onClearFocus}
              className="text-[11px] underline font-semibold text-amber-700 hover:text-amber-900"
            >
              Reset Map View
            </button>
          )}
        </div>
      )}

      {/* Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-[500px] z-10" />

      {/* Map Legend & Directions Footer */}
      <div className="px-4 py-2.5 border-t text-[11px] theme-text-muted flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: 'var(--theme-card-subtle)', borderColor: 'var(--theme-border)' }}>
        {mapMode === 'cinema' ? (
          <div className="flex flex-wrap items-center space-x-3">
            <span className="font-semibold theme-text flex items-center space-x-1">
              <Compass className="w-3 h-3 text-amber-600" />
              <span>Directional Zones:</span>
            </span>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: DIRECTION_COLORS.North }} />
              <span>🏔️ North (Ladakh, Manali, Kashmir, Agra)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: DIRECTION_COLORS.South }} />
              <span>🌴 South (Kerala, Hampi, Ooty, Ramoji)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: DIRECTION_COLORS.West }} />
              <span>🏰 West (Goa, Udaipur, Mumbai, Jaipur, Kutch)</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: DIRECTION_COLORS.East }} />
              <span>🌿 East (Kolkata, Darjeeling, Meghalaya, Kaziranga)</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-3 overflow-x-auto">
            <span className="font-semibold theme-text flex items-center space-x-1">
              <Compass className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
              <span>Itinerary Route Trails:</span>
            </span>
            {uniqueDays.map((d) => (
              <div key={d} className="flex items-center space-x-1 shrink-0">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: WARM_DAY_COLORS[(d - 1) % WARM_DAY_COLORS.length] }}
                />
                <span>Day {d} Route</span>
              </div>
            ))}
          </div>
        )}

        <div className="text-[10px] opacity-80 flex items-center space-x-1">
          <span>Click any 🎬 pin to reveal film backstory, scene trivia & exact coordinates</span>
        </div>
      </div>
    </div>
  );
}

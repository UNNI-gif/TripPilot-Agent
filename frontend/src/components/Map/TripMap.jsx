import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin } from 'lucide-react';

const WARM_DAY_COLORS = ['#C84B26', '#3B684D', '#C98D25', '#A96E1D', '#832E16', '#20362A', '#D9532F'];

export function TripMap({ itinerary, destination }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState('all');

  // Extract all points with coordinates
  const points = [];
  (itinerary || []).forEach((day) => {
    (day.activities || []).forEach((act, actIdx) => {
      if (act.latitude && act.longitude) {
        points.push({
          ...act,
          dayNumber: day.day_number,
          actIndex: actIdx + 1,
          color: WARM_DAY_COLORS[(day.day_number - 1) % WARM_DAY_COLORS.length],
        });
      }
    });
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = points.length > 0 ? [points[0].latitude, points[0].longitude] : [48.8566, 2.3522];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
      });

      // CartoDB Voyager tiles (warm, clean, high-detail editorial aesthetic)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19,
      }).addTo(map);

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

  // Update Markers when points or selectedDay changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    markersLayerRef.current.clearLayers();

    const activePoints = selectedDay === 'all' 
      ? points 
      : points.filter((p) => p.dayNumber === parseInt(selectedDay, 10));

    if (activePoints.length === 0) return;

    const latLngs = [];

    activePoints.forEach((pt) => {
      latLngs.push([pt.latitude, pt.longitude]);

      // Custom HTML Pin icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-pin',
        html: `
          <div style="
            background-color: ${pt.color};
            width: 28px;
            height: 28px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 2px solid #ffffff;
            box-shadow: 0 4px 10px rgba(80,40,20,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
          ">
            <span style="
              transform: rotate(45deg);
              color: #ffffff;
              font-size: 11px;
              font-weight: bold;
              line-height: 1;
            ">${pt.dayNumber}</span>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
      });

      const popupContent = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #231F20; min-width: 190px; max-width: 250px; padding: 2px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${pt.color}; margin-bottom: 2px;">
            Day ${pt.dayNumber} • ${pt.time_slot}
          </div>
          <div style="font-size: 14px; font-family: 'Playfair Display', serif; font-weight: bold; margin-bottom: 4px; line-height: 1.2;">
            ${pt.title}
          </div>
          <div style="font-size: 11px; color: #6E675F; margin-bottom: 6px;">
            ${pt.time} (${pt.estimated_cost})
          </div>
          <div style="font-size: 11px; color: #44403C; line-height: 1.3;">
            ${pt.description}
          </div>
          ${pt.tips ? `<div style="font-size: 10px; color: #C84B26; margin-top: 4px; font-style: italic;">Tip: ${pt.tips}</div>` : ''}
        </div>
      `;

      const marker = L.marker([pt.latitude, pt.longitude], { icon: customIcon })
        .bindPopup(popupContent);

      markersLayerRef.current.addLayer(marker);
    });

    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [40, 40], maxZoom: 15 });
    }
  }, [points, selectedDay]);

  const uniqueDays = Array.from(new Set(points.map((p) => p.dayNumber)));

  return (
    <div className="theme-card rounded-2xl overflow-hidden border shadow-warm">
      {/* Map Filter Controls Bar */}
      <div className="p-3.5 border-b flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
          <span className="text-xs sm:text-sm font-bold font-serif theme-text">
            Interactive Route Map ({destination || 'Destination'})
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded theme-badge font-sans">
            {points.length} Geo Pins
          </span>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedDay === 'all'
                ? 'theme-primary-btn shadow-warm-sm'
                : 'theme-btn'
            }`}
          >
            All Pins
          </button>
          {uniqueDays.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(String(d))}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1.5 ${
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
        </div>
      </div>

      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-[450px] z-10" />

      {/* Map Legend Footer */}
      <div className="px-4 py-2.5 border-t text-[11px] theme-text-muted flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: 'var(--theme-card-subtle)', borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center space-x-3">
          <span className="font-semibold theme-text">Legend:</span>
          {uniqueDays.map((d) => (
            <div key={d} className="flex items-center space-x-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: WARM_DAY_COLORS[(d - 1) % WARM_DAY_COLORS.length] }}
              />
              <span>Day {d}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px] opacity-75">
          Click any pin on the map to view schedules & insider tips
        </div>
      </div>
    </div>
  );
}

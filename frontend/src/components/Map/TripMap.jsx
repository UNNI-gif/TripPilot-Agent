import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Layers, Navigation } from 'lucide-react';

const DAY_COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

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
          color: DAY_COLORS[(day.day_number - 1) % DAY_COLORS.length],
        });
      }
    });
  });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center
      const defaultCenter = points.length > 0 ? [points[0].latitude, points[0].longitude] : [35.0116, 135.7681];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: true,
      });

      // CartoDB Dark Matter tiles for ultra-sleek dark mode matching TripPilot UI
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
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
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
        <div style="font-family: Inter, sans-serif; color: #0f172a; min-width: 180px; max-width: 240px; padding: 2px;">
          <div style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${pt.color}; margin-bottom: 2px;">
            Day ${pt.dayNumber} • ${pt.time_slot}
          </div>
          <div style="font-size: 13px; font-weight: bold; margin-bottom: 4px; line-height: 1.2;">
            ${pt.title}
          </div>
          <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
            ${pt.time} (${pt.estimated_cost})
          </div>
          <div style="font-size: 11px; color: #334155; line-height: 1.3;">
            ${pt.description}
          </div>
          ${pt.tips ? `<div style="font-size: 10px; color: #0284c7; margin-top: 4px; font-style: italic;">Tip: ${pt.tips}</div>` : ''}
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
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 shadow-xl">
      {/* Map Filter Controls Bar */}
      <div className="p-3.5 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-sky-400" />
          <span className="text-xs sm:text-sm font-bold text-white">
            Interactive Route Map ({destination || 'Destination'})
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-medium">
            {points.length} Geo Pins
          </span>
        </div>

        {/* Day Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedDay === 'all'
                ? 'bg-sky-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-white bg-slate-800'
            }`}
          >
            All Pins
          </button>
          {uniqueDays.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(String(d))}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all flex items-center space-x-1 ${
                selectedDay === String(d)
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-800'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: DAY_COLORS[(d - 1) % DAY_COLORS.length] }}
              />
              <span>Day {d}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-[450px] z-10" />

      {/* Map Legend Footer */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-slate-300">Legend:</span>
          {uniqueDays.map((d) => (
            <div key={d} className="flex items-center space-x-1">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: DAY_COLORS[(d - 1) % DAY_COLORS.length] }}
              />
              <span>Day {d}</span>
            </div>
          ))}
        </div>
        <div className="text-[10px] text-slate-500">
          Click any pin on the map to view schedules & insider tips
        </div>
      </div>
    </div>
  );
}

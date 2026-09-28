import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Navigation, Maximize2, Compass } from 'lucide-react';

const WARM_DAY_COLORS = ['#C84B26', '#3B684D', '#C98D25', '#A96E1D', '#832E16', '#20362A', '#D9532F'];

export function TripMap({ itinerary, destination }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routesLayerRef = useRef(null);
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

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter = points.length > 0 ? [points[0].latitude, points[0].longitude] : [48.8566, 2.3522];

      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 12,
        zoomControl: true,
      });

      // OpenStreetMap standard tiles - 100% free, reliable, no API key watermark
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

  // Update Markers and Connecting Route Lines when points or selectedDay changes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routesLayerRef.current) return;

    const map = mapInstanceRef.current;
    markersLayerRef.current.clearLayers();
    routesLayerRef.current.clearLayers();

    const activePoints = selectedDay === 'all' 
      ? points 
      : points.filter((p) => p.dayNumber === parseInt(selectedDay, 10));

    if (activePoints.length === 0) return;

    const latLngs = [];

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

        // Soft white backing line for contrast
        const shadowPolyline = L.polyline(routeCoords, {
          color: '#ffffff',
          weight: 6,
          opacity: 0.9,
          lineJoin: 'round',
          lineCap: 'round',
        });
        routesLayerRef.current.addLayer(shadowPolyline);

        // Colored route line with dashed progression trail
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

      // Custom styled pin with Stop & Day badge
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
            transition: transform 0.15s ease;
          ">
            <span style="
              transform: rotate(45deg);
              color: #ffffff;
              font-size: 10px;
              font-weight: 800;
              font-family: 'Plus Jakarta Sans', sans-serif;
              line-height: 1;
              letter-spacing: -0.5px;
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
            <span style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: ${pt.color}; letter-spacing: 0.5px;">
              Day ${pt.dayNumber} • Stop ${pt.actIndex} (${pt.time_slot})
            </span>
            <span style="font-size: 9px; background: #FAF5F0; border: 1px solid #E4D8CE; border-radius: 4px; padding: 1px 4px; color: #8C5338; font-weight: 600;">
              ${pt.category || 'Sightseeing'}
            </span>
          </div>
          <div style="font-size: 14px; font-family: 'Playfair Display', Georgia, serif; font-weight: bold; margin-bottom: 4px; line-height: 1.25; color: #1C1917;">
            ${pt.title}
          </div>
          <div style="font-size: 11px; color: #78716C; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
            <span>⏱ ${pt.time || 'Flexible'}</span>
            <span style="font-weight: 600; color: #B45309;">${pt.estimated_cost || 'Free'}</span>
          </div>
          <div style="font-size: 11px; color: #44403C; line-height: 1.35; margin-bottom: 6px;">
            ${pt.description}
          </div>
          ${pt.tips ? `
            <div style="font-size: 10px; color: #C84B26; background: #FFF7ED; border-left: 2.5px solid #C84B26; padding: 4px 6px; border-radius: 0 4px 4px 0; line-height: 1.3;">
              <strong>Insider Tip:</strong> ${pt.tips}
            </div>` : ''}
        </div>
      `;

      const marker = L.marker([pt.latitude, pt.longitude], { icon: customIcon })
        .bindPopup(popupContent);

      markersLayerRef.current.addLayer(marker);
    });

    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [45, 45], maxZoom: 14 });
    }
  }, [points, selectedDay]);

  const handleFitBounds = () => {
    if (!mapInstanceRef.current || points.length === 0) return;
    const activePoints = selectedDay === 'all' 
      ? points 
      : points.filter((p) => p.dayNumber === parseInt(selectedDay, 10));
    const targetPoints = activePoints.length > 0 ? activePoints : points;
    const latLngs = targetPoints.map((p) => [p.latitude, p.longitude]);
    mapInstanceRef.current.fitBounds(L.latLngBounds(latLngs), { padding: [45, 45], maxZoom: 14 });
  };

  const uniqueDays = Array.from(new Set(points.map((p) => p.dayNumber)));

  return (
    <div className="theme-card rounded-2xl overflow-hidden border shadow-warm">
      {/* Map Filter Controls Bar */}
      <div className="p-3.5 border-b flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4" style={{ color: 'var(--theme-primary)' }} />
          <span className="text-xs sm:text-sm font-bold font-serif theme-text">
            Authentic Route Map ({destination || 'Destination'})
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded theme-badge font-sans font-semibold">
            {points.length} Sightseeing Stops
          </span>
        </div>

        {/* Day Filter Pills & Reset Control */}
        <div className="flex items-center space-x-1 overflow-x-auto">
          <button
            onClick={() => setSelectedDay('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedDay === 'all'
                ? 'theme-primary-btn shadow-warm-sm'
                : 'theme-btn'
            }`}
          >
            All Stops
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
          <button
            onClick={handleFitBounds}
            className="p-1.5 rounded-lg theme-btn transition-all text-xs"
            title="Fit Route to Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Leaflet Map DOM Node */}
      <div ref={mapContainerRef} className="w-full h-[470px] z-10" />

      {/* Map Legend & Route Trail Status Footer */}
      <div className="px-4 py-2.5 border-t text-[11px] theme-text-muted flex flex-wrap items-center justify-between gap-2" style={{ backgroundColor: 'var(--theme-card-subtle)', borderColor: 'var(--theme-border)' }}>
        <div className="flex items-center space-x-3 overflow-x-auto">
          <span className="font-semibold theme-text flex items-center space-x-1">
            <Compass className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
            <span>Route Trails:</span>
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
        <div className="text-[10px] opacity-80 flex items-center space-x-1">
          <span>Dashed lines show recommended daily walking & transit order</span>
        </div>
      </div>
    </div>
  );
}

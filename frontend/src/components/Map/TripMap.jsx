import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  MapPin, 
  Navigation, 
  Maximize2, 
  Compass, 
  Clapperboard, 
  Eye, 
  ArrowLeftRight, 
  Car, 
  Clock, 
  Sparkles,
  Search
} from 'lucide-react';
import { apiService } from '../../services/api';

const WARM_DAY_COLORS = ['#C84B26', '#3B684D', '#C98D25', '#A96E1D', '#832E16', '#20362A', '#D9532F'];

const DIRECTION_COLORS = {
  North: '#0284c7', // Sky Blue
  South: '#059669', // Emerald Green
  West: '#d97706',  // Amber Terracotta
  East: '#0d9488',  // Teal
};

// Comprehensive coordinate dictionary for immediate client-side resolution
const CITY_COORDINATES = {
  // South India
  'munnar': [10.0889, 77.0595],
  'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946],
  'kochi': [9.9312, 76.2673],
  'cochin': [9.9312, 76.2673],
  'coimbatore': [11.0168, 76.9558],
  'madurai': [9.9252, 78.1198],
  'chennai': [13.0827, 80.2707],
  'mysore': [12.2958, 76.6394],
  'mysuru': [12.2958, 76.6394],
  'ooty': [11.4102, 76.6950],
  'alleppey': [9.4981, 76.3388],
  'alappuzha': [9.4981, 76.3388],
  'wayanad': [11.6854, 76.1320],
  'thekkady': [9.6031, 77.1615],
  'hyderabad': [17.3850, 78.4867],
  'trivandrum': [8.5241, 76.9366],
  'thiruvananthapuram': [8.5241, 76.9366],
  'hampi': [15.3350, 76.4600],
  'goa': [15.2993, 74.1240],
  // North & Central India
  'delhi': [28.6139, 77.2090],
  'new delhi': [28.6139, 77.2090],
  'mumbai': [19.0760, 72.8777],
  'jaipur': [26.9124, 75.7873],
  'udaipur': [24.5854, 73.7125],
  'agra': [27.1767, 78.0081],
  'varanasi': [25.3176, 82.9739],
  'manali': [32.2432, 77.1892],
  'shimla': [31.1048, 77.1734],
  'leh': [34.1526, 77.5771],
  'ladakh': [34.1526, 77.5771],
  'srinagar': [34.0837, 74.7973],
  'kashmir': [34.0837, 74.7973],
  'kolkata': [22.5726, 88.3639],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'chandigarh': [30.7333, 76.7794],
  // International
  'france': [46.2276, 2.2137],
  'paris': [48.8566, 2.3522],
  'tokyo': [35.6762, 139.6503],
  'japan': [36.2048, 138.2529],
  'london': [51.5074, -0.1278],
  'dubai': [25.2048, 55.2708],
  'singapore': [1.3521, 103.8198],
  'rome': [41.9028, 12.4964],
  'italy': [41.8719, 12.5674],
  'bangkok': [13.7563, 100.5018],
  'bali': [-8.4095, 115.1889],
  'new york': [40.7128, -74.0060]
};

function resolveCoords(name) {
  if (!name) return null;
  const clean = name.toLowerCase().trim();
  for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
    if (clean === key || clean.includes(key) || key.includes(clean)) {
      return coords;
    }
  }
  return null;
}

function calculateRoadDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLine = R * c;
  // Road winding factor 1.25 for Indian highways / mountain ghat roads
  return Math.round(straightLine * 1.25 * 10) / 10;
}

function calculateTravelDuration(distanceKm) {
  if (!distanceKm || distanceKm <= 0) return '0 min';
  if (distanceKm < 90) {
    const hours = distanceKm / 42;
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return h > 0 ? `~${h}h ${m}m Drive` : `~${m}m Drive`;
  }
  const hours = distanceKm / 52;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `~${h}h ${m}m by Road / Express`;
}

export function TripMap({ 
  itinerary, 
  destination, 
  origin: propOrigin,
  originLatitude: propOriginLat,
  originLongitude: propOriginLng,
  destinationLatitude: propDestLat,
  destinationLongitude: propDestLng,
  totalDistanceKm: propDistance,
  estimatedTravelTime: propTravelTime,
  focusedLocation, 
  onClearFocus,
  onPlanRoute
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routesLayerRef = useRef(null);
  const cinemaMarkersRef = useRef({});

  // Source and Destination Interactive State
  const defaultDest = destination || 'Munnar';
  const defaultSource = propOrigin || (defaultDest.toLowerCase().includes('munnar') ? 'Bangalore' : 'Bangalore');

  const [sourceInput, setSourceInput] = useState(defaultSource);
  const [destInput, setDestInput] = useState(defaultDest);

  // Active Source & Destination Coordinates
  const [sourceCoords, setSourceCoords] = useState(() => {
    if (propOriginLat && propOriginLng) return [propOriginLat, propOriginLng];
    return resolveCoords(defaultSource) || [12.9716, 77.5946]; // Default Bangalore
  });

  const [destCoords, setDestCoords] = useState(() => {
    if (propDestLat && propDestLng) return [propDestLat, propDestLng];
    return resolveCoords(defaultDest) || [10.0889, 77.0595]; // Default Munnar
  });

  const [activeDistance, setActiveDistance] = useState(() => {
    if (propDistance) return propDistance;
    if (sourceCoords && destCoords) {
      return calculateRoadDistanceKm(sourceCoords[0], sourceCoords[1], destCoords[0], destCoords[1]);
    }
    return null;
  });

  const [activeDuration, setActiveDuration] = useState(() => {
    if (propTravelTime) return propTravelTime;
    if (activeDistance) return calculateTravelDuration(activeDistance);
    return null;
  });

  // Update state if props change from backend agent response
  useEffect(() => {
    if (propOrigin) setSourceInput(propOrigin);
    if (destination) setDestInput(destination);

    let sCoords = null;
    let dCoords = null;

    if (propOriginLat && propOriginLng) {
      sCoords = [propOriginLat, propOriginLng];
    } else if (propOrigin) {
      sCoords = resolveCoords(propOrigin);
    }

    if (propDestLat && propDestLng) {
      dCoords = [propDestLat, propDestLng];
    } else if (destination) {
      dCoords = resolveCoords(destination);
    }

    if (sCoords) setSourceCoords(sCoords);
    if (dCoords) setDestCoords(dCoords);

    if (propDistance) {
      setActiveDistance(propDistance);
      setActiveDuration(propTravelTime || calculateTravelDuration(propDistance));
    } else if (sCoords && dCoords) {
      const dist = calculateRoadDistanceKm(sCoords[0], sCoords[1], dCoords[0], dCoords[1]);
      setActiveDistance(dist);
      setActiveDuration(calculateTravelDuration(dist));
    }
  }, [propOrigin, destination, propOriginLat, propOriginLng, propDestLat, propDestLng, propDistance, propTravelTime]);

  const isIndiaDest = (destInput || destination || '').toLowerCase().includes('india') ||
    ['munnar', 'delhi', 'mumbai', 'goa', 'kerala', 'manali', 'ladakh', 'kashmir', 'hampi', 'ooty', 'jaipur', 'udaipur', 'kolkata'].some(
      (k) => (destInput || destination || '').toLowerCase().includes(k)
    );

  const [mapMode, setMapMode] = useState('itinerary'); // 'itinerary' | 'cinema'
  const [selectedDay, setSelectedDay] = useState('all');
  const [cinemaDirection, setCinemaDirection] = useState('all'); // 'all', 'North', 'South', 'West', 'East'
  const [cinemaLocations, setCinemaLocations] = useState([]);

  // Handle Source / Destination Changes
  const applyDirections = (newSource, newDest) => {
    const s = newSource !== undefined ? newSource : sourceInput;
    const d = newDest !== undefined ? newDest : destInput;

    const sCoords = resolveCoords(s) || sourceCoords;
    const dCoords = resolveCoords(d) || destCoords;

    setSourceInput(s);
    setDestInput(d);
    setSourceCoords(sCoords);
    setDestCoords(dCoords);

    if (sCoords && dCoords) {
      const dist = calculateRoadDistanceKm(sCoords[0], sCoords[1], dCoords[0], dCoords[1]);
      setActiveDistance(dist);
      setActiveDuration(calculateTravelDuration(dist));
    }
  };

  const handleSwap = () => {
    const nextSource = destInput;
    const nextDest = sourceInput;
    const nextSourceCoords = destCoords;
    const nextDestCoords = sourceCoords;

    setSourceInput(nextSource);
    setDestInput(nextDest);
    setSourceCoords(nextSourceCoords);
    setDestCoords(nextDestCoords);
  };

  // Quick preset sources
  const quickOriginPresets = ['Bangalore', 'Kochi', 'Coimbatore', 'Madurai', 'Chennai', 'Mumbai', 'Delhi'];

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
      let defaultCenter = destCoords || [10.0889, 77.0595];
      let defaultZoom = 8;

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

  // Render Markers, GMaps Pins (A & B) and Routes
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !routesLayerRef.current) return;

    const map = mapInstanceRef.current;
    markersLayerRef.current.clearLayers();
    routesLayerRef.current.clearLayers();
    cinemaMarkersRef.current = {};

    const allRouteLatLngs = [];

    // MODE 1: ITINERARY & GMAPS NAVIGATION ROUTE
    if (mapMode === 'itinerary') {
      // 1. PIN A: SOURCE / ORIGIN (Google Maps Style Green Pin)
      if (sourceCoords && sourceCoords.length === 2) {
        allRouteLatLngs.push(sourceCoords);

        const sourceIcon = L.divIcon({
          className: 'gmaps-source-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="
                position: absolute;
                width: 36px;
                height: 36px;
                background: rgba(16, 185, 129, 0.35);
                border-radius: 50%;
                top: -3px;
                animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
              <div style="
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2.5px solid #ffffff;
                box-shadow: 0 4px 14px rgba(5, 150, 105, 0.55);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 20;
              ">
                <span style="
                  transform: rotate(45deg);
                  color: #ffffff;
                  font-size: 13px;
                  font-weight: 900;
                  font-family: 'Plus Jakarta Sans', sans-serif;
                ">A</span>
              </div>
              <div style="
                margin-top: 2px;
                background: rgba(15, 23, 42, 0.88);
                color: #ffffff;
                padding: 1px 6px;
                border-radius: 4px;
                font-size: 9px;
                font-weight: 700;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                z-index: 20;
              ">${sourceInput || 'Origin'}</div>
            </div>
          `,
          iconSize: [36, 48],
          iconAnchor: [18, 30],
          popupAnchor: [0, -32],
        });

        const sourcePopup = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; min-width: 200px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="background: #10b981; color: white; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 4px;">
                START POINT (A)
              </span>
              <span style="font-size: 10px; color: #64748b; font-family: monospace;">
                ${sourceCoords[0].toFixed(3)}°N, ${sourceCoords[1].toFixed(3)}°E
              </span>
            </div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
              ${sourceInput}
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
              Origin departure terminal for the holiday route.
            </div>
            ${activeDistance ? `
              <div style="background: #ecfdf5; border-left: 3px solid #10b981; padding: 4px 6px; font-size: 10px; color: #065f46; font-weight: 600;">
                🚗 Total Route to ${destInput}: <strong>${activeDistance} km</strong> (${activeDuration})
              </div>
            ` : ''}
          </div>
        `;

        const sourceMarker = L.marker(sourceCoords, { icon: sourceIcon }).bindPopup(sourcePopup);
        markersLayerRef.current.addLayer(sourceMarker);
      }

      // 2. PIN B: DESTINATION (Google Maps Style Crimson Pin)
      if (destCoords && destCoords.length === 2) {
        allRouteLatLngs.push(destCoords);

        const destIcon = L.divIcon({
          className: 'gmaps-dest-pin',
          html: `
            <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
              <div style="
                background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
                width: 32px;
                height: 32px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2.5px solid #ffffff;
                box-shadow: 0 4px 14px rgba(185, 28, 28, 0.6);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 20;
              ">
                <span style="
                  transform: rotate(45deg);
                  color: #ffffff;
                  font-size: 13px;
                  font-weight: 900;
                  font-family: 'Plus Jakarta Sans', sans-serif;
                ">B</span>
              </div>
              <div style="
                margin-top: 2px;
                background: rgba(185, 28, 28, 0.95);
                color: #ffffff;
                padding: 1px 6px;
                border-radius: 4px;
                font-size: 9px;
                font-weight: 700;
                white-space: nowrap;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                z-index: 20;
              ">${destInput || 'Destination'}</div>
            </div>
          `,
          iconSize: [36, 48],
          iconAnchor: [18, 32],
          popupAnchor: [0, -34],
        });

        const destPopup = `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; min-width: 220px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
              <span style="background: #ef4444; color: white; font-size: 10px; font-weight: 800; padding: 1px 6px; border-radius: 4px;">
                DESTINATION (B)
              </span>
              <span style="font-size: 10px; color: #64748b; font-family: monospace;">
                ${destCoords[0].toFixed(3)}°N, ${destCoords[1].toFixed(3)}°E
              </span>
            </div>
            <div style="font-size: 15px; font-weight: 800; color: #0f172a; margin-bottom: 4px;">
              ${destInput}
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
              Primary vacation destination & sightseeing territory.
            </div>
            ${activeDistance ? `
              <div style="background: #fef2f2; border-left: 3px solid #ef4444; padding: 4px 6px; font-size: 10px; color: #991b1b; font-weight: 600;">
                📍 Distance from ${sourceInput}: <strong>${activeDistance} km</strong> (${activeDuration})
              </div>
            ` : ''}
          </div>
        `;

        const destMarker = L.marker(destCoords, { icon: destIcon }).bindPopup(destPopup);
        markersLayerRef.current.addLayer(destMarker);
      }

      // 3. GMAPS NAVIGATION ROUTE POLYLINE (From Source to Destination)
      if (sourceCoords && destCoords) {
        const directRoute = [sourceCoords, destCoords];

        // Outer white casing
        const shadowPoly = L.polyline(directRoute, {
          color: '#ffffff',
          weight: 7,
          opacity: 0.9,
          lineJoin: 'round',
        });
        routesLayerRef.current.addLayer(shadowPoly);

        // Vibrant Google Maps Blue Polyline
        const navPoly = L.polyline(directRoute, {
          color: '#2563eb',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8',
          lineJoin: 'round',
        });
        routesLayerRef.current.addLayer(navPoly);
      }

      // 4. ITINERARY DAY STOPS & INTRA-CITY TRAILS
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

        // Draw day route lines connecting sequential stops
        Object.entries(pointsByDay).forEach(([dayNum, dayPts]) => {
          if (dayPts.length >= 2) {
            const routeCoords = dayPts.map((p) => [p.latitude, p.longitude]);
            const dayColor = WARM_DAY_COLORS[(parseInt(dayNum, 10) - 1) % WARM_DAY_COLORS.length];

            const dayShadow = L.polyline(routeCoords, {
              color: '#ffffff',
              weight: 5,
              opacity: 0.8,
              lineJoin: 'round',
            });
            routesLayerRef.current.addLayer(dayShadow);

            const dayRoute = L.polyline(routeCoords, {
              color: dayColor,
              weight: 3,
              opacity: 0.95,
              lineJoin: 'round',
            });
            routesLayerRef.current.addLayer(dayRoute);
          }
        });

        // Add Markers for each stop
        activePoints.forEach((pt) => {
          allRouteLatLngs.push([pt.latitude, pt.longitude]);

          const customIcon = L.divIcon({
            className: 'custom-leaflet-pin',
            html: `
              <div style="
                background-color: ${pt.color};
                width: 30px;
                height: 30px;
                border-radius: 50% 50% 50% 0;
                transform: rotate(-45deg);
                border: 2px solid #ffffff;
                box-shadow: 0 4px 10px rgba(60,30,10,0.35);
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
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
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
      }

      // Automatically fit map view to show both Origin (A) and Destination (B) and stops
      if (allRouteLatLngs.length > 0 && !focusedLocation) {
        map.fitBounds(L.latLngBounds(allRouteLatLngs), { padding: [55, 55], maxZoom: 14 });
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
        allRouteLatLngs.push([loc.latitude, loc.longitude]);
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

      if (allRouteLatLngs.length > 0 && !focusedLocation) {
        map.fitBounds(L.latLngBounds(allRouteLatLngs), { padding: [40, 40] });
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
  }, [mapMode, selectedDay, cinemaDirection, cinemaLocations, focusedLocation, sourceCoords, destCoords, sourceInput, destInput, activeDistance, activeDuration]);

  const handleFitBounds = () => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    const latLngs = [];

    if (mapMode === 'itinerary') {
      if (sourceCoords) latLngs.push(sourceCoords);
      if (destCoords) latLngs.push(destCoords);
      itineraryPoints.forEach((p) => latLngs.push([p.latitude, p.longitude]));
    } else if (mapMode === 'cinema' && cinemaLocations.length > 0) {
      cinemaLocations.forEach((loc) => {
        if (loc.latitude && loc.longitude) {
          if (cinemaDirection === 'all' || loc.direction?.toLowerCase() === cinemaDirection.toLowerCase()) {
            latLngs.push([loc.latitude, loc.longitude]);
          }
        }
      });
    }

    if (latLngs.length > 0) {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    }
  };

  const uniqueDays = Array.from(new Set(itineraryPoints.map((p) => p.dayNumber)));

  return (
    <div className="theme-card rounded-2xl overflow-hidden border shadow-warm">
      
      {/* 1. GOOGLE MAPS STYLE DIRECTIONS PANEL (Source & Destination) */}
      <div className="p-4 border-b theme-card-subtle" style={{ borderColor: 'var(--theme-border)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* GMaps Direction Input Box */}
          <div className="flex-1 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm rounded-xl p-3 border shadow-warm-sm" style={{ borderColor: 'var(--theme-border)' }}>
            <div className="flex items-center gap-3">
              
              {/* Route Indicator Visual (Green dot -> line -> Red pin) */}
              <div className="flex flex-col items-center justify-center py-1 self-stretch">
                <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-[7px] text-white font-bold">A</span>
                </div>
                <div className="w-0.5 flex-1 min-h-[22px] border-l-2 border-dashed border-stone-300 dark:border-stone-700 my-1" />
                <div className="w-3.5 h-3.5 rounded-full bg-rose-600 border-2 border-white shadow-sm flex items-center justify-center">
                  <span className="text-[7px] text-white font-bold">B</span>
                </div>
              </div>

              {/* Source & Destination Text Inputs */}
              <div className="flex-1 space-y-2">
                {/* Source Input */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="source-input" className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 w-16 shrink-0">
                    Source:
                  </label>
                  <input
                    id="source-input"
                    type="text"
                    value={sourceInput}
                    onChange={(e) => setSourceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') applyDirections(sourceInput, destInput);
                    }}
                    placeholder="Enter starting city (e.g. Bangalore, Kochi...)"
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border theme-input font-medium focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    style={{ borderColor: 'var(--theme-border)' }}
                  />
                </div>

                {/* Destination Input */}
                <div className="flex items-center space-x-2">
                  <label htmlFor="destination-input" className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 w-16 shrink-0">
                    Destination:
                  </label>
                  <input
                    id="destination-input"
                    type="text"
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') applyDirections(sourceInput, destInput);
                    }}
                    placeholder="Destination (e.g. Munnar, Paris...)"
                    className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border theme-input font-medium focus:outline-none focus:ring-1 focus:ring-rose-500"
                    style={{ borderColor: 'var(--theme-border)' }}
                  />
                </div>
              </div>

              {/* Action Buttons: Swap & Update */}
              <div className="flex flex-col items-center gap-1.5 self-center pl-1 border-l" style={{ borderColor: 'var(--theme-border)' }}>
                <button
                  type="button"
                  onClick={handleSwap}
                  className="p-1.5 rounded-lg theme-card-subtle border hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors text-stone-600 dark:text-stone-300"
                  title="Swap Origin and Destination"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => applyDirections(sourceInput, destInput)}
                  className="px-2 py-1 text-[11px] font-bold rounded-lg theme-primary-btn shadow-warm-sm flex items-center space-x-1"
                  title="Update Directions Route"
                >
                  <Search className="w-3 h-3" />
                  <span>Update</span>
                </button>
              </div>

            </div>

            {/* Quick Origin Presets Chips */}
            <div className="mt-2.5 pt-2 border-t flex flex-wrap items-center gap-1 text-[10px]" style={{ borderColor: 'var(--theme-border)' }}>
              <span className="theme-text-muted font-semibold mr-1">Quick Origins:</span>
              {quickOriginPresets.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    setSourceInput(city);
                    applyDirections(city, destInput);
                  }}
                  className={`px-2 py-0.5 rounded-md border text-[10px] font-medium transition-colors ${
                    sourceInput.toLowerCase() === city.toLowerCase()
                      ? 'bg-emerald-600 text-white font-bold border-emerald-600'
                      : 'theme-card-subtle theme-text-muted hover:theme-text'
                  }`}
                  style={{ borderColor: 'var(--theme-border)' }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* GMaps Route Distance & Travel Duration Card */}
          {activeDistance && (
            <div className="lg:w-72 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                  <Car className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Driving Route Metrics</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-emerald-600/20 text-emerald-800 dark:text-emerald-200">
                  GMaps Live
                </span>
              </div>

              <div className="flex items-baseline space-x-2 my-1">
                <span className="text-2xl font-black font-sans text-stone-900 dark:text-stone-100">
                  {activeDistance}
                </span>
                <span className="text-xs font-bold text-stone-500">km Total Distance</span>
              </div>

              <div className="flex items-center space-x-1.5 text-xs text-stone-700 dark:text-stone-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>{activeDuration}</span>
              </div>

              {/* Exact Coordinates Footer */}
              <div className="mt-2 pt-1.5 border-t border-emerald-500/20 text-[9px] font-mono text-stone-500 flex justify-between">
                <span>A: {sourceCoords ? `${sourceCoords[0].toFixed(2)}°, ${sourceCoords[1].toFixed(2)}°` : 'N/A'}</span>
                <span>➔</span>
                <span>B: {destCoords ? `${destCoords[0].toFixed(2)}°, ${destCoords[1].toFixed(2)}°` : 'N/A'}</span>
              </div>

              {/* Plan with Copilot Button */}
              {onPlanRoute && (
                <button
                  type="button"
                  onClick={() => onPlanRoute(sourceInput, destInput)}
                  className="mt-2 w-full py-1 text-[11px] font-bold rounded-lg theme-primary-btn flex items-center justify-center space-x-1 shadow-warm-sm"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Plan Vacation From {sourceInput}</span>
                </button>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 2. MAP CONTROLS & MODE TOGGLE */}
      <div className="p-3 border-b flex flex-wrap items-center justify-between gap-3" style={{ backgroundColor: 'var(--theme-card)', borderColor: 'var(--theme-border)' }}>
        
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
            <span>Itinerary & Navigation ({itineraryPoints.length} Sights)</span>
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
            title="Fit Map to View Full Route"
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
              Focused on <strong>{focusedLocation.name}</strong> ({focusedLocation.direction || 'Sight'} Zone) • Exact GPS: {focusedLocation.latitude?.toFixed(4)}°N, {focusedLocation.longitude?.toFixed(4)}°E
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

      {/* 3. LEAFLET MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-[520px] z-10" />

      {/* 4. MAP LEGEND & GMAPS DIRECTIONS FOOTER */}
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
              <span>🌴 South (Kerala, Munnar, Hampi, Ooty)</span>
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
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="font-bold text-emerald-700 dark:text-emerald-400">Pin A: Origin ({sourceInput})</span>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
              <span className="font-bold text-rose-700 dark:text-rose-400">Pin B: Destination ({destInput})</span>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0">
              <span className="w-4 h-1 bg-blue-600 inline-block rounded" />
              <span className="font-medium text-blue-700 dark:text-blue-400">Connecting Highway Polyline</span>
            </div>
            {uniqueDays.map((d) => (
              <div key={d} className="flex items-center space-x-1 shrink-0">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: WARM_DAY_COLORS[(d - 1) % WARM_DAY_COLORS.length] }}
                />
                <span>Day {d} Stops</span>
              </div>
            ))}
          </div>
        )}

        <div className="text-[10px] opacity-80 flex items-center space-x-1">
          <span>Set or change source & destination anytime to recalculate travel distance</span>
        </div>
      </div>
    </div>
  );
}

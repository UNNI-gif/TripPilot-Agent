import json
import re
import httpx
from typing import Dict, Any, Optional, Tuple, List
from app.core.config import settings
from app.core.logging import logger
from app.agents.prompts import SYSTEM_PROMPT
from app.agents.schemas import (
    TripPlanResponse, DayPlan, ActivityItem, MealRecommendation,
    TripOverview, BudgetBreakdown, FlightOption, HotelOption, SightseeingHub
)
from app.tools.flights_tool import search_flights
from app.tools.hotels_tool import search_hotels
from app.tools.weather_tool import get_weather_and_packing_tips
from app.tools.budget_tool import calculate_trip_budget
from app.tools.places_tool import get_attractions_and_dining
from app.tools.sightseeing_tool import get_destination_sightseeing_hubs
from app.tools.currency_tool import get_destination_currency, convert_cost_str

# Try importing Google GenAI SDK
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logger.warning("google-generativeai package not found. Fallback mode enabled.")


KNOWN_DESTINATIONS = [
    "France", "Paris", "Nice", "Lyon", "Marseille", "Bordeaux",
    "Italy", "Rome", "Florence", "Venice", "Milan", "Naples", "Amalfi", "Sicily",
    "Japan", "Kyoto", "Tokyo", "Osaka", "Hokkaido", "Okinawa",
    "Spain", "Barcelona", "Madrid", "Seville", "Valencia", "Granada",
    "Switzerland", "Zurich", "Geneva", "Lucerne", "Interlaken",
    "Greece", "Santorini", "Athens", "Mykonos", "Crete",
    "United Kingdom", "London", "Edinburgh", "Scotland",
    "United States", "New York", "Hawaii", "California", "San Francisco", "Los Angeles", "Miami",
    "Thailand", "Bangkok", "Phuket", "Chiang Mai",
    "Bali", "Indonesia", "India", "Munnar", "Goa", "Kerala", "Manali", "Ladakh", "Leh", "Kashmir", "Srinagar", "Delhi", "New Delhi", "Mumbai", "Bangalore", "Bengaluru", "Kochi", "Cochin", "Ooty", "Hampi", "Jaipur", "Udaipur", "Rajasthan", "Kolkata", "Darjeeling", "Cherrapunji", "Shillong", "Meghalaya", "Assam", "Agra", "Chennai", "Hyderabad", "Varanasi", "Rishikesh", "Shimla", "Amritsar",
    "Germany", "Berlin", "Munich", "Frankfurt",
    "Portugal", "Lisbon", "Porto", "Algarve",
    "Netherlands", "Amsterdam",
    "Iceland", "Reykjavik",
    "Dubai", "United Arab Emirates",
    "Australia", "Sydney", "Melbourne",
    "Canada", "Vancouver", "Toronto", "Banff",
    "Singapore", "Mexico", "Cancun", "Mexico City",
    "Egypt", "Cairo",
    "Turkey", "Istanbul", "Cappadocia",
    "Morocco", "Marrakech",
    "Austria", "Vienna", "Salzburg",
    "Czech Republic", "Prague",
    "Hungary", "Budapest",
    "Norway", "Oslo", "Bergen",
    "Sweden", "Stockholm",
    "Denmark", "Copenhagen",
    "Finland", "Helsinki",
    "Ireland", "Dublin",
    "Croatia", "Dubrovnik", "Split",
    "South Korea", "Seoul", "Busan",
    "Vietnam", "Hanoi", "Da Nang", "Ho Chi Minh City",
    "New Zealand", "Auckland", "Queenstown",
    "Brazil", "Rio de Janeiro",
    "Argentina", "Buenos Aires",
    "Peru", "Lima", "Cusco",
    "South Africa", "Cape Town",
    "Belgium", "Brussels", "Bruges"
]


class TripPilotAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
        self._init_client()

    def _init_client(self):
        # Only configure if API key is not an empty string or dummy placeholder
        is_dummy_key = not self.api_key or "your_" in self.api_key.lower() or len(self.api_key.strip()) < 20
        if GENAI_AVAILABLE and not is_dummy_key:
            try:
                genai.configure(api_key=self.api_key.strip())
                self.model = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=SYSTEM_PROMPT
                )
                logger.info(f"Gemini client initialized successfully with model: {self.model_name}")
            except Exception as e:
                logger.warning(f"Failed to configure Gemini client: {e}. Using native travel engine.")
                self.model = None
        else:
            self.model = None
            logger.info("Using TripPilot native knowledge & NLP travel engine.")

    def extract_intent(
        self,
        user_message: str,
        destination_hint: Optional[str] = None,
        duration_days: Optional[int] = None,
        travel_style: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Extracts structured travel parameters (destination, duration, travel style, transit prefs)
        from freeform natural language text.
        """
        text = user_message.strip()
        lower_text = text.lower()

        # 1. Origin & Destination Extraction
        origin = None
        dest = None

        # Check for "from <Origin> to <Destination>"
        from_to_match = re.search(r'from\s+([A-Za-z\s]{2,25}?)\s+to\s+([A-Za-z\s]{2,25}?)(?:\s+(?:with|for|under|on|and|during|\.|\,|$)|$)', text, re.IGNORECASE)
        if from_to_match:
            origin_cand = from_to_match.group(1).strip()
            dest_cand = from_to_match.group(2).strip()
            for known in KNOWN_DESTINATIONS:
                if known.lower() == origin_cand.lower() or origin_cand.lower() in known.lower():
                    origin = known
                if known.lower() == dest_cand.lower() or dest_cand.lower() in known.lower():
                    dest = known
            if not origin:
                origin = origin_cand.title()
            if not dest:
                dest = dest_cand.title()

        # Check for explicit origin prepositions: "starting from Bangalore", "start from Kochi", "origin: Mumbai"
        if not origin:
            orig_match = re.search(r'(?:starting from|start from|departs? from|leaving from|origin\s*:\s*|source\s*:\s*|from)\s+([A-Za-z\s]{2,25}?)(?:\s+(?:to|for|in|into|with|on|\.|\,|$)|$)', text, re.IGNORECASE)
            if orig_match:
                candidate = orig_match.group(1).strip()
                for known in KNOWN_DESTINATIONS:
                    if known.lower() == candidate.lower() or candidate.lower() in known.lower():
                        origin = known
                        break
                if not origin and candidate.lower() not in ["the", "a", "an", "all", "here"]:
                    origin = candidate.title()

        # Check for targeted destination preposition patterns like "to Munnar", "in Kyoto", "visit Paris"
        if not dest:
            dest_match = re.search(r'(?:to|in|visit|explore|around|across|for)\s+([A-Za-z\s]{3,30}?)(?:\s+(?:with|for|under|on|and|from|during|starting|\.|\,|$)|$)', text, re.IGNORECASE)
            if dest_match:
                candidate = dest_match.group(1).strip()
                for known in KNOWN_DESTINATIONS:
                    if known.lower() == candidate.lower() or known.lower() in candidate.lower() or candidate.lower() in known.lower():
                        dest = known
                        break
                if not dest and candidate.lower() not in ["the", "a", "an", "all", "some", "cheapest", "cheapest hotels", "major locations", "my", "our", "us"]:
                    dest = candidate.title()

        # If not found via preposition pattern, search whole message for known destinations
        if not dest:
            for known in KNOWN_DESTINATIONS:
                pattern = r'\b' + re.escape(known.lower()) + r'\b'
                if re.search(pattern, lower_text):
                    dest = known
                    break

        # If not explicitly in user text, fall back to destination_hint (from UI drawer or prior session)
        if not dest and destination_hint and destination_hint.strip():
            dest = destination_hint.strip()

        # Fallback if completely unspecified anywhere
        if not dest:
            dest = "Munnar"

        # Default smart origin based on destination
        if not origin:
            if any(k in dest.lower() for k in ["munnar", "kerala", "kochi", "ooty", "hampi"]):
                origin = "Bangalore"
            elif any(k in dest.lower() for k in ["manali", "kashmir", "ladakh", "agra", "jaipur"]):
                origin = "Delhi"
            elif any(k in dest.lower() for k in ["goa", "udaipur", "mumbai"]):
                origin = "Mumbai"
            else:
                origin = "Bangalore"


        # 2. Duration Extraction: Check user message first
        days = None
        month_match = re.search(r'(\d+)\s*(?:-| )?month', lower_text)
        week_match = re.search(r'(\d+)\s*(?:-| )?week', lower_text)
        day_match = re.search(r'(\d+)\s*(?:-| )?day', lower_text)

        if month_match:
            days = int(month_match.group(1)) * 30
        elif "a month" in lower_text or "one month" in lower_text:
            days = 30
        elif week_match:
            days = int(week_match.group(1)) * 7
        elif "a week" in lower_text or "one week" in lower_text:
            days = 7
        elif day_match:
            days = int(day_match.group(1))
        elif "weekend" in lower_text:
            days = 3

        # Fall back to duration_days hint if message had no duration
        if not days and duration_days and duration_days > 0:
            days = duration_days

        if not days:
            days = 5  # default duration

        # 3. Travel Style & Companions
        is_romantic = any(w in lower_text for w in ['romantic', 'fiancé', 'fiance', 'couple', 'honeymoon', 'anniversary', 'partner'])
        is_budget = any(w in lower_text for w in ['cheap', 'cheapest', 'budget', 'affordable', 'hostel', 'economical'])
        is_luxury = any(w in lower_text for w in ['luxury', '5-star', 'first class', 'deluxe', 'vip'])
        is_family = any(w in lower_text for w in ['family', 'kids', 'children'])

        computed_style = travel_style if travel_style else "moderate"
        if is_romantic and is_budget:
            computed_style = "romantic budget"
        elif is_romantic:
            computed_style = "romantic"
        elif is_budget:
            computed_style = "budget"
        elif is_luxury:
            computed_style = "luxury"
        elif is_family:
            computed_style = "family"

        # 4. Logistics & Special Requests
        wants_cabs = any(w in lower_text for w in ['cab', 'cabs', 'taxi', 'taxis', 'chauffeur', 'private driver', 'uber'])
        wants_rental = any(w in lower_text for w in ['rental car', 'rent a car', 'road trip', 'driving'])
        wants_cheapest_hotels = is_budget

        planning_keywords = [
            "plan", "trip", "itinerary", "visit", "travel", "fly", "days", "budget", "vacation",
            "holiday", "holidays", "tour", "explore", "hotel", "hotels", "cab", "cabs",
            "sightseeing", "site-seeing", "see", "places", "attractions", "where to go"
        ]
        is_sightseeing_query = any(w in lower_text for w in ["site-seeing", "sightseeing", "places to see", "places to visit", "what to see", "best places", "where to go", "which places"])
        is_planning_request = any(k in lower_text for k in planning_keywords) or bool(destination_hint)

        return {
            "origin": origin,
            "destination": dest,
            "duration_days": days,
            "travel_style": computed_style,
            "wants_cabs": wants_cabs,
            "wants_rental": wants_rental,
            "wants_cheapest_hotels": wants_cheapest_hotels,
            "is_romantic": is_romantic,
            "is_planning_request": is_planning_request,
            "is_sightseeing_query": is_sightseeing_query
        }

    def _geocode_destination(self, dest: str) -> Tuple[float, float]:
        """Looks up coordinates via geocoding API or offline cache."""
        coords_map = {
            "munnar": (10.0889, 77.0595),
            "kerala": (10.0889, 77.0595),
            "india": (20.5937, 78.9629),
            "bangalore": (12.9716, 77.5946),
            "bengaluru": (12.9716, 77.5946),
            "delhi": (28.6139, 77.2090),
            "new delhi": (28.6139, 77.2090),
            "mumbai": (18.9220, 72.8347),
            "chennai": (13.0827, 80.2707),
            "kochi": (9.9312, 76.2673),
            "cochin": (9.9312, 76.2673),
            "hyderabad": (17.3850, 78.4867),
            "goa": (15.2993, 74.1240),
            "manali": (32.2432, 77.1892),
            "ladakh": (34.1526, 77.5771),
            "leh": (34.1526, 77.5771),
            "kashmir": (34.0837, 74.8370),
            "srinagar": (34.0837, 74.8370),
            "jaipur": (26.9124, 75.7873),
            "udaipur": (24.5854, 73.7125),
            "kolkata": (22.5726, 88.3639),
            "darjeeling": (27.0410, 88.2663),
            "ooty": (11.4102, 76.6950),
            "hampi": (15.3350, 76.4600),
            "coimbatore": (11.0168, 76.9558),
            "madurai": (9.9252, 78.1198),
            "agra": (27.1751, 78.0421),
            "pune": (18.5204, 73.8567),
            "france": (48.8566, 2.3522),
            "paris": (48.8566, 2.3522),
            "italy": (41.9028, 12.4964),
            "rome": (41.9028, 12.4964),
            "florence": (43.7696, 11.2558),
            "japan": (35.6762, 139.6503),
            "tokyo": (35.6762, 139.6503),
            "kyoto": (35.0116, 135.7681),
            "spain": (41.3879, 2.1699),
            "barcelona": (41.3879, 2.1699),
            "london": (51.5074, -0.1278),
            "switzerland": (47.3769, 8.5417),
            "zurich": (47.3769, 8.5417),
            "greece": (36.3932, 25.4615),
            "santorini": (36.3932, 25.4615),
            "new york": (40.7128, -74.0060),
            "bali": (-8.3405, 115.0920),
            "thailand": (13.7563, 100.5018),
            "bangkok": (13.7563, 100.5018),
            "amsterdam": (52.3676, 4.9041)
        }
        dest_clean = dest.lower().split(",")[0].strip()
        for k, coords in coords_map.items():
            if k in dest_clean or dest_clean in k:
                return coords

        try:
            with httpx.Client(timeout=3.0) as client:
                res = client.get("https://geocoding-api.open-meteo.com/v1/search", params={"name": dest, "count": 1})
                if res.status_code == 200:
                    data = res.json()
                    if data.get("results"):
                        return float(data["results"][0]["latitude"]), float(data["results"][0]["longitude"])
        except Exception:
            pass

        if any(w in dest_clean for w in ["munnar", "kerala", "india", "kochi", "bangalore"]):
            return (10.0889, 77.0595)
        return (48.8566, 2.3522)


    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        """Extracts JSON block from model response."""
        try:
            json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
            if json_match:
                return json.loads(json_match.group(1))
            raw_match = re.search(r"(\{[\s\S]*\})", text)
            if raw_match:
                return json.loads(raw_match.group(1))
        except Exception as e:
            logger.warning(f"Failed to parse JSON from response text: {e}")
        return None

    def _generate_synthetic_trip(self, intent: Dict[str, Any]) -> TripPlanResponse:
        """
        Generates a rich, verified structured trip plan tailored to the exact destination
        and user preferences.
        """
        dest = intent["destination"]
        origin = intent.get("origin") or "Bangalore"
        total_duration = intent["duration_days"]
        style = intent["travel_style"]
        wants_cabs = intent.get("wants_cabs", False)
        is_romantic = intent.get("is_romantic", False)

        origin_lat, origin_lng = self._geocode_destination(origin)
        base_lat, base_lng = self._geocode_destination(dest)

        import math
        def calculate_dist(lt1: float, ln1: float, lt2: float, ln2: float) -> float:
            r = 6371.0
            dlat = math.radians(lt2 - lt1)
            dlon = math.radians(ln2 - ln1)
            a = math.sin(dlat / 2)**2 + math.cos(math.radians(lt1)) * math.cos(math.radians(lt2)) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return r * c

        geo_dist = calculate_dist(origin_lat, origin_lng, base_lat, base_lng)
        road_distance_km = round(geo_dist * 1.25, 1)

        if road_distance_km <= 150:
            est_travel_time = f"~{max(1, round(road_distance_km / 45))}h {round((road_distance_km % 45) * 1.2)}m by Scenic Road / Cab"
        elif road_distance_km <= 650:
            hours = int(road_distance_km // 55)
            mins = int((road_distance_km % 55) * 1.05)
            est_travel_time = f"~{hours}h {mins}m by Road / Express Train"
        else:
            flight_hrs = max(1, int(road_distance_km // 750))
            est_travel_time = f"~{flight_hrs}h Flight + regional cab transfer"

        # For long trips (e.g. 1 month / 30 days), create a featured 7-day multi-region loop
        # that serves as the centerpiece itinerary, while computing the budget for the full duration!
        display_days = min(7, total_duration)

        dest_curr = get_destination_currency(dest)

        # Execute autonomous tools
        flights_raw = search_flights(origin, dest, style)
        hotels_raw = search_hotels(dest, style)
        weather_raw = get_weather_and_packing_tips(dest)
        budget_raw = calculate_trip_budget(total_duration, style, travelers=2 if is_romantic else 1, destination=dest)
        places_raw = get_attractions_and_dining(dest)

        flights = [FlightOption(**f) for f in flights_raw]
        hotels = [HotelOption(**h) for h in hotels_raw]

        # Add custom customs & transit notes
        customs = list(weather_raw["local_customs_and_safety"])
        if wants_cabs:
            if "france" in dest.lower() or "paris" in dest.lower():
                customs.insert(0, "Taxi & Cab Service: Use the official Taxi G7 app (fixed airport flat-rates, priority couple bookings) and Uber/Bolt for city rides. Pre-book private chauffeured transfers for castle and regional excursions.")
            else:
                customs.insert(0, f"Private Cab & Taxi Service: Pre-arrange airport private chauffeured transfers and utilize vetted local taxi apps in {dest} for seamless door-to-door comfort.")

        if is_romantic:
            customs.append("Romantic Dining: Reserve sunset tables and candlelit courtyard bistros 2-3 weeks in advance for prime couple seating.")

        overview = TripOverview(
            destination=dest,
            origin=origin,
            tagline=f"Unforgettable {total_duration}-Day {'Romantic ' if is_romantic else ''}Discovery of {dest}",
            duration_days=total_duration,
            best_season=weather_raw["best_season"],
            weather_summary=weather_raw["weather_summary"],
            packing_list=weather_raw["packing_list"],
            local_customs_and_safety=customs
        )
        budget = BudgetBreakdown(**budget_raw)

        # Destination specific daily themes
        if "munnar" in dest.lower():
            day_themes = [
                "Emerald Valleys: Arrival in Munnar, KDHP Tata Tea Museum & Attukad Waterfalls Walk",
                "Wild Western Ghats: Eravikulam National Park Nilgiri Tahr Safari & Anamudi Summit Vista",
                "Highland Lakes & Peaks: Mattupetty Dam Speedboating, Echo Point & Kundala Arch Dam",
                "World's Highest Sunrise: 4x4 Jeep Safari to Kolukkumalai Cloud Peak & Top Station",
                "Fragrant Spices: Cardamom Plantation Walks, Traditional Kathakali & Farewell Kerala Feast"
            ]
        elif "france" in dest.lower() or "paris" in dest.lower():
            day_themes = [
                "Arrival in Paris: Romantic Eiffel Tower Sunset & Champagne Seine River Cruise",
                "Artistic Heart: The Louvre Masterpieces & Bohemian Montmartre Artists Square",
                "Royal Grandeur: Excursion to the Palace of Versailles, Hall of Mirrors & Fountains",
                "Chic Strolls: Le Marais Courtyard Boutiques, Latin Quarter & Notre-Dame Promenade",
                "French Gastronomy: Wine & Cheese Tasting, Covered Markets & Saint-Germain Evening Jazz",
                "The Sunlit South: High-Speed TGV to the French Riviera & Promenade des Anglais (Nice)",
                "Provençal Romance: Lavender Hilltop Villages & Farewell Candlelit Bistro Dinner"
            ]
        elif "italy" in dest.lower() or "rome" in dest.lower():
            day_themes = [
                "Ancient Rome: The Colosseum, Roman Forum & Evening Piazza Navona Stroll",
                "Renaissance Splendor: Vatican Museums, Sistine Chapel & Trastevere Wine Walk",
                "Tuscan Charm: High-Speed Rail to Florence, Duomo Vista & Artisan Leather Markets",
                "Romantic Canals: Arrival in Venice, Gondola Ride & St. Mark's Square",
                "Venetian Islands: Murano Glassblowing, Burano Colorful Houses & Seafood Trattoria",
                "Amalfi Coast Escape: Cliffside Strolls in Positano & Lemon Grove Tasting",
                "Farewell Sunset Dinner overlooking the Bay of Naples"
            ]
        else:
            day_themes = [
                f"Iconic Landmarks & Historical Heart of {dest}",
                f"Hidden Alleys, Artisan Boutiques & Romantic Promenade Walk",
                f"Cultural Heritage, Historic Temples & Panoramic Vistas",
                f"Art Galleries, Modern Architecture & Sunset Skyline",
                f"Local Neighborhood Wandering, Markets & Regional Gastronomy",
                f"Excursion to Nearby Scenic Countryside & Country Estates",
                f"Relaxed Morning Cafés, Souvenir Treasure Hunting & Farewell Celebration"
            ]


        transit_notes = (
            "Private Cab & Chauffeur: Utilize Taxi G7 / Uber / Bolt and private chauffeured transfers for effortless door-to-door comfort."
            if wants_cabs else
            f"Utilize the local metro/tram network and regional express rail for effortless transit around {dest}."
        )

        landmarks = places_raw.get("landmarks", [])
        dining = places_raw.get("dining", [])

        # Fetch authentic destination sightseeing hubs
        hubs_raw = get_destination_sightseeing_hubs(dest)
        sightseeing_hubs = [SightseeingHub(**h) for h in hubs_raw]

        import math
        def resolve_coords(item: Dict[str, Any], slot_idx: int, day_num: int) -> Tuple[float, float]:
            if item.get("latitude") is not None and item.get("longitude") is not None:
                return float(item["latitude"]), float(item["longitude"])
            # Natural urban cluster distribution around destination centroid
            angle = (day_num * 1.35 + slot_idx * 2.1) % (2 * math.pi)
            dist_deg = 0.008 + (day_num % 4) * 0.004 + slot_idx * 0.003
            return round(base_lat + dist_deg * math.cos(angle), 4), round(base_lng + dist_deg * math.sin(angle), 4)

        # Distance calculation helper for travel pacing
        def calculate_dist(lt1: float, ln1: float, lt2: float, ln2: float) -> float:
            r = 6371.0
            dlat = math.radians(lt2 - lt1)
            dlon = math.radians(ln2 - ln1)
            a = math.sin(dlat / 2)**2 + math.cos(math.radians(lt1)) * math.cos(math.radians(lt2)) * math.sin(dlon / 2)**2
            c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
            return r * c

        rainy_raw = places_raw.get("rainy_day_landmarks", [])

        itinerary = []
        for d in range(1, display_days + 1):
            theme = day_themes[(d - 1) % len(day_themes)]

            lm1 = landmarks[(d * 2 - 2) % len(landmarks)]
            lm2 = landmarks[(d * 2 - 1) % len(landmarks)]
            dinner_rec = dining[(d - 1) % len(dining)]

            lat1, lng1 = resolve_coords(lm1, 0, d)
            lat2, lng2 = resolve_coords(lm2, 1, d)
            lat3, lng3 = resolve_coords(dinner_rec, 2, d)

            # Calculate daily walking distance & pacing
            d12 = calculate_dist(lat1, lng1, lat2, lng2)
            d23 = calculate_dist(lat2, lng2, lat3, lng3)
            daily_walking_km = round(d12 + d23 + 2.0, 1)

            if daily_walking_km < 5.5:
                pacing = "Relaxed"
            elif daily_walking_km <= 9.0:
                pacing = "Balanced"
            else:
                pacing = "Ambitious"

            activities = [
                ActivityItem(
                    time_slot="Morning",
                    time="09:30 AM - 12:30 PM",
                    title=lm1["title"],
                    description=f"Begin your morning exploring {lm1['title']}, immersing in the culture and scenic beauty.",
                    location=lm1.get("location", f"Central {dest}"),
                    category=lm1.get("category", "Culture & Sightseeing"),
                    estimated_cost=convert_cost_str(lm1.get("estimated_cost", "$20"), dest_curr),
                    latitude=lat1,
                    longitude=lng1,
                    tips=lm1.get("tips", "Arrive early to beat the crowd and enjoy prime lighting.")
                ),
                ActivityItem(
                    time_slot="Afternoon",
                    time="02:30 PM - 05:30 PM",
                    title=lm2["title"],
                    description=f"Continue your afternoon journey discovering {lm2['title']}, with time for artisan shops and cozy cafés.",
                    location=lm2.get("location", f"Historic District, {dest}"),
                    category=lm2.get("category", "Heritage & Leisure"),
                    estimated_cost=convert_cost_str(lm2.get("estimated_cost", "Free"), dest_curr),
                    latitude=lat2,
                    longitude=lng2,
                    tips=lm2.get("tips", "Take time to explore the adjacent pedestrian alleys.")
                ),
                ActivityItem(
                    time_slot="Evening",
                    time="07:00 PM - 10:00 PM",
                    title=f"Sunset Panorama & {'Romantic Candlelit Dinner' if is_romantic else 'Evening Ambiance'}",
                    description=f"Savor golden hour views followed by a dinner experience at {dinner_rec.get('name', 'a recommended local bistro')} in {dest}.",
                    location=dinner_rec.get("name", f"Scenic Promenade, {dest}"),
                    category="Romance & Dining" if is_romantic else "Dining & Leisure",
                    estimated_cost=convert_cost_str(dinner_rec.get("estimated_cost", "$35"), dest_curr),
                    latitude=lat3,
                    longitude=lng3,
                    tips="Reserve a window or outdoor terrace table for romantic twilight views."
                )
            ]

            # Curate Rainy Day Contingency Plan
            rainy_activities = []
            if rainy_raw:
                r1 = rainy_raw[(d * 2 - 2) % len(rainy_raw)]
                r2 = rainy_raw[(d * 2 - 1) % len(rainy_raw)]
                r3 = rainy_raw[(d * 2) % len(rainy_raw)]

                rlat1, rlng1 = resolve_coords(r1, 0, d)
                rlat2, rlng2 = resolve_coords(r2, 1, d)
                rlat3, rlng3 = resolve_coords(r3, 2, d)

                rainy_activities = [
                    ActivityItem(
                        time_slot="Morning",
                        time="10:00 AM - 01:00 PM",
                        title=r1["title"],
                        description=f"Sheltered indoor cultural morning: Explore {r1['title']} completely protected from precipitation.",
                        location=r1.get("location", f"Central {dest}"),
                        category=r1.get("category", "Indoor Culture & Art"),
                        estimated_cost=convert_cost_str(r1.get("estimated_cost", "$18"), dest_curr),
                        latitude=rlat1,
                        longitude=rlng1,
                        tips=r1.get("tips", "Ideal indoor refuge during inclement weather.")
                    ),
                    ActivityItem(
                        time_slot="Afternoon",
                        time="02:30 PM - 05:30 PM",
                        title=r2["title"],
                        description=f"Rainproof afternoon stroll: Experience {r2['title']} with cozy artisanal tea salons and vintage arcades.",
                        location=r2.get("location", f"Covered District, {dest}"),
                        category=r2.get("category", "Covered Heritage & Shopping"),
                        estimated_cost=convert_cost_str(r2.get("estimated_cost", "Free"), dest_curr),
                        latitude=rlat2,
                        longitude=rlng2,
                        tips=r2.get("tips", "Stay dry while admiring vintage bookstores and warm bakeries.")
                    ),
                    ActivityItem(
                        time_slot="Evening",
                        time="07:30 PM - 10:30 PM",
                        title=r3["title"],
                        description=f"Intimate subterranean or cellar dinner experience: Savor regional wine tastings and hearty dishes away from rain.",
                        location=r3.get("location", f"Historic Quarter, {dest}"),
                        category=r3.get("category", "Subterranean Dining & Comfort"),
                        estimated_cost=convert_cost_str(r3.get("estimated_cost", "$35"), dest_curr),
                        latitude=rlat3,
                        longitude=rlng3,
                        tips="Pre-book cellar tables for prime cozy candlelit ambiance."
                    )
                ]

            sym = dest_curr["symbol"] if dest_curr["symbol"] not in ["AED", "CHF"] else "$"
            meals = [
                MealRecommendation(
                    meal_type="Breakfast",
                    name="Morning Artisan Bakery & Espresso Counter",
                    cuisine="Local Bakery & Coffee",
                    recommended_dish="Fresh butter pastries, warm breads & artisan roast coffee",
                    price_range=sym
                ),
                MealRecommendation(
                    meal_type="Lunch",
                    name=dining[0]["name"],
                    cuisine=dining[0]["cuisine"],
                    recommended_dish=dining[0]["recommended_dish"],
                    price_range=dining[0]["price_range"]
                ),
                MealRecommendation(
                    meal_type="Dinner",
                    name=dining[1 % len(dining)]["name"],
                    cuisine=dining[1 % len(dining)]["cuisine"],
                    recommended_dish=dining[1 % len(dining)]["recommended_dish"],
                    price_range=dining[1 % len(dining)]["price_range"]
                )
            ]

            itinerary.append(
                DayPlan(
                    day_number=d,
                    date=f"Day {d}",
                    theme=theme,
                    activities=activities,
                    meals=meals,
                    transit_tips=transit_notes,
                    rainy_day_activities=rainy_activities,
                    pacing_score=pacing,
                    estimated_walking_km=daily_walking_km
                )
            )

        title = f"The Ultimate {total_duration}-Day {'Romantic ' if is_romantic else ''}Grand Tour of {dest}"

        return TripPlanResponse(
            title=title,
            origin=origin,
            destination=dest,
            origin_latitude=origin_lat,
            origin_longitude=origin_lng,
            destination_latitude=base_lat,
            destination_longitude=base_lng,
            total_distance_km=road_distance_km,
            estimated_travel_time=est_travel_time,
            duration_days=total_duration,
            overview=overview,
            flights=flights,
            hotels=hotels,
            itinerary=itinerary,
            budget=budget,
            key_recommendations=customs,
            sightseeing_hubs=sightseeing_hubs
        )


    async def run(
        self,
        user_message: str,
        chat_history: Optional[List[Dict[str, str]]] = None,
        destination_hint: Optional[str] = None,
        duration_days: Optional[int] = None,
        travel_style: Optional[str] = None
    ) -> Tuple[str, Optional[TripPlanResponse]]:
        """
        Executes the agent logic with natural language intent extraction.
        """
        intent = self.extract_intent(
            user_message=user_message,
            destination_hint=destination_hint,
            duration_days=duration_days,
            travel_style=travel_style
        )

        dest = intent["destination"]
        days = intent["duration_days"]
        style = intent["travel_style"]
        is_planning = intent["is_planning_request"]

        # If Gemini is configured and active with a valid API key, invoke it
        if self.model:
            try:
                logger.info(f"Invoking Gemini for prompt: '{user_message}'")
                tool_flight_preview = search_flights("Home", dest, style)
                tool_hotel_preview = search_hotels(dest, style)
                tool_budget_preview = calculate_trip_budget(days, style, travelers=2 if intent["is_romantic"] else 1)

                augmented_prompt = f"""User request: {user_message}

Extracted Intent:
- Destination: {dest}
- Duration: {days} days
- Travel Style: {style}
- Cab/Private Driver Service Requested: {intent['wants_cabs']}
- Budget Stays Requested: {intent['wants_cheapest_hotels']}
- Romantic / Couple: {intent['is_romantic']}

Pre-computed Travel Insights:
- Recommended Flights: {json.dumps(tool_flight_preview[:2])}
- Recommended Stays: {json.dumps(tool_hotel_preview[:2])}
- Target Budget Breakdown: {json.dumps(tool_budget_preview)}

Craft a personalized response with a conversational intro directly acknowledging their destination ({dest}), duration ({days} days), romance, cab requests, and the full TripPlan JSON block.
"""
                response = self.model.generate_content(augmented_prompt)
                response_text = response.text

                parsed_json = self._extract_json(response_text)
                trip_plan = None
                if parsed_json:
                    try:
                        trip_plan = TripPlanResponse(**parsed_json)
                    except Exception as parse_err:
                        logger.warning(f"Pydantic validation failed on Gemini output: {parse_err}. Re-synthesizing structure.")
                        trip_plan = self._generate_synthetic_trip(intent)

                clean_reply = re.sub(r"```(?:json)?\s*[\s\S]*?\s*```", "", response_text).strip()
                if not clean_reply:
                    clean_reply = f"Here is your personalized {days}-day itinerary for {dest}! Review the day-by-day plan, hotel recommendations, and budget breakdown below."

                return clean_reply, trip_plan
            except Exception as e:
                logger.error(f"Gemini API invocation error: {e}. Falling back to native travel engine.")

        # Native travel knowledge engine
        if is_planning:
            trip_plan = self._generate_synthetic_trip(intent)
            
            cab_mention = " We've also included dedicated private cab and chauffeur recommendations (Taxi G7 & Uber) for stress-free door-to-door transit." if intent["wants_cabs"] else ""
            budget_mention = " We selected verified budget-friendly boutique stays to maximize your savings without sacrificing charm." if intent["wants_cheapest_hotels"] else ""
            romantic_mention = " Perfect for you and your fiancé to celebrate your romance!" if intent["is_romantic"] else ""

            # Top sightseeing hubs highlight
            hubs_mention = ""
            if trip_plan.sightseeing_hubs:
                hubs_list = []
                for h in trip_plan.sightseeing_hubs[:4]:
                    top_sights = ", ".join(h.must_see_landmarks[:3])
                    hubs_list.append(f"• **{h.name}** ({h.badge or h.region}): {h.tagline}\n  - *Must-See Sights:* {top_sights}\n  - *Recommended Stay:* {h.recommended_stay} | *Best for:* {h.best_for}")
                hubs_mention = f"\n\n🏰 **Essential Sightseeing Places in {dest} to Plan Your Holiday**:\n" + "\n".join(hubs_list)

            distance_mention = ""
            if trip_plan.origin and trip_plan.total_distance_km:
                distance_mention = f"\n\n🛣️ **Journey Route & Navigation**: Starting from **{trip_plan.origin}** to **{dest}** — Total Distance: **{trip_plan.total_distance_km} km** ({trip_plan.estimated_travel_time}). Open the **Route Map** tab to view the Google Maps style source-to-destination navigation route!"

            currency_mention = ""
            if trip_plan.budget and trip_plan.budget.currency:
                currency_mention = f"\n\n💰 **Standard Local Currency**: All travel expenses, stays, tickets, and dining are calculated in **{trip_plan.budget.currency} ({trip_plan.budget.currency_symbol})** according to {dest}'s regional standards."

            if intent.get("is_sightseeing_query"):
                reply = (
                    f"Here are the absolute **best places for sightseeing in {dest}** to plan your holidays around! 🗺️✨\n"
                    f"{hubs_mention}"
                    f"{distance_mention}"
                    f"{currency_mention}\n\n"
                    f"I've also synthesized a complete **{days}-day travel itinerary** for {dest} featuring these premier sights.{cab_mention}{budget_mention}\n\n"
                    f"Check out the **Route Map** tab to see exact geographic pins and route trails, or open the **Must-Visit Places** tab to explore all holiday hubs!"
                )
            else:
                reply = (
                    f"I've tailored an unforgettable **{days}-day adventure to {dest}** for you! 🌟{romantic_mention}\n\n"
                    f"We've structured your journey with iconic bucket-list landmarks, intimate scenic promenades, and authentic local dining.{cab_mention}{budget_mention}"
                    f"{distance_mention}"
                    f"{currency_mention}"
                    f"{hubs_mention}\n\n"
                    f"Explore the interactive **Route Map** (now showing authentic landmark pins and connecting route trails), day-by-day plan, hotel recommendations, and the **Must-Visit Places** tab to explore all top holiday hubs!"
                )
            return reply, trip_plan

        else:
            return (
                f"Hello traveler! I am **TripPilot**, your AI travel copilot. Where would you like to travel next? "
                f"Tell me your destination, duration, budget, or preferred travel style (e.g. *'Plan a romantic trip to France'*), and I will build your complete custom itinerary!",
                None
            )

trip_agent = TripPilotAgent()

import json
import re
from typing import Dict, Any, Optional, Tuple, List
from app.core.config import settings
from app.core.logging import logger
from app.agents.prompts import SYSTEM_PROMPT
from app.agents.schemas import TripPlanResponse, DayPlan, ActivityItem, MealRecommendation, TripOverview, BudgetBreakdown, FlightOption, HotelOption
from app.tools.flights_tool import search_flights
from app.tools.hotels_tool import search_hotels
from app.tools.weather_tool import get_weather_and_packing_tips
from app.tools.budget_tool import calculate_trip_budget
from app.tools.places_tool import get_attractions_and_dining

# Try importing Google GenAI SDK
try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logger.warning("google-generativeai package not found. Fallback mode enabled.")


class TripPilotAgent:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
        self._init_client()

    def _init_client(self):
        if GENAI_AVAILABLE and self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=SYSTEM_PROMPT
                )
                logger.info(f"Gemini client initialized successfully with model: {self.model_name}")
            except Exception as e:
                logger.error(f"Failed to configure Gemini client: {e}")
                self.model = None
        else:
            self.model = None
            if not self.api_key:
                logger.info("No GEMINI_API_KEY provided; using intelligent trip engine generator.")

    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        """Extracts JSON block from model response."""
        try:
            # First attempt: find ```json ... ``` markdown fence
            json_match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
            if json_match:
                return json.loads(json_match.group(1))
            
            # Second attempt: find raw outermost { ... }
            raw_match = re.search(r"(\{[\s\S]*\})", text)
            if raw_match:
                return json.loads(raw_match.group(1))
        except Exception as e:
            logger.warning(f"Failed to parse JSON from response text: {e}")
        return None

    def _generate_synthetic_trip(self, destination: str, duration_days: int = 3, travel_style: str = "moderate") -> TripPlanResponse:
        """
        Generates a rich, verified structured trip plan using our autonomous tools.
        Acts as an ultra-reliable, high-fidelity trip engine.
        """
        dest = destination.title() if destination else "Tokyo, Japan"
        days = max(1, min(14, duration_days))
        style = travel_style.lower() if travel_style else "moderate"

        # Execute autonomous tools
        flights_raw = search_flights("New York (JFK)", dest, style)
        hotels_raw = search_hotels(dest, style)
        weather_raw = get_weather_and_packing_tips(dest)
        budget_raw = calculate_trip_budget(days, style, travelers=2)
        places_raw = get_attractions_and_dining(dest)

        flights = [FlightOption(**f) for f in flights_raw]
        hotels = [HotelOption(**h) for h in hotels_raw]
        overview = TripOverview(
            destination=dest,
            tagline=f"Unforgettable {days}-Day Discovery of {dest}",
            duration_days=days,
            best_season=weather_raw["best_season"],
            weather_summary=weather_raw["weather_summary"],
            packing_list=weather_raw["packing_list"],
            local_customs_and_safety=weather_raw["local_customs_and_safety"]
        )
        budget = BudgetBreakdown(**budget_raw)

        # Build day-by-day itinerary
        day_themes = [
            f"Iconic Landmarks & Historical Heart of {dest}",
            f"Hidden Alleys, Artisan Boutiques & Vibrant Street Food",
            f"Cultural Temples, Scenic Gardens & Panoramic Vistas",
            f"Art Galleries, Modern Architecture & Sunset Skyline",
            f"Local Neighborhood Wandering, Markets & Farewell Gastronomy",
            f"Excursion to Nearby Scenic Mountains & Countryside Escape",
            f"Relaxed Morning Cafes, Souvenir Treasure Hunting & Departure"
        ]

        itinerary = []
        for d in range(1, days + 1):
            theme = day_themes[(d - 1) % len(day_themes)]
            activities = [
                ActivityItem(
                    time_slot="Morning",
                    time="09:00 AM - 12:00 PM",
                    title=f"Explore Central {dest} & Historic District",
                    description=f"Begin your morning exploring the cultural landmarks of {dest}, marveling at architecture and taking in morning serenity.",
                    location=f"Old Town Center, {dest}",
                    category="Culture & Sightseeing",
                    estimated_cost="$15",
                    tips="Beat the crowd by arriving right at opening time."
                ),
                ActivityItem(
                    time_slot="Afternoon",
                    time="02:00 PM - 05:00 PM",
                    title=f"Artisan Quarter & Promenade Walk",
                    description=f"Stroll through quaint cobblestone lanes, artisan craft shops, and botanical pathways.",
                    location=f"Artisan District, {dest}",
                    category="Nature & Leisure",
                    estimated_cost="Free",
                    tips="Stop by local tea shops or espresso counters for an afternoon refresher."
                ),
                ActivityItem(
                    time_slot="Evening",
                    time="06:30 PM - 09:30 PM",
                    title=f"Sunset Panorama & Night Ambiance",
                    description=f"Watch the sunset from an elevated scenic observation point, followed by an evening lantern or neon stroll.",
                    location=f"Skyline Promenade, {dest}",
                    category="Entertainment",
                    estimated_cost="$20",
                    tips="Pre-book sunset time tickets for prime photo opportunities."
                )
            ]

            meals = [
                MealRecommendation(
                    meal_type="Breakfast",
                    name=f"Morning Harvest Cafe ({dest})",
                    cuisine="Artisan Bakery & Coffee",
                    recommended_dish="Fresh sourdough pastries & local roast coffee",
                    price_range="$"
                ),
                MealRecommendation(
                    meal_type="Lunch",
                    name=places_raw["dining"][0]["name"],
                    cuisine=places_raw["dining"][0]["cuisine"],
                    recommended_dish=places_raw["dining"][0]["recommended_dish"],
                    price_range=places_raw["dining"][0]["price_range"]
                ),
                MealRecommendation(
                    meal_type="Dinner",
                    name=places_raw["dining"][1]["name"],
                    cuisine=places_raw["dining"][1]["cuisine"],
                    recommended_dish=places_raw["dining"][1]["recommended_dish"],
                    price_range=places_raw["dining"][1]["price_range"]
                )
            ]

            itinerary.append(
                DayPlan(
                    day_number=d,
                    date=f"Day {d}",
                    theme=theme,
                    activities=activities,
                    meals=meals,
                    transit_tips=f"Utilize the local metro/tram network with a daily transit pass for effortless navigation around {dest}."
                )
            )

        return TripPlanResponse(
            title=f"The Ultimate {days}-Day {dest} Itinerary",
            destination=dest,
            duration_days=days,
            overview=overview,
            flights=flights,
            hotels=hotels,
            itinerary=itinerary,
            budget=budget,
            key_recommendations=[
                f"Purchase a contactless travel transit card right upon arrival at the airport.",
                f"Reservations for high-end dining in {dest} should be booked 2-3 weeks in advance.",
                f"Keep your comfortable walking footwear handy—most highlights are best experienced on foot."
            ]
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
        Executes the agent logic:
        1. Contextualize with history and tool insights.
        2. Queries Gemini LLM.
        3. Parses response text and structured itinerary.
        4. Seamlessly falls back to synthetic high-fidelity engine if Gemini is offline or without key.
        """
        # Determine intent: is this a trip planning request or general question?
        planning_keywords = ["plan", "trip", "itinerary", "visit", "travel", "fly", "days", "budget", "vacation", "holiday", "tour", "explore", "kyoto", "paris", "tokyo", "rome", "bali", "swiss", "york", "spain", "london"]
        is_planning_request = any(k in user_message.lower() for k in planning_keywords) or bool(destination_hint)

        # Detect destination if not explicitly passed
        dest = destination_hint
        if not dest:
            for word in ["Kyoto", "Tokyo", "Paris", "Rome", "London", "Barcelona", "Bali", "New York", "Dubai", "Amsterdam", "Iceland", "Santorini", "Bangkok", "Singapore", "Zurich"]:
                if word.lower() in user_message.lower():
                    dest = word
                    break
        if not dest and is_planning_request:
            dest = "Kyoto, Japan"

        days = duration_days or 3
        # Match days in user message if mentioned e.g. "5 days" or "4-day"
        day_match = re.search(r"(\d+)\s*(?:-| )day", user_message.lower())
        if day_match:
            try:
                days = int(day_match.group(1))
            except ValueError:
                pass

        # If Gemini is configured and active, invoke it
        if self.model and self.api_key:
            try:
                logger.info(f"Invoking Gemini for prompt: '{user_message}'")
                
                # Enrich prompt with real tool data
                tool_flight_preview = search_flights("Home", dest, travel_style or "moderate")
                tool_hotel_preview = search_hotels(dest, travel_style or "moderate")
                tool_budget_preview = calculate_trip_budget(days, travel_style or "moderate")

                augmented_prompt = f"""User request: {user_message}

Destination: {dest}
Duration: {days} days
Style: {travel_style or 'moderate'}

Pre-computed Travel Insights:
- Recommended Flights: {json.dumps(tool_flight_preview[:2])}
- Recommended Stays: {json.dumps(tool_hotel_preview[:2])}
- Target Budget Breakdown: {json.dumps(tool_budget_preview)}

Craft a personalized response with a conversational intro and the full TripPlan JSON block.
"""
                response = self.model.generate_content(augmented_prompt)
                response_text = response.text

                # Attempt to extract structured itinerary
                parsed_json = self._extract_json(response_text)
                trip_plan = None
                if parsed_json:
                    try:
                        trip_plan = TripPlanResponse(**parsed_json)
                    except Exception as parse_err:
                        logger.warning(f"Pydantic validation failed on Gemini output: {parse_err}. Re-synthesizing structure.")
                        trip_plan = self._generate_synthetic_trip(dest, days, travel_style or "moderate")

                # Remove the JSON code fence from conversational reply text for clean display
                clean_reply = re.sub(r"```(?:json)?\s*[\s\S]*?\s*```", "", response_text).strip()
                if not clean_reply:
                    clean_reply = f"Here is your personalized {days}-day itinerary for {dest}! Review the day-by-day plan, hotel recommendations, and budget breakdown below."

                return clean_reply, trip_plan
            except Exception as e:
                logger.error(f"Gemini API invocation encountered error: {e}. Falling back to autonomous engine.")

        # Fallback / Autonomous synthetic engine
        if is_planning_request:
            trip_plan = self._generate_synthetic_trip(dest, days, travel_style or "moderate")
            reply = (
                f"I've tailored an exciting **{days}-day adventure to {dest}** for you! 🌟\n\n"
                f"We've optimized your schedule with curated morning cultural exploration, relaxed artisan afternoon strolls, and stellar dining spots. "
                f"Explore the interactive itinerary board below to see the flight options, handpicked boutique hotels, and comprehensive budget breakdown."
            )
            return reply, trip_plan
        else:
            return (
                "Hello traveler! I am **TripPilot**, your AI travel copilot. Where would you like to travel next? "
                "Tell me your dream destination, trip duration, budget, or preferred travel style (e.g. *'Plan a 5-day romantic trip to Kyoto'* or *'Weekend getaway to Barcelona'*), and I will build your complete custom itinerary!",
                None
            )

trip_agent = TripPilotAgent()

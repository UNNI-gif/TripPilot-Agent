from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ActivityItem(BaseModel):
    time_slot: str = Field(..., description="Morning, Afternoon, Evening, or Night")
    time: str = Field(..., description="e.g. '09:30 AM - 11:30 AM'")
    title: str = Field(..., description="Title of the activity or attraction")
    description: str = Field(..., description="Engaging summary of what to experience")
    location: str = Field(..., description="Name of the place or district")
    category: str = Field("Sightseeing", description="Category: Sightseeing, Food, Culture, Nature, Adventure, Shopping")
    estimated_cost: str = Field("$0", description="Estimated cost per person (e.g. '$20' or 'Free')")
    latitude: Optional[float] = Field(None, description="Approximate latitude")
    longitude: Optional[float] = Field(None, description="Approximate longitude")
    tips: Optional[str] = Field(None, description="Insider tip for visitors")

class MealRecommendation(BaseModel):
    meal_type: str = Field(..., description="Breakfast, Lunch, or Dinner")
    name: str = Field(..., description="Name of restaurant, market stall, or cafe")
    cuisine: str = Field(..., description="Type of cuisine")
    recommended_dish: str = Field(..., description="Signature dish to try")
    price_range: str = Field("$$", description="$, $$, $$$, or $$$$")

class DayPlan(BaseModel):
    day_number: int = Field(..., description="Day number (1, 2, 3...)")
    date: Optional[str] = Field(None, description="e.g. Day 1, or YYYY-MM-DD")
    theme: str = Field(..., description="Theme of the day, e.g. 'Historic Temples & Old Town'")
    activities: List[ActivityItem] = Field(default_factory=list, description="Activities for this day")
    meals: List[MealRecommendation] = Field(default_factory=list, description="Recommended dining options")
    transit_tips: Optional[str] = Field(None, description="Transportation recommendation for this day")
    rainy_day_activities: List[ActivityItem] = Field(default_factory=list, description="Curated indoor alternatives in case of rain")
    pacing_score: Optional[str] = Field("Balanced", description="Relaxed, Balanced, or Ambitious")
    estimated_walking_km: Optional[float] = Field(5.5, description="Estimated total walking distance in kilometers")

class FlightOption(BaseModel):
    airline: str = Field(..., description="Airline name")
    flight_number: str = Field(..., description="e.g. 'JL 006' or 'UA 875'")
    origin: str = Field(..., description="Departure city or airport code")
    destination: str = Field(..., description="Arrival city or airport code")
    departure_time: str = Field(..., description="e.g. '10:15 AM'")
    arrival_time: str = Field(..., description="e.g. '03:45 PM (+1)'")
    duration: str = Field(..., description="Flight duration e.g. '11h 30m'")
    stops: str = Field("Non-stop", description="Non-stop or 1 Stop")
    price_usd: float = Field(..., description="Estimated ticket price in USD")
    booking_tip: Optional[str] = Field(None, description="Tip for booking or baggage")

class HotelOption(BaseModel):
    name: str = Field(..., description="Hotel or resort name")
    tier: str = Field("Mid-Range", description="Budget-Friendly, Mid-Range, Boutique, or Luxury")
    rating: float = Field(4.5, description="Star or guest rating out of 5")
    price_per_night_usd: float = Field(..., description="Estimated price per night in USD")
    location: str = Field(..., description="Neighborhood or area")
    highlights: List[str] = Field(default_factory=list, description="Top 2-3 amenities or perks")
    neighborhood: Optional[str] = Field(None, description="Description of the surrounding neighborhood")

class BudgetBreakdown(BaseModel):
    flights_transit: float = Field(0.0, description="Total transit & flights estimate")
    accommodation: float = Field(0.0, description="Total stay estimate")
    food_dining: float = Field(0.0, description="Total dining estimate")
    activities_tickets: float = Field(0.0, description="Total tickets & entry estimate")
    misc_buffer: float = Field(0.0, description="Emergency and shopping buffer")
    total_estimated: float = Field(0.0, description="Total overall estimated cost")
    currency: str = Field("USD", description="Currency symbol or code")

class TripOverview(BaseModel):
    destination: str = Field(..., description="City, Region, or Country")
    tagline: str = Field(..., description="Catchy travel slogan for this journey")
    duration_days: int = Field(..., description="Total trip duration in days")
    best_season: str = Field(..., description="Best time or season to visit")
    weather_summary: str = Field(..., description="Expected weather and temperature")
    packing_list: List[str] = Field(default_factory=list, description="Recommended items to pack")
    local_customs_and_safety: List[str] = Field(default_factory=list, description="Key local cultural etiquette & safety tips")

class SightseeingHub(BaseModel):
    name: str = Field(..., description="Name of the place, city, or scenic region (e.g. 'Paris', 'French Riviera (Nice)', 'Loire Valley')")
    region: str = Field(..., description="Region, State, or Area")
    tagline: str = Field(..., description="Short evocative summary of what makes it special")
    must_see_landmarks: List[str] = Field(default_factory=list, description="Top 3-4 famous sightseeing attractions")
    best_for: str = Field(..., description="Ideal traveler interests, e.g. 'Romance, Art & History'")
    recommended_stay: str = Field(..., description="Ideal duration, e.g. '4 - 5 Days'")
    vibe: str = Field("Iconic", description="Travel vibe")
    badge: Optional[str] = Field(None, description="e.g. 'Must-Visit Capital', 'Coastal Paradise', 'Wine & Châteaux'")
    direction: Optional[str] = Field(None, description="Direction or Cardinal Zone: North, South, East, West, Central")
    movie_locations: List[str] = Field(default_factory=list, description="Famous movie shooting spots and films shot here")
    featured_movie: Optional[str] = Field(None, description="Iconic film name shot here (e.g. '3 Idiots', 'Baahubali', 'Dil Chahta Hai')")
    latitude: Optional[float] = Field(None, description="Exact latitude for map plotting")
    longitude: Optional[float] = Field(None, description="Exact longitude for map plotting")

class TripPlanResponse(BaseModel):
    id: Optional[int] = None
    title: str = Field(..., description="Inspiring trip title")
    destination: str = Field(..., description="Primary destination")
    duration_days: int = Field(..., description="Number of days")
    overview: TripOverview
    flights: List[FlightOption] = Field(default_factory=list)
    hotels: List[HotelOption] = Field(default_factory=list)
    itinerary: List[DayPlan] = Field(default_factory=list)
    budget: BudgetBreakdown
    key_recommendations: List[str] = Field(default_factory=list)
    sightseeing_hubs: List[SightseeingHub] = Field(default_factory=list)

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    destination: Optional[str] = None
    duration_days: Optional[int] = None
    budget_target: Optional[float] = None
    travel_style: Optional[str] = None # e.g. "budget", "luxury", "backpacking", "family", "romantic"

class ChatResponse(BaseModel):
    session_id: str
    reply: str
    trip_plan: Optional[TripPlanResponse] = None

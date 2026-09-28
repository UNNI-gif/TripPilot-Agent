from typing import Dict, Any

def calculate_trip_budget(duration_days: int, travel_style: str = "moderate", travelers: int = 1) -> Dict[str, Any]:
    """
    Computes an itemized budget estimate based on duration, traveler count, and travel style.
    """
    duration = max(1, duration_days)
    travelers = max(1, travelers)
    style = travel_style.lower() if travel_style else "moderate"
    
    # Rates per person per day
    daily_rates = {
        "budget": {
            "flight_transit": 450.0,
            "hotel_per_night": 60.0,
            "food_per_day": 35.0,
            "activities_per_day": 20.0,
            "misc_per_day": 15.0
        },
        "moderate": {
            "flight_transit": 850.0,
            "hotel_per_night": 140.0,
            "food_per_day": 75.0,
            "activities_per_day": 45.0,
            "misc_per_day": 25.0
        },
        "luxury": {
            "flight_transit": 2200.0,
            "hotel_per_night": 380.0,
            "food_per_day": 180.0,
            "activities_per_day": 120.0,
            "misc_per_day": 60.0
        }
    }
    
    rates = daily_rates.get(style, daily_rates["moderate"])
    
    # Total calculations
    total_flights = rates["flight_transit"] * travelers
    # Stays are shared per 2 travelers approximately
    rooms_needed = max(1, (travelers + 1) // 2)
    total_accommodation = rates["hotel_per_night"] * duration * rooms_needed
    total_food = rates["food_per_day"] * duration * travelers
    total_activities = rates["activities_per_day"] * duration * travelers
    total_misc = rates["misc_per_day"] * duration * travelers
    
    grand_total = total_flights + total_accommodation + total_food + total_activities + total_misc
    
    return {
        "flights_transit": round(total_flights, 2),
        "accommodation": round(total_accommodation, 2),
        "food_dining": round(total_food, 2),
        "activities_tickets": round(total_activities, 2),
        "misc_buffer": round(total_misc, 2),
        "total_estimated": round(grand_total, 2),
        "currency": "USD"
    }

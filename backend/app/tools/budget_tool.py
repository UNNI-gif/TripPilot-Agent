from typing import Dict, Any, Optional
from app.tools.currency_tool import get_destination_currency, EXCHANGE_RATES

def calculate_trip_budget(
    duration_days: int, 
    travel_style: str = "moderate", 
    travelers: int = 1,
    destination: Optional[str] = None,
    target_currency: Optional[str] = None
) -> Dict[str, Any]:
    """
    Computes an itemized budget estimate based on duration, traveler count, 
    and travel style, localized to the destination country's standard currency.
    """
    duration = max(1, duration_days)
    travelers = max(1, travelers)
    style = travel_style.lower() if travel_style else "moderate"
    
    # Determine target currency based on destination or explicit override
    if target_currency and target_currency.upper() in EXCHANGE_RATES:
        curr_info = EXCHANGE_RATES[target_currency.upper()]
        curr_code = target_currency.upper()
        curr_symbol = curr_info["symbol"]
        rate = curr_info["rate"]
    elif destination:
        curr_info = get_destination_currency(destination)
        curr_code = curr_info["code"]
        curr_symbol = curr_info["symbol"]
        rate = curr_info["rate"]
    else:
        # Default USD if destination not provided
        curr_info = EXCHANGE_RATES["USD"]
        curr_code = "USD"
        curr_symbol = "$"
        rate = 1.0

    # Realistic rates tailored to destination
    is_india = curr_code == "INR"

    if is_india:
        # Realistic Indian domestic rates in INR
        inr_rates = {
            "budget": {
                "flight_transit": 3800.0,
                "hotel_per_night": 2400.0,
                "food_per_day": 850.0,
                "activities_per_day": 450.0,
                "misc_per_day": 500.0
            },
            "moderate": {
                "flight_transit": 7800.0,
                "hotel_per_night": 5200.0,
                "food_per_day": 1600.0,
                "activities_per_day": 950.0,
                "misc_per_day": 1200.0
            },
            "luxury": {
                "flight_transit": 18500.0,
                "hotel_per_night": 16500.0,
                "food_per_day": 4200.0,
                "activities_per_day": 2800.0,
                "misc_per_day": 3500.0
            }
        }
        r = inr_rates.get(style, inr_rates["moderate"])
        rooms_needed = max(1, (travelers + 1) // 2)

        total_flights = r["flight_transit"] * travelers
        total_accommodation = r["hotel_per_night"] * duration * rooms_needed
        total_food = r["food_per_day"] * duration * travelers
        total_activities = r["activities_per_day"] * duration * travelers
        total_misc = r["misc_per_day"] * duration * travelers
        grand_total = total_flights + total_accommodation + total_food + total_activities + total_misc

        return {
            "flights_transit": round(total_flights),
            "accommodation": round(total_accommodation),
            "food_dining": round(total_food),
            "activities_tickets": round(total_activities),
            "misc_buffer": round(total_misc),
            "total_estimated": round(grand_total),
            "currency": "INR",
            "currency_symbol": "₹"
        }

    # Rates per person per day in base USD
    daily_rates_usd = {
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
    
    base_r = daily_rates_usd.get(style, daily_rates_usd["moderate"])
    rooms_needed = max(1, (travelers + 1) // 2)
    
    total_flights_usd = base_r["flight_transit"] * travelers
    total_accommodation_usd = base_r["hotel_per_night"] * duration * rooms_needed
    total_food_usd = base_r["food_per_day"] * duration * travelers
    total_activities_usd = base_r["activities_per_day"] * duration * travelers
    total_misc_usd = base_r["misc_per_day"] * duration * travelers

    # Convert to destination national currency
    total_flights = total_flights_usd * rate
    total_accommodation = total_accommodation_usd * rate
    total_food = total_food_usd * rate
    total_activities = total_activities_usd * rate
    total_misc = total_misc_usd * rate
    grand_total = total_flights + total_accommodation + total_food + total_activities + total_misc

    if curr_code in ["JPY", "IDR", "KRW"]:
        return {
            "flights_transit": round(total_flights),
            "accommodation": round(total_accommodation),
            "food_dining": round(total_food),
            "activities_tickets": round(total_activities),
            "misc_buffer": round(total_misc),
            "total_estimated": round(grand_total),
            "currency": curr_code,
            "currency_symbol": curr_symbol
        }

    return {
        "flights_transit": round(total_flights, 2),
        "accommodation": round(total_accommodation, 2),
        "food_dining": round(total_food, 2),
        "activities_tickets": round(total_activities, 2),
        "misc_buffer": round(total_misc, 2),
        "total_estimated": round(grand_total, 2),
        "currency": curr_code,
        "currency_symbol": curr_symbol
    }

import random
from typing import List, Dict, Any
from app.tools.currency_tool import get_destination_currency

def search_flights(origin: str, destination: str, travel_style: str = "moderate") -> List[Dict[str, Any]]:
    """
    Simulates searching real-time flight options between origin and destination.
    Adapts pricing, currency, and airline carriers based on destination country standard.
    """
    origin = origin.strip().title() if origin else "New York (JFK)"
    destination = destination.strip().title() if destination else "Paris (CDG)"
    
    curr_info = get_destination_currency(destination)
    curr_code = curr_info["code"]
    curr_symbol = curr_info["symbol"]
    rate = curr_info["rate"]

    # Check if domestic India route
    is_india_dest = curr_code == "INR"
    
    if is_india_dest:
        carriers = [
            {"name": "IndiGo Express", "code": "6E"},
            {"name": "Air India Express", "code": "IX"},
            {"name": "Akasa Air", "code": "QP"},
            {"name": "Vistara Airways", "code": "UK"},
            {"name": "SpiceJet", "code": "SG"}
        ]
        base_prices_inr = {
            "budget": (3200, 5500),
            "moderate": (5200, 8800),
            "luxury": (12000, 24000)
        }
        price_range = base_prices_inr.get(travel_style.lower(), (4500, 7500))
        selected_carriers = random.sample(carriers, 3)

        p1 = round(random.uniform(price_range[0], (price_range[0] + price_range[1]) / 2))
        p2 = round(random.uniform(price_range[0] * 0.9, price_range[0] * 1.15))
        p3 = round(random.uniform((price_range[0] + price_range[1]) / 2, price_range[1]))

        return [
            {
                "airline": selected_carriers[0]["name"],
                "flight_number": f"{selected_carriers[0]['code']} {random.randint(100, 999)}",
                "origin": origin,
                "destination": destination,
                "departure_time": "07:30 AM",
                "arrival_time": "09:45 AM",
                "duration": "1h 45m",
                "stops": "Non-stop",
                "price_usd": round(p1 / rate, 2),
                "price": p1,
                "currency": "INR",
                "currency_symbol": "₹",
                "booking_tip": "Morning non-stop flight to maximize sightseeing upon arrival."
            },
            {
                "airline": selected_carriers[1]["name"],
                "flight_number": f"{selected_carriers[1]['code']} {random.randint(100, 999)}",
                "origin": origin,
                "destination": destination,
                "departure_time": "12:15 PM",
                "arrival_time": "02:30 PM",
                "duration": "2h 15m",
                "stops": "Direct",
                "price_usd": round(p2 / rate, 2),
                "price": p2,
                "currency": "INR",
                "currency_symbol": "₹",
                "booking_tip": "Popular midday departure, includes checked baggage allowance."
            },
            {
                "airline": selected_carriers[2]["name"],
                "flight_number": f"{selected_carriers[2]['code']} {random.randint(100, 999)}",
                "origin": origin,
                "destination": destination,
                "departure_time": "06:45 PM",
                "arrival_time": "08:50 PM",
                "duration": "2h 05m",
                "stops": "Non-stop",
                "price_usd": round(p3 / rate, 2),
                "price": p3,
                "currency": "INR",
                "currency_symbol": "₹",
                "booking_tip": "Evening flight ideal for post-work weekend getaways."
            }
        ]

    # Global International carriers
    carriers = [
        {"name": "Emirates", "code": "EK"},
        {"name": "Delta Air Lines", "code": "DL"},
        {"name": "Qatar Airways", "code": "QR"},
        {"name": "Singapore Airlines", "code": "SQ"},
        {"name": "Lufthansa", "code": "LH"},
        {"name": "British Airways", "code": "BA"},
        {"name": "United Airlines", "code": "UA"},
        {"name": "Air France", "code": "AF"},
        {"name": "All Nippon Airways", "code": "NH"}
    ]

    base_prices = {
        "budget": (380.0, 650.0),
        "moderate": (650.0, 1100.0),
        "luxury": (1800.0, 4200.0)
    }
    
    price_range = base_prices.get(travel_style.lower(), (550.0, 950.0))
    selected_carriers = random.sample(carriers, 3)

    p1_usd = round(random.uniform(price_range[0], (price_range[0] + price_range[1]) / 2), 2)
    p2_usd = round(random.uniform(price_range[0] * 0.85, price_range[0] * 1.1), 2)
    p3_usd = round(random.uniform((price_range[0] + price_range[1]) / 2, price_range[1]), 2)

    def calc_local(usd_val):
        if curr_code in ["JPY", "IDR"]:
            return round(usd_val * rate)
        return round(usd_val * rate, 2)

    return [
        {
            "airline": selected_carriers[0]["name"],
            "flight_number": f"{selected_carriers[0]['code']} {random.randint(100, 999)}",
            "origin": origin,
            "destination": destination,
            "departure_time": "08:30 AM",
            "arrival_time": "06:45 PM",
            "duration": "10h 15m",
            "stops": "Non-stop",
            "price_usd": p1_usd,
            "price": calc_local(p1_usd),
            "currency": curr_code,
            "currency_symbol": curr_symbol,
            "booking_tip": "Fastest non-stop connection, includes standard carry-on and meal service."
        },
        {
            "airline": selected_carriers[1]["name"],
            "flight_number": f"{selected_carriers[1]['code']} {random.randint(100, 999)}",
            "origin": origin,
            "destination": destination,
            "departure_time": "01:15 PM",
            "arrival_time": "09:30 AM (+1)",
            "duration": "13h 15m",
            "stops": "1 Stop (1h 45m layover)",
            "price_usd": p2_usd,
            "price": calc_local(p2_usd),
            "currency": curr_code,
            "currency_symbol": curr_symbol,
            "booking_tip": "Best value option with a seamless single hub transfer."
        },
        {
            "airline": selected_carriers[2]["name"],
            "flight_number": f"{selected_carriers[2]['code']} {random.randint(100, 999)}",
            "origin": origin,
            "destination": destination,
            "departure_time": "10:45 PM",
            "arrival_time": "02:20 PM (+1)",
            "duration": "11h 35m",
            "stops": "Non-stop",
            "price_usd": p3_usd,
            "price": calc_local(p3_usd),
            "currency": curr_code,
            "currency_symbol": curr_symbol,
            "booking_tip": "Overnight red-eye arrival. Maximize your first day upon landing."
        }
    ]

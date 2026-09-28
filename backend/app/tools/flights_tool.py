import random
from typing import List, Dict, Any

def search_flights(origin: str, destination: str, travel_style: str = "moderate") -> List[Dict[str, Any]]:
    """
    Simulates searching real-time flight options between origin and destination.
    Adapts pricing and airline carriers based on common global routes and travel style.
    """
    origin = origin.strip().title() if origin else "New York (JFK)"
    destination = destination.strip().title() if destination else "Paris (CDG)"
    
    # Airline options by region / carrier
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
    
    flights = [
        {
            "airline": selected_carriers[0]["name"],
            "flight_number": f"{selected_carriers[0]['code']} {random.randint(100, 999)}",
            "origin": origin,
            "destination": destination,
            "departure_time": "08:30 AM",
            "arrival_time": "06:45 PM",
            "duration": "10h 15m",
            "stops": "Non-stop",
            "price_usd": round(random.uniform(price_range[0], (price_range[0] + price_range[1]) / 2), 2),
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
            "price_usd": round(random.uniform(price_range[0] * 0.85, price_range[0] * 1.1), 2),
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
            "price_usd": round(random.uniform((price_range[0] + price_range[1]) / 2, price_range[1]), 2),
            "booking_tip": "Overnight red-eye arrival. Maximize your first day upon landing."
        }
    ]
    return flights

import random
from typing import List, Dict, Any

def search_hotels(destination: str, travel_style: str = "moderate") -> List[Dict[str, Any]]:
    """
    Returns curated accommodation choices across different tiers in the destination.
    """
    dest = destination.strip().title() if destination else "Paris"
    
    hotel_templates = [
        {
            "name": f"The Grand {dest} Heritage Hotel",
            "tier": "Luxury",
            "rating": 4.9,
            "price_per_night_usd": 380.0 if travel_style != "budget" else 280.0,
            "location": f"Historic Center, {dest}",
            "highlights": ["Rooftop Panoramic Lounge", "Spa & Wellness Center", "Complimentary Gourmet Breakfast"],
            "neighborhood": "Located in the cultural epicenter with quick walking access to major landmarks."
        },
        {
            "name": f"{dest} Boutique Haven",
            "tier": "Boutique",
            "rating": 4.7,
            "price_per_night_usd": 195.0,
            "location": f"Artisan Quarter, {dest}",
            "highlights": ["Artisan Coffee Bar", "Locally Designed Interiors", "Bike Rentals Available"],
            "neighborhood": "Vibrant arts district packed with local bakeries, craft shops, and cozy bistros."
        },
        {
            "name": f"Citizen {dest} Urban Stay",
            "tier": "Mid-Range",
            "rating": 4.5,
            "price_per_night_usd": 125.0,
            "location": f"Downtown Central, {dest}",
            "highlights": ["High-Speed Wi-Fi & Workspaces", "24/7 Fitness Studio", "Metro Station Access"],
            "neighborhood": "Convenient transport hub near primary subway lines and night markets."
        },
        {
            "name": f"{dest} Eco Nest & Hostel",
            "tier": "Budget-Friendly",
            "rating": 4.4,
            "price_per_night_usd": 55.0,
            "location": f"Greenway District, {dest}",
            "highlights": ["Communal Kitchen", "Social Terrace & Tours", "Solar Powered & Eco Certified"],
            "neighborhood": "Relaxed youthful neighborhood with budget street food and scenic parks."
        }
    ]
    return hotel_templates

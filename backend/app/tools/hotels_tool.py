from typing import List, Dict, Any
from app.tools.currency_tool import get_destination_currency

DEST_HOTELS = {
    "munnar": [
        {
            "name": "Munnar Tea Country Resort",
            "tier": "Boutique",
            "rating": 4.8,
            "price_per_night_usd": 58.0,
            "location": "Chithirapuram, Munnar",
            "highlights": ["Private Tea Garden Balcony", "Complimentary Spiced Chai Hour", "Campfire Evenings", "Mountain Mist Views"],
            "neighborhood": "Perched on scenic tiered hillsides overlooking emerald tea valleys and waterfall glades."
        },
        {
            "name": "Windermere Estate Plantation Stay",
            "tier": "Heritage Boutique",
            "rating": 4.9,
            "price_per_night_usd": 85.0,
            "location": "Pothamedu Viewpoint Road, Munnar",
            "highlights": ["60-Acre Coffee & Cardamom Estate", "Authentic Kerala Wooden Architecture", "Highland Birdwatching"],
            "neighborhood": "Serene highland retreat nestled between clouds, rainforest trails, and spice plantations."
        },
        {
            "name": "Fragrant Nature Luxury Mountain Resort",
            "tier": "Luxury",
            "rating": 4.7,
            "price_per_night_usd": 118.0,
            "location": "Pothamedu, Munnar",
            "highlights": ["Fireplace in Every Room", "Ayurvedic Wellness Spa", "Panoramic Glass Dining Pavilion"],
            "neighborhood": "Ultra-luxe mountainside resort offering unmatched sunset panoramas across the Western Ghats."
        },
        {
            "name": "Green Ridge Munnar Valley Inn",
            "tier": "Budget-Friendly",
            "rating": 4.4,
            "price_per_night_usd": 32.0,
            "location": "Munnar Town Center",
            "highlights": ["Walk to Local Spice Bazaar", "Complimentary Kerala Breakfast", "Local Cab Tour Desk"],
            "neighborhood": "Convenient central location minutes from the KDHP Tea Museum and vibrant street food."
        }
    ],
    "india": [
        {
            "name": "The Heritage Grand Palace & Spa",
            "tier": "Luxury",
            "rating": 4.9,
            "price_per_night_usd": 185.0,
            "location": "Palace Grounds & Heritage Quarter",
            "highlights": ["Royal Courtyard Architecture", "Ayurvedic Rejuvenation Spa", "Traditional Sitar Evenings"],
            "neighborhood": "Regal historic district showcasing classical arches, fountains, and royal gardens."
        },
        {
            "name": "Zostel Cultural Traveler Hub",
            "tier": "Budget-Friendly",
            "rating": 4.6,
            "price_per_night_usd": 22.0,
            "location": "Old Town Heritage Lane",
            "highlights": ["Rooftop Cafe & Chai Lounge", "Walking Tour Meetups", "High-Speed Fiber Wi-Fi"],
            "neighborhood": "Vibrant, artistic backpacker enclave with colorful street art, cafes, and rooftop vistas."
        },
        {
            "name": "Royal Haveli Boutique Hotel",
            "tier": "Boutique",
            "rating": 4.7,
            "price_per_night_usd": 65.0,
            "location": "Historic Fort & Market Quarter",
            "highlights": ["Carved Jharokha Balconies", "Terracotta Courtyard Dining", "Complimentary Morning Masala Chai"],
            "neighborhood": "Atmospheric quarter footsteps from bustling handicraft bazaars and scenic monuments."
        }
    ],
    "france": [
        {
            "name": "Hôtel de la Porte Dorée (Paris)",
            "tier": "Budget-Friendly",
            "rating": 4.6,
            "price_per_night_usd": 68.0,
            "location": "12th Arrondissement, Paris",
            "highlights": ["Eco-Certified", "Romantic French Balconies", "Metro Step Away", "Free High-Speed Wi-Fi"],
            "neighborhood": "Charming, authentic residential Parisian neighborhood with quaint local bakeries and bistros."
        },
        {
            "name": "Hôtel des Arts Montmartre",
            "tier": "Boutique",
            "rating": 4.8,
            "price_per_night_usd": 115.0,
            "location": "Montmartre, 18th Arrondissement, Paris",
            "highlights": ["Romantic Cobblestone Views", "Complimentary Croissant Breakfast", "Couple Wine Hour"],
            "neighborhood": "Bohemian arts quarter, steps from Sacré-Cœur with stunning views across Paris."
        },
        {
            "name": "Generator Paris / Hostellerie du Canal",
            "tier": "Budget-Friendly",
            "rating": 4.4,
            "price_per_night_usd": 48.0,
            "location": "Canal Saint-Martin, Paris",
            "highlights": ["Panoramic Sunset Rooftop Bar", "Private Couple En-Suite Rooms", "24/7 Security"],
            "neighborhood": "Hip waterway district packed with affordable bistros, vintage stores, and romantic bridges."
        },
        {
            "name": "Hôtel Le Petit Marais",
            "tier": "Boutique",
            "rating": 4.7,
            "price_per_night_usd": 135.0,
            "location": "Le Marais, 4th Arrondissement, Paris",
            "highlights": ["Artisan Designed Suites", "Walk to the Louvre & Notre Dame", "Espresso Bar"],
            "neighborhood": "Historic core of Paris filled with fashion galleries, courtyard cafés, and vibrant nightlife."
        }
    ],
    "italy": [
        {
            "name": "Hotel Grifo (Rome)",
            "tier": "Budget-Friendly",
            "rating": 4.6,
            "price_per_night_usd": 72.0,
            "location": "Monti District, Rome",
            "highlights": ["Rooftop Terracotta Terrace", "Steps to Colosseum", "Free Italian Breakfast"],
            "neighborhood": "Quaint bohemian neighborhood filled with artisan boutiques and family trattorias."
        },
        {
            "name": "Relais Piazza Signoria (Florence)",
            "tier": "Boutique",
            "rating": 4.8,
            "price_per_night_usd": 120.0,
            "location": "Historic Center, Florence",
            "highlights": ["Renaissance Views", "Marble Bathrooms", "Complimentary Chianti Wine"],
            "neighborhood": "Located in the historic piazza, steps from the Uffizi Gallery and Ponte Vecchio."
        }
    ]
}

def search_hotels(destination: str, travel_style: str = "moderate") -> List[Dict[str, Any]]:
    """
    Returns curated accommodation choices across different tiers in the destination,
    localized to the destination's national currency standards.
    """
    dest_clean = destination.strip().lower() if destination else "france"
    is_budget = "budget" in travel_style.lower() or "cheap" in travel_style.lower()

    curr_info = get_destination_currency(destination)
    curr_code = curr_info["code"]
    curr_symbol = curr_info["symbol"]
    rate = curr_info["rate"]

    def enrich(hotels_list):
        enriched = []
        for h in hotels_list:
            usd_val = h["price_per_night_usd"]
            if curr_code in ["INR", "JPY", "IDR"]:
                local_price = round(usd_val * rate)
            else:
                local_price = round(usd_val * rate, 2)
            enriched.append({
                **h,
                "price_per_night": local_price,
                "currency": curr_code,
                "currency_symbol": curr_symbol
            })
        if is_budget:
            return sorted(enriched, key=lambda x: x["price_per_night_usd"])
        return enriched

    for key in ["munnar", "france", "italy", "india"]:
        if key in dest_clean and key in DEST_HOTELS:
            return enrich(DEST_HOTELS[key])

    for key, hotels in DEST_HOTELS.items():
        if key in dest_clean:
            return enrich(hotels)

    # Generic intelligent hotel templates adapted for destination
    dest_title = destination.strip().title() if destination else "Paris, France"
    budget_price = 55.0 if is_budget else 75.0
    mid_price = 110.0 if is_budget else 145.0
    
    generic = [
        {
            "name": f"{dest_title} Eco Boutique Inn",
            "tier": "Budget-Friendly",
            "rating": 4.5,
            "price_per_night_usd": budget_price,
            "location": f"Old Town District, {dest_title}",
            "highlights": ["Centrally Located", "Complimentary Breakfast", "Couple Friendly", "Free High-Speed Wi-Fi"],
            "neighborhood": "Convenient, quiet district with immediate walking access to public transit and local eateries."
        },
        {
            "name": f"The Grand {dest_title} Heritage Stay",
            "tier": "Boutique",
            "rating": 4.8,
            "price_per_night_usd": mid_price,
            "location": f"Historic Center, {dest_title}",
            "highlights": ["Rooftop Panoramic Terrace", "Historic Architecture", "Artisan Coffee Bar"],
            "neighborhood": "Prime central neighborhood surrounded by landmarks, pedestrian promenades, and evening dining."
        },
        {
            "name": f"City Hub {dest_title} Central",
            "tier": "Budget-Friendly",
            "rating": 4.4,
            "price_per_night_usd": budget_price * 0.9,
            "location": f"Downtown Hub, {dest_title}",
            "highlights": ["Clean Modern Rooms", "24/7 Front Desk", "Near Metro Station"],
            "neighborhood": "Vibrant urban quarter close to key transit lines and affordable street markets."
        }
    ]
    return enrich(generic)

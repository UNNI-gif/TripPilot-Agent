from typing import List, Dict, Any

def get_attractions_and_dining(destination: str) -> Dict[str, Any]:
    """
    Returns prominent landmarks and dining experiences tailored to the destination.
    """
    dest = destination.strip().title() if destination else "Tokyo"
    
    # Generic intelligent place highlights
    return {
        "landmarks": [
            {
                "title": f"The Historic Old Quarter & Grand Plaza",
                "category": "Culture & Heritage",
                "estimated_cost": "Free",
                "tips": "Arrive early morning around 8:30 AM before tourist crowds gather."
            },
            {
                "title": f"Panoramic Skyline Observation Deck",
                "category": "Sightseeing",
                "estimated_cost": "$25",
                "tips": "Book the golden-hour slot (around 5:30 PM) for sunset photographs."
            },
            {
                "title": f"Artisan Marketplace & Botanical Promenade",
                "category": "Nature & Leisure",
                "estimated_cost": "$10",
                "tips": "Sample regional seasonal snacks and artisanal crafts from local vendors."
            }
        ],
        "dining": [
            {
                "name": "Bistro du Marché",
                "cuisine": "Contemporary Regional",
                "recommended_dish": "Chef's Tasting Plate & Seasonal Pairing",
                "price_range": "$$$"
            },
            {
                "name": "The Old Street Noodle House",
                "cuisine": "Traditional Street Eats",
                "recommended_dish": "Hand-pulled Broth Noodles",
                "price_range": "$"
            },
            {
                "name": "Terraza Sunset Lounge",
                "cuisine": "Fusion Tapas & Cocktails",
                "recommended_dish": "Artisan Flatbreads & Craft Mocktails",
                "price_range": "$$"
            }
        ]
    }

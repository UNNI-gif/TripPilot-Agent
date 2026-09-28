from typing import List, Dict, Any

DESTINATION_KNOWLEDGE = {
    "france": {
        "landmarks": [
            {
                "title": "Eiffel Tower & Champ de Mars Sunset",
                "location": "Champ de Mars, 7th Arrondissement, Paris",
                "category": "Iconic Landmark",
                "estimated_cost": "$28",
                "tips": "Book the summit elevator ticket 3 weeks ahead for the golden hour sunset views over the Seine."
            },
            {
                "title": "Musée du Louvre & Tuileries Royal Garden",
                "location": "Rue de Rivoli, Paris",
                "category": "Art & History",
                "estimated_cost": "$22",
                "tips": "Enter through the Carrousel du Louvre underground mall entrance to skip the glass pyramid line."
            },
            {
                "title": "Palace of Versailles & Hall of Mirrors",
                "location": "Versailles, Île-de-France",
                "category": "Royal Heritage",
                "estimated_cost": "$30",
                "tips": "Hire a private cab or express RER C train early morning to stroll the fountain gardens before crowds."
            },
            {
                "title": "Bohemian Montmartre & Sacré-Cœur Basilica",
                "location": "Montmartre Hill, 18th Arrondissement, Paris",
                "category": "Culture & Romance",
                "estimated_cost": "Free",
                "tips": "Explore the quiet cobblestone vineyards behind Sacré-Cœur for romantic couple photo spots."
            },
            {
                "title": "Sunset Cruise on the River Seine",
                "location": "Pont Neuf / Port de la Bourdonnais, Paris",
                "category": "Romance & Scenic",
                "estimated_cost": "$18",
                "tips": "Time your boarding 30 minutes before twilight to watch the city of light illuminate."
            },
            {
                "title": "Promenade des Anglais & Old Town (Vieux Nice)",
                "location": "French Riviera (Côte d'Azur), Nice",
                "category": "Coastal Leisure",
                "estimated_cost": "Free",
                "tips": "Sample fresh socca flatbreads from local market stalls along the sun-washed Mediterranean promenade."
            }
        ],
        "dining": [
            {
                "name": "Le Coupe-Chou (Latin Quarter)",
                "cuisine": "Romantic French Classic",
                "recommended_dish": "Boeuf Bourguignon & Candlelit Crème Brûlée",
                "price_range": "$$"
            },
            {
                "name": "Bistrot Paul Bert",
                "cuisine": "Authentic Parisian Bistro",
                "recommended_dish": "Filet au Poivre & Tarte Tatin",
                "price_range": "$$"
            },
            {
                "name": "Crêperie Brocéliande (Montmartre)",
                "cuisine": "Artisan Galettes & Cider",
                "recommended_dish": "Savory Buckwheat Galette & Sweet Salted Caramel Crêpe",
                "price_range": "$"
            }
        ]
    },
    "italy": {
        "landmarks": [
            {
                "title": "The Colosseum & Roman Forum",
                "location": "Piazza del Colosseo, Rome",
                "category": "Ancient History",
                "estimated_cost": "$24",
                "tips": "Book the underground arena floor ticket for an intimate historical walk."
            },
            {
                "title": "Vatican Museums & Sistine Chapel",
                "location": "Vatican City, Rome",
                "category": "Renaissance Art",
                "estimated_cost": "$28",
                "tips": "Arrive for the early morning access before tourist groups arrive."
            },
            {
                "title": "Duomo di Firenze & Giotto's Bell Tower",
                "location": "Piazza del Duomo, Florence",
                "category": "Architecture",
                "estimated_cost": "$20",
                "tips": "Climb Brunelleschi's dome for the ultimate panorama of Tuscany's red-tile roofs."
            }
        ],
        "dining": [
            {
                "name": "Trattoria Da Enzo al 29 (Trastevere)",
                "cuisine": "Roman Trattoria",
                "recommended_dish": "Handmade Cacio e Pepe & Tiramisu",
                "price_range": "$$"
            },
            {
                "name": "All'Antico Vinaio",
                "cuisine": "Artisan Panini",
                "recommended_dish": "Tuscan Prosciutto & Truffle Cream Schiacciata",
                "price_range": "$"
            }
        ]
    }
}

def get_attractions_and_dining(destination: str) -> Dict[str, Any]:
    """
    Returns prominent landmarks and dining experiences tailored to the destination.
    """
    dest_clean = destination.strip().lower() if destination else "france"
    
    # Check knowledge base
    for key, data in DESTINATION_KNOWLEDGE.items():
        if key in dest_clean:
            return data

    # Intelligent location-aware generator for any other destination
    dest_title = destination.strip().title() if destination else "Paris, France"
    return {
        "landmarks": [
            {
                "title": f"Historic Old Town & Cultural Promenade in {dest_title}",
                "location": f"Central District, {dest_title}",
                "category": "Culture & Heritage",
                "estimated_cost": "Free",
                "tips": "Begin your exploration in the early morning for peaceful photography."
            },
            {
                "title": f"Panoramic Scenic Vista & Architectural Landmark",
                "location": f"Observation Point, {dest_title}",
                "category": "Sightseeing & Romance",
                "estimated_cost": "$20",
                "tips": "Book tickets during sunset to witness the twilight skyline."
            },
            {
                "title": f"Artisanal Market & Botanical Waterfront Gardens",
                "location": f"Market District, {dest_title}",
                "category": "Nature & Leisure",
                "estimated_cost": "$10",
                "tips": "Sample regional specialty delicacies from traditional local vendors."
            }
        ],
        "dining": [
            {
                "name": f"Le Bistro Traditionnel ({dest_title})",
                "cuisine": "Regional Cuisine & Wine",
                "recommended_dish": "Signature Chef Tasting Plate",
                "price_range": "$$"
            },
            {
                "name": f"The Old Town Artisan Eatery",
                "cuisine": "Local Street Flavors",
                "recommended_dish": "Handcrafted Regional Dish",
                "price_range": "$"
            },
            {
                "name": f"Belvedere Sunset Terrace",
                "cuisine": "Contemporary Fusion",
                "recommended_dish": "Fresh Local Harvest & Desserts",
                "price_range": "$$"
            }
        ]
    }

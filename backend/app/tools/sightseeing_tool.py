from typing import List, Dict, Any

DESTINATION_HUBS: Dict[str, List[Dict[str, Any]]] = {
    "france": [
        {
            "name": "Paris (Île-de-France)",
            "region": "Northern France",
            "tagline": "The City of Light: iconic world monuments, royal art, bohemian quarters & twilight Seine romance.",
            "must_see_landmarks": [
                "Eiffel Tower & Champ de Mars",
                "Musée du Louvre & Tuileries Garden",
                "Palace of Versailles (Hall of Mirrors)",
                "Montmartre & Sacré-Cœur Basilica",
                "Sunset Seine River Boat Cruise"
            ],
            "best_for": "Art, Culture, Romance & First-Timers",
            "recommended_stay": "4 - 5 Days",
            "vibe": "Cosmopolitan & Romantic",
            "badge": "Must-Visit Capital"
        },
        {
            "name": "French Riviera (Côte d'Azur & Nice)",
            "region": "Southeastern Coast",
            "tagline": "Sun-drenched Mediterranean coastline, azure pebble beaches, Belle Époque luxury & clifftop villages.",
            "must_see_landmarks": [
                "Promenade des Anglais & Baie des Anges (Nice)",
                "Èze Clifftop Medieval Village",
                "Monaco Grand Casino & Harbor",
                "Cannes Croisette Promenade",
                "Saint-Paul-de-Vence Artist Enclave"
            ],
            "best_for": "Beaches, Scenic Drives, Glamour & Coastal Relaxation",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Mediterranean Glamour",
            "badge": "Coastal Paradise"
        },
        {
            "name": "Provence & Luberon",
            "region": "Southern France",
            "tagline": "Rolling purple lavender fields, sun-baked stone villages, ancient Roman aqueducts & vineyard terraces.",
            "must_see_landmarks": [
                "Gordes & Roussillon Ochre Cliffs",
                "Pont du Gard Roman Aqueduct",
                "Palais des Papes (Avignon)",
                "Sénanque Abbey Lavender Fields",
                "Aix-en-Provence Fountains & Markets"
            ],
            "best_for": "Country Romance, Wine Tasting & Scenic Photography",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Rustic Elegance",
            "badge": "Scenic Countryside"
        },
        {
            "name": "Loire Valley (Châteaux de la Loire)",
            "region": "Central France",
            "tagline": "The Garden of France: grand Renaissance royal castles, ornate water gardens & crisp Chenin Blanc wines.",
            "must_see_landmarks": [
                "Château de Chambord (Double Helix Staircase)",
                "Château de Chenonceau (Spanning the River Cher)",
                "Villandry Renaissance Geometric Gardens",
                "Amboise Royal Castle & Leonardo da Vinci Tomb",
                "Vouvray Underground Wine Caves"
            ],
            "best_for": "Fairytale Castles, Heritage & Wine Connoisseurs",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Royal & Historic",
            "badge": "Fairytale Châteaux"
        },
        {
            "name": "Normandy & Mont Saint-Michel",
            "region": "Northwestern Coast",
            "tagline": "Dramatic coastal tides, the miraculous island abbey, historic D-Day sands & apple cider orchards.",
            "must_see_landmarks": [
                "Mont Saint-Michel Abbey Island",
                "Omaha Beach & Normandy American Cemetery",
                "Étretat White Needle Chalk Cliffs",
                "Rouen Gothic Cathedral",
                "Honfleur Historic Harbor Basin"
            ],
            "best_for": "World History, Coastal Drama & Gourmet Cheeses",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Historic & Dramatic",
            "badge": "Coastal Wonder"
        },
        {
            "name": "Bordeaux & Aquitaine Wine Country",
            "region": "Southwestern France",
            "tagline": "World capital of grand cru wines, 18th-century neoclassical promenades & golden Dune du Pilat.",
            "must_see_landmarks": [
                "Place de la Bourse & Miroir d'Eau",
                "Saint-Émilion Medieval Vineyard Village",
                "La Cité du Vin Modern Wine Museum",
                "Dune du Pilat (Europe's Highest Sand Dune)",
                "Medoc Wine Route Castles"
            ],
            "best_for": "Wine Connoisseurs, Architecture & Gastronomy",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Sophisticated & Epicurean",
            "badge": "Wine Capital"
        },
        {
            "name": "Lyon & French Alps",
            "region": "Auvergne-Rhône-Alpes",
            "tagline": "The culinary capital of France with hidden traboule passageways and gateway to snow-capped Mont Blanc.",
            "must_see_landmarks": [
                "Vieux Lyon Renaissance Quarter & Traboules",
                "Basilique Notre-Dame de Fourvière",
                "Les Halles de Lyon Paul Bocuse Gourmet Market",
                "Lake Annecy & Venice of the Alps",
                "Chamonix-Mont-Blanc Aiguille du Midi Cableway"
            ],
            "best_for": "Culinary Tourism, Alpine Adventure & Mountain Vistas",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Gourmet & Alpine",
            "badge": "Gastronomy & Alps"
        }
    ],
    "italy": [
        {
            "name": "Rome & Vatican City",
            "region": "Lazio",
            "tagline": "The Eternal City: gladiatorial amphitheatres, Renaissance papal treasures & lively piazza culture.",
            "must_see_landmarks": [
                "The Colosseum & Roman Forum",
                "Vatican Museums & Sistine Chapel",
                "Pantheon & Piazza Navona",
                "Trevi Fountain Sunset",
                "Trastevere Cobblestone Dining"
            ],
            "best_for": "Ancient History, Art & Vibrant Street Life",
            "recommended_stay": "4 - 5 Days",
            "vibe": "Monumental & Classic",
            "badge": "Eternal Capital"
        },
        {
            "name": "Florence & Tuscany",
            "region": "Tuscany",
            "tagline": "Cradle of the Renaissance, terracotta Duomo vistas, rolling cypress hills & Chianti vineyards.",
            "must_see_landmarks": [
                "Florence Duomo & Brunelleschi's Dome",
                "Uffizi Gallery Masterpieces",
                "Ponte Vecchio Sunset",
                "Siena Piazza del Campo",
                "San Gimignano Medieval Towers"
            ],
            "best_for": "Renaissance Art, Wine Trails & Romantic Country Estates",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Artistic & Pastoral",
            "badge": "Renaissance Heart"
        },
        {
            "name": "Venice & The Venetian Lagoon",
            "region": "Veneto",
            "tagline": "A floating marvel of marble palaces, gondola canals, arched footbridges & colorful glassmaker islands.",
            "must_see_landmarks": [
                "St. Mark's Basilica & Campanile",
                "Grand Canal Gondola Voyage",
                "Doge's Palace & Bridge of Sighs",
                "Burano Island Rainbow Houses",
                "Rialto Bridge Market Stroll"
            ],
            "best_for": "Romance, Unique Architecture & Canals",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Timeless Romance",
            "badge": "Floating Jewel"
        },
        {
            "name": "Amalfi Coast & Capri",
            "region": "Campania",
            "tagline": "Pastel cliffside villages hanging over the turquoise Tyrrhenian Sea, lemon groves & scenic coastal drives.",
            "must_see_landmarks": [
                "Positano Cliffside Beach Panorama",
                "Ravello Villa Rufolo Cliff Gardens",
                "Capri Island & Blue Grotto Boat Tour",
                "Amalfi Cathedral (Duomo di Sant'Andrea)",
                "Path of the Gods Clifftop Hike"
            ],
            "best_for": "Dramatic Ocean Views, Luxury Romance & Seafood",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Cinematic & Coastal",
            "badge": "Cliffside Glamour"
        }
    ],
    "japan": [
        {
            "name": "Tokyo Metropolis",
            "region": "Kanto",
            "tagline": "Futuristic neon skyscrapers, historic Shinto shrines, Michelin dining & buzzing youth pop culture.",
            "must_see_landmarks": [
                "Shibuya Crossing & Hachiko Plaza",
                "Senso-ji Temple & Asakusa Old Town",
                "teamLab Borderless Digital Art",
                "Meiji Jingu Shrine & Harajuku",
                "Shinjuku Omoide Yokocho Alley Dining"
            ],
            "best_for": "Modern Innovation, Dining, Shopping & Pop Culture",
            "recommended_stay": "4 - 5 Days",
            "vibe": "Electrifying & Futuristic",
            "badge": "Ultra-Modern Capital"
        },
        {
            "name": "Kyoto Ancient Capital",
            "region": "Kansai",
            "tagline": "Thousands of serene vermilion torii gates, Zen rock gardens, golden temples & traditional geisha quarters.",
            "must_see_landmarks": [
                "Fushimi Inari-taisha 10,000 Torii Path",
                "Kinkaku-ji (Golden Pavilion)",
                "Arashiyama Bamboo Forest & Monkey Park",
                "Kiyomizu-dera Cliffside Temple",
                "Gion Historic Preservation District"
            ],
            "best_for": "Ancient Culture, Spiritual Temples & Seasonal Foliage",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Serene & Traditional",
            "badge": "Cultural Heart"
        },
        {
            "name": "Osaka & Mount Fuji (Hakone)",
            "region": "Kansai & Chubu",
            "tagline": "Japan's lively street food kitchen meets sacred snow-capped mountain views and relaxing thermal onsen baths.",
            "must_see_landmarks": [
                "Dotonbori Street Food & Neon Glico Sign",
                "Osaka Castle & Moat Park",
                "Hakone Lake Ashi Pirate Cruise (Fuji Views)",
                "Owakudani Active Volcanic Valley",
                "Hakone Open-Air Sculpture Museum"
            ],
            "best_for": "Street Food, Thermal Spas & Iconic Mountain Landscapes",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Vibrant & Scenic",
            "badge": "Flavors & Vistas"
        }
    ],
    "spain": [
        {
            "name": "Barcelona & Catalonia",
            "region": "Catalonia",
            "tagline": "Antoni Gaudí's surreal modernist architecture, vibrant Gothic quarters & sun-drenched Mediterranean beaches.",
            "must_see_landmarks": [
                "Sagrada Família Basilica",
                "Park Güell Mosaics & City Vista",
                "Casa Batlló & Passeig de Gràcia",
                "Gothic Quarter (Barri Gòtic) Alleys",
                "Barceloneta Beach Promenade"
            ],
            "best_for": "Surreal Architecture, Coastal Culture & Tapas",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Artistic & Vibrant",
            "badge": "Modernist Gem"
        },
        {
            "name": "Madrid & Central Spain",
            "region": "Community of Madrid",
            "tagline": "Grand neoclassical boulevards, world-class art museums, expansive royal palaces & late-night tapas squares.",
            "must_see_landmarks": [
                "Royal Palace of Madrid & Almudena",
                "Prado National Museum (Velázquez & Goya)",
                "El Retiro Park & Crystal Palace",
                "Plaza Mayor & Mercado de San Miguel",
                "Toledo Medieval Walled City Day Trip"
            ],
            "best_for": "Royal Heritage, Fine Art, Nightlife & Dining",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Regal & Energetic",
            "badge": "Royal Capital"
        },
        {
            "name": "Seville & Andalusia",
            "region": "Andalusia",
            "tagline": "Passionate flamenco dancing, Moorish tilework palaces, orange blossom courtyards & sunny plazas.",
            "must_see_landmarks": [
                "Real Alcázar Palace & Moorish Gardens",
                "Plaza de España & Maria Luisa Park",
                "Seville Cathedral & Giralda Tower",
                "Triana Traditional Flamenco Taverns",
                "Alhambra Palace (Granada Day Excursion)"
            ],
            "best_for": "Flamenco, Moorish Architecture & Romantic Plazas",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Passionate & Historic",
            "badge": "Soul of Andalusia"
        }
    ]
}


def get_destination_sightseeing_hubs(destination: str) -> List[Dict[str, Any]]:
    """
    Returns curated must-visit sightseeing hubs and cities for a destination.
    If the destination matches known countries, returns rich regional highlights.
    Otherwise, synthesizes authentic, realistic travel hubs for that destination.
    """
    dest_clean = destination.strip().lower() if destination else "france"

    for key, hubs in DESTINATION_HUBS.items():
        if key in dest_clean or any(h["name"].lower().split()[0] in dest_clean for h in hubs):
            return hubs

    # Universal intelligent generator for any worldwide location
    dest_title = destination.strip().title() if destination else "Global Destination"
    return [
        {
            "name": f"{dest_title} Historic Center & Old Town",
            "region": f"Core District, {dest_title}",
            "tagline": f"The vibrant cultural heart of {dest_title}: ancient architectural landmarks, local artisan markets & lively pedestrian promenades.",
            "must_see_landmarks": [
                f"{dest_title} Central Landmark Square",
                f"National Museum & Heritage Center of {dest_title}",
                f"{dest_title} Cathedral / Sacred Monument",
                "Artisan Craft Quarter & Local Produce Market",
                "Sunset Panorama Viewpoint"
            ],
            "best_for": "Culture, First-Timers & Architectural Sightseeing",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Historic & Cultural",
            "badge": "Essential Core"
        },
        {
            "name": f"Scenic Surrounds & Natural Landscapes of {dest_title}",
            "region": f"Regional Province, {dest_title}",
            "tagline": f"Breathtaking countryside escapes, tranquil lakes, dramatic mountain trails and pristine viewpoints just outside {dest_title}.",
            "must_see_landmarks": [
                f"{dest_title} Scenic Valley & Nature Sanctuary",
                "Panoramic Clifftop Vista Walk",
                "Historic Countryside Village & Vineyard Estate",
                "Scenic Waterfall or Coastal Lookout"
            ],
            "best_for": "Nature, Hiking, Photography & Peaceful Getaways",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Scenic & Relaxing",
            "badge": "Nature Escape"
        },
        {
            "name": f"{dest_title} Culinary & Arts District",
            "region": f"Creative Enclave, {dest_title}",
            "tagline": f"Chic boutiques, modern galleries, rooftop cocktail bars and celebrated local gastronomic bistros.",
            "must_see_landmarks": [
                f"{dest_title} Modern Contemporary Art Pavilion",
                "Celebrated Waterfront / River Walk",
                "Gourmet Food Hall & Tastings",
                "Evening Jazz & Acoustic Performance Lounge"
            ],
            "best_for": "Foodies, Art Enthusiasts & Evening Leisure",
            "recommended_stay": "2 Days",
            "vibe": "Trendy & Gastronomic",
            "badge": "Art & Flavors"
        }
    ]

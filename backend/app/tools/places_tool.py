from typing import List, Dict, Any

DESTINATION_KNOWLEDGE = {
    "france": {
        "landmarks": [
            {
                "title": "Eiffel Tower & Champ de Mars Sunset",
                "location": "Champ de Mars, 7th Arrondissement, Paris",
                "category": "Iconic Landmark",
                "estimated_cost": "$28",
                "latitude": 48.8584,
                "longitude": 2.2945,
                "tips": "Book the summit elevator ticket 3 weeks ahead for golden hour sunset views over the Seine."
            },
            {
                "title": "Musée du Louvre & Tuileries Royal Garden",
                "location": "Rue de Rivoli, Paris",
                "category": "Art & History",
                "estimated_cost": "$22",
                "latitude": 48.8606,
                "longitude": 2.3376,
                "tips": "Enter through the Carrousel du Louvre underground mall entrance to skip the glass pyramid line."
            },
            {
                "title": "Palace of Versailles & Hall of Mirrors",
                "location": "Versailles, Île-de-France",
                "category": "Royal Heritage",
                "estimated_cost": "$30",
                "latitude": 48.8049,
                "longitude": 2.1204,
                "tips": "Hire a private cab or express RER C train early morning to stroll the fountain gardens before crowds."
            },
            {
                "title": "Bohemian Montmartre & Sacré-Cœur Basilica",
                "location": "Montmartre Hill, 18th Arrondissement, Paris",
                "category": "Culture & Romance",
                "estimated_cost": "Free",
                "latitude": 48.8867,
                "longitude": 2.3431,
                "tips": "Explore the quiet cobblestone vineyards behind Sacré-Cœur for romantic couple photo spots."
            },
            {
                "title": "Sunset Cruise on the River Seine (Pont Neuf)",
                "location": "Pont Neuf / Port de la Bourdonnais, Paris",
                "category": "Romance & Scenic",
                "estimated_cost": "$18",
                "latitude": 48.8566,
                "longitude": 2.3413,
                "tips": "Time your boarding 30 minutes before twilight to watch the city of light illuminate."
            },
            {
                "title": "Arc de Triomphe & Champs-Élysées Promenade",
                "location": "Place Charles de Gaulle, Paris",
                "category": "Monument & Vistas",
                "estimated_cost": "$16",
                "latitude": 48.8738,
                "longitude": 2.2950,
                "tips": "Climb the rooftop terrace for the most symmetrical star vista radiating across Paris."
            },
            {
                "title": "Sainte-Chapelle & Notre-Dame Historic Island",
                "location": "Île de la Cité, Paris",
                "category": "Gothic Architecture",
                "estimated_cost": "$13",
                "latitude": 48.8554,
                "longitude": 2.3450,
                "tips": "Visit between 11 AM and 2 PM on a sunny day when sunlight turns the 13th-century stained glass radiant."
            },
            {
                "title": "Musée d'Orsay & Left Bank Promenade",
                "location": "Esplanade Valéry Giscard d'Estaing, Paris",
                "category": "Impressionist Art",
                "estimated_cost": "$19",
                "latitude": 48.8599,
                "longitude": 2.3266,
                "tips": "Check out the giant station clock face on the top floor with views framed over Sacré-Cœur."
            },
            {
                "title": "Jardin du Luxembourg & Latin Quarter",
                "location": "6th Arrondissement, Paris",
                "category": "Royal Gardens & Leisure",
                "estimated_cost": "Free",
                "latitude": 48.8462,
                "longitude": 2.3372,
                "tips": "Sit beside the Medici Fountain with fresh pastries for classic Parisian people-watching."
            },
            {
                "title": "Le Marais & Place des Vosges Heritage Walk",
                "location": "4th Arrondissement, Paris",
                "category": "Historic Boutiques",
                "estimated_cost": "Free",
                "latitude": 48.8554,
                "longitude": 2.3656,
                "tips": "Wander through the vaulted brick arcades of Paris's oldest planned royal square."
            },
            {
                "title": "Promenade des Anglais & Old Town (Nice, Riviera)",
                "location": "French Riviera (Côte d'Azur), Nice",
                "category": "Coastal Leisure",
                "estimated_cost": "Free",
                "latitude": 43.6952,
                "longitude": 7.2656,
                "tips": "Sample fresh socca flatbreads from local market stalls along the sun-washed Mediterranean promenade."
            },
            {
                "title": "Colline du Château & Baie des Anges Viewpoint",
                "location": "Castle Hill, Nice, French Riviera",
                "category": "Panoramic Viewpoint",
                "estimated_cost": "Free",
                "latitude": 43.6948,
                "longitude": 7.2805,
                "tips": "Ascend the winding stone stairs or free art-deco lift for the premier panoramic view of the azure bay."
            }
        ],
        "dining": [
            {
                "name": "Le Coupe-Chou (Latin Quarter)",
                "cuisine": "Romantic French Classic",
                "recommended_dish": "Boeuf Bourguignon & Candlelit Crème Brûlée",
                "price_range": "$$",
                "latitude": 48.8488,
                "longitude": 2.3491
            },
            {
                "name": "Bistrot Paul Bert",
                "cuisine": "Authentic Parisian Bistro",
                "recommended_dish": "Filet au Poivre & Tarte Tatin",
                "price_range": "$$",
                "latitude": 48.8533,
                "longitude": 2.3842
            },
            {
                "name": "Crêperie Brocéliande (Montmartre)",
                "cuisine": "Artisan Galettes & Cider",
                "recommended_dish": "Savory Buckwheat Galette & Sweet Salted Caramel Crêpe",
                "price_range": "$",
                "latitude": 48.8842,
                "longitude": 2.3385
            },
            {
                "name": "Café de Flore (Saint-Germain)",
                "cuisine": "Historic Parisian Café",
                "recommended_dish": "Hot Chocolate & Pain au Chocolat",
                "price_range": "$$",
                "latitude": 48.8540,
                "longitude": 2.3328
            },
            {
                "name": "La Petite Maison (Nice French Riviera)",
                "cuisine": "Provençal Mediterranean Seafood",
                "recommended_dish": "Grilled Sea Bass, Ratatouille & Local Chilled Rosé",
                "price_range": "$$$",
                "latitude": 43.6961,
                "longitude": 7.2755
            }
        ],
        "rainy_day_landmarks": [
            {
                "title": "Musée d'Orsay Impressionist Masterpieces (Indoor Refuge)",
                "location": "Left Bank, 7th Arrondissement, Paris",
                "category": "Art & Indoor Refuge",
                "estimated_cost": "$19",
                "latitude": 48.8599,
                "longitude": 2.3266,
                "tips": "Shelter under the grand glass barrel vault of the former Belle Époque railway station away from the rain."
            },
            {
                "title": "Historic Covered Passages (Galerie Vivienne & Panoramas)",
                "location": "2nd Arrondissement, Paris",
                "category": "Historic Covered Arcades",
                "estimated_cost": "Free",
                "latitude": 48.8665,
                "longitude": 2.3396,
                "tips": "Stroll completely dry under 19th-century glass roofs lined with antiquarian bookstores, tea salons, and vintage boutiques."
            },
            {
                "title": "Subterranean Wine Cellar Tasting & Candlelit Bistro",
                "location": "Les Caves du Louvre, Paris",
                "category": "Subterranean Romance & Dining",
                "estimated_cost": "$38",
                "latitude": 48.8615,
                "longitude": 2.3411,
                "tips": "Taste sommelier selections deep inside 18th-century vaulted royal stone cellars insulated from the weather."
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
                "latitude": 41.8902,
                "longitude": 12.4922,
                "tips": "Book the underground arena floor ticket for an intimate historical walk."
            },
            {
                "title": "Vatican Museums & Sistine Chapel",
                "location": "Vatican City, Rome",
                "category": "Renaissance Art",
                "estimated_cost": "$28",
                "latitude": 41.9029,
                "longitude": 12.4534,
                "tips": "Arrive for the early morning access before tourist groups arrive."
            },
            {
                "title": "Duomo di Firenze & Giotto's Bell Tower",
                "location": "Piazza del Duomo, Florence",
                "category": "Architecture",
                "estimated_cost": "$20",
                "latitude": 43.7731,
                "longitude": 11.2560,
                "tips": "Climb Brunelleschi's dome for the ultimate panorama of Tuscany's red-tile roofs."
            },
            {
                "title": "Ponte Vecchio & Uffizi Gallery",
                "location": "Piazzale degli Uffizi, Florence",
                "category": "Renaissance Heritage",
                "estimated_cost": "$25",
                "latitude": 43.7687,
                "longitude": 11.2533,
                "tips": "Admire Botticelli's Birth of Venus then stroll across the historic goldsmiths bridge."
            },
            {
                "title": "St. Mark's Basilica & Venetian Gondola Tour",
                "location": "Piazza San Marco, Venice",
                "category": "Unique Heritage",
                "estimated_cost": "$35",
                "latitude": 45.4342,
                "longitude": 12.3388,
                "tips": "Take a sunset gondola glide into the quiet secondary canals away from the Grand Canal boat wake."
            },
            {
                "title": "Positano Cliffside & Marina Promenade (Amalfi)",
                "location": "Amalfi Coast, Campania",
                "category": "Coastal Romance",
                "estimated_cost": "Free",
                "latitude": 40.6281,
                "longitude": 14.4850,
                "tips": "Enjoy sunset limoncello spritz overlooking the pastel homes cascading into the sea."
            }
        ],
        "dining": [
            {
                "name": "Trattoria Da Enzo al 29 (Trastevere)",
                "cuisine": "Roman Trattoria",
                "recommended_dish": "Handmade Cacio e Pepe & Tiramisu",
                "price_range": "$$",
                "latitude": 41.8885,
                "longitude": 12.4782
            },
            {
                "name": "All'Antico Vinaio (Florence)",
                "cuisine": "Artisan Panini",
                "recommended_dish": "Tuscan Prosciutto & Truffle Cream Schiacciata",
                "price_range": "$",
                "latitude": 43.7684,
                "longitude": 11.2575
            },
            {
                "name": "Cantina Do Mori (Venice)",
                "cuisine": "Venetian Cicchetti & Wine",
                "recommended_dish": "Baccalà Mantecato & Local Prosecco",
                "price_range": "$$",
                "latitude": 45.4387,
                "longitude": 12.3347
            }
        ],
        "rainy_day_landmarks": [
            {
                "title": "Vatican Museums, Sistine Chapel & Raphael Rooms (Indoor)",
                "location": "Vatican City, Rome",
                "category": "Renaissance Art & Indoor Refuge",
                "estimated_cost": "$28",
                "latitude": 41.9029,
                "longitude": 12.4534,
                "tips": "Stay completely dry inside miles of Renaissance galleries and papal palaces."
            },
            {
                "title": "Galleria Doria Pamphilj & Mirror Hall",
                "location": "Via del Corso, Rome",
                "category": "Palace Gallery",
                "estimated_cost": "$18",
                "latitude": 41.8978,
                "longitude": 12.4813,
                "tips": "Private princely palace with Caravaggio masterpieces under gilded baroque ceilings."
            },
            {
                "title": "Historic Roman Enoteca & Candlelit Trattoria",
                "location": "Enoteca Il Gocchetto, Rome",
                "category": "Warm Wine Cellar & Comfort Dining",
                "estimated_cost": "$32",
                "latitude": 41.9065,
                "longitude": 12.4764,
                "tips": "Cozy wooden cellar with hot cacio e pepe pasta and local vintage wines on rainy evenings."
            }
        ]
    },
    "japan": {
        "landmarks": [
            {
                "title": "Fushimi Inari-taisha & 10,000 Torii Gates",
                "location": "Fushimi Ward, Kyoto",
                "category": "Spiritual Shrine",
                "estimated_cost": "Free",
                "latitude": 34.9671,
                "longitude": 135.7727,
                "tips": "Hike past the halfway point (Yotsutsuji intersection) for serene photography without crowds."
            },
            {
                "title": "Kinkaku-ji (The Golden Pavilion)",
                "location": "Kita Ward, Kyoto",
                "category": "Zen Heritage",
                "estimated_cost": "$5",
                "latitude": 35.0394,
                "longitude": 135.7292,
                "tips": "Witness the gilded pavilion reflect over Mirror Pond in the morning sun."
            },
            {
                "title": "Kiyomizu-dera Temple & Higashiyama Streets",
                "location": "Higashiyama Ward, Kyoto",
                "category": "Ancient Culture",
                "estimated_cost": "$4",
                "latitude": 34.9949,
                "longitude": 135.7850,
                "tips": "Stroll down Ninenzaka and Sannenzaka preservation cobblestone alleys."
            },
            {
                "title": "Arashiyama Bamboo Grove & Tenryu-ji",
                "location": "Ukyo Ward, Kyoto",
                "category": "Nature & Zen",
                "estimated_cost": "$6",
                "latitude": 35.0169,
                "longitude": 135.6713,
                "tips": "Arrive at 7:30 AM to hear the gentle swaying bamboo stalks in peaceful solitude."
            },
            {
                "title": "Shibuya Crossing & Meiji Jingu Shrine",
                "location": "Shibuya, Tokyo",
                "category": "Modern & Sacred",
                "estimated_cost": "Free",
                "latitude": 35.6595,
                "longitude": 139.7005,
                "tips": "Experience the world's busiest pedestrian crossing, then retreat to the quiet forested shrine."
            },
            {
                "title": "Senso-ji Temple & Asakusa Nakamise Street",
                "location": "Taito City, Tokyo",
                "category": "Historic Tokyo",
                "estimated_cost": "Free",
                "latitude": 35.7148,
                "longitude": 139.7967,
                "tips": "Sample freshly made warm ningyo-yaki bean-paste cakes along the lantern-lit market street."
            }
        ],
        "dining": [
            {
                "name": "Gion Karyo (Kyoto)",
                "cuisine": "Seasonal Kaiseki Dining",
                "recommended_dish": "Multi-course seasonal Kyoto banquet & dashi broth",
                "price_range": "$$$",
                "latitude": 35.0037,
                "longitude": 135.7758
            },
            {
                "name": "Ichiran Ramen (Shibuya, Tokyo)",
                "cuisine": "Tonkotsu Ramen",
                "recommended_dish": "Custom rich broth tonkotsu ramen with spicy red sauce",
                "price_range": "$",
                "latitude": 35.6618,
                "longitude": 139.7008
            },
            {
                "name": "Nishiki Market Street Food Tour",
                "cuisine": "Kyoto Street Delicacies",
                "recommended_dish": "Fresh sashimi skewers, tamagoyaki & matcha soft serve",
                "price_range": "$",
                "latitude": 35.0050,
                "longitude": 135.7649
            }
        ],
        "rainy_day_landmarks": [
            {
                "title": "Sanjusangendo Temple (Hall of 1,001 Golden Statues)",
                "location": "Higashiyama Ward, Kyoto",
                "category": "Sacred Indoor Temple",
                "estimated_cost": "$6",
                "latitude": 34.9878,
                "longitude": 135.7717,
                "tips": "Walk quietly along the long wooden hall admiring 1,001 life-sized gilded Kannon statues protected from weather."
            },
            {
                "title": "Nishiki Covered Market & Traditional Tea Ceremony",
                "location": "Nakagyo Ward, Kyoto",
                "category": "Covered Artisan Arcade",
                "estimated_cost": "$15",
                "latitude": 35.0050,
                "longitude": 135.7649,
                "tips": "Five blocks of vibrant covered stalls filled with warm street delicacies, pickles, and steaming matcha."
            },
            {
                "title": "Pontocho Covered Alley Hot Pot & Sukiyaki Dining",
                "location": "Pontocho Alley, Kyoto",
                "category": "Cozy Dining",
                "estimated_cost": "$35",
                "latitude": 35.0058,
                "longitude": 135.7715,
                "tips": "Savor steaming Wagyu sukiyaki hot pot overlooking the rain droplets rippling across the Kamogawa River."
            }
        ]
    },
    "india": {
        "landmarks": [
            {
                "title": "Pangong Tso Lake (3 Idiots Climax Spot)",
                "location": "Leh, Ladakh",
                "category": "Cinema Landmark & Alpine Lake",
                "estimated_cost": "Free",
                "latitude": 33.7595,
                "longitude": 78.6674,
                "tips": "Famed shooting spot of 3 Idiots climax where Pia meets Rancho with the yellow scooter. Visit during morning sunlight for vivid turquoise shades."
            },
            {
                "title": "Rohtang Pass & Solang Valley (YJHD Snow Trek)",
                "location": "Manali, Himachal Pradesh",
                "category": "Himalayan Snow & Cinema Lore",
                "estimated_cost": "$15",
                "latitude": 32.3716,
                "longitude": 77.2466,
                "tips": "Legendary filming spot of Yeh Jawaani Hai Deewani (Bunny & Naina's snow trek) and Jab We Met ('Yeh Ishq Haaye')."
            },
            {
                "title": "Athirappilly Waterfalls (Baahubali Niagara of India)",
                "location": "Chalakudy, Thrissur, Kerala",
                "category": "Epic Cinema Waterfall",
                "estimated_cost": "$2",
                "latitude": 10.2851,
                "longitude": 76.5698,
                "tips": "The awe-inspiring 80-foot cascade that Shivudu climbs in Baahubali and backdrop of Dil Se ('Jiya Jale')."
            },
            {
                "title": "Chapora Fort ('Dil Chahta Hai Fort')",
                "location": "Vagator, North Goa",
                "category": "Clifftop Sea Fort",
                "estimated_cost": "Free",
                "latitude": 15.6060,
                "longitude": 73.7380,
                "tips": "Sit along the red laterite ramparts overlooking the Arabian Sea, echoing the iconic Dil Chahta Hai conversation."
            },
            {
                "title": "Dudhsagar Waterfalls & Railway Arch Bridge",
                "location": "Sonaulim, Goa / Karnataka Border",
                "category": "Four-Tiered Waterfall & Rail Arch",
                "estimated_cost": "$12",
                "latitude": 15.3144,
                "longitude": 74.3143,
                "tips": "World-famous filming spot from Chennai Express where the train halts before roaring milky cascades."
            },
            {
                "title": "The Oberoi Udaivilas & Lake Pichola",
                "location": "Udaipur, Rajasthan",
                "category": "Royal Palace & Luxury Vistas",
                "estimated_cost": "Free",
                "latitude": 24.5764,
                "longitude": 73.6734,
                "tips": "Iconic royal palace where Aditi and Taran's grand wedding was filmed in Yeh Jawaani Hai Deewani."
            },
            {
                "title": "Hampi Vijaya Vittala Temple & Stone Chariot",
                "location": "Hampi, Vijayanagara, Karnataka",
                "category": "UNESCO World Heritage Monolith",
                "estimated_cost": "$5",
                "latitude": 15.3350,
                "longitude": 76.4600,
                "tips": "Featured in Rowdy Rathore and Jackie Chan's The Myth. Explore the boulder landscape during sunset."
            },
            {
                "title": "Nilgiri Mountain Railway (Chaiyya Chaiyya Train)",
                "location": "Ooty, Tamil Nadu",
                "category": "UNESCO Heritage Steam Railway",
                "estimated_cost": "$4",
                "latitude": 11.4102,
                "longitude": 76.6950,
                "tips": "Filming location of the historic 'Chaiyya Chaiyya' song from Dil Se, running through misty pine eucalyptus forests."
            },
            {
                "title": "Marine Drive & Gateway of India",
                "location": "South Mumbai, Maharashtra",
                "category": "Cinema Promenade & Monument",
                "estimated_cost": "Free",
                "latitude": 18.9220,
                "longitude": 72.8347,
                "tips": "Featured in Wake Up Sid and Slumdog Millionaire. Enjoy roasted corn on the cob watching twilight over the Arabian Sea."
            },
            {
                "title": "Taj Mahal & Mehtab Bagh Sunset",
                "location": "Agra, Uttar Pradesh",
                "category": "Mughal World Wonder",
                "estimated_cost": "$15",
                "latitude": 27.1751,
                "longitude": 78.0421,
                "tips": "View the white marble dome glowing pink at sunset across the Yamuna River from Mehtab Bagh."
            },
            {
                "title": "Howrah Bridge & Victoria Memorial",
                "location": "Kolkata, West Bengal",
                "category": "Colonial & Cantilever Heritage",
                "estimated_cost": "Free",
                "latitude": 22.5851,
                "longitude": 88.3468,
                "tips": "Featured in Piku, Kahaani, and Yuva. Ride a vintage yellow Ambassador taxi across the iconic steel cantilever."
            },
            {
                "title": "Darjeeling Himalayan Railway & Batasia Loop",
                "location": "Darjeeling, West Bengal",
                "category": "UNESCO Mountain Steam Train",
                "estimated_cost": "$8",
                "latitude": 27.0410,
                "longitude": 88.2663,
                "tips": "Filming setting for Barfi!, Parineeta, and Main Hoon Na with 360-degree views of Mt. Kanchenjunga."
            }
        ],
        "dining": [
            {
                "name": "Bukhara / Karim's (Delhi)",
                "cuisine": "Royal Mughlai & Tandoor",
                "recommended_dish": "Slow-cooked Dal Bukhara & Sikandari Raan",
                "price_range": "$$$",
                "latitude": 28.5975,
                "longitude": 77.1738
            },
            {
                "name": "Cafe Leopold & Mondegar (Colaba, Mumbai)",
                "cuisine": "Historic Bombay Cafe & Beer",
                "recommended_dish": "Spicy Keema Pav & Classic Cold Draft",
                "price_range": "$$",
                "latitude": 18.9234,
                "longitude": 72.8326
            },
            {
                "name": "Ambrai at Amet Haveli (Udaipur)",
                "cuisine": "Mewari Royal Dining",
                "recommended_dish": "Laal Maas with Lake Pichola Illuminated Views",
                "price_range": "$$$",
                "latitude": 24.5802,
                "longitude": 73.6811
            },
            {
                "name": "Paragon Seafood (Kozhikode / Kerala)",
                "cuisine": "Authentic Malabar Seafood",
                "recommended_dish": "Malabar Fish Biryani & Meen Pollichathu",
                "price_range": "$$",
                "latitude": 11.2588,
                "longitude": 75.7804
            }
        ],
        "rainy_day_landmarks": [
            {
                "title": "Chhatrapati Shivaji Maharaj Vastu Sangrahalaya (CSMVS Museum)",
                "location": "Fort, South Mumbai",
                "category": "Indo-Saracenic Art Museum & Refuge",
                "estimated_cost": "$6",
                "latitude": 18.9269,
                "longitude": 72.8326,
                "tips": "Spend a rainy afternoon sheltered inside ornate Indo-Saracenic galleries filled with Indian miniature paintings and ancient sculptures."
            },
            {
                "title": "City Palace Museum & Crystal Gallery (Udaipur)",
                "location": "Old City, Udaipur, Rajasthan",
                "category": "Royal Palace Interior & Crystal Hall",
                "estimated_cost": "$8",
                "latitude": 24.5764,
                "longitude": 73.6835,
                "tips": "Wander through sheltered mirrored corridors, peacock mosaics, and the world's single largest private crystal collection."
            },
            {
                "title": "National Rail Museum Heritage Indoor Saloons",
                "location": "Chanakyapuri, New Delhi",
                "category": "Historic Royal Trains & Indoor Exhibition",
                "estimated_cost": "$3",
                "latitude": 28.5855,
                "longitude": 77.1802,
                "tips": "Step inside Maharaja royal train carriages and indoor exhibits showcasing 170 years of Indian rail heritage."
            }
        ]
    }
}

def get_attractions_and_dining(destination: str) -> Dict[str, Any]:
    """
    Returns prominent landmarks and dining experiences with authentic GPS coordinates tailored to the destination.
    """
    dest_clean = destination.strip().lower() if destination else "france"
    
    # India aliases
    india_aliases = ["india", "bharat", "delhi", "mumbai", "goa", "kerala", "manali", "ladakh", "kashmir", "hampi", "ooty", "jaipur", "udaipur", "kolkata", "darjeeling", "bollywood", "tollywood", "chennai", "hyderabad", "bengaluru", "bangalore", "rajasthan"]
    if any(alias in dest_clean for alias in india_aliases):
        return DESTINATION_KNOWLEDGE["india"]

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
                "latitude": None,
                "longitude": None,
                "tips": "Begin your exploration in the early morning for peaceful photography."
            },
            {
                "title": f"Panoramic Scenic Vista & Architectural Landmark",
                "location": f"Observation Point, {dest_title}",
                "category": "Sightseeing & Romance",
                "estimated_cost": "$20",
                "latitude": None,
                "longitude": None,
                "tips": "Book tickets during sunset to witness the twilight skyline."
            },
            {
                "title": f"Artisanal Market & Botanical Waterfront Gardens",
                "location": f"Market District, {dest_title}",
                "category": "Nature & Leisure",
                "estimated_cost": "$10",
                "latitude": None,
                "longitude": None,
                "tips": "Sample regional specialty delicacies from traditional local vendors."
            }
        ],
        "dining": [
            {
                "name": f"Le Bistro Traditionnel ({dest_title})",
                "cuisine": "Regional Cuisine & Wine",
                "recommended_dish": "Signature Chef Tasting Plate",
                "price_range": "$$",
                "latitude": None,
                "longitude": None
            },
            {
                "name": f"The Old Town Artisan Eatery",
                "cuisine": "Local Street Flavors",
                "recommended_dish": "Handcrafted Regional Dish",
                "price_range": "$",
                "latitude": None,
                "longitude": None
            },
            {
                "name": f"Belvedere Sunset Terrace",
                "cuisine": "Contemporary Fusion",
                "recommended_dish": "Fresh Local Harvest & Desserts",
                "price_range": "$$",
                "latitude": None,
                "longitude": None
            }
        ],
        "rainy_day_landmarks": [
            {
                "title": f"{dest_title} Fine Arts Museum & Heritage Pavilion",
                "location": f"Cultural District, {dest_title}",
                "category": "Museum & Indoor Shelter",
                "estimated_cost": "$18",
                "latitude": None,
                "longitude": None,
                "tips": "Spend a rainy morning exploring climate-controlled galleries and historical treasures."
            },
            {
                "title": f"Covered Artisan Bazaar & Historic Tea Rooms",
                "location": f"Old Town Arcades, {dest_title}",
                "category": "Covered Promenade",
                "estimated_cost": "Free",
                "latitude": None,
                "longitude": None,
                "tips": "Browse dry beneath historic glass and stone vaults."
            },
            {
                "title": f"Candlelit Underground Cellar & Regional Tasting",
                "location": f"Historic Center, {dest_title}",
                "category": "Cellar Experience",
                "estimated_cost": "$30",
                "latitude": None,
                "longitude": None,
                "tips": "Warm up with comforting regional specialties in an atmospheric stone setting."
            }
        ]
    }

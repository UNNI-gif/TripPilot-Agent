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
    ],
    "india": [
        # --- NORTH INDIA ---
        {
            "name": "Ladakh & Pangong Tso Lake",
            "region": "Jammu & Kashmir / Ladakh",
            "direction": "North",
            "tagline": "Turquoise high-altitude salt lake surrounded by barren Himalayan peaks, where Bollywood cinematic dreams come to life.",
            "must_see_landmarks": [
                "Pangong Tso Lake (3 Idiots Climax Spot)",
                "Khardung La Pass (Highest Motorroad in the World)",
                "Nubra Valley & Hunder Sand Dunes (Double-Humped Camels)",
                "Thiksey & Hemis Ancient Monasteries",
                "Magnetic Hill & Indus Zanskar Confluence"
            ],
            "best_for": "Cinematic Landscapes, High-Altitude Adventure & Buddhist Culture",
            "recommended_stay": "4 - 5 Days",
            "vibe": "Ethereal & Adventurous",
            "badge": "🎬 3 Idiots Climax",
            "movie_locations": [
                "3 Idiots (Pia's yellow scooter reunion with Rancho at Pangong Lake)",
                "Jab Tak Hai Jaan (Shah Rukh Khan defusing explosive at freezing waters)",
                "Dil Se (Shah Rukh Khan & Manisha Koirala 'Satrangi Re')"
            ],
            "featured_movie": "3 Idiots",
            "latitude": 33.7595,
            "longitude": 78.6674
        },
        {
            "name": "Manali & Solang Valley (Himachal)",
            "region": "Himachal Pradesh",
            "direction": "North",
            "tagline": "Snow-capped cedar valleys, roaring Beas river rapids, and the quintessential youthful Bollywood backpacking playground.",
            "must_see_landmarks": [
                "Rohtang Pass Snow Corridor",
                "Solang Valley Adventure Glades",
                "Hadimba Devi Historic Wooden Temple",
                "Old Manali Cafes & Beas River Walk",
                "Jogini Waterfalls Trek"
            ],
            "best_for": "Snow Adventures, Trekking & Bollywood Romance",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Youthful & Alpine",
            "badge": "🎬 Yeh Jawaani Hai Deewani Trek",
            "movie_locations": [
                "Yeh Jawaani Hai Deewani (Bunny & Naina's iconic friendship snow trek)",
                "Jab We Met (Geet & Aditya dancing in snow corridors 'Yeh Ishq Haaye')",
                "Krrish (Mountain chases)",
                "Highway (Alia Bhatt's mountain journey)"
            ],
            "featured_movie": "Yeh Jawaani Hai Deewani",
            "latitude": 32.2432,
            "longitude": 77.1892
        },
        {
            "name": "Kashmir Valley (Srinagar & Gulmarg)",
            "region": "Jammu & Kashmir",
            "direction": "North",
            "tagline": "Paradise on Earth: floating shikaras on Dal Lake, blooming tulip gardens, and the world's highest ski gondola in Gulmarg.",
            "must_see_landmarks": [
                "Dal Lake Floating Houseboats & Shikararides",
                "Gulmarg Gondola & Apharwat Peak",
                "Mughal Terraced Gardens (Shalimar & Nishat)",
                "Pahalgam Betaab Valley & Aru Valley",
                "Pari Mahal Twilight Hillside"
            ],
            "best_for": "Romance, Alpine Gondolas & Traditional Crafts",
            "recommended_stay": "4 - 5 Days",
            "vibe": "Romantic & Heavenly",
            "badge": "🎬 Bajrangi Bhaijaan & Rockstar",
            "movie_locations": [
                "Bajrangi Bhaijaan (Salman Khan reuniting Munni in scenic valleys)",
                "Rockstar (Ranbir Kapoor & Nargis Fakhri 'Katiya Karun')",
                "Yeh Jawaani Hai Deewani (Gulmarg snow sequences)",
                "Mission Kashmir",
                "Kashmir Ki Kali"
            ],
            "featured_movie": "Bajrangi Bhaijaan",
            "latitude": 34.0837,
            "longitude": 74.8370
        },
        {
            "name": "Agra & Delhi Capital Heritage",
            "region": "Northern Heritage Corridor",
            "direction": "North",
            "tagline": "The royal Mughal power corridors: marble poetry of the Taj Mahal, historic red sandstone fortresses & ancient stepwells.",
            "must_see_landmarks": [
                "Taj Mahal & Mehtab Bagh Sunset",
                "Agra Fort Imperial Palaces",
                "India Gate & Kartavya Path",
                "Agrasen Ki Baoli Ancient Stepwell",
                "Red Fort & Chandni Chowk Culinary Walk"
            ],
            "best_for": "World Wonders, Mughal Architecture & Historic Lore",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Monumental & Regal",
            "badge": "🎬 Rang De Basanti & PK",
            "movie_locations": [
                "Rang De Basanti (Torchlight student rally around India Gate)",
                "PK (Aamir Khan taking shelter at Agrasen Ki Baoli stepwell)",
                "Slumdog Millionaire (Taj Mahal tours)",
                "Chak De! India (National stadium and India Gate victory)"
            ],
            "featured_movie": "Rang De Basanti",
            "latitude": 27.1751,
            "longitude": 78.0421
        },

        # --- SOUTH INDIA ---
        {
            "name": "Athirappilly & Munnar Highlands (Kerala)",
            "region": "Western Ghats, Kerala",
            "direction": "South",
            "tagline": "The thunderous 'Niagara of India' plunging into tropical rainforests and emerald carpeted tea hills.",
            "must_see_landmarks": [
                "Athirappilly Waterfalls (Baahubali Torrential Falls)",
                "Munnar Kolukkumalai Sunrise Tea Estate",
                "Mattupetty Dam & Eco Point",
                "Vazhachal Forest Waterfalls",
                "Eravikulam National Park (Nilgiri Tahr)"
            ],
            "best_for": "Epic Waterfalls, Tea Plantations & Jungle Escapes",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Lush & Majestic",
            "badge": "🎬 Baahubali Waterfall",
            "movie_locations": [
                "Baahubali: The Beginning (Shivudu climbing the majestic 80-ft Athirappilly waterfall)",
                "Dil Se (Shah Rukh Khan & Preity Zinta 'Jiya Jale')",
                "Chennai Express (Deepika & SRK 'Kashmir Main Tu Kanyakumari' in Munnar tea hills)",
                "Raavan (Aishwarya Rai & Abhishek Bachchan cliff sequences)",
                "Life of Pi (Suraj Sharma gazing at Munnar green slopes)"
            ],
            "featured_movie": "Baahubali",
            "latitude": 10.2851,
            "longitude": 76.5698
        },
        {
            "name": "Hampi UNESCO Ruins & Stone Chariot",
            "region": "Karnataka",
            "direction": "South",
            "tagline": "A surreal boulder-strewn open-air museum: 14th-century capital of the Vijayanagara Empire on the banks of the Tungabhadra.",
            "must_see_landmarks": [
                "Vijaya Vittala Temple & Stone Chariot",
                "Virupaksha Sacred Riverside Temple",
                "Matanga Hill Sunrise Panorama",
                "Coracle Boat Ride on Tungabhadra River",
                "Lotus Mahal & Royal Elephant Stables"
            ],
            "best_for": "Ancient Empire Archaeology, Bouldering & Rustic Serenity",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Mystical & Timeless",
            "badge": "🎬 Rowdy Rathore & The Myth",
            "movie_locations": [
                "Rowdy Rathore (Akshay Kumar 'Dhadang Dhang' dance at stone ruins)",
                "The Myth (Jackie Chan martial arts action among Hampi monoliths)",
                "K.G.F (Historical backdrop aesthetic)",
                "Magadheera"
            ],
            "featured_movie": "Rowdy Rathore",
            "latitude": 15.3350,
            "longitude": 76.4600
        },
        {
            "name": "Ooty & Nilgiri Mountain Railway",
            "region": "Tamil Nadu",
            "direction": "South",
            "tagline": "The Queen of Hill Stations: century-old blue steam toy trains, fragrant eucalyptus groves & romantic pine forests.",
            "must_see_landmarks": [
                "Nilgiri Mountain UNESCO Steam Railway",
                "Ooty Pine Forest & Kamraj Sagar Dam",
                "Doddabetta Highest Peak Lookout",
                "Botanical Gardens & Rose Pavilion",
                "Pykara Waterfalls & Boating Lake"
            ],
            "best_for": "Toy Train Rides, Cool Weather & Classic Cinema Nostalgia",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Colonial Charm & Romantic",
            "badge": "🎬 Dil Se (Chaiyya Chaiyya)",
            "movie_locations": [
                "Dil Se (Shah Rukh Khan & Malaika Arora dancing on moving steam train roof 'Chaiyya Chaiyya')",
                "Barfi! (Ranbir Kapoor & Ileana D'Cruz romantic misty hill sequences)",
                "Kuch Kuch Hota Hai (The iconic Shimla summer camp was shot in Ooty pine forests)",
                "Andaz Apna Apna"
            ],
            "featured_movie": "Dil Se",
            "latitude": 11.4102,
            "longitude": 76.6950
        },
        {
            "name": "Ramoji Film City & Hyderabad",
            "region": "Telangana",
            "direction": "South",
            "tagline": "The world's largest film studio city where grand cinema illusions are born, alongside 400-year-old Charminar alleys.",
            "must_see_landmarks": [
                "Ramoji Film City Studio Tours & Baahubali Sets",
                "Charminar & Laad Bazaar Chime",
                "Golconda Fort Acoustic Sound & Light Show",
                "Qutb Shahi Royal Tombs",
                "Hussain Sagar Lake & Buddha Statue"
            ],
            "best_for": "Cinema Sets, Royal Nizami Culture & World-Famous Biryani",
            "recommended_stay": "3 Days",
            "vibe": "Cinematic & Nizami Grandeur",
            "badge": "🎬 World's Largest Film Studio",
            "movie_locations": [
                "Baahubali 1 & 2 (Complete Mahishmati Kingdom set standing)",
                "RRR (Grand British palace and forest confrontation sets)",
                "Pushpa (Action sequences)",
                "Chennai Express (South Indian village sets)"
            ],
            "featured_movie": "Baahubali (Ramoji Sets)",
            "latitude": 17.2543,
            "longitude": 78.6808
        },

        # --- WEST INDIA ---
        {
            "name": "Goa Coastal Forts & Dudhsagar Falls",
            "region": "Goa & Western Ghats",
            "direction": "West",
            "tagline": "Sun-kissed Arabian Sea beaches, Portuguese clifftop ramparts, and thunderous milky cascades through jungle rail bridges.",
            "must_see_landmarks": [
                "Chapora Fort ('Dil Chahta Hai Fort' over Vagator)",
                "Dudhsagar Waterfalls & Jungle Jeep Safari",
                "Fort Aguada 17th-Century Lighthouse",
                "Old Goa UNESCO Basilica of Bom Jesus",
                "Palolem & Morjim Sunset Coastlines"
            ],
            "best_for": "Beach Vibe, Friendship Getaways & Seafront Forts",
            "recommended_stay": "4 - 5 Days",
            "vibe": "Bohemian & Coastal",
            "badge": "🎬 Dil Chahta Hai Fort",
            "movie_locations": [
                "Dil Chahta Hai (The iconic Akash, Sameer, and Sid sitting on Chapora Fort walls)",
                "Chennai Express (The legendary train stopping scene at Dudhsagar Falls)",
                "Dhoom & Golmaal series",
                "Dear Zindagi (Alia Bhatt & SRK cycling along North Goa palms)"
            ],
            "featured_movie": "Dil Chahta Hai",
            "latitude": 15.6060,
            "longitude": 73.7380
        },
        {
            "name": "Udaipur & Royal Lakes (Rajasthan)",
            "region": "Mewar, Rajasthan",
            "direction": "West",
            "tagline": "The Venice of the East: floating marble palaces on Lake Pichola, peacock mosaics & world-famous grand destination weddings.",
            "must_see_landmarks": [
                "The Oberoi Udaivilas & Jagmandir Island Palace",
                "City Palace Complex & Peacock Courtyard",
                "Sunset Boat Cruise on Lake Pichola",
                "Monsoon Palace (Sajjangarh Clifftop)",
                "Saheliyon-ki-Bari Royal Lotus Fountains"
            ],
            "best_for": "Regal Romance, Destination Weddings & Lake Palaces",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Regal & Romantic",
            "badge": "🎬 YJHD Grand Wedding",
            "movie_locations": [
                "Yeh Jawaani Hai Deewani (Aditi & Taran's grand royal palace wedding at Oberoi Udaivilas)",
                "Octopussy (James Bond 007 floating palace)",
                "Goliyon Ki Raasleela Ram-Leela (Deepika & Ranveer palace romance)",
                "Guide (Dev Anand & Waheeda Rehman classic)"
            ],
            "featured_movie": "Yeh Jawaani Hai Deewani (Wedding)",
            "latitude": 24.5764,
            "longitude": 73.6734
        },
        {
            "name": "Mumbai Cinema Capital & Marine Drive",
            "region": "Maharashtra",
            "direction": "West",
            "tagline": "The City of Dreams: the Queen's Necklace promenade, Victorian Gothic heritage & the beating heart of Bollywood.",
            "must_see_landmarks": [
                "Marine Drive & Chowpatty Beach Sunset",
                "Gateway of India & Taj Mahal Palace Hotel",
                "Chhatrapati Shivaji Maharaj Terminus (UNESCO)",
                "Bandra Bandstand & Filmstar Mansions (Mannat & Galaxy)",
                "Colaba Causeway & Cafe Leopold"
            ],
            "best_for": "Bollywood Industry, Coastal Promenades & High Energy",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Electrifying & Iconic",
            "badge": "🎬 Wake Up Sid & Slumdog",
            "movie_locations": [
                "Wake Up Sid (Sid & Aisha standing at Marine Drive in the monsoon rain)",
                "Slumdog Millionaire (CST railway station 'Jai Ho' dance)",
                "Jaane Tu... Ya Jaane Na (Airport chase from Bandra)",
                "Gully Boy (Dharavi & Mumbai street hip-hop)"
            ],
            "featured_movie": "Wake Up Sid",
            "latitude": 18.9220,
            "longitude": 72.8347
        },
        {
            "name": "Jaipur & Amber Fort (Rajasthan)",
            "region": "Rajasthan",
            "direction": "West",
            "tagline": "The Pink City: grand sandstone ramparts soaring above Maota Lake, mirror palaces & the iconic Nahargarh baori jump.",
            "must_see_landmarks": [
                "Amer Fort & Sheesh Mahal (Mirror Palace)",
                "Nahargarh Fort & Stepwell Sunset",
                "Hawa Mahal (Palace of Winds)",
                "City Palace & Jantar Mantar Observatory",
                "Jaigarh Fort (World's Largest Wheeled Cannon)"
            ],
            "best_for": "Fortresses, Royal Rajput History & Textile Bazaars",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Royal & Vibrant",
            "badge": "🎬 Rang De Basanti Beer Jump",
            "movie_locations": [
                "Rang De Basanti (Aamir Khan & Sharman Joshi jumping into Nahargarh stepwell 'Masti Ki Paathshaala')",
                "Bajirao Mastani & Jodhaa Akbar (Amer Fort palace scenes)",
                "Shuddh Desi Romance",
                "Khoobsurat"
            ],
            "featured_movie": "Rang De Basanti (Jaipur)",
            "latitude": 26.9855,
            "longitude": 75.8513
        },
        {
            "name": "Great Rann of Kutch White Desert",
            "region": "Gujarat",
            "direction": "West",
            "tagline": "An endless glistening salt crust shining under moonlight, vibrant Kutchi embroidery & desert festival tents.",
            "must_see_landmarks": [
                "White Rann Endless Salt Flats",
                "Kala Dungar (Black Hill Sunset Viewpoint)",
                "Bhuj Aina Mahal & Prag Mahal",
                "Hodka Artisan Craft & Mud Bhunga Villages",
                "Dholavira Harappan Ancient UNESCO Metropolis"
            ],
            "best_for": "Moonlight Desert Walks, Artisan Crafts & Cultural Festivals",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Mystical & Expansive",
            "badge": "🎬 Hum Dil De Chuke Sanam",
            "movie_locations": [
                "Hum Dil De Chuke Sanam (Salman Khan & Aishwarya Rai desert sequences)",
                "Lagaan (Aamir Khan cricket match filmed in surrounding Bhuj villages)",
                "Goliyon Ki Raasleela Ram-Leela",
                "Refugee"
            ],
            "featured_movie": "Hum Dil De Chuke Sanam",
            "latitude": 23.8344,
            "longitude": 69.8322
        },

        # --- EAST & NORTHEAST INDIA ---
        {
            "name": "Kolkata & Howrah Bridge Heritage",
            "region": "West Bengal",
            "direction": "East",
            "tagline": "The Cultural Capital: yellow Ambassador taxis on Howrah Bridge, colonial white marble palaces & intellectual coffee houses.",
            "must_see_landmarks": [
                "Howrah Bridge & Hooghly River Ferry",
                "Victoria Memorial & Maidan Green",
                "Dakshineswar Kali Riverside Temple",
                "College Street Book Market & Indian Coffee House",
                "Kumartuli Artisan Idol Quarter"
            ],
            "best_for": "Art, Literature, Street Food & Soulful Nostalgia",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Soulful & Intellectual",
            "badge": "🎬 Piku & Kahaani",
            "movie_locations": [
                "Piku (Amitabh Bachchan cycling & driving over Howrah Bridge with Deepika)",
                "Kahaani (Vidya Balan navigating Kolkata alleys and Durga Puja festival)",
                "Yuva (Abhishek & Ajay Devgn on Vidyasagar Setu)",
                "Barfi! (Calcutta tram ride scenes)",
                "Detective Byomkesh Bakshy!"
            ],
            "featured_movie": "Piku",
            "latitude": 22.5851,
            "longitude": 88.3468
        },
        {
            "name": "Darjeeling & Toy Train Tea Ridges",
            "region": "Eastern Himalayas, West Bengal",
            "direction": "East",
            "tagline": "Misty emerald tea slopes facing Mt. Kanchenjunga, UNESCO heritage steam whistles & vibrant Tibetan monasteries.",
            "must_see_landmarks": [
                "Darjeeling Himalayan Railway (Toy Train) & Batasia Loop",
                "Tiger Hill Dawn Sunrise over Mt. Kanchenjunga",
                "Happy Valley Historic Tea Estate",
                "Ghum Monastery & Peace Pagoda",
                "Mall Road & Chowrasta Promenade"
            ],
            "best_for": "Himalayan Sunrise, Steam Trains & World-Famous Tea",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Misty & Nostalgic",
            "badge": "🎬 Barfi! & Main Hoon Na",
            "movie_locations": [
                "Barfi! (Ranbir Kapoor cycling alongside the puffing toy train)",
                "Parineeta (Saif & Vidya 'Kasto Mazza' toy train song)",
                "Main Hoon Na (Shah Rukh Khan arriving at St. Paul's School Darjeeling)",
                "Aradhana (Rajesh Khanna & Sharmila Tagore 'Mere Sapno Ki Rani')"
            ],
            "featured_movie": "Barfi!",
            "latitude": 27.0410,
            "longitude": 88.2663
        },
        {
            "name": "Cherrapunji & Living Root Bridges",
            "region": "Meghalaya, Northeast",
            "direction": "East",
            "tagline": "The Abode of Clouds: bio-engineered living rubber tree bridges, crystal-clear river canyons & soaring jungle waterfalls.",
            "must_see_landmarks": [
                "Nongriat Double Decker Living Root Bridge",
                "Nohkalikai Falls (India's Tallest Plunge Waterfall)",
                "Dawki Umngot Crystal Clear Glass-like River",
                "Mawsmai Limestone Caves",
                "Mawlynnong (Cleanest Village in Asia)"
            ],
            "best_for": "Bio-Wonders, Rainforest Treks & Crystalline Waters",
            "recommended_stay": "3 - 4 Days",
            "vibe": "Untamed & Mystical",
            "badge": "🎬 Rock On 2 & Living Roots",
            "movie_locations": [
                "Rock On 2 (Farhan Akhtar's serene Meghalaya retreat and Shillong acoustic jam)",
                "Nature Bio-engineering Documentaries"
            ],
            "featured_movie": "Rock On 2",
            "latitude": 25.2506,
            "longitude": 91.6706
        },
        {
            "name": "Kaziranga Wilderness & Assam",
            "region": "Assam, Northeast",
            "direction": "East",
            "tagline": "UNESCO World Heritage floodplain grasslands, home to two-thirds of the world's Great Indian One-Horned Rhinoceroses.",
            "must_see_landmarks": [
                "Kaziranga Central Range Elephant & Jeep Safaris",
                "One-Horned Rhinoceros & Wild Water Buffalo Encounters",
                "Brahmaputra River Twilight Dolphin Cruise",
                "Majuli Island (World's Largest River Island)",
                "Assam Tea Garden Tasting Walk"
            ],
            "best_for": "Rare Wildlife Safaris, River Islands & Untouched Nature",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Wild & Pristine",
            "badge": "🎬 UNESCO Wildlife Haven",
            "movie_locations": [
                "Anek (Ayushmann Khurrana Northeast wilderness narrative)",
                "National Geographic & Wildlife Documentaries"
            ],
            "featured_movie": "Anek",
            "latitude": 26.5775,
            "longitude": 93.1711
        }
    ],
    "munnar": [
        {
            "name": "Munnar Emerald Tea Estates & Tata Tea Museum",
            "region": "Idukki District, Kerala",
            "direction": "South",
            "tagline": "Endless rolling carpet of emerald green tea bushes, century-old British tea factories & fragrant cardamom valleys.",
            "must_see_landmarks": [
                "KDHP Tata Tea Museum & Live Processing",
                "Pothamedu Cloud Viewpoint",
                "Mattupetty Dam & Speedboat Lake",
                "Echo Point Valley",
                "Attukad Jungle Waterfalls"
            ],
            "best_for": "Tea Plantations, Cool Hill Breezes & Scenic Photography",
            "recommended_stay": "2 - 3 Days",
            "vibe": "Serene & Lush",
            "badge": "🎬 Chennai Express & Life of Pi",
            "movie_locations": [
                "Chennai Express (Shah Rukh Khan & Deepika 'Kashmir Main Tu Kanyakumari' filmed among Munnar tea terraces)",
                "Life of Pi (Suraj Sharma overlooking mist-covered green tea slopes)"
            ],
            "featured_movie": "Chennai Express",
            "latitude": 10.0889,
            "longitude": 77.0595
        },
        {
            "name": "Eravikulam National Park & Anamudi Peak",
            "region": "Western Ghats, Munnar",
            "direction": "South",
            "tagline": "Home to the endangered Nilgiri Tahr and South India's highest peak Anamudi (8,842 ft) with blooming Neelakurinji slopes.",
            "must_see_landmarks": [
                "Rajamalai Nilgiri Tahr Sanctuary Walk",
                "Anamudi Peak Lookout (Highest Peak in South India)",
                "Lakkam Forest Waterfalls",
                "Chinnar Wildlife Sanctuary Border",
                "High-Altitude Shola Forest Ecosystem"
            ],
            "best_for": "Rare Wildlife, High-Altitude Walks & Panoramic Vistas",
            "recommended_stay": "1 - 2 Days",
            "vibe": "Pristine & Wild",
            "badge": "Highest Peak in South India",
            "movie_locations": [
                "Filmed in numerous wildlife documentaries and Malayalam classics"
            ],
            "featured_movie": "Wildlife of Western Ghats",
            "latitude": 10.2016,
            "longitude": 77.0425
        },
        {
            "name": "Kolukkumalai Sunrise & Top Station",
            "region": "Munnar - Tamil Nadu Border",
            "direction": "South",
            "tagline": "World's highest orthodox tea plantation at 7,900 ft, offering sunrise above a blanket of swirling clouds.",
            "must_see_landmarks": [
                "Kolukkumalai Sunrise Safari by 4x4 Jeep",
                "Top Station Western Ghats Cloud Viewpoint",
                "Kundala Boating Lake & Arch Dam",
                "Meesapulimala Trekking Ridge (Second Highest Peak)",
                "Organic Artisan Orthodox Tea Tasting"
            ],
            "best_for": "Cloud Sunrise, Off-Road Jeep Safaris & Adventure Treks",
            "recommended_stay": "1 - 2 Days",
            "vibe": "Epic & Majestic",
            "badge": "World's Highest Tea Estate",
            "movie_locations": [
                "Charlie (Dulquer Salmaan Meesapulimala monologue scene)"
            ],
            "featured_movie": "Charlie",
            "latitude": 10.0863,
            "longitude": 77.2285
        }
    ]
}


def get_destination_sightseeing_hubs(destination: str) -> List[Dict[str, Any]]:
    """
    Returns curated must-visit sightseeing hubs tailored specifically to the requested place.
    If the user requests a country broadly ('India'), returns national multi-region hubs.
    If the user requests a specific city/place ('Munnar', 'Goa', 'Paris', etc.), returns sights strictly for that place.
    """
    dest_clean = destination.strip().lower() if destination else "france"

    # 1. Exact or partial match in DESTINATION_HUBS keys (excluding general country "india")
    if "munnar" in dest_clean:
        return DESTINATION_HUBS["munnar"]

    if dest_clean in DESTINATION_HUBS:
        return DESTINATION_HUBS[dest_clean]

    # 2. Check if destination is specifically the country "India" as a whole
    if dest_clean in ["india", "bharat", "indian", "all india", "india movie locations"]:
        return DESTINATION_HUBS["india"]

    # 3. Check for exact hub match inside "india" dataset (e.g. "goa", "manali", "kashmir", "ladakh", "hampi", "ooty", "jaipur", "udaipur", "kolkata", "darjeeling")
    if "india" in DESTINATION_HUBS:
        matching_hubs = [
            h for h in DESTINATION_HUBS["india"]
            if any(term in dest_clean for term in h["name"].lower().replace("&", "").split())
            or any(term in dest_clean for term in h["region"].lower().split())
        ]
        if matching_hubs:
            return matching_hubs

    # 4. Check other country keys
    for key, hubs in DESTINATION_HUBS.items():
        if key != "india" and (key in dest_clean or dest_clean in key):
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

from typing import Dict, Any, List

def get_weather_and_packing_tips(destination: str, season: str = "spring") -> Dict[str, Any]:
    """
    Returns climate context, average temperatures, and packing advice tailored for the destination.
    """
    dest = destination.strip().title() if destination else "Tokyo"
    
    # Generic smart packing by climate archetype
    packing = [
        "Lightweight breathable layers",
        "Comfortable broken-in walking sneakers / footwear",
        "Compact windproof umbrella or water-resistant shell jacket",
        "Universal power adapter with USB-C high-wattage ports",
        "Reusable insulated water bottle",
        "Crossbody anti-theft daypack for city wandering",
        "Small personal first aid & medication kit"
    ]
    
    customs = [
        f"Carry a small amount of local currency as some smaller artisan stalls and transit kiosks may prefer cash.",
        f"Keep digital copies of your passport, booking confirmations, and emergency embassy contacts offline.",
        f"Public transit in {dest} is generally punctual, quiet, and cashless—download local transit navigation apps upon arrival.",
        f"Tipping customs vary; check local dining norms (service charges are often included in standard bills)."
    ]
    
    return {
        "best_season": "April to June (Spring) & September to November (Autumn) for mild weather and optimal outdoor strolls.",
        "weather_summary": f"Pleasant daytime averages between 18°C - 24°C (64°F - 75°F) with cool evening breezes and occasional light showers.",
        "packing_list": packing,
        "local_customs_and_safety": customs
    }

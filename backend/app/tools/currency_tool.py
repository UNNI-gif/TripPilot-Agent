import re
from typing import Dict, Any, Optional

# Standard benchmark exchange rates relative to USD (1.0 USD)
EXCHANGE_RATES = {
    "USD": {"rate": 1.0, "symbol": "$", "name": "US Dollar"},
    "INR": {"rate": 84.2, "symbol": "₹", "name": "Indian Rupee"},
    "EUR": {"rate": 0.92, "symbol": "€", "name": "Euro"},
    "GBP": {"rate": 0.78, "symbol": "£", "name": "British Pound"},
    "JPY": {"rate": 154.5, "symbol": "¥", "name": "Japanese Yen"},
    "AED": {"rate": 3.67, "symbol": "AED", "name": "UAE Dirham"},
    "CAD": {"rate": 1.36, "symbol": "CA$", "name": "Canadian Dollar"},
    "AUD": {"rate": 1.52, "symbol": "A$", "name": "Australian Dollar"},
    "CHF": {"rate": 0.88, "symbol": "CHF", "name": "Swiss Franc"},
    "THB": {"rate": 35.5, "symbol": "฿", "name": "Thai Baht"},
    "IDR": {"rate": 16000.0, "symbol": "Rp", "name": "Indonesian Rupiah"},
    "SGD": {"rate": 1.35, "symbol": "S$", "name": "Singapore Dollar"}
}

def get_destination_currency(destination: str) -> Dict[str, Any]:
    """
    Determines the national currency code, symbol, and conversion rate
    based on the destination country or region.
    """
    dest = (destination or "").strip().lower()

    # 1. India (all states, regions, and major destinations)
    india_keywords = [
        "india", "bharat", "munnar", "kerala", "bangalore", "bengaluru", "kochi", "cochin",
        "delhi", "new delhi", "mumbai", "bombay", "goa", "manali", "ladakh", "leh",
        "kashmir", "srinagar", "ooty", "hampi", "jaipur", "udaipur", "rajasthan",
        "kolkata", "calcutta", "darjeeling", "agra", "chennai", "madras", "hyderabad",
        "varanasi", "rishikesh", "shimla", "amritsar", "assam", "meghalaya", "shillong",
        "cherrapunji", "coimbatore", "madurai", "mysore", "mysuru", "wayanad", "thekkady",
        "alleppey", "alappuzha", "trivandrum", "thiruvananthapuram", "kutch", "pondicherry",
        "puducherry", "pune", "ahmedabad", "chandigarh"
    ]
    if any(k in dest for k in india_keywords):
        info = EXCHANGE_RATES["INR"]
        return {"code": "INR", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 2. Eurozone (France, Italy, Spain, Germany, Netherlands, Portugal, Austria, Greece, etc.)
    euro_keywords = [
        "france", "paris", "nice", "marseille", "lyon", "bordeaux", "provence", "cannes",
        "italy", "italia", "rome", "florence", "venice", "milan", "naples", "amalfi", "sicily",
        "spain", "espana", "barcelona", "madrid", "seville", "valencia", "granada",
        "germany", "deutschland", "berlin", "munich", "frankfurt", "hamburg",
        "netherlands", "holland", "amsterdam", "rotterdam",
        "portugal", "lisbon", "porto", "algarve",
        "austria", "vienna", "salzburg",
        "greece", "santorini", "athens", "mykonos", "crete",
        "ireland", "dublin", "finland", "helsinki", "belgium", "brussels"
    ]
    if any(k in dest for k in euro_keywords):
        info = EXCHANGE_RATES["EUR"]
        return {"code": "EUR", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 3. United Kingdom
    uk_keywords = ["uk", "united kingdom", "london", "edinburgh", "scotland", "england", "manchester", "britain", "wales", "belfast"]
    if any(k in dest for k in uk_keywords):
        info = EXCHANGE_RATES["GBP"]
        return {"code": "GBP", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 4. Japan
    japan_keywords = ["japan", "nippon", "tokyo", "kyoto", "osaka", "hokkaido", "okinawa", "hiroshima", "fuji", "nara"]
    if any(k in dest for k in japan_keywords):
        info = EXCHANGE_RATES["JPY"]
        return {"code": "JPY", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 5. United Arab Emirates
    uae_keywords = ["uae", "emirates", "dubai", "abu dhabi", "sharjah"]
    if any(k in dest for k in uae_keywords):
        info = EXCHANGE_RATES["AED"]
        return {"code": "AED", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 6. Switzerland
    swiss_keywords = ["switzerland", "swiss", "zurich", "geneva", "lucerne", "interlaken", "zermatt"]
    if any(k in dest for k in swiss_keywords):
        info = EXCHANGE_RATES["CHF"]
        return {"code": "CHF", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 7. Canada
    canada_keywords = ["canada", "toronto", "vancouver", "montreal", "banff", "quebec", "ottawa"]
    if any(k in dest for k in canada_keywords):
        info = EXCHANGE_RATES["CAD"]
        return {"code": "CAD", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 8. Australia
    aus_keywords = ["australia", "sydney", "melbourne", "brisbane", "gold coast", "perth", "cairns"]
    if any(k in dest for k in aus_keywords):
        info = EXCHANGE_RATES["AUD"]
        return {"code": "AUD", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 9. Thailand
    thai_keywords = ["thailand", "bangkok", "phuket", "chiang mai", "krabi", "koh samui", "pattaya"]
    if any(k in dest for k in thai_keywords):
        info = EXCHANGE_RATES["THB"]
        return {"code": "THB", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 10. Indonesia / Bali
    bali_keywords = ["bali", "indonesia", "jakarta", "ubud", "seminyak", "canggu", "lombok"]
    if any(k in dest for k in bali_keywords):
        info = EXCHANGE_RATES["IDR"]
        return {"code": "IDR", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 11. Singapore
    if "singapore" in dest:
        info = EXCHANGE_RATES["SGD"]
        return {"code": "SGD", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}

    # 12. Default: United States / US Dollar
    info = EXCHANGE_RATES["USD"]
    return {"code": "USD", "symbol": info["symbol"], "name": info["name"], "rate": info["rate"]}


def convert_currency(amount: float, from_curr: str = "USD", to_curr: str = "EUR") -> Dict[str, Any]:
    """
    Converts amount between supported global currencies.
    """
    from_info = EXCHANGE_RATES.get(from_curr.upper(), EXCHANGE_RATES["USD"])
    to_info = EXCHANGE_RATES.get(to_curr.upper(), EXCHANGE_RATES["EUR"])

    amount_in_usd = amount / from_info["rate"]
    converted_amount = round(amount_in_usd * to_info["rate"], 2)

    return {
        "original_amount": amount,
        "from_currency": from_curr.upper(),
        "to_currency": to_curr.upper(),
        "symbol": to_info["symbol"],
        "converted_amount": converted_amount,
        "exchange_rate": round(to_info["rate"] / from_info["rate"], 4)
    }

def format_currency_amount(amount: float, currency_code: str = "USD") -> str:
    """
    Formats numeric amount with appropriate national currency symbol and separator.
    """
    curr = EXCHANGE_RATES.get(currency_code.upper(), EXCHANGE_RATES["USD"])
    symbol = curr["symbol"]
    if currency_code in ["INR", "JPY", "IDR"]:
        return f"{symbol}{int(round(amount)):,}"
    if amount == int(amount):
        return f"{symbol}{int(amount):,}"
    return f"{symbol}{amount:,.2f}"

def convert_cost_str(cost_str: str, target_curr: Dict[str, Any]) -> str:
    """
    Converts cost strings like '$20', 'Free', '€25' into target destination currency.
    """
    if not cost_str:
        return "Free"
    clean = cost_str.strip()
    if clean.lower() == "free" or clean == "$0" or clean == "₹0" or clean == "€0":
        return "Free"

    symbol = target_curr.get("symbol", "$")
    code = target_curr.get("code", "USD")

    # If already in target currency, return as is
    if clean.startswith(symbol) or f" {symbol}" in clean or clean.endswith(symbol):
        return clean

    # Extract digits
    match = re.search(r'([0-9]+(?:,[0-9]+)*(?:\.[0-9]+)?)', clean)
    if not match:
        return clean

    base_val = float(match.group(1).replace(",", ""))
    rate = target_curr.get("rate", 1.0)

    # If it was in USD, multiply by rate
    converted = base_val * rate
    if code in ["INR", "JPY", "IDR"]:
        # Round to friendly increments (e.g. 50, 100)
        val = int(round(converted))
        if val > 500:
            val = round(val / 50) * 50
        elif val > 100:
            val = round(val / 10) * 10
        return f"{symbol}{val:,}"
    elif code in ["EUR", "GBP", "CHF", "USD"]:
        val = int(round(converted))
        return f"{symbol}{val}"
    return f"{symbol}{round(converted, 1)}"

def get_supported_currencies() -> Dict[str, Dict[str, Any]]:
    return EXCHANGE_RATES

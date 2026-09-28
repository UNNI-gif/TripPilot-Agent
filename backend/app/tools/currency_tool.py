from typing import Dict, Any

# Standard benchmark exchange rates relative to USD (1.0 USD)
EXCHANGE_RATES = {
    "USD": {"rate": 1.0, "symbol": "$", "name": "US Dollar"},
    "EUR": {"rate": 0.92, "symbol": "€", "name": "Euro"},
    "GBP": {"rate": 0.78, "symbol": "£", "name": "British Pound"},
    "JPY": {"rate": 154.5, "symbol": "¥", "name": "Japanese Yen"},
    "INR": {"rate": 84.2, "symbol": "₹", "name": "Indian Rupee"},
    "CAD": {"rate": 1.36, "symbol": "CA$", "name": "Canadian Dollar"},
    "AUD": {"rate": 1.52, "symbol": "A$", "name": "Australian Dollar"},
    "CHF": {"rate": 0.88, "symbol": "CHF", "name": "Swiss Franc"}
}

def convert_currency(amount: float, from_curr: str = "USD", to_curr: str = "EUR") -> Dict[str, Any]:
    """
    Converts amount between supported global currencies.
    """
    from_info = EXCHANGE_RATES.get(from_curr.upper(), EXCHANGE_RATES["USD"])
    to_info = EXCHANGE_RATES.get(to_curr.upper(), EXCHANGE_RATES["EUR"])

    # Convert from base USD
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

def get_supported_currencies() -> Dict[str, Dict[str, Any]]:
    return EXCHANGE_RATES

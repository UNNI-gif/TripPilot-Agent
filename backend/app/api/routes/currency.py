from fastapi import APIRouter, Query
from app.tools.currency_tool import convert_currency, get_supported_currencies

router = APIRouter(prefix="/currency", tags=["Currency"])

@router.get("/rates")
def list_currencies():
    """List supported currencies and exchange rates."""
    return get_supported_currencies()

@router.get("/convert")
def convert(
    amount: float = Query(..., gt=0, description="Amount to convert"),
    from_currency: str = Query("USD", description="Source currency code"),
    to_currency: str = Query("EUR", description="Target currency code")
):
    """Convert amount between currencies."""
    return convert_currency(amount, from_curr=from_currency, to_curr=to_currency)

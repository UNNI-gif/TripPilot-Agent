import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.tools.flights_tool import search_flights
from app.tools.hotels_tool import search_hotels
from app.tools.weather_tool import get_weather_and_packing_tips
from app.tools.budget_tool import calculate_trip_budget

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert "TripPilot" in data["service"]

def test_tools():
    flights = search_flights("New York", "Tokyo", "moderate")
    assert len(flights) >= 2
    assert flights[0]["price_usd"] > 0

    hotels = search_hotels("Tokyo", "moderate")
    assert len(hotels) >= 3
    assert hotels[0]["rating"] >= 4.0

    weather = get_weather_and_packing_tips("Tokyo")
    assert "best_season" in weather
    assert len(weather["packing_list"]) > 0

    budget = calculate_trip_budget(5, "moderate", 2)
    assert budget["total_estimated"] > 0
    assert budget["currency"] == "USD"

def test_generate_trip():
    response = client.post("/api/trips/generate?destination=Rome&duration_days=3&travel_style=moderate")
    assert response.status_code == 200
    data = response.json()
    assert data["destination"] == "Rome"
    assert data["duration_days"] == 3
    assert len(data["itinerary"]) == 3
    assert len(data["hotels"]) > 0
    assert len(data["flights"]) > 0

def test_chat_interaction():
    response = client.post("/api/chat", json={
        "message": "Plan a 4-day romantic escape to Paris",
        "destination": "Paris",
        "duration_days": 4,
        "travel_style": "boutique"
    })
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert len(data["reply"]) > 0
    assert data["trip_plan"] is not None
    assert data["trip_plan"]["destination"] == "Paris"
    assert len(data["trip_plan"]["itinerary"]) == 4

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.tools.flights_tool import search_flights
from app.tools.hotels_tool import search_hotels
from app.tools.weather_tool import get_weather_and_packing_tips
from app.tools.budget_tool import calculate_trip_budget
from app.tools.currency_tool import convert_currency

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

def test_currency_conversion():
    res = client.get("/api/currency/convert?amount=1000&from_currency=USD&to_currency=EUR")
    assert res.status_code == 200
    data = res.json()
    assert data["to_currency"] == "EUR"
    assert data["converted_amount"] > 0

def test_generate_trip():
    response = client.post("/api/trips/generate?destination=Rome&duration_days=3&travel_style=moderate")
    assert response.status_code == 200
    data = response.json()
    assert data["destination"] == "Rome"
    assert data["duration_days"] == 3
    assert len(data["itinerary"]) == 3
    assert len(data["hotels"]) > 0
    assert len(data["flights"]) > 0
    # Coordinates check
    assert data["itinerary"][0]["activities"][0]["latitude"] is not None

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

def test_chat_stream():
    with client.stream("POST", "/api/chat/stream", json={
        "message": "Quick weekend trip to Rome",
        "destination": "Rome",
        "duration_days": 2
    }) as stream_res:
        assert stream_res.status_code == 200
        # Read initial chunk
        chunks = list(stream_res.iter_lines())
        assert len(chunks) > 0

def test_freeform_france_romantic_trip():
    # User provides only free-form natural language text, without form parameters
    response = client.post("/api/chat", json={
        "message": "Plan a 1-month romantic trip to France with my fiancé. Get us the cheapest hotels to stay and a cab service with all major locations to see."
    })
    assert response.status_code == 200
    data = response.json()
    assert data["trip_plan"] is not None
    plan = data["trip_plan"]
    assert plan["destination"] == "France"
    assert plan["duration_days"] == 30
    assert "France" in plan["title"]
    # Check that cab service is recommended in itinerary transit tips
    assert any("cab" in d["transit_tips"].lower() or "taxi" in d["transit_tips"].lower() for d in plan["itinerary"])
    # Check that hotels include budget options
    assert any(h["price_per_night_usd"] <= 70 for h in plan["hotels"])
    # Check that budget is calculated for the full month
    assert plan["budget"]["total_estimated"] > 2000

def test_sightseeing_hubs():
    response = client.get("/api/trips/sightseeing/hubs?destination=France")
    assert response.status_code == 200
    hubs = response.json()
    assert len(hubs) >= 4
    # Paris should be present
    assert any("Paris" in h["name"] for h in hubs)
    # Nice / French Riviera should be present
    assert any("Riviera" in h["name"] or "Nice" in h["name"] for h in hubs)
    # Check landmarks list
    paris_hub = next(h for h in hubs if "Paris" in h["name"])
    assert any("Eiffel" in lm for lm in paris_hub["must_see_landmarks"])

def test_authentic_gps_coordinates():
    response = client.post("/api/trips/generate?destination=France&duration_days=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data["sightseeing_hubs"]) >= 4
    # Check that day 1 activity has authentic Paris coordinates
    first_act = data["itinerary"][0]["activities"][0]
    assert 48.8 <= first_act["latitude"] <= 48.9
    assert 2.2 <= first_act["longitude"] <= 2.4



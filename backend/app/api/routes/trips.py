import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.db.models import TripPlan
from app.agents.schemas import TripPlanResponse, SightseeingHub
from app.agents.trip_agent import trip_agent
from app.tools.sightseeing_tool import get_destination_sightseeing_hubs

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.get("/sightseeing/hubs", response_model=List[SightseeingHub])
def get_destination_hubs(destination: str = "France"):
    """Get curated must-visit sightseeing hubs and cities for a destination."""
    hubs = get_destination_sightseeing_hubs(destination)
    return [SightseeingHub(**h) for h in hubs]

@router.get("", response_model=List[dict])
def list_trips(db: Session = Depends(get_db)):
    """List all saved itineraries."""
    trips = db.query(TripPlan).order_by(TripPlan.created_at.desc()).all()
    results = []
    for t in trips:
        results.append({
            "id": t.id,
            "title": t.title,
            "destination": t.destination,
            "duration_days": t.duration_days,
            "budget_total": t.budget_total,
            "currency": t.currency,
            "created_at": t.created_at.isoformat() if t.created_at else None,
            "overview": t.overview
        })
    return results

@router.get("/{trip_id}", response_model=TripPlanResponse)
def get_trip(trip_id: int, db: Session = Depends(get_db)):
    """Retrieve full details of a specific saved trip."""
    trip = db.query(TripPlan).filter(TripPlan.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    hubs = get_destination_sightseeing_hubs(trip.destination)

    return TripPlanResponse(
        id=trip.id,
        title=trip.title,
        destination=trip.destination,
        duration_days=trip.duration_days,
        overview=trip.overview or {},
        flights=trip.flights or [],
        hotels=trip.hotels or [],
        itinerary=trip.itinerary or [],
        budget=trip.budget or {},
        key_recommendations=trip.overview.get("local_customs_and_safety", []) if trip.overview else [],
        sightseeing_hubs=[SightseeingHub(**h) for h in hubs]
    )

@router.post("", response_model=TripPlanResponse, status_code=status.HTTP_201_CREATED)
def save_trip(trip_in: TripPlanResponse, db: Session = Depends(get_db)):
    """Save an itinerary to the database."""
    trip_record = TripPlan(
        title=trip_in.title,
        destination=trip_in.destination,
        duration_days=trip_in.duration_days,
        budget_total=trip_in.budget.total_estimated if trip_in.budget else 0.0,
        currency=trip_in.budget.currency if trip_in.budget else "USD",
        overview=trip_in.overview.model_dump() if trip_in.overview else None,
        flights=[f.model_dump() for f in trip_in.flights],
        hotels=[h.model_dump() for h in trip_in.hotels],
        itinerary=[d.model_dump() for d in trip_in.itinerary],
        budget=trip_in.budget.model_dump() if trip_in.budget else None
    )
    db.add(trip_record)
    db.commit()
    db.refresh(trip_record)

    trip_in.id = trip_record.id
    return trip_in

@router.delete("/{trip_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_trip(trip_id: int, db: Session = Depends(get_db)):
    """Delete a saved trip."""
    trip = db.query(TripPlan).filter(TripPlan.id == trip_id).first()
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    db.delete(trip)
    db.commit()
    return None

@router.post("/generate", response_model=TripPlanResponse)
async def generate_trip(
    destination: str,
    duration_days: int = 3,
    travel_style: str = "moderate",
    save_to_db: bool = False,
    db: Session = Depends(get_db)
):
    """Directly generate a full structured trip plan."""
    _, trip_plan = await trip_agent.run(
        user_message=f"Plan a {duration_days}-day trip to {destination}",
        destination_hint=destination,
        duration_days=duration_days,
        travel_style=travel_style
    )

    if not trip_plan:
        raise HTTPException(status_code=500, detail="Failed to synthesize trip plan")

    if save_to_db:
        record = TripPlan(
            title=trip_plan.title,
            destination=trip_plan.destination,
            duration_days=trip_plan.duration_days,
            budget_total=trip_plan.budget.total_estimated,
            currency=trip_plan.budget.currency,
            overview=trip_plan.overview.model_dump(),
            flights=[f.model_dump() for f in trip_plan.flights],
            hotels=[h.model_dump() for h in trip_plan.hotels],
            itinerary=[d.model_dump() for d in trip_plan.itinerary],
            budget=trip_plan.budget.model_dump()
        )
        db.add(record)
        db.commit()
        db.refresh(record)
        trip_plan.id = record.id

    return trip_plan

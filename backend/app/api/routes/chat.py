import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.db.models import ChatSession, ChatMessage, TripPlan
from app.agents.schemas import ChatRequest, ChatResponse, TripPlanResponse
from app.agents.trip_agent import trip_agent

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Conversational endpoint for chatting with TripPilot.
    Supports session persistence, context awareness, and structured itinerary extraction.
    """
    session_id = request.session_id or str(uuid.uuid4())
    
    # Fetch or create session
    session_record = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session_record:
        session_title = request.destination or (request.message[:40] + "..." if len(request.message) > 40 else request.message)
        session_record = ChatSession(
            id=session_id,
            title=f"Trip: {session_title}",
            destination=request.destination
        )
        db.add(session_record)
        db.commit()

    # Load recent conversation history
    prior_messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.desc()).limit(6).all()
    history = [{"role": m.role, "content": m.content} for m in reversed(prior_messages)]

    # Record User Message
    user_msg = ChatMessage(
        session_id=session_id,
        role="user",
        content=request.message
    )
    db.add(user_msg)
    db.commit()

    # Run agent
    reply, trip_plan = await trip_agent.run(
        user_message=request.message,
        chat_history=history,
        destination_hint=request.destination or session_record.destination,
        duration_days=request.duration_days,
        travel_style=request.travel_style
    )

    # If trip plan was generated, optionally save to database
    trip_plan_dict = None
    if trip_plan:
        trip_plan_dict = trip_plan.model_dump()
        try:
            plan_db = TripPlan(
                title=trip_plan.title,
                destination=trip_plan.destination,
                duration_days=trip_plan.duration_days,
                budget_total=trip_plan.budget.total_estimated if trip_plan.budget else 0.0,
                currency=trip_plan.budget.currency if trip_plan.budget else "USD",
                overview=trip_plan.overview.model_dump() if trip_plan.overview else None,
                flights=[f.model_dump() for f in trip_plan.flights],
                hotels=[h.model_dump() for h in trip_plan.hotels],
                itinerary=[d.model_dump() for d in trip_plan.itinerary],
                budget=trip_plan.budget.model_dump() if trip_plan.budget else None,
                raw_prompt=request.message
            )
            db.add(plan_db)
            db.commit()
            db.refresh(plan_db)
            trip_plan.id = plan_db.id
            session_record.current_trip_id = plan_db.id
            session_record.destination = trip_plan.destination
            db.commit()
        except Exception as err:
            db.rollback()

    # Record Assistant Message
    assistant_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        content=reply,
        trip_data=trip_plan.model_dump() if trip_plan else None
    )
    db.add(assistant_msg)
    db.commit()

    return ChatResponse(
        session_id=session_id,
        reply=reply,
        trip_plan=trip_plan
    )

@router.get("/sessions")
def list_sessions(db: Session = Depends(get_db)):
    """List recent travel planning conversations."""
    sessions = db.query(ChatSession).order_by(ChatSession.updated_at.desc()).limit(20).all()
    return [
        {
            "id": s.id,
            "title": s.title,
            "destination": s.destination,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "updated_at": s.updated_at.isoformat() if s.updated_at else None
        }
        for s in sessions
    ]

@router.get("/sessions/{session_id}/messages")
def get_session_messages(session_id: str, db: Session = Depends(get_db)):
    """Get all messages for a specific chat session."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc()).all()
    return [
        {
            "id": m.id,
            "role": m.role,
            "content": m.content,
            "trip_data": m.trip_data,
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in messages
    ]

@router.delete("/sessions/{session_id}")
def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Delete a conversation session."""
    session = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    db.delete(session)
    db.commit()
    return {"message": "Session deleted successfully"}

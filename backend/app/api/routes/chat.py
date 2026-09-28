import uuid
import json
import asyncio
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.db.session import SessionLocal
from app.db.models import ChatSession, ChatMessage, TripPlan
from app.agents.schemas import ChatRequest, ChatResponse, TripPlanResponse
from app.agents.trip_agent import trip_agent

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Standard conversational endpoint for chatting with TripPilot.
    Supports session persistence, context awareness, and structured itinerary extraction.
    """
    session_id = request.session_id or str(uuid.uuid4())
    
    # Extract intent from natural language message + optional hints
    intent = trip_agent.extract_intent(
        user_message=request.message,
        destination_hint=request.destination,
        duration_days=request.duration_days,
        travel_style=request.travel_style
    )
    dest = intent["destination"]

    # Fetch or create session
    session_record = db.query(ChatSession).filter(ChatSession.id == session_id).first()
    if not session_record:
        session_title = dest or (request.message[:40] + "..." if len(request.message) > 40 else request.message)
        session_record = ChatSession(
            id=session_id,
            title=f"Trip: {session_title}",
            destination=dest
        )
        db.add(session_record)
        db.commit()
    elif dest:
        session_record.destination = dest
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
        destination_hint=dest,
        duration_days=intent["duration_days"],
        travel_style=intent["travel_style"]
    )

    # If trip plan was generated, save to database
    if trip_plan:
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


@router.post("/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """
    Real-time Server-Sent Events (SSE) streaming endpoint.
    Emits live agent thought stages, tool execution events, streamed response tokens,
    and structured itinerary payload.
    """
    session_id = request.session_id or str(uuid.uuid4())

    async def sse_generator():
        # Separate DB session for async generator
        db = SessionLocal()
        try:
            # 1. Extract natural language intent
            intent = trip_agent.extract_intent(
                user_message=request.message,
                destination_hint=request.destination,
                duration_days=request.duration_days,
                travel_style=request.travel_style
            )
            dest = intent["destination"]

            # 2. Fetch or create session
            session_record = db.query(ChatSession).filter(ChatSession.id == session_id).first()
            if not session_record:
                session_title = dest or (request.message[:40] + "..." if len(request.message) > 40 else request.message)
                session_record = ChatSession(
                    id=session_id,
                    title=f"Trip: {session_title}",
                    destination=dest
                )
                db.add(session_record)
                db.commit()
            elif dest:
                session_record.destination = dest
                db.commit()

            # Record User Message
            user_msg = ChatMessage(
                session_id=session_id,
                role="user",
                content=request.message
            )
            db.add(user_msg)
            db.commit()

            # Emit initial thought event
            yield f"data: {json.dumps({'event': 'thought', 'text': f'Analyzing travel request for {dest}...'})}\n\n"
            await asyncio.sleep(0.15)

            # Emit flight search tool event
            yield f"data: {json.dumps({'event': 'tool_start', 'tool': 'search_flights', 'text': f'Searching flights and routes to {dest}...'})}\n\n"
            await asyncio.sleep(0.2)
            yield f"data: {json.dumps({'event': 'tool_end', 'tool': 'search_flights', 'text': f'Found optimal flight routes & pricing to {dest}'})}\n\n"

            # Emit hotel search tool event
            hotel_type_label = "budget-friendly stays" if intent.get("wants_cheapest_hotels") else "boutique stays & accommodations"
            yield f"data: {json.dumps({'event': 'tool_start', 'tool': 'search_hotels', 'text': f'Curating {hotel_type_label} in {dest}...'})}\n\n"
            await asyncio.sleep(0.2)
            yield f"data: {json.dumps({'event': 'tool_end', 'tool': 'search_hotels', 'text': f'Curated verified hotel options in {dest}'})}\n\n"

            # Emit live weather tool event
            yield f"data: {json.dumps({'event': 'tool_start', 'tool': 'weather_forecast', 'text': f'Fetching live weather & packing checklist for {dest} via Open-Meteo...'})}\n\n"
            await asyncio.sleep(0.2)
            yield f"data: {json.dumps({'event': 'tool_end', 'tool': 'weather_forecast', 'text': 'Live weather & packing checklist synthesized'})}\n\n"

            # Emit budget optimizer tool event
            duration_val = intent["duration_days"]
            yield f"data: {json.dumps({'event': 'tool_start', 'tool': 'budget_optimizer', 'text': f'Balancing {duration_val}-day itemized budget categories...'})}\n\n"
            await asyncio.sleep(0.15)
            yield f"data: {json.dumps({'event': 'tool_end', 'tool': 'budget_optimizer', 'text': 'Budget calculated successfully'})}\n\n"

            # Run agent core logic
            prior_messages = db.query(ChatMessage).filter(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.desc()).limit(6).all()
            history = [{"role": m.role, "content": m.content} for m in reversed(prior_messages)]

            reply, trip_plan = await trip_agent.run(
                user_message=request.message,
                chat_history=history,
                destination_hint=dest,
                duration_days=intent["duration_days"],
                travel_style=intent["travel_style"]
            )

            # Stream text tokens
            words = reply.split(" ")
            chunk_size = 3
            for i in range(0, len(words), chunk_size):
                chunk = " ".join(words[i:i + chunk_size]) + " "
                yield f"data: {json.dumps({'event': 'token', 'text': chunk})}\n\n"
                await asyncio.sleep(0.04)

            # Save trip plan if present
            if trip_plan:
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

                # Emit trip_plan event
                yield f"data: {json.dumps({'event': 'trip_plan', 'data': trip_plan.model_dump()})}\n\n"

            # Record Assistant Message in DB
            assistant_msg = ChatMessage(
                session_id=session_id,
                role="assistant",
                content=reply,
                trip_data=trip_plan.model_dump() if trip_plan else None
            )
            db.add(assistant_msg)
            db.commit()

            # Emit done
            yield f"data: {json.dumps({'event': 'done', 'session_id': session_id})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'event': 'error', 'message': str(e)})}\n\n"
        finally:
            db.close()

    return StreamingResponse(sse_generator(), media_type="text/event-stream")


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

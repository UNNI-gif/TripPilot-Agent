import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.session import Base

class TripPlan(Base):
    __tablename__ = "trip_plans"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    destination = Column(String(255), nullable=False, index=True)
    duration_days = Column(Integer, default=3)
    budget_total = Column(Float, default=0.0)
    currency = Column(String(10), default="USD")
    
    # Structured trip data in JSON format
    overview = Column(JSON, nullable=True)
    itinerary = Column(JSON, nullable=True)
    flights = Column(JSON, nullable=True)
    hotels = Column(JSON, nullable=True)
    budget = Column(JSON, nullable=True)
    raw_prompt = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)


class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(255), default="New Trip Exploration")
    destination = Column(String(255), nullable=True)
    current_trip_id = Column(Integer, ForeignKey("trip_plans.id"), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan", order_by="ChatMessage.created_at")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), ForeignKey("chat_sessions.id"), nullable=False, index=True)
    role = Column(String(20), nullable=False) # 'user', 'assistant', 'system'
    content = Column(Text, nullable=False)
    trip_data = Column(JSON, nullable=True) # Attached structured itinerary snapshot if generated
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

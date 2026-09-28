import time
from fastapi import APIRouter
from app.core.config import settings
from app.agents.trip_agent import trip_agent

router = APIRouter(prefix="/health", tags=["Health"])

START_TIME = time.time()

@router.get("")
def health_check():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "uptime_seconds": round(time.time() - START_TIME, 2),
        "ai_engine": {
            "model": settings.GEMINI_MODEL,
            "has_api_key": bool(settings.GEMINI_API_KEY),
            "client_ready": trip_agent.model is not None
        }
    }

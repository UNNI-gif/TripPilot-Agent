# ✈️ TripPilot Agent - Production AI Travel Planner & Copilot

TripPilot Agent is a full-stack, enterprise-grade AI travel planning assistant and autonomous trip copilot powered by **Google Gemini**, **FastAPI**, and **React (Vite + Tailwind CSS)**.

It generates personalized, realistic, day-by-day travel itineraries, discovers flight options and boutique accommodations, calculates detailed budget forecasts, advises on seasonal weather, and enables real-time conversational itinerary adjustments.

---

## 🌟 Key Features

- 🤖 **Autonomous AI Agent**: Context-aware travel copilot backed by Gemini 2.5 with autonomous tool orchestration.
- ⚡ **Real-Time SSE Streaming Chat**: Word-by-word streaming responses with live agent thought states and animated tool execution progress badges (`search_flights`, `search_hotels`, `weather_forecast`, `budget_optimizer`).
- 🗺️ **Interactive Route Map (Leaflet & OpenStreetMap)**: Day-by-day color-coded geo-pins, popups with schedules and costs, and interactive day filters.
- ⛅ **Live Meteorological Weather (Open-Meteo API)**: Real-time temperature, condition codes, rainfall probability, and smart packing suggestions for any destination worldwide.
- ✏️ **Inline Activity Customizer & Editor**: Modal editor to customize times, descriptions, costs, delete activities, or append new activities to any day on the fly.
- 💱 **Multi-Currency Live Converter**: Instant budget switching between USD ($), EUR (€), GBP (£), JPY (¥), INR (₹), CAD ($), and AUD ($).
- 📅 **Day-by-Day Visual Itinerary Board**: Morning, afternoon, and evening activity timelines with local tips, coordinates, and categories.
- ✈️ **Flight & Stay Recommendations**: Live route visualizations, flight schedules, pricing estimates, and hotel tiers (Luxury, Boutique, Mid-Range, Budget).
- 💰 **Comprehensive Budget Breakdown**: Category-by-category expense forecasts (transit, lodging, dining, tickets, emergency buffer).
- 💾 **Session & Trip Persistence**: SQLite / PostgreSQL storage with full CRUD, history, and message memory.
- 📤 **Multi-Format Export**: Export any trip plan to JSON, clean Markdown (for Notion/Obsidian), or print-ready PDF.
- 🐳 **Production Dockerized**: Multi-stage Nginx frontend build and slim Python backend orchestrated via Docker Compose.
- 🔄 **Automated CI/CD**: GitHub Actions workflow (`.github/workflows/ci.yml`) validating tests and Docker images on push.

---

## 🏗️ Architecture

```mermaid
flowchart TD
    User([Traveler / User]) <--> Frontend[React + Vite + Tailwind CSS]
    
    subgraph Frontend_UI [Frontend Components]
        ChatCopilot[Streaming SSE Chat Copilot]
        MapView[Interactive Leaflet Route Map]
        ItineraryView[Day-by-Day Timeline Board + Editor]
        BudgetForecast[Smart Expense Breakdown + Currency Switcher]
        TripOverview[Flight & Hotel Cards + Packing Checklist]
    end
    
    Frontend <--> |REST API / SSE Streams| Backend[FastAPI Backend Engine]
    
    subgraph Backend_Engine [FastAPI Engine]
        Agent[TripPilot Agent Controller]
        Tools[Autonomous Travel Tools]
        DB[(SQLite / PostgreSQL via SQLAlchemy)]
    end
    
    subgraph ToolSuite [Agent Tools]
        FlightsTool[Flights Search Tool]
        HotelsTool[Accommodations Tool]
        WeatherTool[Live Open-Meteo Weather Tool]
        PlacesTool[Attractions & Dining Tool]
        BudgetTool[Budget Optimizer Tool]
        CurrencyTool[Currency Converter Tool]
    end
    
    Agent --> Tools
    Tools --> FlightsTool
    Tools --> HotelsTool
    Tools --> WeatherTool
    Tools --> PlacesTool
    Tools --> BudgetTool
    Tools --> CurrencyTool
    Agent <--> DB
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Python 3.11+** (Python 3.13 tested)
- **Node.js 18+** & **npm**
- **Google Gemini API Key** (optional, high-fidelity synthetic engine active if key is unset)

### 1. Launch Everything in One Command
Run the included PowerShell launcher:
```powershell
.\run_dev.ps1
```

Or start manually:
```bash
# Terminal 1: Backend
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows (or source venv/bin/activate on Unix)
pip install -r requirements.txt
cp .env.example .env
python -m pytest -v      # Run tests
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🐳 Production Deployment (Docker Compose)

Deploy the entire production stack with a single command:

```bash
docker compose up -d --build
```

- **Frontend Application**: [http://localhost:80](http://localhost:80)
- **Backend API**: [http://localhost:8000/api](http://localhost:8000/api)
- **Interactive OpenAPI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Health Check**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

To view logs:
```bash
docker compose logs -f
```

To stop:
```bash
docker compose down
```

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status, uptime, and AI engine readiness |
| `POST` | `/api/chat` | Conversational travel copilot endpoint with session memory |
| `POST` | `/api/chat/stream` | Real-time Server-Sent Events (SSE) streaming chat |
| `GET` | `/api/chat/sessions` | List active planning sessions |
| `GET` | `/api/chat/sessions/{id}/messages` | Retrieve conversation history for a session |
| `GET` | `/api/currency/rates` | List supported currencies and exchange rates |
| `GET` | `/api/currency/convert` | Live currency conversion |
| `GET` | `/api/trips` | List all saved itineraries |
| `POST` | `/api/trips` | Save or update an itinerary |
| `GET` | `/api/trips/{id}` | Fetch full trip details |
| `DELETE` | `/api/trips/{id}` | Delete a saved trip |
| `POST` | `/api/trips/generate` | Direct structured trip plan synthesis |

---

## 🛡️ License
MIT License. Built for production-ready autonomous travel planning.

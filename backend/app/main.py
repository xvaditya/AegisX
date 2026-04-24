"""AegisX Backend — FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import actions, analysis, incidents, metrics
from app.config import settings
from app.services.incident_engine import incident_engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — start/stop background services."""
    # Startup
    await incident_engine.start()
    print(f"🛡️  AegisX Backend v{settings.APP_VERSION} started")
    print(f"📡 Incident engine running (interval: {settings.INCIDENT_MIN_INTERVAL}-{settings.INCIDENT_MAX_INTERVAL}s)")

    yield

    # Shutdown
    await incident_engine.stop()
    print("🛡️  AegisX Backend stopped")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Autonomous AI Incident Analyst & Auto-Response Agent",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(incidents.router)
app.include_router(metrics.router)
app.include_router(actions.router)
app.include_router(analysis.router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "incident_count": len(incident_engine.incidents),
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.API_HOST,
        port=settings.API_PORT,
        reload=True,
    )

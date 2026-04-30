from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration via environment variables."""

    APP_NAME: str = "AegisX"
    APP_VERSION: str = "1.0.0"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:8000",
    ]

    # Incident simulation
    INCIDENT_MIN_INTERVAL: float = 5.0
    INCIDENT_MAX_INTERVAL: float = 15.0

    # Metrics polling
    METRICS_POLL_INTERVAL: float = 3.0

    # AI engine (for future real LLM integration)
    AI_PROVIDER: str = "simulated"  # "simulated" | "openai" | "gemini"
    AI_API_KEY: str = ""


settings = Settings()

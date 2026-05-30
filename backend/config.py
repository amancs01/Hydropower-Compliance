import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    """Central place for environment variables used by the backend."""

    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_translation_model: str = os.getenv("GROQ_TRANSLATION_MODEL", "llama-3.3-70b-versatile")
    groq_model: str = os.getenv("GROQ_MODEL", "deepseek-r1-distill-llama-70b")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./hydrocomply.db")
    allowed_origins: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:4173,http://127.0.0.1:4173",
    )
    allow_all_origins: bool = os.getenv("ALLOW_ALL_ORIGINS", "false").lower() == "true"
    demo_jwt_secret: str = os.getenv("DEMO_JWT_SECRET", "change-this-in-production")

    def cors_origins(self):
        if self.allow_all_origins:
            return ["*"]
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin.strip()]


settings = Settings()

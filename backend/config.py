import os

from dotenv import load_dotenv


load_dotenv()


class Settings:
    """Central place for environment variables used by the backend."""

    groq_api_key: str = os.getenv("GROQ_API_KEY", "")
    groq_translation_model: str = os.getenv("GROQ_TRANSLATION_MODEL", "llama-3.3-70b-versatile")
    groq_model: str = os.getenv("GROQ_MODEL", "deepseek-r1-distill-llama-70b")
    database_url: str = os.getenv("DATABASE_URL", "sqlite:///./hydrocomply.db")


settings = Settings()

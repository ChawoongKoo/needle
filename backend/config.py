from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_SECRET: str

    model_config = SettingsConfigDict(env_file=Path(__file__).parent / ".env")

settings = Settings() #type: ignore
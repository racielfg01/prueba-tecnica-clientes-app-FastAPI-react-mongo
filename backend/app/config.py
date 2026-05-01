from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    MONGO_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "innovasoft_db"
    API_BASE_URL: str = "https://localhost/api"
    
    model_config = ConfigDict(env_file=".env")

settings = Settings()
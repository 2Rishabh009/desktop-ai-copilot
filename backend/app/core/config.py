from pydantic_settings import BaseSettings, SettingsConfigDict
class Settings(BaseSettings):
    app_env:str='development'; secret_key:str='change-me'
    database_url:str='postgresql+asyncpg://copilot:copilot@localhost:5432/copilot'
    redis_url:str='redis://localhost:6379/0'
    ai_provider:str='generic_openai'; ai_base_url:str='https://api.openai.com/v1'; ai_api_key:str=''; ai_model:str=''; vision_model:str=''; stt_model:str=''; embedding_model:str=''
    model_config=SettingsConfigDict(env_file='.env', extra='ignore')
settings=Settings()

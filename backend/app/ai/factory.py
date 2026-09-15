from .generic_openai import GenericOpenAI
from app.core.config import settings
def get_ai():
 if settings.ai_provider=='generic_openai': return GenericOpenAI()
 raise ValueError(f'Unsupported AI_PROVIDER: {settings.ai_provider}')

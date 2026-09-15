from abc import ABC, abstractmethod
from typing import AsyncIterator
class AIProvider(ABC):
 @abstractmethod
 async def stream(self, messages:list[dict], model:str|None=None)->AsyncIterator[str]: ...
class VisionProvider(ABC):
 @abstractmethod
 async def stream_vision(self, question:str, image_data_url:str, history:list[dict])->AsyncIterator[str]: ...
class SpeechProvider(ABC):
 @abstractmethod
 async def transcribe(self, audio:bytes, filename:str)->str: ...
class EmbeddingProvider(ABC):
 @abstractmethod
 async def embed(self, texts:list[str])->list[list[float]]: ...
class SearchProvider(ABC):
 @abstractmethod
 async def search(self, query:str)->list[dict]: ...

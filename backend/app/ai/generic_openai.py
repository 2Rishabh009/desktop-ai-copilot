import json, httpx
from typing import AsyncIterator
from .interfaces import AIProvider,VisionProvider,SpeechProvider,EmbeddingProvider
from app.core.config import settings
class GenericOpenAI(AIProvider,VisionProvider,SpeechProvider,EmbeddingProvider):
 def __init__(self): self.base=settings.ai_base_url.rstrip('/'); self.headers={'Authorization':f'Bearer {settings.ai_api_key}'}
 async def stream(self,messages,model=None):
  payload={'model':model or settings.ai_model,'messages':messages,'stream':True}
  async with httpx.AsyncClient(timeout=None) as c:
   async with c.stream('POST',self.base+'/chat/completions',headers=self.headers,json=payload) as r:
    r.raise_for_status()
    async for line in r.aiter_lines():
     if not line.startswith('data:'): continue
     data=line[5:].strip()
     if data=='[DONE]': break
     obj=json.loads(data); delta=obj['choices'][0].get('delta',{}).get('content','')
     if delta: yield delta
 async def stream_vision(self,question,image_data_url,history):
  msgs=history+[{'role':'user','content':[{'type':'text','text':question},{'type':'image_url','image_url':{'url':image_data_url}}]}]
  async for x in self.stream(msgs,settings.vision_model or settings.ai_model): yield x
 async def transcribe(self,audio,filename):
  files={'file':(filename,audio)}; data={'model':settings.stt_model}
  async with httpx.AsyncClient() as c:
   r=await c.post(self.base+'/audio/transcriptions',headers=self.headers,data=data,files=files); r.raise_for_status(); return r.json()['text']
 async def embed(self,texts):
  async with httpx.AsyncClient() as c:
   r=await c.post(self.base+'/embeddings',headers=self.headers,json={'model':settings.embedding_model,'input':texts});r.raise_for_status();return [x['embedding'] for x in r.json()['data']]

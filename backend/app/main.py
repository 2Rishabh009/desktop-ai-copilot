from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
from app.api.documents import router as doc_router
from app.api.speech import router as speech_router
app=FastAPI(title='AI Copilot API',version='0.1.0')
app.add_middleware(CORSMiddleware,allow_origins=['http://localhost:5173'],allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
app.include_router(chat_router); app.include_router(auth_router); app.include_router(doc_router); app.include_router(speech_router)
@app.get('/health')
async def health(): return {'status':'ok'}

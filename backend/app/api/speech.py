from fastapi import APIRouter,UploadFile,File
from app.ai.factory import get_ai
router=APIRouter(prefix='/api/speech',tags=['speech'])
@router.post('/transcribe')
async def transcribe(file:UploadFile=File(...)):
 return {'text':await get_ai().transcribe(await file.read(),file.filename or 'audio.webm')}

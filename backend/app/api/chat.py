import json
from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.chat import ChatRequest
from app.ai.factory import get_ai
router=APIRouter(prefix='/api/chat',tags=['chat'])
@router.post('/stream')
async def stream_chat(req:ChatRequest):
 ai=get_ai()
 history=[{'role':'system','content':'You are a concise desktop AI copilot. Respect the user-controlled capture context. Do not claim to see anything unless an image was supplied.'},{'role':'user','content':req.message}]
 async def gen():
  iterator=ai.stream_vision(req.message,req.image_data_url,history[:-1]) if req.include_screenshot and req.image_data_url else ai.stream(history)
  async for delta in iterator: yield 'data: '+json.dumps({'delta':delta})+'\n\n'
  yield 'data: [DONE]\n\n'
 return StreamingResponse(gen(),media_type='text/event-stream',headers={'Cache-Control':'no-cache','X-Accel-Buffering':'no'})

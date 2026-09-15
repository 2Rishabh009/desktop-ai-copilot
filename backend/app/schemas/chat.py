from pydantic import BaseModel
class ChatRequest(BaseModel):
 message:str; conversation_id:int|None=None; image_data_url:str|None=None; include_screenshot:bool=False

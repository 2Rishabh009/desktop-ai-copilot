from datetime import datetime,timedelta,timezone
import jwt
from fastapi import APIRouter,HTTPException
from pydantic import BaseModel,EmailStr
from pwdlib import PasswordHash
from app.core.config import settings
router=APIRouter(prefix='/api/auth',tags=['auth']); ph=PasswordHash.recommended(); users={}
class Signup(BaseModel): email:EmailStr; password:str
class Login(Signup): pass
@router.post('/signup')
async def signup(x:Signup):
 if x.email in users: raise HTTPException(409,'User exists')
 users[x.email]=ph.hash(x.password); return {'ok':True}
@router.post('/login')
async def login(x:Login):
 if x.email not in users or not ph.verify(x.password,users[x.email]): raise HTTPException(401,'Invalid credentials')
 token=jwt.encode({'sub':x.email,'exp':datetime.now(timezone.utc)+timedelta(hours=12)},settings.secret_key,algorithm='HS256'); return {'access_token':token}

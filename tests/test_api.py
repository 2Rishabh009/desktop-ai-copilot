from fastapi.testclient import TestClient
from backend.app.main import app
client=TestClient(app)
def test_health(): assert client.get('/health').json()=={'status':'ok'}
def test_signup_login():
 r=client.post('/api/auth/signup',json={'email':'test@example.com','password':'strong-password'}); assert r.status_code==200
 r=client.post('/api/auth/login',json={'email':'test@example.com','password':'strong-password'}); assert r.status_code==200 and 'access_token' in r.json()

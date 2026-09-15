# Installation

## Prerequisites
- Node.js 20+
- Python 3.11+
- Docker Desktop
- On macOS: grant Screen Recording and Microphone permissions when prompted.

## Backend
```bash
cd backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Set AI_API_KEY and model names in .env.
cd ../infrastructure
docker compose up -d
cd ../backend
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

## Desktop
```bash
cd desktop
npm install
npm run dev
```

## Tests
```bash
cd backend
pytest
cd ../desktop
npm test
```

## Packaging
```bash
cd desktop
npm run package:win
npm run package:mac
```
macOS production distribution additionally needs Apple Developer signing, hardened runtime/entitlements and notarization. Windows production distribution should use Authenticode signing.

# News-Forge-AI

AI-powered content intelligence platform.

## Structure

- `backend/` — FastAPI backend (Python)
- `apps/web/` — Next.js 15 frontend (TypeScript)

## Quick start

### Backend

See [backend/README.md](backend/README.md).

### Frontend

```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

Frontend runs at http://localhost:3000 and connects to the API at http://127.0.0.1:8000.

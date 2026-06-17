# News Forge AI — Web Frontend

Next.js 15 frontend for the News Forge AI content intelligence platform.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zustand (client state)
- TanStack Query (server state shell)
- next-themes (light/dark)

## Getting started

```bash
cd apps/web
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://127.0.0.1:8000` | FastAPI backend URL |
| `NEXT_PUBLIC_API_V1_PREFIX` | `/api/v1` | API version prefix |

## Project structure

- `src/app/(marketing)/` — public pages (landing, features, pricing, about)
- `src/app/(app)/` — authenticated app shell and feature placeholders
- `src/components/` — UI primitives, layout, navigation, feedback
- `src/lib/api/` — API client and endpoint stubs (TODO until OpenAPI is available)
- `src/stores/` — Zustand stores for auth, UI, preferences, notifications

## Deployment

Deploy to Vercel with project root set to `apps/web`. Set `NEXT_PUBLIC_API_URL` to your production API URL and add the Vercel domain to backend `FRONTEND_ORIGIN`.

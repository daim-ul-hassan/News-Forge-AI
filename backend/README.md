# News Forge AI Backend

FastAPI backend foundation for News Forge AI.

This scaffold contains the application bootstrap, SQLAlchemy setup, Alembic setup, API module structure, placeholder service layers, placeholder repositories, placeholder AI orchestration modules and a reserved `creator_connections` model for future platform integrations.

Planned background work should use FastAPI `BackgroundTasks` until a separate queue architecture is intentionally introduced.

## Project Setup

Requirements:

- Python 3.11 or newer
- Python `venv` and `ensurepip` support
- PostgreSQL

Create and activate a virtual environment:

```powershell
cd NewsForgeAI\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
python -m pip install -e ".[dev]"
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

Update `DATABASE_URL` in `.env` if your local PostgreSQL connection differs from the default.

## Local Development

The backend package is under `app/`.

Current foundation modules:

- `app/main.py` creates the FastAPI application.
- `app/core/config.py` loads settings from environment variables.
- `app/core/database.py` creates the async SQLAlchemy engine and session factory.
- `app/api/v1/router.py` mounts placeholder route modules.
- `app/models/base.py` defines the SQLAlchemy declarative base.
- `migrations/env.py` wires Alembic to application metadata.

No business endpoints, AI agent implementations, subscription logic, voice features or image analysis features are implemented yet.

## Running FastAPI

```powershell
uvicorn app.main:app --reload
```

Default docs URL:

```text
http://127.0.0.1:8000/docs
```

## Running Alembic

Generate a migration:

```powershell
alembic revision --autogenerate -m "initial"
```

Apply migrations:

```powershell
alembic upgrade head
```

Check current database revision:

```powershell
alembic current
```

## Environment Variables

Required for this stage:

```text
DATABASE_URL
FRONTEND_ORIGIN
```

`DATABASE_URL` must use the async PostgreSQL SQLAlchemy driver format:

```text
postgresql+asyncpg://user:password@host:5432/database
```

`FRONTEND_ORIGIN` controls CORS origins. Multiple origins can be provided as a comma-separated string.

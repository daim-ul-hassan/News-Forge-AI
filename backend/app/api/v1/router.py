from fastapi import APIRouter

from app.api.v1.routes import (
    assistant,
    auth,
    content_studio,
    creator_connections,
    creator_profiles,
    dashboard,
    fact_check,
    image_analysis,
    news_feed,
    opportunities,
    research,
    subscriptions,
    trends,
    usage,
    users,
    voice,
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(
    creator_profiles.router,
    prefix="/creator-profile",
    tags=["creator-profile"],
)
api_router.include_router(
    creator_connections.router,
    prefix="/creator-connections",
    tags=["creator-connections"],
)
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
api_router.include_router(news_feed.router, prefix="/news-feed", tags=["news-feed"])
api_router.include_router(research.router, prefix="/research", tags=["research"])
api_router.include_router(trends.router, prefix="/trends", tags=["trends"])
api_router.include_router(opportunities.router, prefix="/opportunities", tags=["opportunities"])
api_router.include_router(
    content_studio.router,
    prefix="/content-briefs",
    tags=["content-studio"],
)
api_router.include_router(fact_check.router, prefix="/fact-checks", tags=["fact-check"])
api_router.include_router(assistant.router, prefix="/assistant", tags=["assistant"])
api_router.include_router(voice.router, prefix="/voice", tags=["voice"])
api_router.include_router(
    image_analysis.router,
    prefix="/image-analysis",
    tags=["image-analysis"],
)
api_router.include_router(
    subscriptions.router,
    prefix="/subscription",
    tags=["subscription"],
)
api_router.include_router(usage.router, prefix="/usage", tags=["usage"])

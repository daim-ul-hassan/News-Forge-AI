import { buildApiPath } from "../client";

export const API_PATHS = {
  AUTH: buildApiPath("/auth"),
  USERS: buildApiPath("/users"),
  CREATOR_PROFILE: buildApiPath("/creator-profile"),
  CREATOR_CONNECTIONS: buildApiPath("/creator-connections"),
  DASHBOARD: buildApiPath("/dashboard"),
  NEWS_FEED: buildApiPath("/news-feed"),
  RESEARCH: buildApiPath("/research"),
  TRENDS: buildApiPath("/trends"),
  OPPORTUNITIES: buildApiPath("/opportunities"),
  CONTENT_BRIEFS: buildApiPath("/content-briefs"),
  FACT_CHECKS: buildApiPath("/fact-checks"),
  ASSISTANT: buildApiPath("/assistant"),
  VOICE: buildApiPath("/voice"),
  IMAGE_ANALYSIS: buildApiPath("/image-analysis"),
  SUBSCRIPTION: buildApiPath("/subscription"),
  USAGE: buildApiPath("/usage"),
} as const;

export type ApiPathKey = keyof typeof API_PATHS;

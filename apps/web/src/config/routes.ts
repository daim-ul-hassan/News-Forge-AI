export const marketingRoutes = {
  home: "/",
  features: "/features",
  pricing: "/pricing",
  about: "/about",
} as const;

export const appRoutes = {
  dashboard: "/dashboard",
  trends: "/trends",
  newsFeed: "/news-feed",
  opportunities: "/opportunities",
  research: "/research",
  contentStudio: "/content-studio",
  assistant: "/assistant",
  creatorProfile: "/creator-profile",
  settings: "/settings",
} as const;

// TODO: /fact-check — reserved for future implementation
// TODO: /voice — reserved for future implementation
// TODO: /image-analysis — reserved for future implementation
// TODO: /login — reserved for future auth
// TODO: /signup — reserved for future auth

export type MarketingRoute = (typeof marketingRoutes)[keyof typeof marketingRoutes];
export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes];

export const allRoutes = {
  ...marketingRoutes,
  ...appRoutes,
} as const;

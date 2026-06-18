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

export const authRoutes = {
  signIn: "/sign-in",
  signUp: "/sign-up",
} as const;

export type AuthRoute = (typeof authRoutes)[keyof typeof authRoutes];


export type MarketingRoute = (typeof marketingRoutes)[keyof typeof marketingRoutes];
export type AppRoute = (typeof appRoutes)[keyof typeof appRoutes];

export const allRoutes = {
  ...marketingRoutes,
  ...appRoutes,
  ...authRoutes,
} as const;

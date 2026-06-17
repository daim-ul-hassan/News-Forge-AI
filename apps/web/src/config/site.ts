export const siteConfig = {
  name: "News Forge AI",
  description:
    "AI-powered content intelligence for creators, journalists and storytellers.",
  url: "https://newsforge.ai",
  links: {
    github: "https://github.com/newsforgeai",
    twitter: "https://twitter.com/newsforgeai",
  },
} as const;

export type SiteConfig = typeof siteConfig;

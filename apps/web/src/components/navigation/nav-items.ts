import {
  BarChart3,
  Bot,
  Compass,
  FileText,
  LayoutDashboard,
  Newspaper,
  Radar,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

import { appRoutes, marketingRoutes } from "@/config/routes";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
}

export const marketingNavItems: NavItem[] = [
  { title: "Features", href: marketingRoutes.features, icon: Compass },
  { title: "Pricing", href: marketingRoutes.pricing, icon: BarChart3 },
  { title: "About", href: marketingRoutes.about, icon: User },
];

export const appNavItems: NavItem[] = [
  { title: "Dashboard", href: appRoutes.dashboard, icon: LayoutDashboard, description: "Overview and insights" },
  { title: "Trends", href: appRoutes.trends, icon: Radar, description: "Trend radar" },
  { title: "News Feed", href: appRoutes.newsFeed, icon: Newspaper, description: "Curated news stream" },
  { title: "Opportunities", href: appRoutes.opportunities, icon: Compass, description: "Content opportunities" },
  { title: "Research", href: appRoutes.research, icon: FileText, description: "Research center" },
  { title: "Content Studio", href: appRoutes.contentStudio, icon: FileText, description: "Briefs and drafts" },
  { title: "AI Assistant", href: appRoutes.assistant, icon: Bot, description: "Conversational AI" },
  { title: "Creator Profile", href: appRoutes.creatorProfile, icon: User, description: "Your creator identity" },
  { title: "Settings", href: appRoutes.settings, icon: Settings, description: "Account preferences" },
];

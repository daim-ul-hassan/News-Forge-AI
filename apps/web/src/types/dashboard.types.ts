export interface DashboardMetrics {
  totalNotes: number;
  totalDrafts: number;
  totalBookmarks: number;
  aiMessagesCount: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: "note" | "draft" | "opportunity";
  timestamp: string;
  href: string;
}

export interface DashboardInsights {
  totalNotes: number;
  totalDrafts: number;
  totalBookmarks: number;
  lastActivityTimestamp: string | null;
  mostActiveCategory: string | null;
}

export interface ResearchNote {
  id: string;
  topic: string;
  content: string;
  tags: string[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface ResearchHistoryItem {
  id: string;
  query: string;
  timestamp: string; // ISO date string
}

export type SortOrder = "newest" | "oldest" | "alphabetical";

export interface ResearchState {
  notes: ResearchNote[];
  history: ResearchHistoryItem[];
  searchQuery: string;
  pinnedIds: string[];
  recentIds: string[];
  sortOrder: SortOrder;
}

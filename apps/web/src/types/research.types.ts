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

export interface ResearchState {
  notes: ResearchNote[];
  history: ResearchHistoryItem[];
  searchQuery: string;
}

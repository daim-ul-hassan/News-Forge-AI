export type DraftFormat = "article" | "script" | "thread" | "newsletter" | "brief";

export type DraftStatus = "draft" | "in-review" | "ready";

export interface Draft {
  id: string;
  title: string;
  content: string;
  format: DraftFormat;
  status: DraftStatus;
  wordCount: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  /** True when there are unsaved changes in the editor */
  isDirty?: boolean;
}

import type { Conversation, Message } from "@/types/assistant.types";
import type {
  AssistantConversationRow,
  AssistantMessageRow,
  ContentDraftRow,
  ResearchHistoryRow,
  ResearchNoteRow,
} from "@/types/database.types";
import type { Draft, DraftFormat, DraftStatus } from "@/types/drafts.types";
import type { ResearchHistoryItem, ResearchNote } from "@/types/research.types";

export function mapResearchNoteRow(row: ResearchNoteRow): ResearchNote {
  return {
    id: row.id,
    topic: row.topic,
    content: row.content,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapResearchNoteToRow(note: ResearchNote, userId: string): ResearchNoteRow {
  return {
    id: note.id,
    user_id: userId,
    topic: note.topic,
    content: note.content,
    tags: note.tags,
    created_at: note.createdAt,
    updated_at: note.updatedAt,
  };
}

export function mapResearchHistoryRow(row: ResearchHistoryRow): ResearchHistoryItem {
  return {
    id: row.id,
    query: row.query,
    timestamp: row.created_at,
  };
}

export function mapDraftRow(row: ContentDraftRow): Draft {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    format: row.format as DraftFormat,
    status: row.status as DraftStatus,
    wordCount: row.word_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapDraftToRow(draft: Draft, userId: string): ContentDraftRow {
  return {
    id: draft.id,
    user_id: userId,
    title: draft.title,
    content: draft.content,
    format: draft.format,
    status: draft.status,
    word_count: draft.wordCount,
    created_at: draft.createdAt,
    updated_at: draft.updatedAt,
  };
}

export function mapMessageRow(row: AssistantMessageRow): Message {
  return {
    id: row.id,
    role: row.role as Message["role"],
    content: row.content,
    timestamp: row.created_at,
  };
}

export function mapConversation(
  row: AssistantConversationRow,
  messages: AssistantMessageRow[],
): Conversation {
  return {
    id: row.id,
    messages: messages.map(mapMessageRow),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

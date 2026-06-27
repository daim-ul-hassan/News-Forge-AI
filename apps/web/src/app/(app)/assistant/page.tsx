"use client";

import { Bot, Clock, Send, Trash2, User, Search, MessageSquare, Edit2, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAssistantStore, type AssistantSortOrder } from "@/stores/assistant-store";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/60 bg-muted/40 text-muted-foreground">
        <Bot className="h-4 w-4" aria-hidden />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-bl-none border border-border/60 bg-card/60 px-4 py-3">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
      </div>
    </div>
  );
}

export default function AssistantPage() {
  const { 
    conversation, isTyping, syncReady, error, 
    sendMessage, clearConversation, clearError,
    history, searchQuery, sortOrder,
    loadConversation, deleteConversation, renameConversation,
    setSearchQuery, setSortOrder, filteredHistory
  } = useAssistantStore();
  
  const displayedHistory = filteredHistory();
  const user = useAuthStore((s) => s.user);
  const isLoading = !!user && !syncReady;
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Edit title state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const totalMessages = history.reduce((sum, c) => sum + c.messages.length, 0);
  const lastActive = history.length > 0 ? [...history].sort((a,b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0].updatedAt : null;

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;
    const message = input.trim();
    setInput("");
    clearError();
    await sendMessage(message);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  };

  const startEditing = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    setEditingId(id);
    setEditTitle(title || "Untitled");
  };

  const submitEdit = (id: string) => {
    if (editTitle.trim()) {
      renameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex min-w-0 flex-col overflow-x-hidden h-full">
      <PageHeader
        title="Assistant"
        description="Your AI-powered content research assistant."
        actions={
          <Button size="sm" onClick={clearConversation} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        }
      />

      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-xs text-destructive">
          <Bot className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      {/* Stats row */}
      {!isLoading && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Total Chats</h3>
            <p className="text-2xl font-semibold">{history.length}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Total Messages</h3>
            <p className="text-2xl font-semibold">{totalMessages}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-card/40 p-4">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Last Activity</h3>
            <p className="text-2xl font-semibold">{lastActive ? formatTime(lastActive) : "Never"}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
          <div className="flex flex-col gap-4">
            <Skeleton className="h-[400px] w-full rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr] flex-1 min-h-0 pb-6">
          {/* Sidebar */}
          <div className="space-y-6 flex flex-col min-h-0">
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                  placeholder="Search chats…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-muted/30 border-border/60"
                  aria-label="Search conversations"
                />
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as AssistantSortOrder)}
                className="w-full rounded-md border border-border/60 bg-muted/30 px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="Sort conversations"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="alphabetical">Alphabetical (A-Z)</option>
              </select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-[300px]">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 mb-2">
                History ({displayedHistory.length})
              </h2>
              {displayedHistory.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-6 text-center">
                  <MessageSquare className="mx-auto mb-2 h-6 w-6 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">No chats found.</p>
                </div>
              ) : (
                displayedHistory.map((c) => (
                  <div
                    key={c.id}
                    className={cn(
                      "group relative flex w-full flex-col items-start gap-1 rounded-lg border p-3 text-left transition-colors",
                      conversation.id === c.id
                        ? "border-primary/40 bg-primary/5"
                        : "border-border/60 bg-card/40 hover:border-border hover:bg-card/70"
                    )}
                    onClick={() => loadConversation(c.id)}
                  >
                    <div className="flex w-full items-start justify-between gap-2">
                      {editingId === c.id ? (
                        <input
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={() => submitEdit(c.id)}
                          onKeyDown={(e) => e.key === "Enter" && submitEdit(c.id)}
                          className="flex-1 bg-background text-xs outline-none border border-border px-1 py-0.5 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <span className="text-xs font-medium leading-snug line-clamp-2 pr-6">
                          {c.title || "Untitled Chat"}
                        </span>
                      )}
                      
                      {/* Hover actions */}
                      <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 flex items-center bg-card/90 rounded border border-border/50 shadow-sm backdrop-blur-sm">
                        <button
                          onClick={(e) => startEditing(e, c.id, c.title || "")}
                          className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted"
                          title="Rename"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteConversation(c.id); }}
                          className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-400/10"
                          title="Delete"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span>{c.messages.length} msgs</span>
                      <span>·</span>
                      <span>{new Date(c.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex flex-col min-h-[500px] max-h-[70vh] rounded-xl border border-border/60 bg-card/40 p-4 relative">
            <div className="absolute top-4 right-4 z-10">
              {conversation.messages.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); clearConversation(); }}
                  className="gap-1.5 h-8 text-xs bg-background/50 backdrop-blur-sm"
                  title="Clear current chat messages"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </Button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2 pt-8">
              {conversation.messages.length === 0 && !isTyping ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                    <Bot className="h-7 w-7" aria-hidden />
                  </div>
                  <p className="mt-4 font-semibold">Ask me anything</p>
                  <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
                    Research topics, brainstorm content angles, or explore your news feed with a question.
                  </p>
                </div>
              ) : (
                <>
                  {conversation.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex items-end gap-2",
                        msg.role === "user" ? "flex-row-reverse" : "flex-row",
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                          msg.role === "user"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : "border-border/60 bg-muted/40 text-muted-foreground",
                        )}
                      >
                        {msg.role === "user" ? (
                          <User className="h-3.5 w-3.5" aria-hidden />
                        ) : (
                          <Bot className="h-3.5 w-3.5" aria-hidden />
                        )}
                      </span>

                      <div
                        className={cn(
                          "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                          msg.role === "user"
                            ? "rounded-br-none border border-primary/20 bg-primary/10 text-foreground"
                            : "rounded-bl-none border border-border/60 bg-card/60 text-foreground",
                        )}
                      >
                        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        <span className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                          <Clock className="h-2.5 w-2.5" aria-hidden />
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {isTyping && <TypingIndicator />}
                </>
              )}
              <div ref={messagesEndRef} className="h-4" />
            </div>

            <form
              onSubmit={handleSend}
              className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-background p-2 shadow-sm"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question about trends, news, or content ideas…"
                disabled={isTyping}
                className="flex-1 border-none bg-transparent px-2 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                aria-label="Message input"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || isTyping}
                aria-label="Send message"
                className="h-9 w-9 shrink-0 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

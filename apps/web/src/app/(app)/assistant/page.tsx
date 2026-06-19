"use client";

import { Bot, Clock, Send, Trash2, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { LoadingState } from "@/components/feedback/loading-state";
import { PageHeader } from "@/components/feedback/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAssistantStore } from "@/stores/assistant-store";
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
  const { conversation, isTyping, syncReady, error, sendMessage, clearConversation, clearError } =
    useAssistantStore();
  const user = useAuthStore((s) => s.user);
  const isLoading = !!user && !syncReady;
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex min-w-0 flex-col overflow-x-hidden" style={{ height: "calc(100vh - var(--header-height) - 3rem)" }}>
      <PageHeader
        title="Assistant"
        description="Your AI-powered content research assistant."
        actions={
          conversation.messages.length > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearConversation}
              className="gap-1.5 text-muted-foreground hover:text-foreground"
              aria-label="Clear conversation"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </Button>
          ) : undefined
        }
      />

      {/* Error notice */}
      {error && (
        <div className="mt-6 flex items-center gap-2 rounded-md border border-destructive/20 bg-destructive/5 px-4 py-2.5 text-xs text-destructive">
          <Bot className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 flex-1">
          <LoadingState rows={3} />
        </div>
      ) : (
        <>
          {/* Messages */}
      <div className="mt-6 flex-1 overflow-y-auto space-y-4 pr-1">
        {conversation.messages.length === 0 && !isTyping ? (
          <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
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
                {/* Avatar */}
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

                {/* Bubble */}
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "rounded-br-none border border-primary/20 bg-primary/10 text-foreground"
                      : "rounded-bl-none border border-border/60 bg-card/60 text-foreground",
                  )}
                >
                  <p>{msg.content}</p>
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
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="mt-4 flex items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-2"
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
          className="h-9 w-9 shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
        </>
      )}
    </div>
  );
}

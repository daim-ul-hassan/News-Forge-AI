"use client";

import { useEffect, useRef } from "react";

import { assistantService } from "@/lib/supabase/services/assistant.service";
import { useAuthStore } from "@/stores/auth-store";
import { useAssistantStore } from "@/stores/assistant-store";

export function useAssistantSync() {
  const user = useAuthStore((s) => s.user);
  const hydrate = useAssistantStore((s) => s.hydrate);
  const setSyncReady = useAssistantStore((s) => s.setSyncReady);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!user) {
      readyRef.current = false;
      setSyncReady(false);
      return;
    }

    let cancelled = false;

    assistantService
      .fetchConversation(user.id)
      .then((conversation) => {
        if (cancelled) return;
        if (conversation) hydrate(conversation);
        readyRef.current = true;
        setSyncReady(true);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : (err && typeof err === "object" ? (err as { message?: string; details?: string }).message || (err as { message?: string; details?: string }).details || JSON.stringify(err) : String(err));
        console.warn(`[assistant-sync] Failed to load (falling back to local state): ${message}`);
        readyRef.current = true;
        setSyncReady(true);
      });

    return () => {
      cancelled = true;
      readyRef.current = false;
    };
  }, [user, hydrate, setSyncReady]);

  useEffect(() => {
    if (!user) return;

    return useAssistantStore.subscribe((state, prev) => {
      if (!readyRef.current) return;

      const prevMessages = prev.conversation.messages;
      const nextMessages = state.conversation.messages;

      if (prev.conversation.id !== state.conversation.id && nextMessages.length === 0) {
        assistantService.clearConversation(user.id, prev.conversation.id).catch((err) => {
          const msg = err instanceof Error ? err.message : (err && typeof err === "object" ? (err as { message?: string; details?: string }).message || (err as { message?: string; details?: string }).details || JSON.stringify(err) : String(err));
          console.warn(`[assistant-sync] Failed to clear conversation: ${msg}`);
        });
        return;
      }

      if (nextMessages.length > prevMessages.length) {
        const newMessages = nextMessages.slice(prevMessages.length);
        for (const message of newMessages) {
          assistantService
            .addMessage(user.id, state.conversation.id, message)
            .catch((err) => {
              const msg = err instanceof Error ? err.message : (err && typeof err === "object" ? (err as { message?: string; details?: string }).message || (err as { message?: string; details?: string }).details || JSON.stringify(err) : String(err));
              console.warn(`[assistant-sync] Failed to add message: ${msg}`);
            });
        }
      }

      if (nextMessages.length === prevMessages.length && nextMessages.length > 0) {
        const lastPrev = prevMessages[prevMessages.length - 1];
        const lastNext = nextMessages[nextMessages.length - 1];
        if (
          lastPrev &&
          lastNext &&
          lastPrev.id === lastNext.id &&
          lastPrev.content !== lastNext.content
        ) {
          assistantService
            .updateMessageContent(state.conversation.id, lastNext.id, lastNext.content)
            .catch((err) => {
              const msg = err instanceof Error ? err.message : (err && typeof err === "object" ? (err as { message?: string; details?: string }).message || (err as { message?: string; details?: string }).details || JSON.stringify(err) : String(err));
              console.warn(`[assistant-sync] Failed to update message: ${msg}`);
            });
        }
      }
    });
  }, [user]);
}

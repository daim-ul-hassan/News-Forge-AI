import { useMemo } from "react";
import { useResearchStore } from "@/stores/research-store";
import { useDraftsStore } from "@/stores/drafts-store";
import { useOpportunitiesStore } from "@/stores/opportunities-store";
import { useAssistantStore } from "@/stores/assistant-store";
import { useOpportunitiesData } from "@/hooks/use-opportunities-data";
import type { DashboardMetrics, ActivityItem, DashboardInsights } from "@/types/dashboard.types";

export function useDashboard() {
  const { notes } = useResearchStore();
  const { drafts } = useDraftsStore();
  const { savedIds } = useOpportunitiesStore();
  const { conversation } = useAssistantStore();
  const { opportunities, isLoading } = useOpportunitiesData();

  const metrics: DashboardMetrics = useMemo(() => {
    // Count assistant messages that are from the user, or count all. 
    // Let's count user messages to represent 'interactions'.
    const aiMessagesCount = conversation.messages.filter((m) => m.role === "user").length;
    return {
      totalNotes: notes.length,
      totalDrafts: drafts.length,
      totalBookmarks: savedIds.size,
      aiMessagesCount,
    };
  }, [notes.length, drafts.length, savedIds.size, conversation.messages]);

  const recentActivity: ActivityItem[] = useMemo(() => {
    const items: ActivityItem[] = [];

    notes.forEach((n) => {
      items.push({
        id: n.id,
        title: n.topic,
        type: "note",
        timestamp: n.updatedAt,
        href: `/research`,
      });
    });

    drafts.forEach((d) => {
      items.push({
        id: d.id,
        title: d.title || "Untitled Draft",
        type: "draft",
        timestamp: d.updatedAt,
        href: `/content-studio`,
      });
    });

    // Include saved opportunities in recent activity
    opportunities.forEach((o) => {
      if (savedIds.has(o.id)) {
        items.push({
          id: o.id,
          title: o.title,
          type: "opportunity",
          timestamp: o.createdAt, // We use createdAt since we don't track savedAt
          href: `/opportunities`,
        });
      }
    });

    return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  }, [notes, drafts, savedIds, opportunities]);

  const insights: DashboardInsights = useMemo(() => {
    const lastActivity = recentActivity.length > 0 ? recentActivity[0].timestamp : null;
    
    // Calculate most active category based on tags/topics
    const categoryCounts: Record<string, number> = {};
    
    notes.forEach(n => {
      n.tags?.forEach(tag => {
        categoryCounts[tag] = (categoryCounts[tag] || 0) + 1;
      });
    });
    
    let mostActiveCategory = null;
    let maxCount = 0;
    
    for (const [category, count] of Object.entries(categoryCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostActiveCategory = category;
      }
    }
    
    if (!mostActiveCategory) {
      if (notes.length > drafts.length) mostActiveCategory = "Research";
      else if (drafts.length > 0) mostActiveCategory = "Drafting";
    }

    return {
      totalNotes: notes.length,
      totalDrafts: drafts.length,
      totalBookmarks: savedIds.size,
      lastActivityTimestamp: lastActivity,
      mostActiveCategory,
    };
  }, [notes, drafts, savedIds.size, recentActivity]);

  return { metrics, recentActivity, insights, isLoading };
}

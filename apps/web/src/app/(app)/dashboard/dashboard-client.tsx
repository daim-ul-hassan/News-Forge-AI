"use client";

import Link from "next/link";
import { Activity, BarChart3, FileText, Radar, ArrowRight, Plus, Zap, Bot } from "lucide-react";

import { DashboardGreeting } from "@/components/dashboard/dashboard-greeting";
import { StatCard } from "@/components/data-display/stat-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboard } from "@/hooks/use-dashboard";
import { useEffect, useState } from "react";

export function DashboardClient() {
  const { metrics, recentActivity, insights, recommendedOpportunities, personalizedInsights, isLoading } = useDashboard();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString();
  };

  return (
    <div className="min-w-0 space-y-8 overflow-x-hidden">
      <DashboardGreeting />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {!mounted ? (
          <>
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
            <Skeleton className="h-[120px] rounded-xl" />
          </>
        ) : (
          <>
            <StatCard title="Research Notes" value={metrics.totalNotes.toString()} description="Saved research items" trend={metrics.totalNotes > 0 ? "+ Active" : "No notes yet"} className="bg-card/70" />
            <StatCard title="Drafts" value={metrics.totalDrafts.toString()} description="Content items in pipeline" trend={metrics.totalDrafts > 0 ? "+ Active" : "No drafts yet"} className="bg-card/70" />
            <StatCard title="Saved Opportunities" value={metrics.totalBookmarks.toString()} description="Bookmarked angles" trend={metrics.totalBookmarks > 0 ? "+ Active" : "No bookmarks yet"} className="bg-card/70" />
            <StatCard title="AI Interactions" value={metrics.aiMessagesCount.toString()} description="Assistant messages" trend={metrics.aiMessagesCount > 0 ? "+ Active" : "No interactions yet"} className="bg-card/70" />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_350px]">
        <div className="space-y-4">
          {/* Recent Activity */}
          <div className="app-panel rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="h-5 w-5 text-secondary" aria-hidden />
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            
            {(!mounted || isLoading) ? (
              <div className="space-y-4">
                <Skeleton className="h-[80px] w-full rounded-lg" />
                <Skeleton className="h-[80px] w-full rounded-lg" />
                <Skeleton className="h-[80px] w-full rounded-lg" />
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center rounded-lg border border-dashed border-border/50 bg-background/20">
                <Activity className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground font-medium">No recent activity yet</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Your recent research notes, drafts, and saved opportunities will appear here. Start creating content to see your timeline.
                </p>
                <Button variant="outline" className="mt-6" asChild>
                  <Link href="/research"><Plus className="mr-2 h-4 w-4" /> Start Research</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/35 p-4 transition-colors hover:bg-muted/40">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {item.type === "note" && <FileText className="h-5 w-5" />}
                        {item.type === "draft" && <FileText className="h-5 w-5" />}
                        {item.type === "opportunity" && <Zap className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1">{item.title}</p>
                        <p className="text-xs text-muted-foreground capitalize">{item.type} • {formatDate(item.timestamp)}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={item.href}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recommended Opportunities */}
          <div className="app-panel rounded-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="text-lg font-semibold">Recommended Opportunities</h2>
            </div>
            {(!mounted || isLoading) ? (
              <div className="space-y-3">
                <Skeleton className="h-[60px] w-full rounded-lg" />
                <Skeleton className="h-[60px] w-full rounded-lg" />
              </div>
            ) : recommendedOpportunities.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recommendations available.</p>
            ) : (
              <div className="space-y-3">
                {recommendedOpportunities.map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between rounded-lg border border-border/70 bg-background/35 p-4 hover:bg-muted/40 transition-colors">
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{opp.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 capitalize">{opp.category} • Score: {opp.score}</p>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link href="/opportunities">
                        View <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions & Insights */}
        <div className="space-y-4">
          <div className="app-panel rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/research">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Research Note
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/content-studio">
                  <FileText className="mr-2 h-4 w-4" />
                  Create Draft
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/opportunities">
                  <Zap className="mr-2 h-4 w-4" />
                  Open Opportunities
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/trends">
                  <Radar className="mr-2 h-4 w-4" />
                  Open Trend Radar
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/assistant">
                  <Bot className="mr-2 h-4 w-4" />
                  Open AI Assistant
                </Link>
              </Button>
            </div>
          </div>

          <div className="app-panel rounded-lg p-6">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 className="h-5 w-5 text-secondary" aria-hidden />
              <h2 className="text-lg font-semibold">Insights</h2>
            </div>
            {!mounted ? (
              <div className="space-y-4">
                <Skeleton className="h-[20px] w-full" />
                <Skeleton className="h-[20px] w-full" />
                <Skeleton className="h-[20px] w-full" />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Most active category</span>
                  <span className="font-medium text-sm">{insights.mostActiveCategory || "N/A"}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Niche Focus</span>
                  <span className="font-medium text-sm">{personalizedInsights.nicheFocus}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Target Platform</span>
                  <span className="font-medium text-sm">{personalizedInsights.targetPlatform}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Recommended Topic</span>
                  <span className="font-medium text-sm">{personalizedInsights.recommendedTopic}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Total items</span>
                  <span className="font-medium text-sm">{insights.totalNotes + insights.totalDrafts + insights.totalBookmarks}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Last activity</span>
                  <span className="font-medium text-sm">
                    {insights.lastActivityTimestamp 
                      ? formatDate(insights.lastActivityTimestamp) 
                      : "None"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

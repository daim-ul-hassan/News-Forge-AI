"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/use-profile";
import { scoreOpportunityForProfile } from "@/lib/personalization";
import { MOCK_OPPORTUNITIES } from "@/lib/data/opportunities.data";
import type { Opportunity } from "@/types/opportunities.types";

/**
 * Hook for fetching opportunities data.
 * Fetches from /api/opportunities with automatic fallback to mock data.
 */
export function useOpportunitiesData() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useProfile();

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/opportunities?limit=8");
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        if (data.opportunities && Array.isArray(data.opportunities)) {
          let ops = data.opportunities;
          if (profile) {
            ops = ops
              .map((o: Opportunity) => ({ ...o, score: scoreOpportunityForProfile(o, profile) }))
              .sort((x: Opportunity, y: Opportunity) => y.score - x.score);
          }
          setOpportunities(ops);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch opportunities";
        console.error("Error fetching opportunities:", message);
        setError(message);
        // Fallback to mock data
        setOpportunities(MOCK_OPPORTUNITIES);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOpportunities();
  }, [profile]);

  // Re-rank existing opportunities when profile changes
  useEffect(() => {
    if (!profile) return;
    setOpportunities((prev) =>
      prev
        .map((o: Opportunity) => ({ ...o, score: scoreOpportunityForProfile(o, profile) }))
        .sort((x: Opportunity, y: Opportunity) => y.score - x.score),
    );
  }, [profile]);

  return { opportunities, isLoading, error };
}

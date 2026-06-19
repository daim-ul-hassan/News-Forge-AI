"use client";

import { useEffect, useState } from "react";
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
          setOpportunities(data.opportunities);
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
  }, []);

  return { opportunities, isLoading, error };
}

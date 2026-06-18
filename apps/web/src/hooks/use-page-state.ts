"use client";

import { useEffect, useState } from "react";

/**
 * Simulates an initial loading state on client mount.
 * Replace `simulateMs` with a real loading state from your async hook/query
 * once API integration is complete.
 *
 * Usage:
 *   const { isLoading } = usePageState();
 *   if (isLoading) return <LoadingView />;
 */
export function usePageState(simulateMs = 400) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace this timeout with real async data fetching state
    const t = setTimeout(() => setIsLoading(false), simulateMs);
    return () => clearTimeout(t);
  }, [simulateMs]);

  const triggerError = (msg: string) => setError(msg);
  const clearError = () => setError(null);

  return { isLoading, error, triggerError, clearError };
}

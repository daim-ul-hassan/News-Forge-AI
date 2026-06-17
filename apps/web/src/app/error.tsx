"use client";

import Link from "next/link";

import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";
import { appRoutes, marketingRoutes } from "@/config/routes";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <ErrorState
          title="Something went wrong"
          description={error.message || "An unexpected error occurred."}
          onRetry={reset}
        />
        <div className="flex justify-center gap-2">
          <Button variant="outline" asChild>
            <Link href={marketingRoutes.home}>Go home</Link>
          </Button>
          <Button asChild>
            <Link href={appRoutes.dashboard}>Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

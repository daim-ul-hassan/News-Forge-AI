import Link from "next/link";

import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";
import { appRoutes, marketingRoutes } from "@/config/routes";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <EmptyState
          title="Page not found"
          description="The page you are looking for does not exist or has been moved."
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

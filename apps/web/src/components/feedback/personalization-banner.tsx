"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/use-profile";

export function PersonalizationBanner() {
  const router = useRouter();
  const { completionPercentage, isProfileComplete } = useProfile();

  if (isProfileComplete) {
    return null;
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg p-4 sm:p-5 mb-6">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
            🚀 Complete your Creator Profile to unlock personalized insights, recommendations, and content tailored to you.
          </p>
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="text-xs text-amber-800 dark:text-amber-200">
              Profile Completion: {completionPercentage}%
            </div>
            <div className="w-32 bg-amber-200 dark:bg-amber-900/50 rounded-full h-1.5">
              <div
                className="bg-amber-600 dark:bg-amber-500 h-1.5 rounded-full transition-all"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <Button
              size="sm"
              variant="default"
              onClick={() => router.push("/creator-profile")}
              className="sm:ml-auto"
            >
              Complete Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

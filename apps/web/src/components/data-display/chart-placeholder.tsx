import { BarChart3 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ChartPlaceholderProps {
  title?: string;
  className?: string;
}

export function ChartPlaceholder({ title = "Chart — TODO", className }: ChartPlaceholderProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-lg border border-dashed border-border bg-muted/20 p-6",
        className,
      )}
    >
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <BarChart3 className="h-4 w-4" aria-hidden />
        <span>{title}</span>
      </div>
      <div className="flex h-40 items-end justify-between gap-2">
        {[40, 65, 45, 80, 55, 70, 50].map((height, index) => (
          <Skeleton key={index} className="w-full" style={{ height: `${height}%` }} />
        ))}
      </div>
    </div>
  );
}

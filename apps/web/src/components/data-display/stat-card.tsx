import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: string;
  className?: string;
}

export function StatCard({ title, value, description, trend, className }: StatCardProps) {
  return (
    <div className={cn("forge-glow forge-glow-hover rounded-lg border border-border bg-card p-6", className)}>
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-2 font-mono text-3xl font-semibold">{value}</p>
      {(description || trend) && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          {trend && <span className="text-secondary">{trend}</span>}
          {description && <span>{description}</span>}
        </div>
      )}
    </div>
  );
}

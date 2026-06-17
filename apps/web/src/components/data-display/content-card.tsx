import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  description?: string;
  meta?: string;
  footer?: React.ReactNode;
  className?: string;
}

export function ContentCard({ title, description, meta, footer, className }: ContentCardProps) {
  return (
    <article className={cn("forge-glow-hover rounded-lg border border-border bg-card p-5 transition-colors", className)}>
      {meta && <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{meta}</p>}
      <h3 className="mt-1 font-mono text-base font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      {footer && <div className="mt-4 border-t border-border pt-4">{footer}</div>}
    </article>
  );
}

import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  description?: string;
  meta?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function ContentCard({ title, description, meta, footer, children, className }: ContentCardProps) {
  return (
    <article
      className={cn(
        "forge-glow-hover rounded-lg border border-border bg-card p-5 transition-colors",
        className,
      )}
    >
      {children}
      {meta && <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{meta}</p>}
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      {description && <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>}
      {footer && <div className="mt-5 border-t border-border/70 pt-4">{footer}</div>}
    </article>
  );
}

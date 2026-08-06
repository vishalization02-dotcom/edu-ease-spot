import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center px-6 py-14 text-center animate-fade-in",
        className,
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
        <div className="relative grid h-16 w-16 place-items-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </div>
      </div>

      <h3 className="text-base font-semibold tracking-tight">{title}</h3>

      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
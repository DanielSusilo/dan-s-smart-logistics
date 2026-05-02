import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "info" | "muted";

export function StatusBadge({
  children,
  variant = "muted",
  className,
  dot = true,
}: {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  dot?: boolean;
}) {
  const styles: Record<Variant, string> = {
    success: "bg-success-soft text-success ring-success/20",
    warning: "bg-warning-soft text-warning ring-warning/20",
    info: "bg-primary/5 text-primary ring-primary/15",
    muted: "bg-muted text-muted-foreground ring-border",
  };
  const dotColor: Record<Variant, string> = {
    success: "bg-success",
    warning: "bg-warning",
    info: "bg-primary",
    muted: "bg-muted-foreground/60",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[variant],
        className,
      )}
    >
      {dot && <span className={cn("h-1.5 w-1.5 rounded-full", dotColor[variant])} />}
      {children}
    </span>
  );
}
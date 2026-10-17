import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "muted" | "accent" | "amber";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default:
    "bg-foreground/[0.06] text-foreground/70",
  muted:
    "bg-muted text-muted-foreground",
  accent:
    "bg-accent-soft text-accent",
  amber:
    "bg-amber-soft text-amber",
};

export function Badge({
  variant = "default",
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium tracking-[-0.01em] px-2 py-0.5 rounded-md",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
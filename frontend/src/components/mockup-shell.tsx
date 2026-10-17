import { cn } from "@/lib/utils";

interface MockupShellProps {
  children: React.ReactNode;
  className?: string;
}

export function MockupShell({ children, className }: MockupShellProps) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-surface shadow-lg md:shadow-xl",
        "overflow-hidden",
        className
      )}
    >
      <div className="flex items-center gap-1.5 px-4 h-9 border-b border-border bg-surface-elevated/60">
        <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-foreground/15" />
        <span className="ml-3 text-[11px] font-mono text-muted-foreground">
          braindock.app
        </span>
      </div>
      <div className="flex">{children}</div>
    </div>
  );
}
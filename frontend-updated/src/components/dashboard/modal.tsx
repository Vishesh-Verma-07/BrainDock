"use client";

import { useEffect, useId } from "react";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  eyebrow,
  title,
  accent,
  onClose,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  onClose: () => void;
  children: React.ReactNode;
  /** Pinned below the scrollable body, so the primary action never scrolls out of view. */
  footer?: React.ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-foreground/40 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[calc(100dvh-1rem)] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-border bg-surface shadow-xl sm:max-h-[calc(100dvh-3rem)] sm:rounded-2xl"
      >
        <header className="relative shrink-0 px-6 pb-4 pt-6 sm:px-8 sm:pt-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground sm:right-5 sm:top-5"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
          <h2 id={titleId} className="mt-3 pr-8 text-2xl font-bold tracking-[-0.03em] sm:text-3xl">
            {title} <span className="text-gradient">{accent}</span>
          </h2>
        </header>
        <div
          className={cn(
            "scroll-thin min-h-0 flex-1 overflow-y-auto px-6 pt-1 sm:px-8",
            footer ? "pb-4" : "pb-6 sm:pb-8",
          )}
        >
          {children}
        </div>
        {footer && (
          <div className="shrink-0 border-t border-border bg-surface px-6 py-4 sm:px-8">{footer}</div>
        )}
      </section>
    </div>
  );
}

export const fieldClass =
  "w-full rounded-md border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none focus-visible:!outline-none focus:border-foreground/40 focus:ring-2 focus:ring-accent/30";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between text-sm font-medium">
        {label}
        {hint && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

/** Select with a custom chevron, so the arrow sits a consistent distance from the edge in every browser. */
export function Select({
  className,
  wrapperClassName,
  autoWidth = false,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { wrapperClassName?: string; autoWidth?: boolean }) {
  return (
    <span className={cn("relative block", autoWidth && "inline-block", wrapperClassName)}>
      <select
        {...props}
        className={cn(autoWidth ? fieldClass.replace("w-full", "w-auto") : fieldClass, "appearance-none pr-10", className)}
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </span>
  );
}

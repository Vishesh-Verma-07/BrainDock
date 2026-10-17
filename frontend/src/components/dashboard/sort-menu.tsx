"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownNarrowWide, ArrowUpNarrowWide, Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortOrder = "newest" | "oldest";

const options: { id: SortOrder; label: string; icon: typeof Check }[] = [
  { id: "newest", label: "Newest first", icon: ArrowDownNarrowWide },
  { id: "oldest", label: "Oldest first", icon: ArrowUpNarrowWide },
];

export function SortMenu({
  value,
  onChange,
}: {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.id === value) ?? options[0];
  const CurrentIcon = current.icon;

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Sort: ${current.label}`}
        className={cn(
          "flex h-9 items-center gap-2 rounded-lg border bg-surface pl-3 pr-2.5 text-sm font-medium shadow-sm transition-colors",
          open ? "border-foreground/30 ring-2 ring-accent/20" : "border-border hover:border-foreground/20",
        )}
      >
        <CurrentIcon className="h-4 w-4 text-muted-foreground" aria-hidden />
        {current.label}
        <ChevronDown
          className={cn("h-4 w-4 text-muted-foreground transition-transform duration-200", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Sort order"
          className="absolute right-0 top-full z-30 mt-2 w-48 rounded-xl border border-border bg-surface p-1.5 shadow-xl"
        >
          <p className="px-3 pb-1 pt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Sort by date
          </p>
          {options.map((option) => {
            const Icon = option.icon;
            const selected = option.id === value;
            return (
              <button
                key={option.id}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => {
                  onChange(option.id);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm",
                  selected ? "bg-accent-soft font-medium" : "hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
                <span className="flex-1">{option.label}</span>
                {selected && <Check className="h-4 w-4 text-accent" aria-hidden />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

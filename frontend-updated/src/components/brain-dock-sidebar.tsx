"use client";

import { motion } from "framer-motion";
import { Brain, Plus, Star, Folder, Users, FileText, Video, StickyNote } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";

const sidebarNav = [
  { label: "All saved", icon: Brain, count: 24, active: true },
  { label: "Favorites", icon: Star },
  { label: "Collections", icon: Folder },
  { label: "Shared", icon: Users },
];

const collections = [
  { label: "Design", count: 12, color: "bg-accent" },
  { label: "Learning", count: 24, color: "bg-amber" },
  { label: "Ideas", count: 8, color: "bg-muted-foreground" },
  { label: "Research", count: 17, color: "bg-foreground/60" },
];

export function BrainDockSidebar() {
  return (
    <aside className="w-full lg:w-[260px] shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-surface">
      <div className="p-4 pb-4">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-foreground text-background shadow-sm">
            <Brain className="w-4.5 h-4.5" aria-hidden />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[-0.01em] leading-none">
              Brain Dock
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Personal workspace
            </span>
          </div>
        </div>

        <button className="group w-full flex items-center justify-center gap-2 h-10 rounded-xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground hover:border-foreground/20 transition-all duration-250 cursor-pointer">
          <Plus className="w-4 h-4 transition-transform duration-250 ease-out-expo group-hover:scale-110 group-hover:rotate-90" />
          New item
        </button>
      </div>

      <nav className="px-3 pb-5 space-y-0.5">
        {sidebarNav.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className={cn(
                "group w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer",
                item.active
                  ? "bg-foreground/[0.06] text-foreground shadow-[inset_0_0_0_1px_var(--border)]"
                  : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors duration-200",
                  item.active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )}
                aria-hidden
              />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count && (
                <span className="text-[11px] tabular-nums text-muted-foreground/50 group-hover:text-muted-foreground transition-colors duration-200">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-4 pt-4 pb-5 border-t border-border">
        <div className="flex items-center justify-between mb-3 px-0.5">
          <p className="text-[10px] font-semibold tracking-[0.1em] uppercase text-muted-foreground/60">
            Collections
          </p>
          <button className="text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer">
            <Plus className="w-3 h-3 transition-transform duration-200 hover:rotate-90" />
          </button>
        </div>
        <div className="space-y-0.5">
          {collections.map((c) => (
            <button
              key={c.label}
              className="group w-full flex items-center gap-2.5 px-2 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/[0.03] rounded-xl transition-all duration-200 cursor-pointer"
            >
              <span
                className={cn(
                  "w-2.5 h-2.5 rounded-full shrink-0 transition-transform duration-250 ease-out-expo",
                  c.color,
                  "group-hover:scale-125"
                )}
              />
              <span className="flex-1 text-left">{c.label}</span>
              <span className="text-[11px] tabular-nums text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors duration-200">
                {c.count}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

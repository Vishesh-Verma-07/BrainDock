"use client";

import { motion } from "framer-motion";
import { Play, StickyNote, FileText, Bookmark, Sparkles, Search } from "lucide-react";
import { staggerContainer, staggerItem, easeOutExpo } from "@/lib/motion";

const displayItems = [
  {
    id: 1,
    type: "article" as const,
    title: "Designing better interfaces",
    domain: "medium.com",
    time: "2h ago",
    tags: ["design", "inspiration"],
    icon: FileText,
  },
  {
    id: 2,
    type: "video" as const,
    title: "The future of creative tools",
    channel: "Fireship",
    time: "Yesterday",
    tags: ["ai", "creativity"],
    icon: Play,
  },
  {
    id: 3,
    type: "note" as const,
    title: "Things worth exploring",
    time: "Jun 12",
    tags: ["ideas"],
    icon: StickyNote,
  },
];

const displayStats = [
  { label: "Saved", value: 24 },
  { label: "Notes", value: 6 },
  { label: "Videos", value: 9 },
];

export function BrainDockMain() {
  return (
    <main className="@container flex-1 min-w-0 bg-surface">
      <div className="p-5 @lg:p-6">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mb-5">
          <span>Workspace</span>
          <span>/</span>
          <span className="text-foreground font-semibold">All saved</span>
        </div>

        <div className="flex flex-col @lg:flex-row @lg:items-end justify-between gap-5 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-[-0.02em]">
              Good morning, Alex
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Here is everything you have saved, in one place.
            </p>
          </div>
          <div className="flex items-center gap-6">
            {displayStats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-bold tabular-nums leading-none">
                  {s.value}
                </p>
                <p className="text-[10px] text-muted-foreground mt-1 font-medium tracking-[0.04em] uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            readOnly
            placeholder="Ask your Brain Dock..."
            className="w-full h-11 pl-11 pr-11 text-sm rounded-xl border border-border bg-surface-elevated/60 text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent/50 focus:bg-surface transition-all duration-200 cursor-text"
          />
          <Sparkles className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent/70" />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <p className="text-[10px] font-semibold tracking-[0.08em] uppercase text-muted-foreground">
              Recently added
            </p>
            <button className="text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer group">
              <span className="group-hover:translate-x-0.5 inline-block transition-transform duration-200">View all</span>
            </button>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 @xl:grid-cols-2 gap-3"
          >
            {displayItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  variants={staggerItem}
                  whileHover={{ y: -2, borderColor: "var(--foreground)", boxShadow: "var(--shadow-md)", transition: { duration: 0.25, ease: easeOutExpo } }}
                  className="group relative flex gap-3.5 p-4 rounded-xl border border-border bg-surface-elevated/40 hover:bg-surface-elevated cursor-pointer"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-foreground/[0.05] text-muted-foreground shrink-0 group-hover:bg-accent/10 group-hover:text-accent transition-all duration-250">
                    <Icon className="w-4.5 h-4.5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[9px] font-semibold tracking-[0.06em] uppercase text-muted-foreground/60">
                        {item.type}
                      </span>
                      <span className="text-[9px] text-muted-foreground/30">·</span>
                      <span className="text-[9px] text-muted-foreground/70">{item.time}</span>
                    </div>
                    <p className="text-sm font-semibold tracking-[-0.01em] truncate group-hover:text-foreground transition-colors duration-200">
                      {item.title}
                    </p>
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground group-hover:bg-accent-soft group-hover:text-accent transition-colors duration-250"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity self-center p-1.5 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg hover:bg-foreground/[0.05]">
                    <Bookmark className="w-4 h-4" aria-hidden />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
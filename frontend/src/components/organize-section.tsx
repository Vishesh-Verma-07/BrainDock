"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Tag, Layout, Check, FileText, Video, StickyNote, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";

type Kind = "article" | "video" | "note";

const kindIcon = { article: FileText, video: Video, note: StickyNote } as const;

const collections = [
  {
    label: "Design",
    dot: "bg-accent",
    items: [
      { title: "Designing better interfaces", kind: "article" as Kind, tags: ["design", "inspiration"] },
      { title: "Design systems explained", kind: "article" as Kind, tags: ["design", "research"] },
      { title: "My thoughts on reusable UI", kind: "note" as Kind, tags: ["design", "ideas"] },
    ],
  },
  {
    label: "Learning",
    dot: "bg-amber",
    items: [
      { title: "How neural networks learn", kind: "video" as Kind, tags: ["ai", "research"] },
      { title: "Notes: spaced repetition", kind: "note" as Kind, tags: ["ideas", "research"] },
      { title: "The future of creativity", kind: "video" as Kind, tags: ["ai", "creativity"] },
    ],
  },
  {
    label: "Ideas",
    dot: "bg-foreground/40",
    items: [
      { title: "Things worth exploring", kind: "note" as Kind, tags: ["ideas", "creativity"] },
      { title: "A calmer inbox, sketched", kind: "note" as Kind, tags: ["ideas", "design"] },
    ],
  },
  {
    label: "Research",
    dot: "bg-muted-foreground",
    items: [
      { title: "Semantic search primer", kind: "article" as Kind, tags: ["ai", "research"] },
      { title: "Interviews: how people save links", kind: "video" as Kind, tags: ["research", "inspiration"] },
    ],
  },
];

const allTags = ["design", "inspiration", "ai", "creativity", "ideas", "research"];

export function OrganizeSection() {
  const [active, setActive] = useState(0);
  const [tag, setTag] = useState<string | null>(null);

  const current = collections[active];
  const visible = tag ? current.items.filter((i) => i.tags.includes(tag)) : current.items;

  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="pointer-events-none absolute -right-40 top-1/4 h-[420px] w-[420px] animate-aurora rounded-full bg-amber/10 blur-[120px]" aria-hidden />
      <Container className="relative">
        <SectionHeader
          eyebrow="Organize"
          title="Keep your knowledge organized without thinking about it."
          description="Collections, tags, and structure that follows your thinking — not the other way around. Try it."
        />

        <div className="grid items-start gap-6 lg:grid-cols-[340px_1fr] lg:gap-8">
          {/* Collections */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Collections</p>
            <div className="space-y-2.5" role="tablist" aria-label="Collections">
              {collections.map((c, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={c.label}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    className={cn(
                      "relative flex w-full cursor-pointer items-center gap-4 rounded-2xl border p-4 text-left",
                      isActive ? "border-accent/40 shadow-sm" : "border-border bg-surface hover:border-foreground/20 hover:shadow-md"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="collection-active"
                        className="absolute inset-0 rounded-2xl bg-accent-soft/60"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className={cn("relative h-3 w-3 shrink-0 rounded-full", c.dot)} />
                    <span className="relative flex-1 text-sm font-semibold">{c.label}</span>
                    <span className="relative text-xs font-medium tabular-nums text-muted-foreground">{c.items.length} items</span>
                    <span
                      className={cn(
                        "relative flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-all duration-300",
                        isActive ? "scale-100 opacity-100" : "scale-50 opacity-0"
                      )}
                    >
                      <Check className="h-4 w-4" aria-hidden />
                    </span>
                  </button>
                );
              })}
            </div>

            <SpotlightCard className="mt-6 rounded-2xl border border-border bg-surface-elevated/50 p-5">
              <div className="mb-2 flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <Layout className="h-4 w-4" />
                </div>
                <span className="text-sm font-semibold">Auto-organized</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Brain Dock suggests collections and tags as you save, so structure builds itself over time.
              </p>
            </SpotlightCard>
          </div>

          {/* Explorer */}
          <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
            <div className="flex flex-wrap items-center gap-2 border-b border-border bg-surface-elevated/60 px-5 py-4">
              <span className="mr-1 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Filter by tag</span>
              {allTags.map((t) => {
                const on = tag === t;
                return (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setTag(on ? null : t)}
                    className={cn(
                      "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium",
                      on
                        ? "border-accent bg-accent text-accent-foreground shadow-sm"
                        : "border-border bg-surface text-muted-foreground hover:border-foreground/25 hover:text-foreground"
                    )}
                  >
                    <Tag className="h-3 w-3" />
                    {t}
                    {on && <X className="h-3 w-3" />}
                  </button>
                );
              })}
            </div>

            <div className="min-h-[300px] p-3 sm:p-4">
              <div className="mb-2 flex items-center gap-2 px-2 pt-1">
                <span className={cn("h-2.5 w-2.5 rounded-full", current.dot)} />
                <span className="text-sm font-semibold">{current.label}</span>
                <span className="text-xs text-muted-foreground">
                  · {visible.length} {visible.length === 1 ? "item" : "items"}
                  {tag && ` tagged “${tag}”`}
                </span>
              </div>

              <AnimatePresence mode="popLayout">
                {visible.map((item) => {
                  const Icon = kindIcon[item.kind];
                  return (
                    <motion.div
                      layout
                      key={`${current.label}-${item.title}`}
                      initial={{ opacity: 0, y: 12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: easeOutExpo }}
                      className="group flex cursor-pointer items-center gap-4 rounded-xl p-3 hover:bg-surface-elevated"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-foreground/[0.05] text-muted-foreground transition-colors group-hover:bg-accent/10 group-hover:text-accent">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{item.title}</p>
                        <p className="text-[11px] capitalize text-muted-foreground">{item.kind}</p>
                      </div>
                      <div className="hidden gap-1.5 sm:flex">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className={cn(
                              "rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors",
                              t === tag ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                            )}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {visible.length === 0 && (
                <p className="px-3 py-12 text-center text-sm text-muted-foreground">
                  Nothing in “{current.label}” has that tag yet — try another collection.
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

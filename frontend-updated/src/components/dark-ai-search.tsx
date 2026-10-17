"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Typewriter } from "@/components/typewriter";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { Brain, FileText, StickyNote, Video, Sparkles, Search, Quote, Check, Link2 } from "lucide-react";
import { easeOutExpo } from "@/lib/motion";

type Item = { title: string; label: string; icon: typeof FileText; match: boolean };

// The library the question is asked against. `match` items are the answer's sources.
const library: Item[] = [
  { title: "Design systems explained", label: "Article", icon: FileText, match: true },
  { title: "Best pasta recipes", label: "Link", icon: Link2, match: false },
  { title: "My thoughts on reusable UI", label: "Note", icon: StickyNote, match: true },
  { title: "Marathon training plan", label: "Note", icon: StickyNote, match: false },
  { title: "Building scalable interfaces", label: "Video", icon: Video, match: true },
  { title: "Travel ideas for spring", label: "Note", icon: StickyNote, match: false },
  { title: "How neural networks learn", label: "Video", icon: Video, match: false },
];

export function DarkAISearch() {
  const [asked, setAsked] = useState(false);

  return (
    <section className="py-14 md:py-20 bg-[#141210] text-foreground relative overflow-hidden" data-theme="dark">
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_100%,var(--accent-soft),transparent_70%)] pointer-events-none"
        aria-hidden
      />
      <div className="pointer-events-none absolute -top-24 right-[-8%] h-[420px] w-[420px] animate-aurora rounded-full bg-accent/15 blur-[120px]" aria-hidden />
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-40" aria-hidden />
      <Container className="relative">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-medium tracking-[0.12em] uppercase text-accent mb-4">Find it naturally</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-foreground">
            Don&#39;t remember where you saved it.
            <br />
            <span className="text-muted-foreground">Just ask.</span>
          </h2>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Question + answer */}
          <div className="lg:min-h-[26rem]">
            <div className="relative mb-6">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-accent/25 to-transparent blur-xl opacity-70" />
              <div className="relative flex items-center gap-3 px-5 py-4 rounded-xl border border-border bg-surface shadow-lg">
                <Search className="w-5 h-5 shrink-0 text-muted-foreground" />
                <span className="text-base text-foreground font-medium">
                  <Typewriter text="What did I save about design systems?" onDone={() => setAsked(true)} />
                </span>
                <Sparkles className="w-5 h-5 shrink-0 text-accent ml-auto" />
              </div>
            </div>

            <AnimatePresence>
              {asked && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: easeOutExpo }}
                  className="rounded-xl border border-border bg-surface shadow-lg overflow-hidden"
                >
                  <div className="flex items-center gap-2 px-4 h-11 border-b border-border bg-surface-elevated/60">
                    <Search className="w-4 h-4 text-muted-foreground" />
                    <span className="text-[11px] font-mono text-muted-foreground">Searching your Brain Dock...</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-5">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-soft">
                        <Brain className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-medium text-accent">AI answer</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">Grounded in 3 saved items</span>
                    </div>

                    <div className="relative pl-5 border-l-2 border-accent/40">
                      <Quote className="absolute -left-2.5 top-0 w-3.5 h-3.5 text-accent bg-surface" />
                      <p className="text-base leading-relaxed text-foreground/85">
                        Your saved material focuses on <span className="font-medium text-foreground">consistency</span>,{" "}
                        <span className="font-medium text-foreground">reusable components</span>, and{" "}
                        <span className="font-medium text-foreground">clear design tokens</span>. The strongest thread is
                        building systems that stay coherent as a product grows.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="mt-4 text-xs text-muted-foreground">
              Answers come from your own saved knowledge — not the open web.
            </p>
          </div>

          {/* The library being searched */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
            <div className="flex items-center justify-between gap-2 px-4 h-11 border-b border-border bg-surface-elevated/60">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs font-medium text-foreground">Your Brain Dock</span>
              </div>
              <span className="text-[11px] text-muted-foreground tabular-nums">
                {asked ? "3 of 7 matched" : "7 saved items"}
              </span>
            </div>

            <div className="relative space-y-1.5 p-3">
              {/* Scan line while the question is being asked */}
              {!asked && (
                <motion.div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-3 z-10 h-px bg-gradient-to-r from-transparent via-accent to-transparent"
                  initial={{ top: "4%" }}
                  animate={{ top: ["4%", "96%", "4%"] }}
                  transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {library.map((item, i) => {
                const Icon = item.icon;
                const hit = asked && item.match;
                const dim = asked && !item.match;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.06, ease: easeOutExpo }}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-500",
                        hit
                          ? "border-accent/60 bg-accent/10"
                          : "border-transparent bg-foreground/[0.03]",
                        dim && "opacity-35"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-colors duration-500",
                          hit ? "bg-accent text-accent-foreground" : "bg-foreground/[0.06] text-muted-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground">{item.label}</p>
                      </div>
                      <AnimatePresence>
                        {hit && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.6 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 400, damping: 20 }}
                            className="flex items-center gap-1 rounded-md bg-accent px-2 py-1 text-[10px] font-semibold text-accent-foreground"
                          >
                            <Check className="h-3 w-3" /> Source
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

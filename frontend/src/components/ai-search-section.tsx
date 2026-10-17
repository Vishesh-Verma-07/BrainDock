"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Brain, FileText, StickyNote, Video, Search, Sparkles, Quote, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const sources = [
  { label: "Article", title: "Design systems explained", icon: FileText, accent: "text-accent bg-accent-soft" },
  { label: "Note", title: "My thoughts on reusable UI", icon: StickyNote, accent: "text-amber bg-amber-soft" },
  { label: "Video", title: "Building scalable interfaces", icon: Video, accent: "text-muted-foreground bg-muted" },
];

export function AISearchSection() {
  return (
    <section className="py-24 md:py-32 bg-surface-elevated/40 border-y border-border">
      <Container>
        <SectionHeader
          eyebrow="Find it naturally"
          title="Don't remember where you saved it."
          description="Just ask."
          narrow
        />

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-b from-accent/20 to-transparent blur-xl opacity-60" />
              <div className="relative flex items-center gap-3 px-5 py-3.5 rounded-xl border border-border bg-surface shadow-sm">
                <Search className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground font-medium">
                  What did I save about design systems?
                </span>
                <Sparkles className="w-4 h-4 text-accent ml-1" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-surface shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 h-10 border-b border-border bg-surface-elevated/60">
              <Search className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px] font-mono text-muted-foreground">
                Searching your Brain Dock...
              </span>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-soft">
                  <Brain className="w-3.5 h-3.5 text-accent" />
                  <span className="text-xs font-medium text-accent">AI answer</span>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Grounded in 6 saved items
                </span>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative pl-5 border-l-2 border-accent/30 mb-5"
              >
                <Quote className="absolute -left-2.5 top-0 w-3.5 h-3.5 text-accent bg-surface" />
                <p className="text-sm md:text-base leading-relaxed text-foreground/85">
                  Your saved material focuses on{" "}
                  <span className="font-medium text-foreground">consistency</span>,{" "}
                  <span className="font-medium text-foreground">reusable components</span>, and{" "}
                  <span className="font-medium text-foreground">clear design tokens</span>. The strongest thread is building
                  systems that stay coherent as a product grows.
                </p>
              </motion.div>

              <p className="text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-3">
                Sources
              </p>
              <div className="space-y-2">
                {sources.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: i * 0.08 }}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-foreground/[0.03] transition-colors cursor-default"
                    >
                      <span className={cn("flex items-center justify-center w-7 h-7 rounded-md", s.accent)}>
                        <Icon className="w-3.5 h-3.5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium truncate">{s.title}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-4">
            Answers come from your own saved knowledge — not the open web.
          </p>
        </div>
      </Container>
    </section>
  );
}
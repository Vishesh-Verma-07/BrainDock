"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Save, FolderSearch, MessageCircleQuestion, Link2, Tag, Search, Sparkles } from "lucide-react";
import { staggerContainer, staggerItem, viewportOnce, easeOutExpo } from "@/lib/motion";

const steps = [
  {
    number: "01",
    title: "Save what inspires you",
    description: "Links, notes, videos, and ideas — anything worth keeping, in one calm flow.",
    icon: Save,
    visual: (
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-elevated/60 px-3 py-2.5 text-xs text-muted-foreground">
        <Link2 className="h-3.5 w-3.5 text-accent" />
        <span className="truncate">example.com/great-read</span>
        <span className="ml-auto rounded-md bg-accent-soft px-2 py-0.5 font-semibold text-accent">Saved</span>
      </div>
    ),
  },
  {
    number: "02",
    title: "Make it yours",
    description: "Add tags and collections that fit how you think. Brain Dock keeps everything structured.",
    icon: FolderSearch,
    visual: (
      <div className="flex flex-wrap items-center gap-1.5">
        {["design", "ux", "inspiration"].map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-elevated/60 px-2.5 py-1.5 text-xs font-medium text-muted-foreground">
            <Tag className="h-3 w-3 text-amber" />
            {t}
          </span>
        ))}
      </div>
    ),
  },
  {
    number: "03",
    title: "Ask, discover, connect",
    description: "Search naturally and let AI surface the right ideas from everything you have saved.",
    icon: MessageCircleQuestion,
    visual: (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-elevated/60 px-3 py-2 text-xs text-foreground">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          Best ideas on onboarding?
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-accent-soft/70 px-3 py-2 text-xs text-accent">
          <Sparkles className="h-3.5 w-3.5" />
          3 saved items match
        </div>
      </div>
    ),
  },
];

export function WorkflowSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20" id="how">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.06] blur-[120px]" aria-hidden />
      <Container className="relative">
        <SectionHeader
          eyebrow="Workflow"
          title="From saved to useful in seconds."
          description="Brain Dock does the heavy lifting so you can focus on thinking, creating, and growing."
        />

        <div className="relative">
          {/* Connecting line that draws itself across the cards (desktop) */}
          <svg className="pointer-events-none absolute left-0 right-0 top-[3.1rem] hidden h-2 w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 2" aria-hidden>
            <motion.line
              x1="16" y1="1" x2="84" y2="1"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeDasharray="1 3"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={viewportOnce}
              transition={{ duration: 1.4, delay: 0.4, ease: easeOutExpo }}
            />
          </svg>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="relative grid gap-6 md:grid-cols-3 lg:gap-8"
          >
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.number} variants={staggerItem} whileHover={{ y: -6, transition: { duration: 0.25, ease: easeOutExpo } }}>
                  <SpotlightCard className="group h-full rounded-2xl border border-border bg-surface p-8 transition-[box-shadow,border-color] duration-300 hover:border-foreground/15 hover:shadow-xl">
                    <div className="mb-8 flex items-center justify-between">
                      <span
                        className="text-6xl font-bold leading-none tracking-[-0.04em] text-transparent transition-all duration-300 group-hover:[-webkit-text-stroke-color:var(--accent)]"
                        style={{ WebkitTextStroke: "1.5px var(--border)" }}
                      >
                        {step.number}
                      </span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-foreground text-background shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                        <Icon className="h-6 w-6" aria-hidden />
                      </span>
                    </div>
                    <h3 className="mb-2.5 text-xl font-bold tracking-[-0.01em]">{step.title}</h3>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                    <div aria-hidden>{step.visual}</div>
                  </SpotlightCard>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

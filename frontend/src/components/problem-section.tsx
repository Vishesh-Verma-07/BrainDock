"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { easeOutExpo, viewportOnce } from "@/lib/motion";

const scattered = [
  { label: "Bookmarks", x: 2, y: 4, r: -6 },
  { label: "YouTube", x: 40, y: 0, r: 4 },
  { label: "Notes", x: 74, y: 14, r: -3 },
  { label: "Screenshots", x: 8, y: 36, r: 5 },
  { label: "Documents", x: 46, y: 34, r: -4 },
  { label: "Random links", x: 70, y: 56, r: 6 },
  { label: "Chat messages", x: 18, y: 68, r: -2 },
];

export function ProblemSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-50" aria-hidden />
      <Container className="relative">
        <div className="max-w-3xl mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <p className="text-xs font-medium tracking-[0.14em] uppercase text-muted-foreground mb-5">
              The problem
            </p>
          </motion.div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.02]">
            Your bookmarks were built for saving.
            <br />
            <span className="text-muted-foreground font-medium">Not for remembering.</span>
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground max-w-xl">
            Knowledge lives in a dozen places. None of them talk to each other.
            When you need something, you cannot find it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mb-6">
              Scattered everywhere
            </p>
            <div className="relative h-64 mb-6">
              {scattered.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
                  whileInView={{ opacity: 1, scale: 1, rotate: item.r }}
                  viewport={viewportOnce}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: easeOutExpo }}
                  whileHover={{ scale: 1.06, rotate: 0, y: -2, transition: { duration: 0.2, ease: easeOutExpo } }}
                  className="absolute px-4 py-2.5 rounded-xl border border-border bg-surface shadow-sm text-sm font-medium text-muted-foreground cursor-pointer hover:shadow-md"
                  style={{ left: `${item.x}%`, top: `${item.y}%` }}
                >
                  <span className="block animate-float" style={{ ["--r" as string]: `${item.r}deg`, animationDelay: `${i * -1.3}s` }}>
                    {item.label}
                  </span>
                </motion.div>
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
              Each place saves differently. None of them help you find things
              later. So you stop saving what matters.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.7, ease: easeOutExpo }}
            className="relative"
          >
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-foreground text-background shadow-sm">
                  <span className="text-xl">✦</span>
                </div>
                <div>
                  <p className="text-lg font-bold tracking-[-0.01em]">
                    Brain Dock
                  </p>
                  <p className="text-xs text-muted-foreground">
                    One calm place
                  </p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-foreground/80 mb-6">
                Everything you want to remember, connected and waiting for you
                when you need it.
              </p>
              <div className="mb-6 space-y-2">
                {[
                  { t: "Designing better interfaces", k: "Article" },
                  { t: "Building scalable interfaces", k: "Video" },
                  { t: "Thoughts on reusable UI", k: "Note" },
                ].map((r, idx) => (
                  <motion.div
                    key={r.t}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOnce}
                    transition={{ delay: 0.3 + idx * 0.12, duration: 0.5, ease: easeOutExpo }}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated/60 px-3.5 py-2.5 text-sm"
                  >
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span className="flex-1 truncate font-medium">{r.t}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{r.k}</span>
                  </motion.div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-accent bg-accent-soft px-2.5 py-1 rounded-md">
                  Organized
                </span>
                <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-amber bg-amber-soft px-2.5 py-1 rounded-md">
                  Searchable
                </span>
                <span className="text-[10px] font-semibold tracking-[0.08em] uppercase text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
                  Askable
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
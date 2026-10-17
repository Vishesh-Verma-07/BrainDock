"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { AnchorButton } from "@/components/ui/button";
import { Tilt } from "@/components/ui/tilt";
import { BrainDockMockup } from "@/components/brain-dock-mockup";
import { Play, Sparkles, Link2, StickyNote, Video, Check } from "lucide-react";
import { fadeUp } from "@/lib/motion";

const floaters = [
  { icon: Link2, label: "Saved 12 links", className: "-left-10 top-[62%] hidden xl:flex", delay: 0.6, r: "-4deg", anim: "animate-float" },
  { icon: Video, label: "Video indexed", className: "-right-8 top-[7%] hidden xl:flex", delay: 0.75, r: "3deg", anim: "animate-float-slow" },
  { icon: Sparkles, label: "Answer ready", className: "-bottom-4 right-14 hidden md:flex", delay: 0.9, r: "2deg", anim: "animate-float" },
];

const proof = ["Save in seconds", "Ask in plain language", "Private by default"];

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-10 md:pt-32 md:pb-14">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="bg-dots absolute inset-0" />
        <div className="absolute -top-32 left-[8%] h-[480px] w-[480px] animate-aurora rounded-full bg-accent/25 blur-[110px]" />
        <div className="absolute top-10 right-[4%] h-[420px] w-[420px] animate-aurora rounded-full bg-amber/20 blur-[110px] [animation-delay:-8s]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col items-start">
            <motion.div initial="hidden" animate="show" variants={fadeUp}>
              <span className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/80 py-1.5 pl-2 pr-4 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                </span>
                Your knowledge, finally useful
              </span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="max-w-2xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4rem]"
            >
              Everything you want to remember.
              <br className="hidden sm:block" />{" "}
              <span className="text-gradient font-semibold">Exactly when you need it.</span>
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
            >
              A calm place for your links, notes, ideas, and videos — organized so you can find and connect what matters later.
            </motion.p>

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <AnchorButton href="/signup" size="lg" showArrow className="btn-shine shadow-lg shadow-foreground/10">
                Build your Brain Dock
              </AnchorButton>
              <AnchorButton href="#how" variant="secondary" size="lg" icon={Play}>
                See how it works
              </AnchorButton>
            </motion.div>

            <motion.ul
              initial="hidden"
              animate="show"
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.32 }}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground"
            >
              {proof.map((p) => (
                <li key={p} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-accent" aria-hidden />
                  {p}
                </li>
              ))}
            </motion.ul>
          </div>

          <div className="relative">
            <Tilt>
              <BrainDockMockup immediate />
            </Tilt>

            {floaters.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  style={{ animationDelay: `${f.delay}s` }}
                  className={`chip-in absolute z-10 ${f.className}`}
                >
                  <div
                    style={{ ["--r" as string]: f.r }}
                    className={`${f.anim} flex items-center gap-2.5 rounded-2xl border border-border bg-surface/90 px-3.5 py-2.5 text-xs font-semibold shadow-lg backdrop-blur`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
                      <Icon className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    {f.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

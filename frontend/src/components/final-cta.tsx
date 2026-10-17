"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { Brain, Check, FileText, Link2, StickyNote, Video, ArrowRight } from "lucide-react";
import { easeOutExpo } from "@/lib/motion";

const proof = ["Save in seconds", "Ask in plain language", "Private by default"];

type Card = { title: string; kind: string; icon: typeof FileText; tag: string };

const rowA: Card[] = [
  { title: "Designing better interfaces", kind: "Article", icon: FileText, tag: "design" },
  { title: "Building scalable interfaces", kind: "Video", icon: Video, tag: "ui" },
  { title: "Thoughts on reusable UI", kind: "Note", icon: StickyNote, tag: "ideas" },
  { title: "Semantic search primer", kind: "Article", icon: FileText, tag: "ai" },
  { title: "reading-list.notion.site", kind: "Link", icon: Link2, tag: "research" },
  { title: "How neural networks learn", kind: "Video", icon: Video, tag: "ai" },
];

const rowB: Card[] = [
  { title: "A calmer inbox, sketched", kind: "Note", icon: StickyNote, tag: "ideas" },
  { title: "Interviews: how people save links", kind: "Video", icon: Video, tag: "research" },
  { title: "Design systems explained", kind: "Article", icon: FileText, tag: "design" },
  { title: "Notes: spaced repetition", kind: "Note", icon: StickyNote, tag: "learning" },
  { title: "The future of creativity", kind: "Video", icon: Video, tag: "creativity" },
  { title: "article-on-typography.com", kind: "Link", icon: Link2, tag: "design" },
];

function CardRow({ items, reverse }: { items: Card[]; reverse?: boolean }) {
  const loop = [...items, ...items];
  return (
    <div className="marquee-mask">
      <div className={`marquee-track flex w-max gap-3 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {loop.map((c, i) => {
          const Icon = c.icon;
          return (
            <div
              key={i}
              aria-hidden
              className="flex w-64 shrink-0 items-center gap-3 rounded-xl border border-border bg-surface/80 px-3.5 py-3 backdrop-blur"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/[0.07] text-muted-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-foreground">{c.title}</p>
                <p className="text-[10px] text-muted-foreground">{c.kind}</p>
              </div>
              <span className="rounded-md bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">{c.tag}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FinalCTA() {
  return (
    <section className="py-14 md:py-20">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: easeOutExpo }}
          data-theme="dark"
          className="relative overflow-hidden rounded-[32px] border border-border bg-[#141210] text-foreground"
        >
          {/* Ambient background */}
          <div className="pointer-events-none absolute inset-0" aria-hidden>
            <div className="bg-dots absolute inset-0 opacity-60" />
            <div className="absolute -left-24 -top-32 h-[420px] w-[420px] animate-aurora rounded-full bg-accent/25 blur-[110px]" />
            <div className="absolute -bottom-40 -right-24 h-[420px] w-[420px] animate-aurora rounded-full bg-amber/20 blur-[110px] [animation-delay:-9s]" />
          </div>

          <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-10 pt-14 text-center md:pt-20">
            <motion.span
              whileHover={{ scale: 1.08, rotate: -4 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className="mb-7 inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-2xl bg-foreground text-background shadow-lg"
            >
              <Brain className="h-6 w-6" aria-hidden />
            </motion.span>

            <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl md:text-6xl lg:text-7xl">
              Give your thoughts
              <br />
              <span className="text-gradient font-semibold">a place to grow.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
              Build a calmer, smarter place for everything worth remembering.
            </p>

            {/* Paste-a-link pill: plain GET form, so it works with no JS */}
            <form
              action="/signup"
              method="get"
              className="mt-9 flex w-full max-w-xl items-center gap-2 rounded-full border border-border bg-surface/90 p-1.5 pl-5 shadow-lg backdrop-blur transition-[border-color,box-shadow] duration-300 focus-within:border-accent/60 focus-within:ring-4 focus-within:ring-accent/15"
            >
              <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
              <label htmlFor="cta-url" className="sr-only">
                Paste a link to save your first item
              </label>
              <input
                id="cta-url"
                name="url"
                type="url"
                placeholder="Paste a link to start…"
                className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                className="btn-shine group flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
              >
                <span className="hidden sm:inline">Create your Brain Dock</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
              </button>
            </form>

            <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {proof.map((p) => (
                <li key={p} className="flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-accent" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>

            <a
              href="#how"
              className="mt-5 text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              or see how it works
            </a>
          </div>

          {/* Stream of saved items */}
          <div className="relative space-y-3 pb-10" aria-hidden>
            <CardRow items={rowA} />
            <CardRow items={rowB} reverse />
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

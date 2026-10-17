"use client";

import { motion } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Brain, Folder, Video, Search, Shield, Sparkles, Tag, Zap, Globe, Link2, StickyNote, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";

type Feature = {
  icon: typeof Brain;
  title: string;
  description: string;
  span: string;
  accent: string;
  visual?: "save" | "ask";
};

// 4-column bento on lg: rows pack exactly (2x2 + 2x1 + 1+1, then 1+1+2, then 2+2).
const features: Feature[] = [
  {
    icon: Brain,
    title: "Save anything",
    description: "Links, notes, articles, and YouTube videos — one place, no friction.",
    span: "lg:col-span-2 lg:row-span-2",
    accent: "bg-accent text-accent-foreground",
    visual: "save",
  },
  {
    icon: Search,
    title: "Ask naturally",
    description: "Plain-language questions get answers grounded in your saved knowledge.",
    span: "lg:col-span-2",
    accent: "bg-amber text-background",
    visual: "ask",
  },
  {
    icon: Folder,
    title: "Collections",
    description: "Group knowledge by topic. Structure follows your thinking.",
    span: "",
    accent: "bg-foreground text-background",
  },
  {
    icon: Tag,
    title: "Tags",
    description: "Layered tags make related ideas findable from any angle.",
    span: "",
    accent: "bg-foreground text-background",
  },
  {
    icon: Video,
    title: "YouTube knowledge",
    description: "Save videos and ask questions about their content later.",
    span: "",
    accent: "bg-accent-soft text-accent",
  },
  {
    icon: Shield,
    title: "Yours only",
    description: "Your knowledge stays private. Share only what you choose.",
    span: "",
    accent: "bg-amber-soft text-amber",
  },
  {
    icon: Sparkles,
    title: "Connections form",
    description: "The more you save, the more Brain Dock can relate ideas.",
    span: "lg:col-span-2",
    accent: "bg-accent-soft text-accent",
  },
  {
    icon: Zap,
    title: "Fast retrieval",
    description: "Find what you saved in seconds, not minutes of tab-hopping.",
    span: "lg:col-span-2",
    accent: "bg-amber-soft text-amber",
  },
  {
    icon: Globe,
    title: "Always available",
    description: "Access your knowledge from anywhere. It is synced and ready.",
    span: "md:col-span-2 lg:col-span-2",
    accent: "bg-accent-soft text-accent",
  },
];

function SaveVisual() {
  const chips = [
    { icon: Link2, label: "article-on-design.com" },
    { icon: Video, label: "Building scalable interfaces" },
    { icon: StickyNote, label: "Thoughts on reusable UI" },
    { icon: FileText, label: "Research notes.pdf" },
  ];
  return (
    <div className="mt-8 space-y-2.5" aria-hidden>
      {chips.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: easeOutExpo }}
            style={{ marginLeft: `${i * 14}px` }}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface-elevated/60 px-3.5 py-2.5 text-sm font-medium text-muted-foreground"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <Icon className="h-3.5 w-3.5" />
            </span>
            {c.label}
            <span className="ml-auto text-[10px] font-semibold uppercase tracking-wider text-accent">Saved</span>
          </motion.div>
        );
      })}
    </div>
  );
}

function AskVisual() {
  return (
    <div className="mt-6 space-y-2" aria-hidden>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-surface-elevated/60 px-3.5 py-2.5 text-sm text-foreground">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        What did I save about onboarding?
      </div>
      <div className="rounded-xl border border-amber/30 bg-amber-soft/60 px-3.5 py-2.5 text-xs leading-relaxed text-foreground/80">
        You saved 3 items: a teardown article, a video on first-run flows, and your own note on checklists.
      </div>
    </div>
  );
}

export function FeatureGrid() {
  return (
    <section className="py-14 md:py-20" id="features">
      <Container>
        <SectionHeader
          eyebrow="Capabilities"
          title="Built for the way you actually think."
          description="Everything you need to turn scattered knowledge into something useful."
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                whileHover={{ y: -4 }}
                className={cn("rounded-2xl", f.span)}
              >
                <SpotlightCard className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-7 transition-[box-shadow,border-color] duration-200 hover:border-foreground/15 hover:shadow-lg">
                  <span
                    className={cn(
                      "mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110",
                      f.accent
                    )}
                  >
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mb-2 text-lg font-bold tracking-[-0.01em]">{f.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  {f.visual === "save" && <SaveVisual />}
                  {f.visual === "ask" && <AskVisual />}
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

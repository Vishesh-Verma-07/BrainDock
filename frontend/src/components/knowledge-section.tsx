"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";
import { Palette, Cpu, Lightbulb, Network, ArrowUpRight } from "lucide-react";
import { staggerContainer, staggerItem, viewportOnce, easeOutExpo } from "@/lib/motion";

// Coordinates are percentages of a fixed 1000x620 canvas, so the SVG edges and the
// HTML nodes share one coordinate system at every width.
const W = 1000;
const H = 620;

type ClusterKey = "design" | "ai" | "ideas";

const clusters: Record<
  ClusterKey,
  { name: string; icon: typeof Palette; stroke: string; fill: string; soft: string; text: string; ring: string; dot: string; border: string }
> = {
  design: {
    name: "Design",
    icon: Palette,
    stroke: "var(--accent)",
    fill: "bg-accent text-accent-foreground",
    soft: "bg-accent-soft",
    text: "text-accent",
    ring: "ring-accent/25",
    dot: "bg-accent",
    border: "border-accent/40",
  },
  ai: {
    name: "AI",
    icon: Cpu,
    stroke: "var(--amber)",
    fill: "bg-amber text-background",
    soft: "bg-amber-soft",
    text: "text-amber",
    ring: "ring-amber/25",
    dot: "bg-amber",
    border: "border-amber/40",
  },
  ideas: {
    name: "Ideas",
    icon: Lightbulb,
    stroke: "var(--foreground)",
    fill: "bg-foreground text-background",
    soft: "bg-foreground/[0.07]",
    text: "text-foreground",
    ring: "ring-foreground/15",
    dot: "bg-foreground",
    border: "border-foreground/30",
  },
};

type GraphNode = { label: string; x: number; y: number; cluster: ClusterKey; hub?: boolean; items: number };

const nodes: GraphNode[] = [
  { label: "Design", x: 20, y: 30, cluster: "design", hub: true, items: 12 },
  { label: "Design systems", x: 42, y: 11, cluster: "design", items: 5 },
  { label: "Typography", x: 40, y: 44, cluster: "design", items: 3 },
  { label: "UI principles", x: 11, y: 62, cluster: "design", items: 4 },
  { label: "Color", x: 5, y: 12, cluster: "design", items: 2 },
  { label: "AI", x: 76, y: 28, cluster: "ai", hub: true, items: 17 },
  { label: "Creative tools", x: 90, y: 52, cluster: "ai", items: 6 },
  { label: "Interfaces", x: 62, y: 54, cluster: "ai", items: 4 },
  { label: "Agents", x: 88, y: 9, cluster: "ai", items: 5 },
  { label: "Ideas", x: 48, y: 78, cluster: "ideas", hub: true, items: 8 },
  { label: "Product concepts", x: 21, y: 90, cluster: "ideas", items: 3 },
  { label: "Research", x: 78, y: 88, cluster: "ideas", items: 6 },
];

// [from, to]; the last three join different clusters.
const edges: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [5, 6], [5, 7], [5, 8],
  [9, 10], [9, 11],
  [1, 7], // Design systems ↔ Interfaces
  [2, 9], // Typography ↔ Ideas
  [11, 5], // Research ↔ AI
];

function curve(a: number, b: number) {
  const x1 = (nodes[a].x / 100) * W;
  const y1 = (nodes[a].y / 100) * H;
  const x2 = (nodes[b].x / 100) * W;
  const y2 = (nodes[b].y / 100) * H;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const k = 0.1;
  return `M ${x1} ${y1} Q ${mx - dy * k} ${my + dx * k} ${x2} ${y2}`;
}

const neighbors = (i: number) =>
  edges.filter(([a, b]) => a === i || b === i).map(([a, b]) => (a === i ? b : a));

export function KnowledgeSection() {
  const [active, setActive] = useState(0);

  const node = nodes[active];
  const c = clusters[node.cluster];
  const linked = neighbors(active);
  const ActiveIcon = c.icon;

  return (
    <section className="py-14 md:py-20 overflow-hidden">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-12">
          {/* Copy + live detail card */}
          <div>
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">Connections</p>
            <h2 className="text-3xl font-semibold leading-[1.1] tracking-[-0.02em] md:text-4xl lg:text-5xl">
              The more you save, the more connections you can make.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Brain Dock quietly maps what you know, so related ideas find each other.
            </p>

            <div className="mt-8 min-h-[11.5rem] rounded-2xl border border-border bg-surface p-5 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22, ease: easeOutExpo }}
                >
                  <div className="flex items-center gap-3">
                    <span className={cn("flex h-10 w-10 items-center justify-center rounded-xl", c.fill)}>
                      <ActiveIcon className="h-5 w-5" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-base font-bold tracking-[-0.01em]">{node.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {node.hub ? "Topic hub" : `Part of ${c.name}`} · {node.items} saved items
                      </p>
                    </div>
                  </div>
                  <p className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    Connected to {linked.length}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {linked.map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setActive(n)}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium",
                          clusters[nodes[n].cluster].soft,
                          clusters[nodes[n].cluster].text
                        )}
                      >
                        {nodes[n].label}
                        <ArrowUpRight className="h-3 w-3 opacity-60" aria-hidden />
                      </button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
              {(Object.keys(clusters) as ClusterKey[]).map((k) => (
                <span key={k} className="flex items-center gap-2">
                  <span className={cn("h-2.5 w-2.5 rounded-full", clusters[k].dot)} />
                  {clusters[k].name}
                </span>
              ))}
              <span className="flex items-center gap-2">
                <Network className="h-3.5 w-3.5" aria-hidden /> Hover or tap a node
              </span>
            </div>
          </div>

          {/* Graph */}
          <div className="relative overflow-x-auto rounded-[28px] border border-border bg-surface-elevated/50 p-3 sm:p-5">
            <div className="bg-dots pointer-events-none absolute inset-0 opacity-60" aria-hidden />
            <div className="relative min-w-[620px]" style={{ aspectRatio: `${W} / ${H}` }}>
              <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden>
                {edges.map(([a, b], i) => {
                  const lit = a === active || b === active;
                  const color = clusters[nodes[b === active ? b : a].cluster].stroke;
                  const d = curve(a, b);
                  return (
                    <g key={i}>
                      <motion.path
                        d={d}
                        fill="none"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        stroke="var(--muted-foreground)"
                        strokeWidth={1}
                        initial={{ pathLength: 0, opacity: 0 }}
                        whileInView={{ pathLength: 1, opacity: lit ? 0.15 : 0.35 }}
                        viewport={viewportOnce}
                        transition={{ duration: 0.9, delay: i * 0.07, ease: easeOutExpo }}
                      />
                      {lit && (
                        <path
                          d={d}
                          fill="none"
                          vectorEffect="non-scaling-stroke"
                          strokeLinecap="round"
                          stroke={color}
                          strokeWidth={2.5}
                          strokeDasharray="5 9"
                          className="animate-dash"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={viewportOnce}
                className="absolute inset-0"
              >
                {nodes.map((n, i) => {
                  const k = clusters[n.cluster];
                  const Icon = k.icon;
                  const isActive = i === active;
                  const isLinked = linked.includes(i);
                  const dim = !isActive && !isLinked;
                  return (
                    <motion.div
                      key={n.label}
                      variants={staggerItem}
                      style={{ position: "absolute", left: `${n.x}%`, top: `${n.y}%` }}
                      className="-translate-x-1/2 -translate-y-1/2"
                    >
                      <motion.button
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onFocus={() => setActive(i)}
                        onClick={() => setActive(i)}
                        whileHover={{ scale: 1.08 }}
                        animate={{ scale: isActive ? 1.1 : 1, opacity: dim ? 0.6 : 1 }}
                        transition={{ duration: 0.25, ease: easeOutExpo }}
                        className={cn(
                          "relative flex cursor-pointer items-center gap-2 whitespace-nowrap font-semibold",
                          n.hub
                            ? cn("rounded-full px-3.5 py-2 text-xs shadow-md sm:px-5 sm:py-2.5 sm:text-sm", k.fill)
                            : cn(
                                "rounded-xl border bg-surface px-2.5 py-1.5 text-[11px] shadow-sm sm:px-3.5 sm:py-2 sm:text-xs",
                                isActive || isLinked ? k.border : "border-border",
                                isActive ? "text-foreground" : "text-muted-foreground"
                              ),
                          isActive && cn("ring-4", k.ring)
                        )}
                      >
                        {n.hub ? (
                          <Icon className="h-4 w-4" aria-hidden />
                        ) : (
                          <span className={cn("h-2 w-2 rounded-full", k.dot)} />
                        )}
                        {n.label}
                        {n.hub && <span className="rounded-full bg-black/15 px-1.5 py-0.5 text-[10px] tabular-nums">{n.items}</span>}
                      </motion.button>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

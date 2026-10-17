"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { ArrowUp, CircleHelp, LayoutGrid, LogIn, Rocket, Workflow, type LucideIcon } from "lucide-react";
import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

type DockLink = { label: string; href: string; icon: LucideIcon; primary?: boolean; internal?: boolean };

const dock: (DockLink | "divider")[] = [
  { label: "Features", href: "#features", icon: LayoutGrid },
  { label: "How it works", href: "#how", icon: Workflow },
  { label: "FAQ", href: "#faq", icon: CircleHelp },
  "divider",
  { label: "Sign in", href: "/login", icon: LogIn, internal: true },
  { label: "Get started", href: "/signup", icon: Rocket, internal: true, primary: true },
];

const BASE = 52;
const PEAK = 84;

function DockItem({ item, mouseX }: { item: DockLink; mouseX: MotionValue<number> }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const Icon = item.icon;

  // Distance from the cursor to this icon's centre drives its size (the "magnify" effect).
  const distance = useTransform(mouseX, (x) => {
    const b = ref.current?.getBoundingClientRect();
    return b ? x - b.x - b.width / 2 : Infinity;
  });
  const size = useSpring(useTransform(distance, [-160, 0, 160], [BASE, PEAK, BASE]), {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });
  const iconSize = useTransform(size, (s) => s * 0.46);

  const className = cn(
    "group relative flex aspect-square items-center justify-center rounded-[28%] border shadow-sm",
    item.primary
      ? "border-transparent bg-foreground text-background"
      : "border-border bg-surface text-muted-foreground hover:text-foreground"
  );

  const inner = (
    <>
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        {item.label}
      </span>
      <motion.span style={{ width: iconSize, height: iconSize }} className="flex items-center justify-center">
        <Icon className="h-full w-full" strokeWidth={1.75} aria-hidden />
      </motion.span>
    </>
  );

  return (
    <motion.div style={{ width: size }} className="shrink-0">
      {item.internal ? (
        <Link ref={ref} href={item.href} aria-label={item.label} className={className}>
          {inner}
        </Link>
      ) : (
        <a ref={ref} href={item.href} aria-label={item.label} className={className}>
          {inner}
        </a>
      )}
    </motion.div>
  );
}

export function Footer() {
  const mouseX = useMotionValue(Infinity);

  return (
    <footer className="relative overflow-hidden bg-surface-elevated/40">
      <div className="bg-dots pointer-events-none absolute inset-x-0 top-0 h-72 opacity-50" aria-hidden />

      <Container className="relative pt-14 md:pt-20">
        <div className="flex flex-col items-center text-center">
          <p className="mb-16 text-sm text-muted-foreground">
            A calm place for everything worth remembering.
          </p>

          {/* The dock */}
          <motion.nav
            aria-label="Footer"
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="flex h-[92px] items-end gap-2.5 rounded-[26px] border border-border bg-surface/80 px-3 pb-3 shadow-lg backdrop-blur"
          >
            {dock.map((item, i) =>
              item === "divider" ? (
                <span key={i} aria-hidden className="mb-2 h-10 w-px shrink-0 bg-border" />
              ) : (
                <DockItem key={item.label} item={item} mouseX={mouseX} />
              )
            )}
          </motion.nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Brain Dock. Made for curious minds.</p>
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="group inline-flex cursor-pointer items-center gap-1.5 font-medium hover:text-foreground"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden />
          </a>
        </div>
      </Container>

      {/* Oversized wordmark, cropped by the page edge and fading out */}
      <div aria-hidden className="pointer-events-none relative mt-6 select-none overflow-hidden">
        <p
          className="whitespace-nowrap text-center font-bold leading-[0.8] tracking-[-0.06em] text-[min(19vw,17rem)]"
          style={{
            background: "linear-gradient(180deg, color-mix(in srgb, var(--foreground) 16%, transparent) 0%, transparent 78%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            WebkitTextStroke: "1px color-mix(in srgb, var(--foreground) 10%, transparent)",
            paddingBottom: "0.06em",
            height: "0.62em",
          }}
        >
          Brain Dock
        </p>
      </div>
    </footer>
  );
}

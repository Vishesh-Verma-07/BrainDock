"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { Tilt } from "@/components/ui/tilt";
import { cn } from "@/lib/utils";
import { Link, FileText, Video, StickyNote, Plus, ExternalLink, Check, Loader2 } from "lucide-react";
import { staggerContainer, staggerItem, viewportOnce, easeOutExpo } from "@/lib/motion";

const captureTypes = [
  { label: "Links", icon: Link, color: "bg-accent text-accent-foreground", hint: "Paste any URL" },
  { label: "Notes", icon: StickyNote, color: "bg-amber text-background", hint: "Jot a quick thought" },
  { label: "Articles", icon: FileText, color: "bg-foreground text-background", hint: "Keep long reads" },
  { label: "Videos", icon: Video, color: "bg-muted-foreground text-background", hint: "Save YouTube links" },
];

const URL_TEXT = "example.com/designing-better-interfaces";
const TITLE_TEXT = "Designing better interfaces";
const TAGS = [
  { label: "design", className: "bg-accent-soft text-accent" },
  { label: "inspiration", className: "bg-amber-soft text-amber" },
  { label: "ux", className: "bg-muted text-muted-foreground" },
];

// step: 0 idle · 1 typing url · 2 typing title · 3 tags · 4 saving · 5 saved
function useCaptureDemo(active: boolean) {
  const [step, setStep] = useState(0);
  const [urlLen, setUrlLen] = useState(0);
  const [titleLen, setTitleLen] = useState(0);
  const [tagCount, setTagCount] = useState(0);

  useEffect(() => {
    if (!active) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const later = (ms: number, fn: () => void) => {
      timers.push(setTimeout(() => !cancelled && fn(), ms));
    };

    const run = () => {
      setStep(1);
      setUrlLen(0);
      setTitleLen(0);
      setTagCount(0);
      const speed = reduced ? 1 : 32;
      let t = 400;
      for (let i = 1; i <= URL_TEXT.length; i++) {
        later((t += speed), () => setUrlLen(i));
      }
      later((t += 250), () => setStep(2));
      for (let i = 1; i <= TITLE_TEXT.length; i++) {
        later((t += speed), () => setTitleLen(i));
      }
      later((t += 250), () => setStep(3));
      TAGS.forEach((_, i) => later((t += 380), () => setTagCount(i + 1)));
      later((t += 600), () => setStep(4));
      later((t += 900), () => setStep(5));
      later((t += 2600), run);
    };
    run();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [active]);

  return { step, urlLen, titleLen, tagCount };
}

function Cursor() {
  return <span aria-hidden className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[2px] animate-blink bg-accent" />;
}

function CaptureDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const { step, urlLen, titleLen, tagCount } = useCaptureDemo(inView);

  return (
    <div ref={ref} className="relative">
      <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-accent/15 via-transparent to-amber/15 blur-2xl" aria-hidden />
      <Tilt max={4}>
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
          <div className="flex h-12 items-center gap-2 border-b border-border bg-surface-elevated/60 px-4">
            <span className="h-3 w-3 rounded-full bg-[#E5A89A]" />
            <span className="h-3 w-3 rounded-full bg-[#E8CC8E]" />
            <span className="h-3 w-3 rounded-full bg-[#A9C79A]" />
            <span className="ml-3 font-mono text-[11px] text-muted-foreground">New item</span>
          </div>

          <div className="space-y-4 p-5">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">URL</label>
              <div
                className={cn(
                  "mt-1.5 flex h-11 items-center gap-2 rounded-xl border bg-surface-elevated/60 px-3.5 text-sm transition-colors",
                  step === 1 ? "border-accent/60 ring-4 ring-accent/10" : "border-border"
                )}
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-foreground">
                  {URL_TEXT.slice(0, urlLen)}
                  {step === 1 && <Cursor />}
                </span>
                {urlLen === 0 && step <= 1 && <span className="text-muted-foreground">Paste a link…</span>}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Title</label>
              <div
                className={cn(
                  "mt-1.5 flex h-11 items-center rounded-xl border bg-surface-elevated/60 px-3.5 text-sm font-semibold transition-colors",
                  step === 2 ? "border-accent/60 ring-4 ring-accent/10" : "border-border"
                )}
              >
                {TITLE_TEXT.slice(0, titleLen)}
                {step === 2 && <Cursor />}
                {titleLen === 0 && step < 2 && (
                  <span className="font-normal text-muted-foreground/70">Auto-filled from the page</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">Tags</label>
              <div className="mt-1.5 flex h-11 items-center gap-1.5 rounded-xl border border-border bg-surface-elevated/60 px-2">
                <AnimatePresence>
                  {TAGS.slice(0, tagCount).map((t) => (
                    <motion.span
                      key={t.label}
                      initial={{ opacity: 0, scale: 0.6, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: "spring", stiffness: 420, damping: 22 }}
                      className={cn("rounded-md px-2.5 py-1 text-[11px] font-medium", t.className)}
                    >
                      {t.label}
                    </motion.span>
                  ))}
                </AnimatePresence>
                {tagCount === 0 && <span className="px-1.5 text-sm text-muted-foreground/70">Suggested as you save</span>}
              </div>
            </div>

            <motion.button
              type="button"
              animate={{ scale: step === 4 ? 0.97 : 1 }}
              className={cn(
                "flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold shadow-sm transition-colors duration-300",
                step === 5 ? "bg-accent text-accent-foreground" : "bg-foreground text-background"
              )}
            >
              {step === 4 ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : step === 5 ? (
                <>
                  <Check className="h-4 w-4" /> Saved to Brain Dock
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> Save to Brain Dock
                </>
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {step === 5 && (
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="absolute bottom-24 right-4 flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3.5 py-2.5 text-xs font-semibold shadow-lg"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Check className="h-3.5 w-3.5" />
                </span>
                Added to “Design”
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Tilt>
    </div>
  );
}

export function CaptureSection() {
  return (
    <section className="relative overflow-hidden py-14 md:py-20">
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[420px] w-[420px] animate-aurora rounded-full bg-accent/10 blur-[120px]" aria-hidden />
      <Container className="relative">
        <SectionHeader
          eyebrow="Capture"
          title="Save anything worth remembering."
          description="Links, notes, videos, ideas — keep everything in one calm, focused flow."
        />

        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-6 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">What you can save</p>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={viewportOnce}
              className="mb-8 grid grid-cols-2 gap-3"
            >
              {captureTypes.map((t) => {
                const Icon = t.icon;
                return (
                  <motion.div
                    key={t.label}
                    variants={staggerItem}
                    whileHover={{ y: -4, boxShadow: "var(--shadow-md)" }}
                    transition={{ duration: 0.25, ease: easeOutExpo }}
                    className="group flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface p-4 hover:border-foreground/15"
                  >
                    <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110", t.color)}>
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{t.label}</span>
                      <span className="block text-xs text-muted-foreground">{t.hint}</span>
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              No tabs to switch between. No forms to fill out. Just paste, type, or save — and let Brain Dock handle the rest.
            </p>
          </div>

          <CaptureDemo />
        </div>
      </Container>
    </section>
  );
}

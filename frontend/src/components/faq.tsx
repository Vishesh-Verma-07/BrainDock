"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container } from "@/components/ui/container";
import { SectionHeader } from "@/components/ui/section-header";
import { AnchorButton } from "@/components/ui/button";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { Plus, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { easeOutExpo } from "@/lib/motion";

const faqs = [
  {
    question: "What can I save in Brain Dock?",
    answer:
      "You can save web links, text notes, articles, and YouTube videos. Anything worth remembering has a home.",
  },
  {
    question: "How does AI search work?",
    answer:
      "Ask in your own words. Brain Dock searches the content you have saved semantically, then grounds its answer in the most relevant items — your knowledge, not the open web.",
  },
  {
    question: "Can I save YouTube videos?",
    answer:
      "Yes. Paste a YouTube link and Brain Dock turns it into a saved item you can ask questions about later.",
  },
  {
    question: "How does Brain Dock organize my knowledge?",
    answer:
      "It suggests collections and tags as you save, so structure builds itself. You can rearrange anything anytime — the system follows your thinking.",
  },
  {
    question: "Is my content private?",
    answer:
      "Your knowledge stays tied to your account and is private by default. You choose what, if anything, to share.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative overflow-hidden py-14 md:py-20" id="faq">
      <div className="pointer-events-none absolute -left-32 top-10 h-[380px] w-[380px] animate-aurora rounded-full bg-accent/10 blur-[110px]" aria-hidden />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              eyebrow="Questions"
              title="Answers to what you might wonder."
              description="Straightforward answers about how Brain Dock works."
              className="mb-6 md:mb-6"
            />
            <SpotlightCard className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
              <span className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Sparkles className="h-5 w-5" aria-hidden />
              </span>
              <p className="text-base font-semibold tracking-[-0.01em]">Ready to try it yourself?</p>
              <p className="mb-5 mt-1 text-sm leading-relaxed text-muted-foreground">
                The quickest way to understand Brain Dock is to save your first link.
              </p>
              <AnchorButton href="/signup" size="md" showArrow className="btn-shine">
                Build your Brain Dock
              </AnchorButton>
            </SpotlightCard>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.question}
                  className={cn(
                    "overflow-hidden rounded-2xl border bg-surface transition-[border-color,box-shadow] duration-300",
                    isOpen ? "border-accent/40 shadow-md" : "border-border hover:border-foreground/20"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group flex w-full cursor-pointer items-center gap-4 px-6 py-5 text-left"
                  >
                    <span className="font-mono text-xs tabular-nums text-muted-foreground/60">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-base font-semibold tracking-[-0.01em]">{faq.question}</span>
                    <span
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                        isOpen
                          ? "rotate-45 border-accent bg-accent text-accent-foreground"
                          : "border-border text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground"
                      )}
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: easeOutExpo }}
                      >
                        <p className="pb-6 pl-[4.25rem] pr-8 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}

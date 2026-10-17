import Link from "next/link";
import { ArrowLeft, Brain, Check, Sparkles } from "lucide-react";

const points = [
  "Save links, notes and YouTube videos in seconds",
  "Ask questions in plain language",
  "Private by default, shareable when you choose",
];

export function AuthShell({
  eyebrow,
  title,
  accent,
  lead,
  children,
  footer,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  lead: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <main className="landing grain flex min-h-screen flex-1 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <section className="relative flex w-full flex-col px-6 py-8 sm:px-10 lg:px-16">
        <div className="bg-dots pointer-events-none absolute inset-0 opacity-70" aria-hidden />
        <header className="relative z-10 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Brain className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-base font-semibold tracking-[-0.01em]">Brain Dock</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back home
          </Link>
        </header>

        <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-12">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
            {title}
            <br />
            <span className="text-gradient">{accent}</span>
          </h1>
          <p className="mt-4 text-base text-muted-foreground">{lead}</p>
          <div className="mt-8 rounded-2xl border border-border bg-surface p-6 shadow-lg sm:p-7">
            {children}
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">{footer}</p>
        </div>
      </section>

      <aside
        data-theme="dark"
        className="relative hidden overflow-hidden bg-[#141210] text-foreground lg:flex lg:flex-col lg:justify-center lg:px-16"
      >
        <div
          className="pointer-events-none absolute -top-32 -right-24 h-[28rem] w-[28rem] animate-aurora rounded-full bg-accent/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-20 h-[26rem] w-[26rem] animate-aurora rounded-full bg-amber/20 blur-3xl"
          aria-hidden
        />
        <div className="relative z-10 max-w-lg">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
            Remember what matters
          </p>
          <h2 className="mt-4 text-4xl font-bold tracking-[-0.03em]">
            Don&apos;t remember where you saved it.
            <br />
            <span className="text-muted-foreground">Just ask.</span>
          </h2>
          <ul className="mt-8 space-y-3.5">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-sm text-muted-foreground">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Check className="h-3 w-3" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="mt-10 rounded-2xl border border-border bg-surface/80 p-5 shadow-xl backdrop-blur">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden />
              <span className="font-medium text-accent">AI answer</span>
              <span>Grounded in 3 saved items</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              Your saved material focuses on <strong>consistency</strong>,{" "}
              <strong>reusable components</strong>, and clear design tokens.
            </p>
          </div>
        </div>
      </aside>
    </main>
  );
}

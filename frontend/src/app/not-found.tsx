import type { Metadata } from "next";
import Link from "next/link";
import { Brain, Compass, LayoutDashboard } from "lucide-react";
import { AnchorButton } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found — Brain Dock",
};

export default function NotFound() {
  return (
    <div className="landing grain relative flex min-h-screen flex-1 flex-col overflow-hidden">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-70" aria-hidden />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 animate-aurora rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 mx-auto flex h-16 w-full max-w-6xl items-center px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shadow-sm transition-transform group-hover:scale-105">
            <Brain className="h-4 w-4" aria-hidden />
          </span>
          <span className="text-base font-semibold tracking-[-0.01em]">Brain Dock</span>
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 pb-24 text-center">
        <p className="text-gradient text-8xl font-bold tracking-[-0.06em] sm:text-9xl">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
          This page <span className="text-gradient">wandered off.</span>
        </h1>
        <p className="mt-4 text-base text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist, or it moved somewhere else. Your saved
          thoughts are safe.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <AnchorButton href="/dashboard" icon={LayoutDashboard} showArrow={false}>
            Go to dashboard
          </AnchorButton>
          <AnchorButton href="/" variant="secondary" icon={Compass} showArrow={false}>
            Back to home
          </AnchorButton>
        </div>
      </main>
    </div>
  );
}

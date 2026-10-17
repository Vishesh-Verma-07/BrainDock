import Link from "next/link";
import { Brain } from "lucide-react";
import { AnchorButton } from "@/components/ui/button";

/** Chrome for the pages anyone can open through a share link (no login needed). */
export function PublicShell({
  children,
  badge = "Shared workspace",
}: {
  children: React.ReactNode;
  badge?: string;
}) {
  return (
    <div className="landing grain flex min-h-screen flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background shadow-sm transition-transform group-hover:scale-105">
              <Brain className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-base font-semibold tracking-[-0.01em]">Brain Dock</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
              {badge}
            </span>
            <AnchorButton href="/signup" size="sm" showArrow>
              Create your own
            </AnchorButton>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:py-14">{children}</main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <p>Made with Brain Dock. A calm place for everything worth remembering.</p>
          <Link href="/" className="font-medium text-foreground hover:underline">
            Learn more
          </Link>
        </div>
      </footer>
    </div>
  );
}

export function PublicMessage({
  eyebrow,
  title,
  accent,
  text,
  action,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  text: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-16 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-4 text-4xl font-bold tracking-[-0.03em] sm:text-5xl">
        {title} <span className="text-gradient">{accent}</span>
      </h1>
      <p className="mt-4 text-base text-muted-foreground">{text}</p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

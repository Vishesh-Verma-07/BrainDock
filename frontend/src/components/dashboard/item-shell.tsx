import Link from "next/link";
import { ArrowLeft } from "lucide-react";

/** Page chrome shared by the item detail page, its loading skeleton and its error state. */
export function ItemShell({
  actions,
  crumb,
  children,
}: {
  actions?: React.ReactNode;
  crumb?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="landing grain min-h-screen flex-1">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center gap-3 px-4 sm:px-6">
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium shadow-sm hover:border-foreground/20"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden /> Dashboard
          </Link>
          <nav aria-label="Breadcrumb" className="hidden min-w-0 flex-1 items-center gap-2 text-sm text-muted-foreground sm:flex">
            {crumb}
          </nav>
          <div className="ml-auto flex items-center gap-1.5">{actions}</div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:py-12">{children}</main>
    </div>
  );
}

export function ItemSkeleton() {
  return (
    <ItemShell>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-busy="true" aria-label="Loading item">
        <div className="space-y-5">
          <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
          <div className="h-12 w-4/5 animate-pulse rounded-lg bg-muted" />
          <div className="flex gap-2">
            <div className="h-7 w-16 animate-pulse rounded-full bg-muted" />
            <div className="h-7 w-20 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-48 animate-pulse rounded-2xl border border-border bg-surface" />
        </div>
        <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
    </ItemShell>
  );
}

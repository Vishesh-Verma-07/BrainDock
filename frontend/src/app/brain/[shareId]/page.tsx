"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Folder, Search, X } from "lucide-react";
import { brainApi, ContentItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AnchorButton, Button } from "@/components/ui/button";
import { fieldClass } from "@/components/dashboard/modal";
import { PublicShell, PublicMessage } from "@/components/public/public-shell";
import { categoryName, PublicCard } from "@/components/public/public-card";

type Kind = "all" | "link" | "note";

function Skeleton() {
  return (
    <div aria-busy="true" aria-label="Loading shared content">
      <div className="h-5 w-48 animate-pulse rounded-full bg-muted" />
      <div className="mt-5 h-14 w-3/4 max-w-xl animate-pulse rounded-lg bg-muted" />
      <div className="mt-4 h-5 w-64 animate-pulse rounded bg-muted" />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-44 animate-pulse rounded-2xl border border-border bg-surface" />
        ))}
      </div>
    </div>
  );
}

export default function PublicBrainPage() {
  const { shareId } = useParams<{ shareId: string }>();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<Kind>("all");
  const [collection, setCollection] = useState("all");

  useEffect(() => {
    brainApi
      .publicBrain(shareId)
      .then(setItems)
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : "This shared Brain Dock is unavailable."),
      )
      .finally(() => setLoading(false));
  }, [shareId]);

  // Only show the name, never the email address, on a public page.
  const owner = items[0]?.userId?.username || "A Brain Dock member";

  const updatedAt = useMemo(
    () =>
      items.reduce<string | undefined>(
        (latest, item) =>
          !latest || new Date(item.updatedAt || item.createdAt || 0) > new Date(latest)
            ? item.updatedAt || item.createdAt
            : latest,
        undefined,
      ),
    [items],
  );

  const collections = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of items) {
      const name = categoryName(item);
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.entries()];
  }, [items]);

  const term = query.trim();
  const inScope = useMemo(() => {
    const needle = term.toLowerCase();
    return items
      .filter((item) => collection === "all" || categoryName(item) === collection)
      .filter(
        (item) =>
          !needle ||
          [item.title, item.content, item.link, ...(item.tags?.map((t) => t.name || t.title || "") ?? [])]
            .join(" ")
            .toLowerCase()
            .includes(needle),
      );
  }, [collection, items, term]);

  const visible = inScope.filter((item) => kind === "all" || (kind === "link" ? item.link : !item.link));
  const kinds: { id: Kind; label: string; count: number }[] = [
    { id: "all", label: "All", count: inScope.length },
    { id: "link", label: "Links", count: inScope.filter((i) => i.link).length },
    { id: "note", label: "Notes", count: inScope.filter((i) => !i.link).length },
  ];
  const filtered = term || kind !== "all" || collection !== "all";

  if (loading)
    return (
      <PublicShell>
        <Skeleton />
      </PublicShell>
    );

  if (error)
    return (
      <PublicShell badge="Shared Brain Dock">
        <PublicMessage
          eyebrow="Shared Brain Dock"
          title="This share link is"
          accent="not available."
          text={error}
          action={
            <AnchorButton href="/" showArrow>
              Visit Brain Dock
            </AnchorButton>
          }
        />
      </PublicShell>
    );

  if (!items.length)
    return (
      <PublicShell badge="Shared Brain Dock">
        <PublicMessage
          eyebrow="Shared Brain Dock"
          title="Nothing has been"
          accent="shared yet."
          text="This Brain Dock doesn't have any shared content right now."
        />
      </PublicShell>
    );

  return (
    <PublicShell>
      <section aria-label="About this Brain Dock">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {owner}&apos;s Brain Dock
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-[-0.03em] sm:text-5xl lg:text-6xl">
          A collection of <span className="text-gradient">useful thoughts.</span>
        </h1>
        <p className="mt-5 text-sm text-muted-foreground">
          Shared by <span className="font-medium text-foreground">{owner}</span>
          {updatedAt && <> · Updated {new Date(updatedAt).toLocaleDateString(undefined, { dateStyle: "medium" })}</>}
          {" · "}
          {items.length} item{items.length === 1 ? "" : "s"}
        </p>
      </section>

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[14rem] flex-1 sm:max-w-sm">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search this Brain Dock…"
            aria-label="Search this Brain Dock"
            className={cn(fieldClass, "h-10 rounded-xl pl-10 pr-9 shadow-sm")}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <div className="inline-flex rounded-lg border border-border bg-surface p-0.5" role="group" aria-label="Type">
          {kinds.map((k) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              aria-pressed={kind === k.id}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium",
                kind === k.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {k.label}
              <span className="ml-1.5 text-xs opacity-60">{k.count}</span>
            </button>
          ))}
        </div>
      </div>

      {collections.length > 0 && (
        <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Collections">
          {[["all", items.length] as const, ...collections].map(([name, count]) => (
            <button
              key={name}
              type="button"
              onClick={() => setCollection(name)}
              aria-pressed={collection === name}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium",
                collection === name
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-surface text-muted-foreground hover:border-foreground/20 hover:text-foreground",
              )}
            >
              {name !== "all" && <Folder className="h-3.5 w-3.5" aria-hidden />}
              {name === "all" ? "All collections" : name}
              <span className="text-xs opacity-60">{count}</span>
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 flex items-baseline justify-between">
        <h2 className="text-lg font-semibold tracking-[-0.01em]">Shared content</h2>
        <span className="text-sm text-muted-foreground" aria-live="polite">
          {visible.length} item{visible.length === 1 ? "" : "s"}
        </span>
      </div>

      {visible.length ? (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <PublicCard key={item._id} item={item} href={`/brain/${shareId}/item/${item._id}`} term={term} />
          ))}
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
          <h3 className="text-lg font-semibold">Nothing matched</h3>
          <p className="mt-1 text-sm text-muted-foreground">Try a different word or filter.</p>
          {filtered && (
            <div className="mt-6">
              <Button
                variant="secondary"
                showArrow={false}
                onClick={() => {
                  setQuery("");
                  setKind("all");
                  setCollection("all");
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}
    </PublicShell>
  );
}

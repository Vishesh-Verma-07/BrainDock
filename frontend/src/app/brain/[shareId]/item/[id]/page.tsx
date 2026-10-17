"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Folder,
  Link2,
  User as UserIcon,
} from "lucide-react";
import { brainApi, ContentItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AnchorButton } from "@/components/ui/button";
import { PublicMessage, PublicShell } from "@/components/public/public-shell";
import { categoryName, PublicCard } from "@/components/public/public-card";

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const hostOf = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

function Skeleton() {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]" aria-busy="true" aria-label="Loading shared item">
      <div className="space-y-5">
        <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
        <div className="h-12 w-4/5 animate-pulse rounded-lg bg-muted" />
        <div className="h-48 animate-pulse rounded-2xl border border-border bg-surface" />
      </div>
      <div className="h-56 animate-pulse rounded-2xl border border-border bg-surface" />
    </div>
  );
}

export default function PublicItemPage() {
  const { shareId, id } = useParams<{ shareId: string; id: string }>();
  const [items, setItems] = useState<ContentItem[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    brainApi
      .publicBrain(shareId)
      .then(setItems)
      .catch((reason) =>
        setError(reason instanceof Error ? reason.message : "This shared item is unavailable."),
      )
      .finally(() => setLoading(false));
  }, [shareId]);

  const item = items.find((entry) => entry._id === id);
  const backHref = `/brain/${shareId}`;

  async function copyPageLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  if (loading)
    return (
      <PublicShell>
        <Skeleton />
      </PublicShell>
    );

  if (!item)
    return (
      <PublicShell badge="Shared item">
        <PublicMessage
          eyebrow="Shared item"
          title="This item is"
          accent="unavailable."
          text={error || "It may have been removed, or the share link was turned off."}
          action={
            <AnchorButton href={backHref} showArrow>
              View shared Brain Dock
            </AnchorButton>
          }
        />
      </PublicShell>
    );

  const isLink = Boolean(item.link);
  const Icon = isLink ? Link2 : FileText;
  const owner = item.userId?.username; // name only, never the email address
  const collection = categoryName(item);
  const tags = item.tags?.map((tag) => tag.name || tag.title).filter(Boolean) as string[] | undefined;
  const more = items.filter((entry) => entry._id !== item._id).slice(0, 3);

  const details = [
    { icon: Folder, label: "Collection", value: collection },
    { icon: UserIcon, label: "Shared by", value: owner },
    { icon: Calendar, label: "Created", value: formatDate(item.createdAt) },
    { icon: Clock, label: "Last updated", value: formatDate(item.updatedAt) },
  ].filter((d) => d.value);

  return (
    <PublicShell badge="Shared item">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={backHref}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium shadow-sm hover:border-foreground/20"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Shared Brain Dock
        </Link>
        <button
          type="button"
          onClick={copyPageLink}
          className="inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {copied ? <Check className="h-4 w-4 text-accent" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
          {copied ? "Link copied" : "Copy page link"}
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
        <article className="min-w-0">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium uppercase tracking-[0.12em]",
              isLink ? "bg-accent-soft text-accent" : "bg-amber-soft text-amber",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {isLink ? "Link" : "Note"}
          </span>

          <h1 className="mt-5 break-words text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
            {item.title}
          </h1>

          {tags && tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {isLink && (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:border-foreground/20 hover:shadow-md"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent">
                <Link2 className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold">{hostOf(item.link!)}</span>
                <span className="block truncate text-xs text-muted-foreground">{item.link}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-accent">
                Open <ExternalLink className="h-4 w-4" aria-hidden />
              </span>
            </a>
          )}

          {item.content && (
            <section className="mt-8" aria-label="Note">
              <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Note</h2>
              <p className="mt-3 whitespace-pre-wrap break-words text-base leading-relaxed sm:text-lg">
                {item.content}
              </p>
            </section>
          )}
        </article>

        <aside
          aria-label="Item details"
          className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-24"
        >
          <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Details</h2>
          <dl className="mt-4 space-y-4">
            {details.map(({ icon: DetailIcon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <DetailIcon className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </aside>
      </div>

      {more.length > 0 && (
        <section className="mt-16 border-t border-border pt-10" aria-label="More from this Brain Dock">
          <div className="flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-[-0.01em]">
              More{owner ? ` from ${owner}` : ""}
            </h2>
            <Link href={backHref} className="text-sm font-medium text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {more.map((entry) => (
              <PublicCard key={entry._id} item={entry} href={`/brain/${shareId}/item/${entry._id}`} term="" />
            ))}
          </div>
        </section>
      )}

      <div className="mt-14 flex flex-col items-center rounded-2xl border border-border bg-surface px-6 py-10 text-center shadow-sm">
        <h2 className="text-2xl font-bold tracking-[-0.03em]">
          Keep your own <span className="text-gradient">Brain Dock.</span>
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Save links, notes and ideas in one calm place, then ask questions about what you&apos;ve saved.
        </p>
        <div className="mt-6">
          <AnchorButton href="/signup" showArrow>
            Get started free
          </AnchorButton>
        </div>
      </div>
    </PublicShell>
  );
}

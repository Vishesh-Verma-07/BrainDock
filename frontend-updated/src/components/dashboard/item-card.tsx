import Link from "next/link";
import { Copy, ExternalLink, FileText, Link2, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/lib/api";

export type ViewMode = "grid" | "list";

export function formatDate(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function Highlight({ text, term }: { text: string; term: string }) {
  const needle = term.trim();
  if (!needle) return <>{text}</>;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "ig"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === needle.toLowerCase() ? (
          <mark key={i} className="rounded bg-accent-soft px-0.5 text-foreground">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}

const actionClass =
  "relative z-20 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground";

export function ItemCard({
  item,
  view,
  term,
  onDelete,
  onCopy,
}: {
  item: ContentItem;
  view: ViewMode;
  term: string;
  onDelete: (item: ContentItem) => void;
  onCopy: (link: string) => void;
}) {
  const isLink = Boolean(item.link);
  const Icon = isLink ? Link2 : FileText;
  const host = (() => {
    try {
      return item.link ? new URL(item.link).hostname.replace(/^www\./, "") : "";
    } catch {
      return item.link ?? "";
    }
  })();
  const date = formatDate(item.createdAt);

  const icon = (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
        isLink ? "bg-accent-soft text-accent" : "bg-amber-soft text-amber",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden />
    </span>
  );

  const actions = (
    <div className="relative z-20 flex items-center">
      {isLink && (
        <>
          <button
            type="button"
            onClick={() => onCopy(item.link!)}
            aria-label={`Copy link for ${item.title}`}
            title="Copy link"
            className={actionClass}
          >
            <Copy className="h-4 w-4" />
          </button>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Open ${item.title} in a new tab`}
            title="Open link"
            className={actionClass}
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </>
      )}
      <button
        type="button"
        onClick={() => onDelete(item)}
        aria-label={`Delete ${item.title}`}
        title="Delete"
        className={cn(actionClass, "hover:bg-red-50 hover:text-red-600")}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  const tags = item.tags?.length ? (
    <div className="flex flex-wrap gap-1.5">
      {item.tags.map((tag) => (
        <span
          key={tag._id}
          className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
        >
          {tag.name || tag.title}
        </span>
      ))}
    </div>
  ) : null;

  const overlay = (
    <Link
      href={`/dashboard/item/${item._id}`}
      aria-label={`View ${item.title}`}
      className="absolute inset-0 z-10 rounded-2xl"
    />
  );

  if (view === "list") {
    return (
      <article className="group relative flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3 shadow-sm transition hover:border-foreground/20 hover:shadow-md">
        {overlay}
        {icon}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold">
            <Highlight text={item.title} term={term} />
          </h3>
          <p className="truncate text-sm text-muted-foreground">
            {isLink && host ? `${host}${item.content ? " · " : ""}` : ""}
            {item.content && <Highlight text={item.content} term={term} />}
          </p>
        </div>
        <div className="hidden w-60 shrink-0 justify-end md:flex [&>div]:justify-end">{tags}</div>
        <span className="hidden w-20 shrink-0 text-right text-xs text-muted-foreground sm:block">
          {date}
        </span>
        {actions}
      </article>
    );
  }

  return (
    <article className="group relative flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md">
      {overlay}
      <div className="flex items-center justify-between">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
          {isLink ? "Link" : "Note"}
          {date && <> · {date}</>}
        </span>
      </div>

      <h3 className="mt-4 line-clamp-2 text-base font-semibold tracking-[-0.01em]">
        <Highlight text={item.title} term={term} />
      </h3>
      {item.content && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          <Highlight text={item.content} term={term} />
        </p>
      )}
      {isLink && host && (
        <p className="mt-3 flex items-center gap-1.5 truncate text-xs font-medium text-accent">
          <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="truncate">{host}</span>
        </p>
      )}

      <footer className="mt-auto flex items-end justify-between gap-3 pt-4">
        {tags ?? <span />}
        {actions}
      </footer>
    </article>
  );
}

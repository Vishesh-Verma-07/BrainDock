import Link from "next/link";
import { ExternalLink, FileText, Folder, Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ContentItem } from "@/lib/api";
import { formatDate, Highlight } from "@/components/dashboard/item-card";

export const categoryName = (item: ContentItem) =>
  typeof item.category === "object" && item.category?.name ? item.category.name : "";

export function PublicCard({
  item,
  href,
  term,
}: {
  item: ContentItem;
  href: string;
  term: string;
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
  const collection = categoryName(item);

  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-border bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            isLink ? "bg-accent-soft text-accent" : "bg-amber-soft text-amber",
          )}
        >
          <Icon className="h-4 w-4" aria-hidden />
        </span>
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

      <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-4">
        {collection && (
          <span className="inline-flex items-center gap-1 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium">
            <Folder className="h-3 w-3" aria-hidden /> {collection}
          </span>
        )}
        {item.tags?.map((tag) => (
          <span key={tag._id} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
            {tag.name || tag.title}
          </span>
        ))}
      </div>
    </Link>
  );
}

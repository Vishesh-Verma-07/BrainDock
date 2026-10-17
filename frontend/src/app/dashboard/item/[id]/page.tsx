"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  Calendar,
  Clock,
  Copy,
  ExternalLink,
  FileText,
  Folder,
  Link2,
  Sparkles,
  Trash2,
  User as UserIcon,
  X,
} from "lucide-react";
import { authApi, brainApi, Category, ContentItem } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/dashboard/modal";
import { ItemShell, ItemSkeleton } from "@/components/dashboard/item-shell";

const formatDate = (value?: string) => {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

const hostOf = (value: string) => {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return value;
  }
};

const iconButton =
  "inline-flex h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground";

export default function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<ContentItem>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        await authApi.currentUser();
      } catch {
        router.replace("/login");
        return;
      }
      try {
        const [content, savedCategories] = await Promise.all([
          brainApi.contentDetail(id),
          brainApi.categories(),
        ]);
        setItem(content);
        setCategories(savedCategories);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load this item.");
      }
    }
    void load();
  }, [id, router]);

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);

  const closeConfirm = useCallback(() => setConfirmDelete(false), []);

  async function copy(text: string, done: string) {
    try {
      await navigator.clipboard.writeText(text);
      setNotice(done);
    } catch {
      setNotice("Could not copy to the clipboard.");
    }
  }

  async function remove() {
    setDeleting(true);
    try {
      await brainApi.deleteContent(id);
      router.push("/dashboard");
    } catch (err) {
      setConfirmDelete(false);
      setNotice(err instanceof Error ? err.message : "Could not delete this item.");
      setDeleting(false);
    }
  }

  if (!item && !error) return <ItemSkeleton />;

  if (!item) {
    return (
      <ItemShell>
        <div className="mx-auto flex max-w-md flex-col items-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <AlertCircle className="h-5 w-5" aria-hidden />
          </span>
          <h1 className="mt-4 text-xl font-semibold">Item unavailable</h1>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <div className="mt-6">
            <Link href="/dashboard">
              <Button showArrow={false}>Back to dashboard</Button>
            </Link>
          </div>
        </div>
      </ItemShell>
    );
  }

  const isLink = Boolean(item.link);
  const Icon = isLink ? Link2 : FileText;
  const tags = item.tags?.map((tag) => tag.name || tag.title).filter(Boolean) as string[] | undefined;
  const itemCategoryId = typeof item.category === "string" ? item.category : item.category?._id;
  const categoryName =
    (typeof item.category === "object" ? item.category?.name : undefined) ||
    categories.find((category) => category._id === itemCategoryId)?.name;

  const details = [
    { icon: Folder, label: "Collection", value: categoryName },
    { icon: Calendar, label: "Created", value: formatDate(item.createdAt) },
    { icon: Clock, label: "Last updated", value: formatDate(item.updatedAt) },
    { icon: UserIcon, label: "Saved by", value: item.userId?.username },
  ].filter((d) => d.value);

  return (
    <ItemShell
      crumb={
        <>
          {categoryName && (
            <>
              <span>{categoryName}</span>
              <span aria-hidden>/</span>
            </>
          )}
          <span className="truncate font-medium text-foreground">{item.title}</span>
        </>
      }
      actions={
        <>
          {isLink ? (
            <button type="button" onClick={() => copy(item.link!, "Link copied to clipboard.")} className={iconButton}>
              <Copy className="h-4 w-4" aria-hidden />
              <span className="hidden sm:inline">Copy link</span>
            </button>
          ) : (
            item.content && (
              <button type="button" onClick={() => copy(item.content!, "Note copied to clipboard.")} className={iconButton}>
                <Copy className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Copy note</span>
              </button>
            )
          )}
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className={cn(iconButton, "hover:bg-red-50 hover:text-red-600")}
          >
            <Trash2 className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-10">
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
              <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Note
              </h2>
              <p className="mt-3 whitespace-pre-wrap break-words text-base leading-relaxed sm:text-lg">
                {item.content}
              </p>
            </section>
          )}

          {item.summary && (
            <section className="mt-8 rounded-2xl border border-accent/30 bg-accent-soft p-5" aria-label="Summary">
              <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-accent">
                <Sparkles className="h-4 w-4" aria-hidden /> Summary
              </h2>
              <p className="mt-2 text-sm leading-relaxed">{item.summary}</p>
            </section>
          )}
        </article>

        <aside aria-label="Item details" className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm lg:sticky lg:top-24">
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

      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-[80] flex max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-xl bg-foreground px-4 py-3 text-sm text-background shadow-xl"
        >
          {notice}
          <button
            type="button"
            onClick={() => setNotice("")}
            aria-label="Dismiss message"
            className="text-background/70 hover:text-background"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {confirmDelete && (
        <Modal eyebrow="Delete content" title="Are you" accent="sure?" onClose={closeConfirm}>
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{item.title}</span>{" "}
            will be permanently deleted. This can&apos;t be undone.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" showArrow={false} onClick={closeConfirm}>
              Cancel
            </Button>
            <Button
              showArrow={false}
              disabled={deleting}
              onClick={remove}
              className="bg-red-600 text-white hover:bg-red-700 active:bg-red-700"
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </Modal>
      )}
    </ItemShell>
  );
}

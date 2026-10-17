"use client";

import { useRouter } from "next/navigation";
import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  AlertCircle,
  Check,
  CornerDownLeft,
  LayoutGrid,
  List,
  Menu,
  Plus,
  RefreshCw,
  Sparkles,
  X,
} from "lucide-react";
import {
  authApi,
  brainApi,
  Category,
  ContentItem,
  CreateContent,
  Tag,
  User,
} from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sidebar, SIDEBAR_MOTION, useSidebarCollapsed } from "@/components/dashboard/sidebar";
import { ItemCard, ViewMode } from "@/components/dashboard/item-card";
import { Field, fieldClass, Modal } from "@/components/dashboard/modal";
import { SortMenu } from "@/components/dashboard/sort-menu";
import { addRecentSearch, SearchBar } from "@/components/dashboard/search-bar";
import { CreateItemModal, ItemDefaults } from "@/components/dashboard/create-item-modal";

const collectionId = (item: ContentItem) =>
  (typeof item.category === "string" ? item.category : item.category?._id) ||
  (typeof item.categoryId === "string" ? item.categoryId : item.categoryId?._id);

const greeting = () => {
  const hour = new Date().getHours();
  return hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
};

function groupLabel(value?: string) {
  const date = new Date(value || 0);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(new Date()) - startOfDay(date)) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return "This week";
  const now = new Date();
  if (date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear())
    return "Earlier this month";
  return date.toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

const isTyping = (el: EventTarget | null) =>
  el instanceof HTMLElement &&
  (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName));

type PendingDelete = { type: "content" | "collection"; id: string; name: string };
type Kind = "all" | "link" | "note";

const VIEW_KEY = "braindock:view";
const VIEW_EVENT = "braindock:view-change";
const subscribeView = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(VIEW_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(VIEW_EVENT, callback);
  };
};
const readView = (): ViewMode => {
  try {
    return localStorage.getItem(VIEW_KEY) === "list" ? "list" : "grid";
  } catch {
    return "grid";
  }
};

export default function Dashboard() {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState<ContentItem[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<User>();
  const [query, setQuery] = useState("");
  const [answer, setAnswer] = useState("");
  const [notice, setNotice] = useState("");
  const [loadError, setLoadError] = useState("");
  const [collection, setCollection] = useState("all");
  const [kind, setKind] = useState<Kind>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const view = useSyncExternalStore(subscribeView, readView, () => "grid" as ViewMode);
  const [semanticResults, setSemanticResults] = useState(false);
  const [createDefaults, setCreateDefaults] = useState<ItemDefaults>();
  const [showCollection, setShowCollection] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, toggleCollapsed] = useSidebarCollapsed();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [quick, setQuick] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>();

  const loadDashboard = useCallback(async () => {
    const [content, savedTags, savedCategories] = await Promise.all([
      brainApi.content(),
      brainApi.tags(),
      brainApi.categories(),
    ]);
    setItems(content);
    setTags(savedTags);
    setCategories(savedCategories);
  }, []);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setUser(await authApi.currentUser());
      } catch {
        router.replace("/login");
        return;
      }
      try {
        await loadDashboard();
      } catch (error) {
        setLoadError(error instanceof Error ? error.message : "Could not load your Brain Dock.");
      } finally {
        setLoading(false);
      }
    }
    void fetchDashboard();
  }, [loadDashboard, reloadKey, router]);

  const retryLoad = () => {
    setLoading(true);
    setLoadError("");
    setReloadKey((key) => key + 1);
  };

  const changeView = (next: ViewMode) => {
    try {
      localStorage.setItem(VIEW_KEY, next);
    } catch {}
    window.dispatchEvent(new Event(VIEW_EVENT));
  };

  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4500);
    return () => clearTimeout(timer);
  }, [notice]);

  // Keyboard shortcuts: "/" to search, "n" for a new item.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "n") {
        e.preventDefault();
        openCreate();
      } else if (e.key === "[") {
        e.preventDefault();
        toggleCollapsed();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection]);

  const counts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const item of items) {
      const id = collectionId(item);
      if (id) result[id] = (result[id] ?? 0) + 1;
    }
    return result;
  }, [items]);

  const tagCounts = useMemo(() => {
    const result: Record<string, number> = {};
    for (const item of items) for (const tag of item.tags ?? []) result[tag._id] = (result[tag._id] ?? 0) + 1;
    return result;
  }, [items]);

  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => (tagCounts[b._id] ?? 0) - (tagCounts[a._id] ?? 0)),
    [tags, tagCounts],
  );
  const shownTags = showAllTags ? sortedTags : sortedTags.slice(0, 8);

  const term = semanticResults ? "" : query.trim();

  const scoped = useMemo(() => {
    const needle = term.toLowerCase();
    return items
      .filter(
        (item) =>
          !needle ||
          [
            item.title,
            item.content,
            item.link,
            ...(item.tags?.map((tag) => tag.name || tag.title || "") || []),
          ]
            .join(" ")
            .toLowerCase()
            .includes(needle),
      )
      .filter((item) => collection === "all" || collectionId(item) === collection)
      .filter((item) =>
        selectedTags.every((tagId) => item.tags?.some((tag) => tag._id === tagId)),
      );
  }, [collection, items, selectedTags, term]);

  const kindCounts = useMemo(
    () => ({
      all: scoped.length,
      link: scoped.filter((i) => i.link).length,
      note: scoped.filter((i) => !i.link).length,
    }),
    [scoped],
  );

  const visibleItems = useMemo(
    () =>
      scoped
        .filter((item) => kind === "all" || (kind === "link" ? item.link : !item.link))
        .sort(
          (a, b) =>
            (semanticResults ? 0 : sort === "newest" ? -1 : 1) *
            (new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()),
        ),
    [kind, scoped, semanticResults, sort],
  );

  const groups = useMemo(() => {
    if (semanticResults) return [{ label: "", items: visibleItems }];
    const result: { label: string; items: ContentItem[] }[] = [];
    for (const item of visibleItems) {
      const label = groupLabel(item.createdAt);
      const last = result[result.length - 1];
      if (last?.label === label) last.items.push(item);
      else result.push({ label, items: [item] });
    }
    return result;
  }, [semanticResults, visibleItems]);

  function openCreate(defaults: ItemDefaults = {}) {
    setCreateDefaults({
      ...defaults,
      categoryId: defaults.categoryId || (collection !== "all" ? collection : undefined),
    });
  }

  function changeQuery(value: string) {
    setQuery(value);
    if (semanticResults) {
      setSemanticResults(false);
      setAnswer("");
      void loadDashboard();
    }
  }

  async function search(text = query) {
    const asked = text.trim();
    if (!asked || searching) return;
    setSearching(true);
    try {
      const result = await brainApi.search(asked);
      addRecentSearch(asked);
      setQuery(asked);
      setSemanticResults(true);
      setAnswer(result.answer || "I found relevant items in your Brain Dock.");
      setItems(result.content || []);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Search failed.");
    } finally {
      setSearching(false);
    }
  }

  function quickCapture(event: FormEvent) {
    event.preventDefault();
    const text = quick.trim();
    if (!text) return;
    if (/^https?:\/\/\S+$/i.test(text)) {
      let host = text;
      try {
        host = new URL(text).hostname.replace(/^www\./, "");
      } catch {}
      openCreate({ link: text, title: host });
    } else {
      openCreate({ title: text.length > 60 ? `${text.slice(0, 57)}…` : text, content: text });
    }
    setQuick("");
  }

  async function create(body: CreateContent) {
    setSaving(true);
    try {
      await brainApi.createContent(body);
      setCreateDefaults(undefined);
      setNotice("Saved to your Brain Dock.");
      setSemanticResults(false);
      setAnswer("");
      await loadDashboard();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save this item.");
    } finally {
      setSaving(false);
    }
  }

  async function createCollection(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(new FormData(event.currentTarget).get("name")).trim();
    if (name.length < 2) return setNotice("Collection names need at least 2 characters.");
    setSaving(true);
    try {
      const created = await brainApi.createCategory(name);
      setCategories((current) => [...current, created]);
      setCollection(created._id);
      setShowCollection(false);
      setNotice("Collection created successfully.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not create this collection.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const target = pendingDelete;
    setSaving(true);
    try {
      if (target.type === "content") {
        await brainApi.deleteContent(target.id);
        setItems((current) => current.filter((item) => item._id !== target.id));
        setNotice("Content deleted successfully.");
      } else {
        await brainApi.deleteCategory(target.id);
        setCategories((current) => current.filter((c) => c._id !== target.id));
        if (collection === target.id) setCollection("all");
        setNotice("Collection deleted successfully.");
      }
      setPendingDelete(undefined);
    } catch (error) {
      setPendingDelete(undefined);
      setNotice(error instanceof Error ? error.message : "Could not delete this item.");
    } finally {
      setSaving(false);
    }
  }

  async function copyLink(link: string) {
    try {
      await navigator.clipboard.writeText(link);
      setNotice("Link copied to clipboard.");
    } catch {
      setNotice("Could not copy the link.");
    }
  }

  async function logout() {
    try {
      await authApi.signout();
    } finally {
      router.push("/login");
    }
  }

  function toggleTag(id: string) {
    setSelectedTags((current) =>
      current.includes(id) ? current.filter((t) => t !== id) : [...current, id],
    );
  }

  function clearFilters() {
    const wasSemantic = semanticResults;
    setCollection("all");
    setSelectedTags([]);
    setKind("all");
    setSort("newest");
    setQuery("");
    setSemanticResults(false);
    setAnswer("");
    if (wasSemantic) void loadDashboard();
  }

  const closeCreate = useCallback(() => setCreateDefaults(undefined), []);
  const closeCollection = useCallback(() => setShowCollection(false), []);
  const closeDelete = useCallback(() => setPendingDelete(undefined), []);

  const selectedName =
    collection === "all"
      ? "All saved"
      : categories.find((category) => category._id === collection)?.name || "Collection";
  const hasFilters =
    collection !== "all" || selectedTags.length > 0 || kind !== "all" || query || semanticResults;
  const firstName = (user?.username || "").split(" ")[0];
  const heading = semanticResults
    ? "AI recommendations"
    : collection === "all"
      ? "Everything you saved"
      : selectedName;

  const kinds: { id: Kind; label: string }[] = [
    { id: "all", label: "All" },
    { id: "link", label: "Links" },
    { id: "note", label: "Notes" },
  ];

  return (
    <div className="landing grain min-h-screen flex-1">
      <Sidebar
        total={items.length}
        categories={categories}
        counts={counts}
        selected={collection}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onSelect={setCollection}
        onNewItem={() => openCreate()}
        onNewCollection={() => setShowCollection(true)}
        onDeleteCollection={(c) =>
          setPendingDelete({ type: "collection", id: c._id, name: c.name })
        }
        onSearch={() => searchRef.current?.focus()}
        user={user}
        onLogout={logout}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
      />

      <div className={cn("transition-[padding]", SIDEBAR_MOTION, collapsed ? "lg:pl-16" : "lg:pl-64")}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur sm:px-6 lg:px-10">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <SearchBar
            inputRef={searchRef}
            query={query}
            onQueryChange={changeQuery}
            onAsk={(text) => void search(text)}
            searching={searching}
            items={items}
            tags={tags}
            categories={categories}
          />

        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-8 sm:px-6 lg:px-10 lg:pb-12 lg:pt-10">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
            <div>
              <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                {greeting()}
                {firstName && <>, <span className="text-gradient">{firstName}</span></>}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {loading ? (
                  <span className="inline-block h-4 w-56 animate-pulse rounded bg-muted align-middle" />
                ) : (
                  <>
                    {items.length} saved · {categories.length} collection
                    {categories.length === 1 ? "" : "s"} · {tags.length} tag
                    {tags.length === 1 ? "" : "s"}
                  </>
                )}
              </p>
            </div>
            <div className="hidden sm:block">
              <Button onClick={() => openCreate()} icon={Plus} showArrow={false}>
                Add item
              </Button>
            </div>
          </div>

          <form
            onSubmit={quickCapture}
            className="mt-6 flex items-center gap-2 rounded-2xl border border-border bg-surface p-2 pl-4 shadow-sm focus-within:border-foreground/30 focus-within:ring-2 focus-within:ring-accent/20"
          >
            <Plus className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              value={quick}
              onChange={(e) => setQuick(e.target.value)}
              placeholder="Paste a link or jot a note…"
              aria-label="Quick capture"
              className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none focus-visible:!outline-none placeholder:text-muted-foreground/70"
            />
            <button
              type="submit"
              disabled={!quick.trim()}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-foreground px-4 text-sm font-medium text-background disabled:opacity-40"
            >
              Save <CornerDownLeft className="h-3.5 w-3.5" aria-hidden />
            </button>
          </form>

          {loadError && (
            <div role="alert" className="mt-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
              <span className="flex-1">{loadError}</span>
              <button
                type="button"
                onClick={retryLoad}
                className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden /> Retry
              </button>
            </div>
          )}

          {answer && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent-soft p-4 sm:p-5">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface text-accent">
                <Sparkles className="h-4 w-4" aria-hidden />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                  AI answer for “{query}”
                </p>
                <p className="mt-1 text-sm leading-relaxed">{answer}</p>
              </div>
              <button
                type="button"
                onClick={() => setAnswer("")}
                aria-label="Dismiss answer"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Collections as chips on small screens (sidebar is hidden there). */}
          <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden" role="tablist" aria-label="Collections">
            {[{ _id: "all", name: "All saved" }, ...categories].map((c) => (
              <button
                key={c._id}
                type="button"
                role="tab"
                aria-selected={collection === c._id}
                onClick={() => setCollection(c._id)}
                className={cn(
                  "shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium",
                  collection === c._id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-surface text-muted-foreground",
                )}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-baseline gap-x-3">
              <h2 className="text-lg font-semibold tracking-[-0.01em]">{heading}</h2>
              <span className="text-sm text-muted-foreground" aria-live="polite">
                {visibleItems.length} item{visibleItems.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex rounded-lg border border-border bg-surface p-0.5" role="group" aria-label="Type">
                {kinds.map((k) => (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKind(k.id)}
                    aria-pressed={kind === k.id}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm font-medium",
                      kind === k.id
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {k.label}
                    <span className="ml-1.5 text-xs opacity-60">{kindCounts[k.id]}</span>
                  </button>
                ))}
              </div>
              <SortMenu value={sort} onChange={setSort} />
              <div className="inline-flex rounded-lg border border-border bg-surface p-0.5" role="group" aria-label="Layout">
                {([["grid", LayoutGrid], ["list", List]] as const).map(([mode, Icon]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => changeView(mode)}
                    aria-pressed={view === mode}
                    aria-label={`${mode} view`}
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md",
                      view === mode ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {sortedTags.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filter by tag">
              {shownTags.map((tag) => {
                const active = selectedTags.includes(tag._id);
                return (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => toggleTag(tag._id)}
                    aria-pressed={active}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium",
                      active
                        ? "border-accent bg-accent-soft text-foreground"
                        : "border-border bg-surface text-muted-foreground hover:border-foreground/20 hover:text-foreground",
                    )}
                  >
                    {active && <Check className="h-3 w-3" aria-hidden />}#{tag.name || tag.title}
                    <span className="opacity-50">{tagCounts[tag._id] ?? 0}</span>
                  </button>
                );
              })}
              {sortedTags.length > 8 && (
                <button
                  type="button"
                  onClick={() => setShowAllTags((v) => !v)}
                  className="px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {showAllTags ? "Show fewer" : `+${sortedTags.length - 8} more`}
                </button>
              )}
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="ml-auto px-2 text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {term && !loading && (
            <button
              type="button"
              onClick={() => void search()}
              disabled={searching}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-dashed border-accent/40 bg-accent-soft/50 px-4 py-3 text-left text-sm hover:bg-accent-soft"
            >
              <Sparkles className={cn("h-4 w-4 shrink-0 text-accent", searching && "animate-pulse")} aria-hidden />
              <span className="flex-1">
                {searching ? "Thinking…" : <>Ask AI about <strong>“{term}”</strong> across everything you saved</>}
              </span>
              <kbd className="hidden rounded border border-border bg-surface px-1.5 text-xs text-muted-foreground sm:block">
                Enter
              </kbd>
            </button>
          )}

          <div className="mt-6">
            {loading ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-busy="true">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-44 animate-pulse rounded-2xl border border-border bg-surface" />
                ))}
              </div>
            ) : visibleItems.length ? (
              <div className="space-y-8">
                {groups.map((group) => (
                  <section key={group.label || "results"} aria-label={group.label || "Results"}>
                    {group.label && (
                      <h3 className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                        {group.label}
                      </h3>
                    )}
                    <div
                      className={cn(
                        view === "grid" ? "grid gap-4 sm:grid-cols-2 xl:grid-cols-3" : "flex flex-col gap-2",
                      )}
                    >
                      {group.items.map((item) => (
                        <ItemCard
                          key={item._id}
                          item={item}
                          view={view}
                          term={term}
                          onCopy={copyLink}
                          onDelete={(it) =>
                            setPendingDelete({ type: "content", id: it._id, name: it.title })
                          }
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : (
              !loadError && (
                <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-16 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <Sparkles className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">
                    {items.length === 0 && !semanticResults
                      ? "Your Brain Dock is empty"
                      : collection !== "all" && !hasFilters
                        ? "Nothing in this collection yet"
                        : "Nothing matched"}
                  </h3>
                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    {items.length === 0 && !semanticResults
                      ? "Paste a link above or add your first note — it will show up here."
                      : "Try a different phrase, tag, or collection."}
                  </p>
                  <div className="mt-6 flex gap-2">
                    {(query || selectedTags.length > 0 || kind !== "all" || semanticResults) && (
                      <Button variant="secondary" showArrow={false} onClick={clearFilters}>
                        Clear filters
                      </Button>
                    )}
                    <Button icon={Plus} showArrow={false} onClick={() => openCreate()}>
                      Add an item
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </main>
      </div>

      <button
        type="button"
        onClick={() => openCreate()}
        aria-label="Add item"
        className="fixed bottom-6 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-foreground text-background shadow-xl active:scale-95 sm:hidden"
      >
        <Plus className="h-6 w-6" />
      </button>

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

      {createDefaults && (
        <CreateItemModal
          categories={categories}
          tags={tags}
          defaults={createDefaults}
          saving={saving}
          onClose={closeCreate}
          onSubmit={create}
          onCreateCollection={() => {
            setCreateDefaults(undefined);
            setShowCollection(true);
          }}
        />
      )}

      {showCollection && (
        <Modal
          eyebrow="New collection"
          title="Make room for"
          accent="something new."
          onClose={closeCollection}
        >
          <form onSubmit={createCollection} className="space-y-4">
            <Field label="Collection name">
              <input
                required
                autoFocus
                minLength={2}
                name="name"
                placeholder="e.g. Reading list"
                className={cn(fieldClass, "h-11")}
              />
            </Field>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Creating…" : "Create collection"}
            </Button>
          </form>
        </Modal>
      )}

      {pendingDelete && (
        <Modal
          eyebrow={`Delete ${pendingDelete.type}`}
          title="Are you"
          accent="sure?"
          onClose={closeDelete}
        >
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">{pendingDelete.name}</span> will be
            permanently deleted
            {pendingDelete.type === "collection" ? ", along with its saved items" : ""}. This
            can&apos;t be undone.
          </p>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" showArrow={false} onClick={closeDelete}>
              Cancel
            </Button>
            <Button
              showArrow={false}
              disabled={saving}
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700 active:bg-red-700"
            >
              {saving ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}

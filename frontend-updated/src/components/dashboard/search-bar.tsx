"use client";

import { RefObject, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { Clock, CornerDownLeft, FileText, Link2, Search, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { fieldClass } from "@/components/dashboard/modal";
import type { Category, ContentItem, Tag } from "@/lib/api";

const RECENT_KEY = "braindock:recent-searches";
const RECENT_EVENT = "braindock:recent-searches-change";

const subscribeRecent = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(RECENT_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(RECENT_EVENT, callback);
  };
};
// useSyncExternalStore needs a stable snapshot, so hand back the raw string and parse it below.
const readRecentRaw = () => {
  try {
    return localStorage.getItem(RECENT_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};

export function addRecentSearch(text: string) {
  const value = text.trim();
  if (!value) return;
  try {
    const current: string[] = JSON.parse(readRecentRaw());
    const next = [value, ...current.filter((r) => r.toLowerCase() !== value.toLowerCase())].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {}
  window.dispatchEvent(new Event(RECENT_EVENT));
}

function clearRecentSearches() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {}
  window.dispatchEvent(new Event(RECENT_EVENT));
}

type Option =
  | { kind: "recent"; label: string }
  | { kind: "suggestion"; label: string }
  | { kind: "ask"; label: string }
  | { kind: "item"; label: string; item: ContentItem };

export function SearchBar({
  inputRef,
  query,
  onQueryChange,
  onAsk,
  searching,
  items,
  tags,
  categories,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  onQueryChange: (value: string) => void;
  onAsk: (text: string) => void;
  searching: boolean;
  items: ContentItem[];
  tags: Tag[];
  categories: Category[];
}) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const recentRaw = useSyncExternalStore(subscribeRecent, readRecentRaw, () => "[]");
  const recents = useMemo<string[]>(() => {
    try {
      return JSON.parse(recentRaw);
    } catch {
      return [];
    }
  }, [recentRaw]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const term = query.trim();

  const options = useMemo<Option[]>(() => {
    if (term) {
      const needle = term.toLowerCase();
      const matches = items
        .filter((item) =>
          [item.title, item.content, ...(item.tags?.map((t) => t.name || t.title || "") ?? [])]
            .join(" ")
            .toLowerCase()
            .includes(needle),
        )
        .slice(0, 5)
        .map<Option>((item) => ({ kind: "item", label: item.title, item }));
      return [...matches, { kind: "ask", label: term }];
    }
    const result: Option[] = recents.map((label) => ({ kind: "recent", label }));
    const topTag = tags[0]?.name || tags[0]?.title;
    const suggestions = [
      topTag && `What did I save about ${topTag}?`,
      categories[0] && `Summarize my ${categories[0].name} collection`,
      items.length > 0 && "What have I saved recently?",
    ].filter(Boolean) as string[];
    return [...result, ...suggestions.map<Option>((label) => ({ kind: "suggestion", label }))];
  }, [categories, items, recents, tags, term]);

  function choose(option: Option) {
    setOpen(false);
    setActive(-1);
    if (option.kind === "item") {
      router.push(`/dashboard/item/${option.item._id}`);
      return;
    }
    onQueryChange(option.label);
    onAsk(option.label);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!options.length) return;
      e.preventDefault();
      setOpen(true);
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (i + step + options.length) % options.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && active >= 0 && options[active]) choose(options[active]);
      else if (term) {
        setOpen(false);
        onAsk(term);
      }
    } else if (e.key === "Escape") {
      if (open) {
        setOpen(false);
        setActive(-1);
      } else {
        onQueryChange("");
        e.currentTarget.blur();
      }
    }
  }

  const sectionOf = (o: Option) =>
    o.kind === "recent" ? "Recent searches" : o.kind === "suggestion" ? "Try asking" : o.kind === "item" ? "Matches" : "Ask AI";

  return (
    <div ref={wrapRef} className="relative w-full max-w-2xl flex-1">
      <Search
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <input
        ref={inputRef}
        value={query}
        role="combobox"
        aria-expanded={open}
        aria-controls="search-options"
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `search-option-${active}` : undefined}
        aria-label="Search your Brain Dock"
        placeholder="Search your saves, or ask a question…"
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onQueryChange(e.target.value);
          setActive(-1);
          setOpen(true);
        }}
        onKeyDown={onKeyDown}
        className={cn(fieldClass, "h-11 rounded-xl pl-10 pr-24 shadow-sm")}
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {query ? (
          <button
            type="button"
            onClick={() => {
              onQueryChange("");
              inputRef.current?.focus();
            }}
            aria-label="Clear search"
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <kbd className="pointer-events-none hidden rounded border border-border bg-muted px-1.5 text-xs text-muted-foreground sm:block">
            /
          </kbd>
        )}
        <button
          type="button"
          disabled={!term || searching}
          onClick={() => onAsk(term)}
          aria-label="Ask AI"
          title="Ask AI"
          className="flex h-7 items-center gap-1 rounded-md bg-accent-soft px-2 text-xs font-medium text-accent hover:bg-accent/20 disabled:opacity-40"
        >
          <Sparkles className={cn("h-3.5 w-3.5", searching && "animate-pulse")} aria-hidden />
          <span className="hidden sm:inline">Ask AI</span>
        </button>
      </div>

      {open && options.length > 0 && (
        <div
          id="search-options"
          role="listbox"
          className="absolute left-0 right-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-surface p-1.5 shadow-xl"
        >
          {options.map((option, i) => {
            const showHeading = i === 0 || sectionOf(options[i - 1]) !== sectionOf(option);
            const Icon =
              option.kind === "recent"
                ? Clock
                : option.kind === "item"
                  ? option.item.link
                    ? Link2
                    : FileText
                  : Sparkles;
            return (
              <div key={`${option.kind}-${option.label}-${i}`}>
                {showHeading && (
                  <div className="flex items-center justify-between px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {sectionOf(option)}
                    {option.kind === "recent" && (
                      <button
                        type="button"
                        onClick={clearRecentSearches}
                        className="normal-case tracking-normal hover:text-foreground"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                )}
                <button
                  id={`search-option-${i}`}
                  type="button"
                  role="option"
                  aria-selected={active === i}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(option)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
                    active === i ? "bg-muted" : "hover:bg-muted",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      option.kind === "ask" || option.kind === "suggestion"
                        ? "text-accent"
                        : "text-muted-foreground",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {option.kind === "ask" ? (
                      <>
                        Ask AI about <strong>“{option.label}”</strong>
                      </>
                    ) : (
                      option.label
                    )}
                  </span>
                  {active === i && (
                    <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

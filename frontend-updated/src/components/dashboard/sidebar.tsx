"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import {
  Brain,
  Folder,
  LayoutGrid,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category, User } from "@/lib/api";

const COLLAPSE_KEY = "braindock:sidebar-collapsed";
const COLLAPSE_EVENT = "braindock:sidebar-collapsed-change";

const subscribeCollapsed = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(COLLAPSE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(COLLAPSE_EVENT, callback);
  };
};
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === "1";
  } catch {
    return false;
  }
};

/** Desktop sidebar collapsed state, remembered between visits. */
export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(subscribeCollapsed, readCollapsed, () => false);
  const toggle = () => {
    try {
      localStorage.setItem(COLLAPSE_KEY, readCollapsed() ? "0" : "1");
    } catch {}
    window.dispatchEvent(new Event(COLLAPSE_EVENT));
  };
  return [collapsed, toggle] as const;
}

const initials = (user?: User) =>
  (user?.username || user?.email || "A")
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

type NavProps = {
  total: number;
  categories: Category[];
  counts: Record<string, number>;
  selected: string;
  onSelect: (id: string) => void;
  onNewItem: () => void;
  onNewCollection: () => void;
  onDeleteCollection: (category: Category) => void;
  onSearch: () => void;
  user?: User;
  onLogout: () => void;
};

// One easing/duration shared by the rail width, the page padding and every label so it all moves together.
export const SIDEBAR_MOTION = "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]";

const idle = "text-muted-foreground hover:bg-muted hover:text-foreground";
const iconBox = "flex h-10 w-10 shrink-0 items-center justify-center";

function SidebarBody({
  onClose,
  collapsed = false,
  desktop = false,
  onToggleCollapsed,
  profileOpen,
  onToggleProfile,
  ...p
}: NavProps & {
  onClose?: () => void;
  collapsed?: boolean;
  desktop?: boolean;
  onToggleCollapsed?: () => void;
  profileOpen: boolean;
  onToggleProfile: () => void;
}) {
  const pick = (fn: () => void) => () => {
    fn();
    onClose?.();
  };

  // Rows keep the same structure in both states: a fixed icon box plus a label that fades and gets clipped.
  // Only the row width changes, so nothing re-flows mid-animation.
  const row = cn(
    "relative flex h-10 items-center overflow-hidden rounded-lg text-sm font-medium",
    "transition-[width,background-color,color]",
    SIDEBAR_MOTION,
    collapsed ? "w-10" : "w-full",
  );
  const label = cn(
    "min-w-0 flex-1 truncate whitespace-nowrap text-left transition-opacity",
    collapsed ? "opacity-0 duration-100" : "opacity-100 delay-100 duration-200",
  );
  const heading = cn(
    "overflow-hidden px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground transition-[opacity,height,margin]",
    SIDEBAR_MOTION,
    collapsed ? "pointer-events-none mb-0 h-0 opacity-0" : "mb-1 h-5 opacity-100",
  );

  return (
    <div className={cn("flex h-full flex-col", desktop ? "w-64" : "w-full")}>
      <div className="flex h-16 shrink-0 items-center gap-3 px-4">
        <Link
          href="/"
          title="Brain Dock home"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background shadow-sm"
        >
          <Brain className="h-4 w-4" aria-hidden />
        </Link>
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-base font-semibold tracking-[-0.01em] transition-opacity",
            collapsed ? "opacity-0 duration-100" : "opacity-100 delay-100 duration-200",
          )}
        >
          Brain Dock
        </span>
        {desktop && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Collapse sidebar"
            title="Collapse sidebar  ["
            tabIndex={collapsed ? -1 : 0}
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-opacity hover:bg-muted hover:text-foreground",
              collapsed ? "pointer-events-none opacity-0 duration-100" : "opacity-100 delay-100 duration-200",
            )}
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {desktop && (
        <div
          className={cn(
            "overflow-hidden px-3 transition-[height,opacity]",
            SIDEBAR_MOTION,
            collapsed ? "h-10 opacity-100" : "pointer-events-none h-0 opacity-0",
          )}
        >
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label="Expand sidebar"
            title="Expand sidebar  ["
            tabIndex={collapsed ? 0 : -1}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="px-3 pt-1">
        <button
          type="button"
          onClick={pick(p.onNewItem)}
          title="New item  n"
          className={cn(
            row,
            // "!" because the landing stylesheet sets a global border colour that would otherwise win.
            "border border-dashed !border-foreground/40 text-foreground hover:!border-foreground/70 hover:bg-foreground/[0.03]",
          )}
        >
          <span className={cn(iconBox, "w-[calc(2.5rem-2px)]")}>
            <Plus className="h-4 w-4" aria-hidden />
          </span>
          <span className={label}>New item</span>
        </button>
      </div>

      <nav
        className="mt-5 flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 pb-4"
        aria-label="Workspace navigation"
      >
        <p className={heading}>Workspace</p>
        <button
          type="button"
          onClick={pick(() => p.onSelect("all"))}
          aria-current={p.selected === "all" ? "page" : undefined}
          title="All saved"
          className={cn(row, p.selected === "all" ? "bg-surface-elevated text-foreground shadow-sm" : idle)}
        >
          <span className={iconBox}>
            <LayoutGrid className="h-4 w-4" aria-hidden />
          </span>
          <span className={label}>All saved</span>
          <span className={cn("pr-3 text-xs text-muted-foreground transition-opacity", collapsed && "opacity-0")}>
            {p.total}
          </span>
        </button>
        <button type="button" onClick={pick(p.onSearch)} title="Search  /" className={cn(row, idle)}>
          <span className={iconBox}>
            <Search className="h-4 w-4" aria-hidden />
          </span>
          <span className={label}>Search</span>
        </button>
        <Link href="/dashboard/share" title="Share brain" className={cn(row, idle)}>
          <span className={iconBox}>
            <Share2 className="h-4 w-4" aria-hidden />
          </span>
          <span className={label}>Share brain</span>
        </Link>

        <div className="!mt-4 border-t border-border pt-3">
          <div className={cn(row, "text-muted-foreground")}>
            <span className={cn(label, "text-[11px] uppercase tracking-[0.14em]")}>
              <span className="pl-3">Collections</span>
            </span>
            <button
              type="button"
              onClick={pick(p.onNewCollection)}
              aria-label="Add collection"
              title="Add collection"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg hover:bg-muted hover:text-foreground"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {p.categories.length ? (
          p.categories.map((c) => (
            <div key={c._id} className="relative">
              <button
                type="button"
                onClick={pick(() => p.onSelect(c._id))}
                aria-current={p.selected === c._id ? "page" : undefined}
                title={collapsed ? `${c.name} (${p.counts[c._id] ?? 0})` : c.name}
                className={cn(row, p.selected === c._id ? "bg-accent-soft text-foreground" : idle)}
              >
                <span className={iconBox}>
                  <Folder className="h-4 w-4" aria-hidden />
                </span>
                <span className={cn(label, "pr-1")}>{c.name}</span>
                <span className={cn("pr-11 text-xs text-muted-foreground transition-opacity", collapsed && "opacity-0")}>
                  {p.counts[c._id] ?? 0}
                </span>
              </button>
              <button
                type="button"
                onClick={() => p.onDeleteCollection(c)}
                aria-label={`Delete ${c.name}`}
                tabIndex={collapsed ? -1 : 0}
                className={cn(
                  "absolute right-1.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-opacity hover:bg-red-50 hover:text-red-600",
                  collapsed ? "pointer-events-none opacity-0 duration-100" : "opacity-100 delay-100 duration-200",
                )}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        ) : (
          <p
            className={cn(
              "overflow-hidden whitespace-nowrap px-3 text-sm text-muted-foreground transition-opacity",
              collapsed ? "h-0 opacity-0" : "py-2 opacity-100",
            )}
          >
            No collections yet
          </p>
        )}
      </nav>

      <div className="shrink-0 border-t border-border px-3 py-3">
        <div className={cn(row, "h-12 bg-surface-elevated")}>
          {/* Avatar opens the account menu, which is how you reach Log out while the sidebar is collapsed. */}
          <button
            type="button"
            onClick={onToggleProfile}
            aria-haspopup="menu"
            aria-expanded={profileOpen}
            aria-label="Account menu"
            title={p.user?.username || p.user?.email || "Your account"}
            className={cn(iconBox, "h-12")}
          >
            <span
              aria-hidden
              className="flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-[11px] font-semibold text-background"
            >
              {initials(p.user)}
            </span>
          </button>
          <span className={cn(label, "leading-tight")}>
            <span className="block truncate text-sm font-medium">{p.user?.username || "Your account"}</span>
            <span className="block truncate text-xs font-normal text-muted-foreground">{p.user?.email}</span>
          </span>
          <button
            type="button"
            onClick={p.onLogout}
            aria-label="Log out"
            title="Log out"
            tabIndex={collapsed ? -1 : 0}
            className={cn(
              "mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-opacity hover:bg-red-50 hover:text-red-600",
              collapsed ? "pointer-events-none opacity-0 duration-100" : "opacity-100 delay-100 duration-200",
            )}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Sidebar(
  props: NavProps & {
    open: boolean;
    onClose: () => void;
    collapsed: boolean;
    onToggleCollapsed: () => void;
  },
) {
  const { open, onClose, collapsed, onToggleCollapsed, ...nav } = props;
  const { onLogout } = nav;
  const [profileOpen, setProfileOpen] = useState(false);
  const toggleProfile = () => setProfileOpen((v) => !v);

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden overflow-hidden border-r border-border bg-surface/70 backdrop-blur transition-[width] lg:block",
          SIDEBAR_MOTION,
          collapsed ? "w-16" : "w-64",
        )}
        aria-label="Sidebar"
      >
        <SidebarBody
          {...nav}
          desktop
          collapsed={collapsed}
          onToggleCollapsed={onToggleCollapsed}
          profileOpen={profileOpen}
          onToggleProfile={toggleProfile}
        />
      </aside>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} aria-hidden />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-background shadow-xl">
            <SidebarBody {...nav} onClose={onClose} profileOpen={profileOpen} onToggleProfile={toggleProfile} />
          </aside>
        </div>
      )}

      {profileOpen && (
        <>
          <div className="fixed inset-0 z-[55]" onClick={() => setProfileOpen(false)} aria-hidden />
          <div
            role="menu"
            className="fixed bottom-[4.75rem] left-3 z-[60] w-60 rounded-xl border border-border bg-surface p-1.5 shadow-xl"
          >
            <div className="border-b border-border px-3 py-2">
              <p className="truncate text-sm font-medium">{nav.user?.username || "Your account"}</p>
              <p className="truncate text-xs text-muted-foreground">{nav.user?.email}</p>
            </div>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setProfileOpen(false);
                onLogout();
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Log out
            </button>
          </div>
        </>
      )}
    </>
  );
}

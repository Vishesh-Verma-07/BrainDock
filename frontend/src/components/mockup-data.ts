import {
  Brain,
  Star,
  Folder,
  Users,
  FileText,
  Video,
  StickyNote,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  count?: number;
  active?: boolean;
}

export interface Collection {
  label: string;
  count: number;
  color: string;
}

export interface SavedItem {
  id: number;
  type: "article" | "video" | "note";
  title: string;
  domain?: string;
  channel?: string;
  time: string;
  tags: string[];
  icon: LucideIcon;
}

export interface Stat {
  label: string;
  value: number;
}

export type Stats = Stat[];

export const sidebarNav: NavItem[] = [
  { label: "All saved", icon: Brain, count: 24, active: true },
  { label: "Favorites", icon: Star },
  { label: "Collections", icon: Folder },
  { label: "Shared", icon: Users },
];

export const collections: Collection[] = [
  { label: "Design", count: 12, color: "bg-accent" },
  { label: "Learning", count: 24, color: "bg-amber" },
  { label: "Ideas", count: 8, color: "bg-muted-foreground" },
  { label: "Research", count: 17, color: "bg-foreground/60" },
];

export const savedItems: SavedItem[] = [
  {
    id: 1,
    type: "article",
    title: "Designing better interfaces",
    domain: "medium.com",
    time: "2h ago",
    tags: ["design", "inspiration"],
    icon: FileText,
  },
  {
    id: 2,
    type: "video",
    title: "The future of creative tools",
    channel: "Fireship",
    time: "Yesterday",
    tags: ["ai", "creativity"],
    icon: Video,
  },
  {
    id: 3,
    type: "note",
    title: "Things worth exploring",
    time: "Jun 12",
    tags: ["ideas"],
    icon: StickyNote,
  },
];

export const stats: Stats = [
  { label: "Saved", value: 24 },
  { label: "Notes", value: 6 },
  { label: "Videos", value: 9 },
];
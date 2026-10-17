import { Link2, StickyNote, Video, FileText, Bookmark, Lightbulb, BookOpen, Quote, Image as ImageIcon, Globe } from "lucide-react";

const items = [
  { icon: Link2, label: "Articles worth rereading" },
  { icon: Video, label: "YouTube lectures" },
  { icon: StickyNote, label: "Half-formed ideas" },
  { icon: BookOpen, label: "Research papers" },
  { icon: Bookmark, label: "Tabs you never closed" },
  { icon: Quote, label: "Quotes & highlights" },
  { icon: FileText, label: "Meeting notes" },
  { icon: Lightbulb, label: "Late-night thoughts" },
  { icon: ImageIcon, label: "Screenshots" },
  { icon: Globe, label: "Reference links" },
];

export function UseCaseMarquee() {
  const row = [...items, ...items];

  return (
    <section aria-label="Things you can save" className="relative py-4 overflow-hidden">
      <div className="marquee-mask">
        <div className="marquee-track flex w-max animate-marquee gap-3">
          {row.map((item, i) => {
            const Icon = item.icon;
            return (
              <span
                key={i}
                aria-hidden={i >= items.length}
                className="flex items-center gap-2.5 whitespace-nowrap rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm transition-colors hover:text-foreground hover:border-foreground/20"
              >
                <Icon className="h-4 w-4 text-accent" aria-hidden />
                {item.label}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}

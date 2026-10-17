import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
  narrow?: boolean;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
  align = "left",
  narrow = false,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 md:mb-10",
        align === "center" && "text-center mx-auto",
        narrow ? "max-w-2xl" : "max-w-3xl",
        className
      )}
    >
      {eyebrow && (
        <p className="text-xs font-medium tracking-[0.12em] uppercase text-muted-foreground mb-4">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-[1.1] text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base md:text-lg leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Card whose border and surface glow follow the cursor. Pair with `.spotlight` in globals.css. */
export function SpotlightCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div onMouseMove={onMove} className={cn("spotlight", className)} {...props}>
      {children}
    </div>
  );
}

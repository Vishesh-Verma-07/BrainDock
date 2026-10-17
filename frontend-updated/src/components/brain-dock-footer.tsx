"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { easeOutExpo } from "@/lib/motion";

export function BrainDockFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6, ease: easeOutExpo }}
      className="px-5 py-4 border-t border-border bg-surface-elevated/30 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center justify-center w-6 h-6 rounded-md bg-accent/10 text-accent">
          <Check className="w-3.5 h-3.5" aria-hidden />
        </span>
        <div className="flex flex-col">
          <span className="text-[10px] font-semibold leading-none">24 items saved</span>
          <span className="text-[9px] text-muted-foreground mt-0.5">3 collections · 6 tags</span>
        </div>
      </div>
      <button className="group flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
        <span>View all</span>
        <span className="transition-transform duration-250 ease-out-expo group-hover:translate-x-0.5">→</span>
      </button>
    </motion.div>
  );
}
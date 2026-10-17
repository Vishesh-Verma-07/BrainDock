"use client";

import { motion } from "framer-motion";
import { Search, Sparkles, Mic } from "lucide-react";
import { easeOutExpo } from "@/lib/motion";

export function BrainDockSearch() {
  return (
    <div className="px-5 py-4 border-b border-border bg-surface-elevated/40">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: easeOutExpo }}
        className="relative"
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          readOnly
          placeholder="Ask your Brain Dock..."
          className="w-full h-11 pl-11 pr-11 text-sm rounded-xl border border-border bg-surface text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-accent/50 focus:bg-surface-elevated transition-all duration-200 cursor-text"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05] transition-all duration-200 cursor-pointer">
            <Mic className="w-3.5 h-3.5" />
          </button>
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent/10 text-accent">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>
      </motion.div>
    </div>
  );
}
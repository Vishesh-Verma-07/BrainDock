"use client";

import { motion } from "framer-motion";
import { BrainDockSidebar } from "@/components/brain-dock-sidebar";
import { BrainDockSearch } from "@/components/brain-dock-search";
import { BrainDockMain } from "@/components/brain-dock-main";
import { BrainDockFooter } from "@/components/brain-dock-footer";
import { slideUp, viewportOnce } from "@/lib/motion";

export function BrainDockMockup({ immediate = false }: { immediate?: boolean }) {
  return (
    <motion.div
      initial="hidden"
      {...(immediate ? { animate: "show" } : { whileInView: "show" })}
      variants={slideUp}
      viewport={viewportOnce}
      className="relative"
    >
      <div className="absolute -inset-4 bg-gradient-to-b from-foreground/[0.04] via-transparent to-transparent rounded-[32px] blur-2xl pointer-events-none" />
      <div className="relative rounded-[28px] overflow-hidden border border-border shadow-2xl bg-surface">
        <div className="flex flex-col lg:flex-row">
          <BrainDockSidebar />
          <div className="flex-1 min-w-0 flex flex-col">
            <BrainDockSearch />
            <BrainDockMain />
            <BrainDockFooter />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

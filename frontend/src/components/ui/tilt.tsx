"use client";

import * as React from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

/** 3D mouse-tilt wrapper. Disabled automatically for reduced-motion users via the spring staying near 0. */
export function Tilt({
  children,
  max = 6,
  className,
}: {
  children: React.ReactNode;
  max?: number;
  className?: string;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 18 });
  const sy = useSpring(y, { stiffness: 140, damping: 18 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div style={{ perspective: 1200 }} onMouseMove={onMove} onMouseLeave={reset} className={className}>
      <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>{children}</motion.div>
    </div>
  );
}

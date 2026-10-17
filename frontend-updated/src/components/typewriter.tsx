"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

/** Types `text` once when scrolled into view. Renders full text immediately for reduced-motion users. */
export function Typewriter({
  text,
  speed = 38,
  onDone,
}: {
  text: string;
  speed?: number;
  onDone?: () => void;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.8 });
  const [count, setCount] = useState(0);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (!inView) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = reduced ? text.length : 1;
    let i = 0;
    const id = setInterval(() => {
      i += step;
      setCount(Math.min(i, text.length));
      if (i >= text.length) {
        clearInterval(id);
        doneRef.current?.();
      }
    }, speed);
    return () => clearInterval(id);
  }, [inView, text, speed]);

  return (
    <span ref={ref} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      <span aria-hidden className="ml-px inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-blink bg-accent" />
    </span>
  );
}

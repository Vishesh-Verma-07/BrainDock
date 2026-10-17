"use client";

import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";
import { Container } from "@/components/ui/container";

const stats = [
  { value: 4, suffix: "", label: "content types, one calm inbox" },
  { value: 1, suffix: "", label: "place for everything you want to keep" },
  { value: 0, suffix: "", label: "tabs to hunt through when you need it" },
  { value: 100, suffix: "%", label: "of answers grounded in your own saves" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const node = ref.current;
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = `${Math.round(v)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export function StatsStrip() {
  return (
    <section className="py-8 md:py-10">
      <Container>
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4 lg:divide-x lg:divide-border">
          {stats.map((s) => (
            <div key={s.label} className="px-2 text-center lg:px-8">
              <dt className="sr-only">{s.label}</dt>
              <dd className="text-5xl font-bold tracking-[-0.04em] text-gradient md:text-6xl">
                <CountUp to={s.value} suffix={s.suffix} />
              </dd>
              <p className="mx-auto mt-3 max-w-[14rem] text-sm leading-snug text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

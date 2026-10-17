export const easeOutExpo = [0.22, 1, 0.36, 1] as const;
export const easeInOutExpo = [0.65, 0, 0.35, 1] as const;
export const easeBackOut = [0.34, 1.56, 0.64, 1] as const;

export const duration = {
  fast: 0.2,
  base: 0.3,
  slow: 0.5,
  slower: 0.7,
} as const;

export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export const slideUp = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

export const hoverLift = {
  whileHover: {
    y: -4,
    scale: 1.01,
    transition: { duration: 0.25, ease: easeOutExpo },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const hoverGlow = {
  whileHover: {
    y: -3,
    boxShadow: "0 16px 40px -12px rgba(28,25,21,0.14), 0 4px 12px -4px rgba(28,25,21,0.08)",
    transition: { duration: 0.25, ease: easeOutExpo },
  },
};

export const hoverSlide = {
  whileHover: {
    x: 3,
    transition: { duration: 0.2, ease: easeOutExpo },
  },
};

export const hoverScale = {
  whileHover: {
    scale: 1.04,
    transition: { duration: 0.2, ease: easeOutExpo },
  },
  whileTap: {
    scale: 0.97,
  },
};

export const viewportOnce = {
  once: true,
  amount: 0.15,
} as const;
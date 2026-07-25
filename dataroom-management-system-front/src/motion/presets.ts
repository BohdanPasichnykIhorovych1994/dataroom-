export const FADE_DURATION = 0.2;

export const fadePresence = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: FADE_DURATION },
} as const;

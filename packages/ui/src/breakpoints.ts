/**
 * Adaptive-layout thresholds, in px. Match Tailwind's default `md`/`lg`
 * screens (neither app overrides `screens` in tailwind.config.ts) so plain
 * `md:`/`lg:` classes and {@link useBreakpoint} agree on the same cutoffs.
 */
export const BREAKPOINTS = {
  tablet: 768,
  desktop: 1024,
} as const;

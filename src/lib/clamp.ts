export const clamp = (n: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, n))

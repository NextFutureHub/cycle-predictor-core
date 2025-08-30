export const mean = (xs: number[]): number | null =>
  xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
export const median = (xs: number[]): number | null => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
};
export const stddev = (xs: number[]): number | null => {
  if (xs.length < 2) return null;
  const m = mean(xs)!;
  const v = mean(xs.map((x) => (x - m) ** 2))!;
  return Math.sqrt(v);
};

export const weightedMovingAverage = (
  xs: number[],
  window = 3
): number | null => {
  if (!xs.length) return null;
  const start = Math.max(0, xs.length - window);
  const slice = xs.slice(start);
  const weights = slice.map((_, i) => i + 1); // 1..n
  const wsum = weights.reduce((a, b) => a + b, 0);
  const val = slice.reduce((acc, x, i) => acc + x * weights[i], 0) / wsum;
  return val;
};

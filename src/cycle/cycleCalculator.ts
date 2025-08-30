/**
 * Расчёт следующей менструации.
 * Берёт дату начала и длину цикла.
 */
export function predictNextPeriod(startDate: Date, cycleLength: number): Date {
  const next = new Date(startDate);
  next.setDate(startDate.getDate() + cycleLength);
  return next;
}

/**
 * Средняя длина цикла на основе истории.
 */
export function calculateAverageCycleLength(cycles: number[]): number {
  if (!cycles.length) throw new Error("No cycles provided");
  const sum = cycles.reduce((a, b) => a + b, 0);
  return Math.round(sum / cycles.length);
}

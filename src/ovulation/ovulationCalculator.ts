/**
 * По умолчанию лютеиновая фаза ≈ 14 дней
 */
const DEFAULT_LUTEAL_PHASE = 14;

export interface OvulationResult {
  date: Date;
  confidence: "high" | "medium" | "low";
  notes?: string[];
}

/**
 * Рассчитывает день овуляции = (nextPeriod - lutealPhase).
 */
export function predictOvulation(
  nextPeriodStart: Date,
  lutealPhase: number = DEFAULT_LUTEAL_PHASE
): OvulationResult {
  const ovulationDate = new Date(nextPeriodStart);
  ovulationDate.setDate(nextPeriodStart.getDate() - lutealPhase);

  return {
    date: ovulationDate,
    confidence: "medium",
    notes: ["Calculated as nextPeriod - lutealPhase"],
  };
}

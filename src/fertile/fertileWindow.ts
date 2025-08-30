import { OvulationResult } from "../ovulation/ovulationCalculator";

export interface FertileWindow {
  start: Date;
  peak: Date;
  end: Date;
  confidence: string;
  notes?: string[];
}

/**
 * Фертильное окно = 5 дней до овуляции + день овуляции
 */
export function getFertileWindow(ovulation: OvulationResult): FertileWindow {
  const start = new Date(ovulation.date);
  start.setDate(start.getDate() - 5);

  const end = new Date(ovulation.date);
  end.setDate(end.getDate() + 1);

  return {
    start,
    peak: ovulation.date,
    end,
    confidence: ovulation.confidence,
    notes: [...(ovulation.notes || []), "fertile = ovulation ± (−5..+1)"],
  };
}

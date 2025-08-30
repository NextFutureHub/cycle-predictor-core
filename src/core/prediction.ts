import {
  DateRange,
  FertileWindow,
  HistoryInput,
  PredictionResult,
  PredictorConfig,
} from "../types";
import { addDays, sortAsc, toDate, toISO } from "../utils/date";
import { weightedMovingAverage } from "../utils/stats";

export const defaultConfig: Required<PredictorConfig> = {
  lutealPhaseDays: 14,
  irregularityStdThreshold: 4, // если std > 4д, считаем нерегулярным
  minIntervalsForConfidence: 3,
  strategy: "wma",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
};

export const buildWindow = (center: string, radius: number): DateRange => {
  const start = addDays(center, -radius);
  const end = addDays(center, radius);
  return { start, end };
};

export const computeNextPeriodByCalendar = (
  history: HistoryInput
): PredictionResult => {
  const dates = sortAsc(history.periodStarts.map((p) => p.date));
  if (dates.length < 2)
    return {
      likely: null,
      window: null,
      confidence: 0.1,
      notes: ["calendar: insufficient data"],
    };
  const intervals: number[] = [];
  for (let i = 1; i < dates.length; i++) {
    const prev = toDate(dates[i - 1]);
    const curr = toDate(dates[i]);
    const delta = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (delta > 5 && delta < 90) intervals.push(delta);
  }
  const last = dates[dates.length - 1];
  const avg = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const likely = addDays(last, Math.round(avg));
  const window = buildWindow(likely, 2); // календарная методика даёт узкое окно; расширим позже по нерегулярности
  return {
    likely,
    window,
    confidence: Math.min(1, intervals.length / 10),
    notes: ["calendar: mean interval"],
  };
};

export const computeNextPeriodByWMA = (
  history: HistoryInput
): PredictionResult => {
  const dates = sortAsc(history.periodStarts.map((p) => p.date));
  if (dates.length < 2)
    return {
      likely: null,
      window: null,
      confidence: 0.1,
      notes: ["wma: insufficient data"],
    };
  const intervals: number[] = [];
  for (let i = 1; i < dates.length; i++) {
    const prev = toDate(dates[i - 1]);
    const curr = toDate(dates[i]);
    const delta = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (delta > 5 && delta < 90) intervals.push(delta);
  }
  const w = weightedMovingAverage(intervals, Math.min(5, intervals.length));
  const last = dates[dates.length - 1];
  const likely = w ? addDays(last, Math.round(w)) : null;
  const window = likely ? buildWindow(likely, 3) : null;
  return {
    likely,
    window,
    confidence: Math.min(1, intervals.length / 10 + 0.1),
    notes: ["wma: weighted last intervals"],
  };
};

export const adjustForIrregularity = (
  pred: PredictionResult,
  std: number | null
): PredictionResult => {
  if (!pred.likely || !pred.window) return pred;
  if (std == null) return pred;
  const radius = Math.max(2, Math.round(std)); // ширина окна растёт с разбросом
  const window = buildWindow(pred.likely, radius);
  const confidence = Math.max(
    0.1,
    pred.confidence - Math.min(0.5, (radius - 2) * 0.05)
  );
  return {
    ...pred,
    window,
    confidence,
    notes: [...pred.notes, `irregularity: ±${radius}d`],
  };
};

export const computeFertilityFromNextPeriod = (
  nextPeriod: PredictionResult,
  lutealPhaseDays: number
): { ovulation: PredictionResult; fertile: FertileWindow } => {
  const notes: string[] = ["ovulation = nextPeriod - lutealPhaseDays"];
  if (!nextPeriod.likely) {
    return {
      ovulation: {
        likely: null,
        window: null,
        confidence: nextPeriod.confidence * 0.5,
        notes: [...nextPeriod.notes, ...notes, "no next period"],
      },
      fertile: {
        start: "1970-01-01",
        peak: "1970-01-01",
        end: "1970-01-01",
        confidence: 0,
        notes: [...nextPeriod.notes, ...notes, "no next period"],
      },
    };
  }
  const ovulationLikely = addDays(nextPeriod.likely, -lutealPhaseDays);
  const ovulationWindow = buildWindow(ovulationLikely, 1);
  const ovulation: PredictionResult = {
    likely: ovulationLikely,
    window: ovulationWindow,
    confidence: Math.max(0, nextPeriod.confidence - 0.1),
    notes: [...nextPeriod.notes, ...notes],
  };
  // Фертильное окно: 5 дней до овуляции + день овуляции
  const fertile: FertileWindow = {
    start: addDays(ovulationLikely, -5),
    peak: ovulationLikely,
    end: addDays(ovulationLikely, 1),
    confidence: ovulation.confidence,
    notes: [...ovulation.notes, "fertile = ovulation ± (−5..+1)"],
  };
  return { ovulation, fertile };
};

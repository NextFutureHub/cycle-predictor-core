export type ISODate = string; // YYYY-MM-DD в локальной TZ пользователя

/**
 * Ключевая запись календаря: первый день менструации.
 * Рекомендуется без пробелов времени (00:00 локальной TZ) в формате YYYY-MM-DD.
 */
export interface PeriodStartRecord {
  date: ISODate;
}

export interface HistoryInput {
  periodStarts: PeriodStartRecord[];
}

export interface PredictorConfig {
  /**
   * Предполагаемая длительность лютеиновой фазы (обычно 12–16 дн., дефолт 14).
   */
  lutealPhaseDays?: number;
  /**
   * Порог нерегулярности цикла (стд. отклонение > threshold → расширяем окна).
   */
  irregularityStdThreshold?: number;
  /**
   * Минимум интервалов для уверенных прогнозов.
   */
  minIntervalsForConfidence?: number;
  /**
   * Стратегия прогнозирования: календарная или WMA (взвеш. скользящее ср.).
   */
  strategy?: "calendar" | "wma";
  /**
   * Таймзона. По умолчанию берём локальную, но можно переопределить.
   */
  timezone?: string;
}

export interface AnalyticsSummary {
  sampleSize: number;
  cycleIntervals: number[]; // в днях
  averageCycle: number | null;
  medianCycle: number | null;
  stdCycle: number | null;
  irregular: boolean;
  dataQuality: "low" | "medium" | "high";
}

export interface DateRange {
  start: ISODate;
  end: ISODate;
}

export interface PredictionResult {
  /**
   * Оценка вероятной даты (мода по правилам стратегии).
   */
  likely: ISODate | null;
  /**
   * Широкое окно с учётом нерегулярности и допущений.
   */
  window: DateRange | null;
  /**
   * 0..1 индикатор доверия на базе размера выборки, std, согласованности.
   */
  confidence: number;
  /**
   * Комментарии по применённым правилам, полезно для UX/отладки.
   */
  notes: string[];
}

export interface FertileWindow {
  start: ISODate;
  peak: ISODate;
  end: ISODate;
  confidence: number;
  notes: string[];
}

export interface PredictionEngineRule {
  readonly id: string;
  /**
   * Вернёт предполагаемую следующую менструацию.
   */
  predictNextPeriod(
    history: HistoryInput,
    cfg: Required<PredictorConfig>,
    summary: AnalyticsSummary
  ): PredictionResult;
  /**
   * По выбранной методике вернёт окно фертильности и овуляции.
   */
  predictFertility(
    history: HistoryInput,
    cfg: Required<PredictorConfig>,
    summary: AnalyticsSummary
  ): { ovulation: PredictionResult; fertile: FertileWindow };
}

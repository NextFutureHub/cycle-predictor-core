import {
  AnalyticsSummary,
  HistoryInput,
  PredictionEngineRule,
  PredictionResult,
  PredictorConfig,
} from "../types";
import { computeFertilityFromNextPeriod } from "../core/prediction";

export abstract class BaseRule implements PredictionEngineRule {
  abstract readonly id: string;
  abstract predictNextPeriod(
    history: HistoryInput,
    cfg: Required<PredictorConfig>,
    summary: AnalyticsSummary
  ): PredictionResult;

  predictFertility(
    history: HistoryInput,
    cfg: Required<PredictorConfig>,
    summary: AnalyticsSummary
  ) {
    const next = this.predictNextPeriod(history, cfg, summary);
    return computeFertilityFromNextPeriod(next, cfg.lutealPhaseDays);
  }
}

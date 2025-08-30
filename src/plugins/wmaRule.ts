import {
  AnalyticsSummary,
  HistoryInput,
  PredictionResult,
  PredictorConfig,
} from "../types";
import { BaseRule } from "./baseRule";
import {
  adjustForIrregularity,
  computeNextPeriodByWMA,
} from "../core/prediction";

export class WmaRule extends BaseRule {
  readonly id = "wma";
  predictNextPeriod(
    history: HistoryInput,
    cfg: Required<PredictorConfig>,
    summary: AnalyticsSummary
  ): PredictionResult {
    const base = computeNextPeriodByWMA(history);
    return adjustForIrregularity(base, summary.stdCycle);
  }
}

import {
  AnalyticsSummary,
  HistoryInput,
  PredictionResult,
  PredictorConfig,
} from "../types";
import { BaseRule } from "./baseRule";
import {
  adjustForIrregularity,
  computeNextPeriodByCalendar,
} from "../core/prediction";

export class CalendarRule extends BaseRule {
  readonly id = "calendar";
  predictNextPeriod(
    history: HistoryInput,
    cfg: Required<PredictorConfig>,
    summary: AnalyticsSummary
  ): PredictionResult {
    const base = computeNextPeriodByCalendar(history);
    return adjustForIrregularity(base, summary.stdCycle);
  }
}

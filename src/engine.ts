import {
  AnalyticsSummary,
  FertileWindow,
  HistoryInput,
  PredictionEngineRule,
  PredictionResult,
  PredictorConfig,
} from "./types";
import { analyzeHistory } from "./core/analytics";
import { CalendarRule } from "./plugins/calendarRule";
import { WmaRule } from "./plugins/wmaRule";

export class PredictionEngine {
  private rules: Record<string, PredictionEngineRule> = {};
  private cfg: Required<PredictorConfig>;

  constructor(cfg: PredictorConfig = {}) {
    this.cfg = {
      lutealPhaseDays: 14,
      irregularityStdThreshold: 4,
      minIntervalsForConfidence: 3,
      strategy: "wma",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
      ...cfg,
    };

    // Регистрация дефолтных стратегий
    this.register(new CalendarRule());
    this.register(new WmaRule());
  }

  register(rule: PredictionEngineRule) {
    this.rules[rule.id] = rule;
  }

  private getRule(id: string): PredictionEngineRule {
    const rule = this.rules[id];
    if (!rule) throw new Error(`Rule not found: ${id}`);
    return rule;
  }

  analyze(history: HistoryInput): AnalyticsSummary {
    return analyzeHistory(history, this.cfg.irregularityStdThreshold);
  }

  predictNextPeriod(history: HistoryInput): PredictionResult {
    const summary = this.analyze(history);
    const rule = this.getRule(this.cfg.strategy);
    const res = rule.predictNextPeriod(history, this.cfg, summary);

    // Скорректируем confidence по качеству данных
    const multiplier =
      summary.dataQuality === "high"
        ? 1
        : summary.dataQuality === "medium"
          ? 0.8
          : 0.6;
    return { ...res, confidence: Math.min(1, res.confidence * multiplier) };
  }

  predictOvulation(history: HistoryInput): PredictionResult {
    const summary = this.analyze(history);
    const rule = this.getRule(this.cfg.strategy);
    const { ovulation } = rule.predictFertility(history, this.cfg, summary);
    const multiplier =
      summary.dataQuality === "high"
        ? 1
        : summary.dataQuality === "medium"
          ? 0.8
          : 0.6;
    return {
      ...ovulation,
      confidence: Math.min(1, ovulation.confidence * multiplier),
    };
  }

  predictFertileWindow(history: HistoryInput): FertileWindow {
    const summary = this.analyze(history);
    const rule = this.getRule(this.cfg.strategy);
    const { fertile } = rule.predictFertility(history, this.cfg, summary);
    const multiplier =
      summary.dataQuality === "high"
        ? 1
        : summary.dataQuality === "medium"
          ? 0.8
          : 0.6;
    return {
      ...fertile,
      confidence: Math.min(1, fertile.confidence * multiplier),
    };
  }
}

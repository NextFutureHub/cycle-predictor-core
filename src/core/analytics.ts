import { AnalyticsSummary, HistoryInput } from "../types";
import { sortAsc } from "../utils/date";
import { mean, median, stddev } from "../utils/stats";

export const analyzeHistory = (
  history: HistoryInput,
  irregularityStdThreshold: number
): AnalyticsSummary => {
  const dates = sortAsc(history.periodStarts.map((p) => p.date));
  const intervals: number[] = [];
  for (let i = 1; i < dates.length; i++) {
    const prev = dates[i - 1];
    const curr = dates[i];
    const delta = Math.round(
      (new Date(curr + "T00:00:00").getTime() -
        new Date(prev + "T00:00:00").getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (delta > 5 && delta < 90) intervals.push(delta); // фильтруем явные выбросы/ошибки ввода
  }

  const avg = mean(intervals);
  const med = median(intervals);
  const sd = stddev(intervals);
  const irregular = sd != null ? sd > irregularityStdThreshold : false;

  const dataQuality: AnalyticsSummary["dataQuality"] =
    intervals.length >= 6 ? "high" : intervals.length >= 3 ? "medium" : "low";

  return {
    sampleSize: intervals.length,
    cycleIntervals: intervals,
    averageCycle: avg,
    medianCycle: med,
    stdCycle: sd,
    irregular,
    dataQuality,
  };
};

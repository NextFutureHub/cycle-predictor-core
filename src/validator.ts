import { HistoryInput } from "./types";

export const validateHistory = (h: HistoryInput): void => {
  if (!h || !Array.isArray(h.periodStarts))
    throw new Error("history.periodStarts must be an array");
  for (const r of h.periodStarts) {
    if (
      !r ||
      typeof r.date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(r.date)
    ) {
      throw new Error("Each period start must have ISO date YYYY-MM-DD");
    }
  }
};

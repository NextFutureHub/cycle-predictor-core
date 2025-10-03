import { predictPregnancy } from "../src/pregnancy/pregnancy";
import { PredictionEngine } from "../src/engine";

describe("Pregnancy Prediction", () => {
  it("should predict pregnancy correctly", () => {
    const lastPeriodDate = new Date("2025-01-01");
    const result = predictPregnancy(lastPeriodDate);

    expect(result).toHaveProperty("dueDate");
    expect(result).toHaveProperty("currentWeek");
    expect(result).toHaveProperty("currentTrimester");
    expect(result).toHaveProperty("daysRemaining");
    expect(result).toHaveProperty("milestones");

    expect(result.currentWeek).toBeGreaterThan(0);
    expect(result.currentWeek).toBeLessThanOrEqual(40);
    expect(result.currentTrimester).toBeGreaterThanOrEqual(1);
    expect(result.currentTrimester).toBeLessThanOrEqual(3);
  });

  it("should throw error for future date", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    expect(() => predictPregnancy(futureDate)).toThrow(
      "Дата последней менструации не может быть в будущем"
    );
  });

  it("should throw error for too old date", () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 300); // Больше 40 недель

    expect(() => predictPregnancy(oldDate)).toThrow(
      "Дата последней менструации слишком давняя для расчета беременности"
    );
  });

  it("should provide milestones for different weeks", () => {
    // Создаем дату 12 недель назад
    const twelveWeeksAgo = new Date();
    twelveWeeksAgo.setDate(twelveWeeksAgo.getDate() - 84); // 12 недель

    const result = predictPregnancy(twelveWeeksAgo);
    
    expect(result.currentWeek).toBeGreaterThanOrEqual(12);
    expect(result.currentWeek).toBeLessThanOrEqual(13);
    expect(Array.isArray(result.milestones)).toBe(true);
    expect(result.currentTrimester).toBe(1);
  });
});

describe("PredictionEngine Pregnancy Integration", () => {
  let engine: PredictionEngine;

  beforeEach(() => {
    engine = new PredictionEngine({ strategy: "wma" });
  });

  it("should predict pregnancy from date", () => {
    const lastPeriodDate = new Date("2025-01-01");
    const result = engine.predictPregnancy(lastPeriodDate);

    expect(result).toHaveProperty("dueDate");
    expect(result).toHaveProperty("currentWeek");
    expect(result).toHaveProperty("currentTrimester");
  });

  it("should predict pregnancy from history", () => {
    const history = {
      periodStarts: [
        { date: "2025-01-01" },
        { date: "2025-01-30" },
        { date: "2025-02-28" },
      ],
    };

    const result = engine.predictPregnancyFromHistory(history);

    expect(result).toHaveProperty("dueDate");
    expect(result).toHaveProperty("currentWeek");
    expect(result).toHaveProperty("currentTrimester");
  });

  it("should throw error for empty history", () => {
    const emptyHistory = { periodStarts: [] };

    expect(() => engine.predictPregnancyFromHistory(emptyHistory)).toThrow(
      "История менструаций пуста"
    );
  });
});

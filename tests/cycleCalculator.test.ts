import { predictNextPeriod, calculateAverageCycleLength } from "../src/cycle/cycleCalculator";

describe("cycleCalculator", () => {
  it("считает следующую менструацию (28 дней)", () => {
    const start = new Date("2025-08-01");
    const result = predictNextPeriod(start, 28);
    expect(result.toISOString().slice(0, 10)).toBe("2025-08-29");
  });

  it("считает среднюю длину цикла", () => {
    const cycles = [28, 30, 27, 29];
    const avg = calculateAverageCycleLength(cycles);
    expect(avg).toBe(29);
  });
});

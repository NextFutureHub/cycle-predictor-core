import { predictOvulation } from "../src/ovulation/ovulationCalculator";

describe("ovulationCalculator", () => {
  it("считает овуляцию как nextPeriod - lutealPhase", () => {
    const nextPeriod = new Date("2025-08-29");
    const result = predictOvulation(nextPeriod, 14);
    expect(result.date.toISOString().slice(0, 10)).toBe("2025-08-15");
  });
});

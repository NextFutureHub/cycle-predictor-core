import { PredictionEngine } from "../src/engine";

const history = {
  periodStarts: [
    { date: "2025-01-02" },
    { date: "2025-01-31" }, // 29d
    { date: "2025-03-01" }, // 29d
    { date: "2025-03-29" }, // 28d
    { date: "2025-04-27" }, // 29d
    { date: "2025-05-26" }, // 29d
  ],
};

describe("PredictionEngine", () => {
  it("produces predictions with WMA strategy", () => {
    const engine = new PredictionEngine({ strategy: "wma" });
    const next = engine.predictNextPeriod(history);
    expect(typeof next.likely).toBe("string");
    expect(next.window).not.toBeNull();
    expect(next.confidence).toBeGreaterThan(0);

    const ovu = engine.predictOvulation(history);
    expect(typeof ovu.likely).toBe("string");

    const fertile = engine.predictFertileWindow(history);
    expect(typeof fertile.start).toBe("string");
    expect(typeof fertile.end).toBe("string");
  });
});

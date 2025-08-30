import { describe, expect, it } from "vitest";
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
    expect(next.likely).toBeTypeOf("string");
    expect(next.window).not.toBeNull();
    expect(next.confidence).toBeGreaterThan(0);

    const ovu = engine.predictOvulation(history);
    expect(ovu.likely).toBeTypeOf("string");

    const fertile = engine.predictFertileWindow(history);
    expect(fertile.start).toBeTypeOf("string");
    expect(fertile.end).toBeTypeOf("string");
  });
});

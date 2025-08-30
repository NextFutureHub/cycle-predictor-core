import { getFertileWindow } from "../src/fertile/fertileWindow";
import { predictOvulation } from "../src/ovulation/ovulationCalculator";

describe("fertileWindow", () => {
  it("строит окно вокруг овуляции", () => {
    const nextPeriod = new Date("2025-08-29");
    const ovulation = predictOvulation(nextPeriod, 14);
    const fertile = getFertileWindow(ovulation);

    expect(fertile.start.toISOString().slice(0, 10)).toBe("2025-08-10");
    expect(fertile.peak.toISOString().slice(0, 10)).toBe("2025-08-15");
    expect(fertile.end.toISOString().slice(0, 10)).toBe("2025-08-16");
  });
});

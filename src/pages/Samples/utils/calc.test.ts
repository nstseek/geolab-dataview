import { describe, it, expect } from "vitest";
import { calcAdjustedMoisture, calcAdjustedDensity, recalcRow } from "./calc";
import type { SampleRow } from "../types";

function makeSampleRow(overrides: Partial<SampleRow> = {}): SampleRow {
  return {
    id: "S-001",
    moisture: 10,
    dryDensity: 1.5,
    correctionFactor: 5,
    porosity: 30,
    adjustedMoisture: 0,
    adjustedDensity: 0,
    ...overrides,
  };
}

describe("calcAdjustedMoisture", () => {
  it("applies the correction factor formula", () => {
    // 10 * (1 + 5/100) = 10 * 1.05 = 10.5
    expect(calcAdjustedMoisture(10, 5)).toBe(10.5);
  });

  it("returns the original moisture when correction factor is 0", () => {
    expect(calcAdjustedMoisture(10, 0)).toBe(10);
  });

  it("returns 0 when moisture is 0", () => {
    expect(calcAdjustedMoisture(0, 5)).toBe(0);
  });

  it("handles large correction factors", () => {
    // 10 * (1 + 100/100) = 10 * 2 = 20
    expect(calcAdjustedMoisture(10, 100)).toBe(20);
  });
});

describe("calcAdjustedDensity", () => {
  it("applies the porosity formula", () => {
    // 1.5 * (1 - 30/100) = 1.5 * 0.7 = 1.05
    expect(calcAdjustedDensity(1.5, 30)).toBeCloseTo(1.05);
  });

  it("returns the original density when porosity is 0", () => {
    expect(calcAdjustedDensity(1.5, 0)).toBe(1.5);
  });

  it("returns 0 when porosity is 100", () => {
    expect(calcAdjustedDensity(1.5, 100)).toBe(0);
  });

  it("returns 0 when dry density is 0", () => {
    expect(calcAdjustedDensity(0, 30)).toBe(0);
  });
});

describe("recalcRow", () => {
  it("computes both adjusted fields from the row inputs", () => {
    const row = makeSampleRow();
    const result = recalcRow(row);

    expect(result.adjustedMoisture).toBe(
      calcAdjustedMoisture(row.moisture, row.correctionFactor),
    );
    expect(result.adjustedDensity).toBeCloseTo(
      calcAdjustedDensity(row.dryDensity, row.porosity),
    );
  });

  it("preserves all other fields", () => {
    const row = makeSampleRow({ id: "CUSTOM-ID" });
    const result = recalcRow(row);

    expect(result.id).toBe("CUSTOM-ID");
    expect(result.moisture).toBe(row.moisture);
    expect(result.dryDensity).toBe(row.dryDensity);
    expect(result.correctionFactor).toBe(row.correctionFactor);
    expect(result.porosity).toBe(row.porosity);
  });

  it("does not mutate the original row", () => {
    const row = makeSampleRow();
    const original = { ...row };
    recalcRow(row);

    expect(row).toEqual(original);
  });
});

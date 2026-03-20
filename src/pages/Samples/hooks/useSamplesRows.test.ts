import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useSamplesRows } from "./useSamplesRows";
import type { SampleRow } from "../types";
import { recalcRow } from "../utils/calc";

function makeSampleRow(overrides: Partial<SampleRow> = {}): SampleRow {
  return recalcRow({
    id: "S-001",
    moisture: 10,
    dryDensity: 1.5,
    correctionFactor: 5,
    porosity: 30,
    adjustedMoisture: 0,
    adjustedDensity: 0,
    ...overrides,
  });
}

describe("useSamplesRows", () => {
  it("starts with empty state", () => {
    const { result } = renderHook(() => useSamplesRows());

    expect(result.current.rows).toEqual([]);
    expect(result.current.visibleRows).toEqual([]);
    expect(result.current.fileName).toBeNull();
    expect(result.current.filter).toBe("");
    expect(result.current.autoRecalc).toBe(true);
  });

  describe("loadRows", () => {
    it("replaces all rows and sets fileName", () => {
      const { result } = renderHook(() => useSamplesRows());
      const rows = [makeSampleRow({ id: "A" }), makeSampleRow({ id: "B" })];

      act(() => result.current.loadRows(rows, "data.csv"));

      expect(result.current.rows).toHaveLength(2);
      expect(result.current.fileName).toBe("data.csv");
    });
  });

  describe("updateRow", () => {
    it("replaces a row matched by id", () => {
      const { result } = renderHook(() => useSamplesRows());
      const rows = [makeSampleRow({ id: "A", moisture: 10 })];

      act(() => result.current.loadRows(rows, "test.csv"));

      const updated = { ...rows[0], moisture: 99 };
      act(() => result.current.updateRow(updated));

      expect(result.current.rows[0].moisture).toBe(99);
    });

    it("does not affect other rows", () => {
      const { result } = renderHook(() => useSamplesRows());
      const rows = [
        makeSampleRow({ id: "A", moisture: 10 }),
        makeSampleRow({ id: "B", moisture: 20 }),
      ];

      act(() => result.current.loadRows(rows, "test.csv"));
      act(() => result.current.updateRow({ ...rows[0], moisture: 99 }));

      expect(result.current.rows[1].moisture).toBe(20);
    });
  });

  describe("deleteRow", () => {
    it("removes a row by id", () => {
      const { result } = renderHook(() => useSamplesRows());
      const rows = [makeSampleRow({ id: "A" }), makeSampleRow({ id: "B" })];

      act(() => result.current.loadRows(rows, "test.csv"));
      act(() => result.current.deleteRow("A"));

      expect(result.current.rows).toHaveLength(1);
      expect(result.current.rows[0].id).toBe("B");
    });
  });

  describe("clearRows", () => {
    it("empties rows and resets fileName", () => {
      const { result } = renderHook(() => useSamplesRows());

      act(() => result.current.loadRows([makeSampleRow()], "data.csv"));
      act(() => result.current.clearRows());

      expect(result.current.rows).toEqual([]);
      expect(result.current.fileName).toBeNull();
    });
  });

  describe("visibleRows (filter)", () => {
    it("returns all rows when filter is empty", () => {
      const { result } = renderHook(() => useSamplesRows());
      const rows = [
        makeSampleRow({ id: "ALPHA" }),
        makeSampleRow({ id: "BETA" }),
      ];

      act(() => result.current.loadRows(rows, "test.csv"));

      expect(result.current.visibleRows).toHaveLength(2);
    });

    it("filters rows by ID case-insensitively", () => {
      const { result } = renderHook(() => useSamplesRows());
      const rows = [
        makeSampleRow({ id: "ALPHA-001" }),
        makeSampleRow({ id: "BETA-002" }),
        makeSampleRow({ id: "alpha-003" }),
      ];

      act(() => result.current.loadRows(rows, "test.csv"));
      act(() => result.current.setFilter("alpha"));

      expect(result.current.visibleRows).toHaveLength(2);
      expect(result.current.visibleRows.map((r) => r.id)).toEqual([
        "ALPHA-001",
        "alpha-003",
      ]);
    });

    it("returns empty when no rows match the filter", () => {
      const { result } = renderHook(() => useSamplesRows());

      act(() =>
        result.current.loadRows([makeSampleRow({ id: "X" })], "test.csv"),
      );
      act(() => result.current.setFilter("ZZZZZ"));

      expect(result.current.visibleRows).toHaveLength(0);
    });
  });

  describe("summary", () => {
    it("returns zeroed summary when there are no visible rows", () => {
      const { result } = renderHook(() => useSamplesRows());

      expect(result.current.summary).toEqual({
        avgMoisture: 0,
        avgDensity: 0,
        totalSamples: 0,
      });
    });

    it("computes averages over visible rows", () => {
      const { result } = renderHook(() => useSamplesRows());
      const row1 = makeSampleRow({
        id: "A",
        moisture: 10,
        dryDensity: 1.5,
        correctionFactor: 0,
        porosity: 0,
      });
      const row2 = makeSampleRow({
        id: "B",
        moisture: 20,
        dryDensity: 2.0,
        correctionFactor: 0,
        porosity: 0,
      });

      act(() => result.current.loadRows([row1, row2], "test.csv"));

      expect(result.current.summary.totalSamples).toBe(2);
      // adjustedMoisture with correctionFactor=0: moisture * 1 = moisture
      // adjustedDensity with porosity=0: dryDensity * 1 = dryDensity
      expect(result.current.summary.avgMoisture).toBeCloseTo(
        (row1.adjustedMoisture + row2.adjustedMoisture) / 2,
      );
      expect(result.current.summary.avgDensity).toBeCloseTo(
        (row1.adjustedDensity + row2.adjustedDensity) / 2,
      );
    });

    it("recomputes summary when filter changes", () => {
      const { result } = renderHook(() => useSamplesRows());
      const rows = [
        makeSampleRow({
          id: "A",
          moisture: 10,
          correctionFactor: 0,
          porosity: 0,
        }),
        makeSampleRow({
          id: "B",
          moisture: 100,
          correctionFactor: 0,
          porosity: 0,
        }),
      ];

      act(() => result.current.loadRows(rows, "test.csv"));
      act(() => result.current.setFilter("A"));

      expect(result.current.summary.totalSamples).toBe(1);
      expect(result.current.summary.avgMoisture).toBeCloseTo(10);
    });
  });

  describe("recalculateAll", () => {
    it("recomputes adjusted fields for every row", () => {
      const { result } = renderHook(() => useSamplesRows());
      const row = makeSampleRow({ id: "A" });
      // Zero out adjusted fields to simulate stale data
      row.adjustedMoisture = 0;
      row.adjustedDensity = 0;

      act(() => result.current.loadRows([row], "test.csv"));
      act(() => result.current.recalculateAll());

      expect(result.current.rows[0].adjustedMoisture).toBeGreaterThan(0);
      expect(result.current.rows[0].adjustedDensity).toBeGreaterThan(0);
    });
  });
});

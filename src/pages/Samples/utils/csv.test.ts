import { describe, it, expect, vi } from "vitest";
import type { SampleRow } from "../types";
import { handleFileUpload, handleExport } from "./csv";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

function makeCSVFile(content: string, name = "test.csv"): File {
  return new File([content], name, { type: "text/csv" });
}

describe("handleFileUpload", () => {
  it("parses a valid CSV and calls loadRows with computed rows", async () => {
    const csv = "S-001,10,1.5,5,30\nS-002,20,2.0,10,40";
    const loadRows = vi.fn();

    await handleFileUpload(makeCSVFile(csv), loadRows);

    expect(loadRows).toHaveBeenCalledOnce();
    const [rows, fileName] = loadRows.mock.calls[0];
    expect(fileName).toBe("test.csv");
    expect(rows).toHaveLength(2);
    expect(rows[0].id).toBe("S-001");
    expect(rows[0].moisture).toBe(10);
    expect(rows[0].dryDensity).toBe(1.5);
    expect(rows[0].correctionFactor).toBe(5);
    expect(rows[0].porosity).toBe(30);
    expect(rows[0].adjustedMoisture).toBeGreaterThan(0);
    expect(rows[0].adjustedDensity).toBeGreaterThan(0);
  });

  it("uses default correctionFactor and porosity when columns are missing", async () => {
    const csv = "S-001,10,1.5";
    const loadRows = vi.fn();

    await handleFileUpload(makeCSVFile(csv), loadRows);

    const [rows] = loadRows.mock.calls[0];
    expect(rows[0].correctionFactor).toBe(5);
    expect(rows[0].porosity).toBe(30);
  });

  it("defaults NaN correctionFactor and porosity to their configured defaults", async () => {
    const csv = "S-001,10,1.5,abc,xyz";
    const loadRows = vi.fn();

    await handleFileUpload(makeCSVFile(csv), loadRows);

    const [rows] = loadRows.mock.calls[0];
    expect(rows[0].correctionFactor).toBe(5);
    expect(rows[0].porosity).toBe(30);
  });

  it("skips empty lines", async () => {
    const csv = "S-001,10,1.5,5,30\n\nS-002,20,2.0,10,40\n";
    const loadRows = vi.fn();

    await handleFileUpload(makeCSVFile(csv), loadRows);

    const [rows] = loadRows.mock.calls[0];
    expect(rows).toHaveLength(2);
  });

  it("rejects rows with negative values and does not call loadRows", async () => {
    const { toast } = await import("sonner");
    const csv = "S-001,-5,1.5,5,30";
    const loadRows = vi.fn();

    await handleFileUpload(makeCSVFile(csv), loadRows);

    expect(loadRows).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalled();
  });

  it("computes adjustedMoisture and adjustedDensity on each row", async () => {
    const csv = "S-001,10,1.5,5,30";
    const loadRows = vi.fn();

    await handleFileUpload(makeCSVFile(csv), loadRows);

    const [rows] = loadRows.mock.calls[0];
    // 10 * (1 + 5/100) = 10.5
    expect(rows[0].adjustedMoisture).toBeCloseTo(10.5);
    // 1.5 * (1 - 30/100) = 1.05
    expect(rows[0].adjustedDensity).toBeCloseTo(1.05);
  });
});

describe("handleExport", () => {
  it("calls URL.createObjectURL and triggers a download", () => {
    const revokeObjectURL = vi.fn();
    const createObjectURL = vi.fn(() => "blob:mock-url");
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL });

    const clickSpy = vi.fn();
    vi.spyOn(document, "createElement").mockReturnValue({
      set href(_: string) {},
      set download(_: string) {},
      click: clickSpy,
    } as unknown as HTMLAnchorElement);

    const rows: SampleRow[] = [
      {
        id: "S-001",
        moisture: 10,
        dryDensity: 1.5,
        correctionFactor: 5,
        porosity: 30,
        adjustedMoisture: 10.5,
        adjustedDensity: 1.05,
      },
    ];

    handleExport(rows);

    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(clickSpy).toHaveBeenCalledOnce();
    expect(revokeObjectURL).toHaveBeenCalledOnce();
  });
});

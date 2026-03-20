import Papa from "papaparse";
import { toast } from "sonner";
import { SAMPLE_ROW_CONFIG, type SampleRow } from "../types";
import { fillRowDefaultValues, recalcRow } from "../utils/calc";
import { sampleRowSchema } from "./validationSchema";

type RawCsvRow = [string, string, string, string, string];

function parseCSV(file: File): Promise<SampleRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawCsvRow>(file, {
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows: SampleRow[] = results.data.map((cols) => {
            const id = String(cols[0] ?? "").trim();
            const moisture = parseFloat(String(cols[1]));
            const dryDensity = parseFloat(String(cols[2]));
            const correctionFactor =
              cols[3] !== undefined && String(cols[3]).trim() !== ""
                ? parseFloat(String(cols[3]))
                : SAMPLE_ROW_CONFIG.correctionFactor.defaultValue;
            const porosity =
              cols[4] !== undefined && String(cols[4]).trim() !== ""
                ? parseFloat(String(cols[4]))
                : SAMPLE_ROW_CONFIG.porosity.defaultValue;

            const row: SampleRow = {
              id,
              moisture: isNaN(moisture) ? 0 : moisture,
              dryDensity: isNaN(dryDensity) ? 0 : dryDensity,
              correctionFactor: isNaN(correctionFactor)
                ? SAMPLE_ROW_CONFIG.correctionFactor.defaultValue
                : correctionFactor,
              porosity: isNaN(porosity)
                ? SAMPLE_ROW_CONFIG.porosity.defaultValue
                : porosity,
              adjustedMoisture: 0,
              adjustedDensity: 0,
            };

            const autofilledRow = fillRowDefaultValues(row);
            const computedRow = recalcRow(autofilledRow);
            const validationStatus = sampleRowSchema.safeParse(computedRow);

            if (!validationStatus.success) {
              const message =
                validationStatus.error.issues[0]?.message ?? "Invalid row data";
              toast.error(message);
              throw new Error(message);
            }
            return computedRow;
          });
          resolve(rows);
        } catch (err) {
          reject(err);
        }
      },
      error: (err) => reject(err),
    });
  });
}

function exportCSV(rows: SampleRow[], fileName = "samples_export.csv"): void {
  const data = rows.map(
    ({ id, moisture, dryDensity, correctionFactor, porosity }) => [
      id,
      moisture,
      dryDensity,
      correctionFactor,
      porosity,
    ],
  );
  const csv = Papa.unparse(data, { header: false });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export async function handleFileUpload(
  file: File,
  loadRows: (rows: SampleRow[], fileName: string) => void,
): Promise<void> {
  try {
    const rows = await parseCSV(file);
    loadRows(rows, file.name);
    toast.success(`Imported ${rows.length} rows from ${file.name}`);
  } catch (err) {
    toast.error(
      `Failed to import CSV: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }
}

export function handleExport(rows: SampleRow[]): void {
  exportCSV(rows);
  toast.success(`Exported ${rows.length} rows to CSV`);
}

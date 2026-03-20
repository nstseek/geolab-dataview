import { type SampleRow } from "../types";

export function calcAdjustedMoisture(
  moisture: number,
  correctionFactor: number,
): number {
  return moisture * (1 + correctionFactor / 100);
}

export function calcAdjustedDensity(
  dryDensity: number,
  porosity: number,
): number {
  return dryDensity * (1 - porosity / 100);
}

export function recalcRow(row: SampleRow): SampleRow {
  return {
    ...row,
    adjustedMoisture: calcAdjustedMoisture(row.moisture, row.correctionFactor),
    adjustedDensity: calcAdjustedDensity(row.dryDensity, row.porosity),
  };
}

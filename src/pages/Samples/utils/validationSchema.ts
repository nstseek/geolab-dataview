import { z } from "zod";
import {
  SAMPLE_ROW_CONFIG,
  type SampleRow,
  type SampleRowConfig,
} from "../types";

export const sampleRowSchema = z.object({
  id: z
    .string("Sample ID is required")
    .min(1, "Sample ID must have at least one character"),
  moisture: z
    .number("Moisture is required")
    .nonnegative("Moisture must be ≥ 0"),
  dryDensity: z
    .number("Dry density is required")
    .nonnegative("Dry Density must be ≥ 0"),
  correctionFactor: z
    .number("Correction factor is required")
    .nonnegative("Correction Factor must be ≥ 0"),
  porosity: z
    .number("Porosity is required")
    .nonnegative("Porosity must be ≥ 0"),
});

export function fillRowDefaultValues(row: SampleRow) {
  const filledEntries = Object.entries(row).map(([key, value]) => [
    key,
    value ||
      (SAMPLE_ROW_CONFIG as SampleRowConfig)[key as keyof SampleRowConfig]
        .defaultValue,
  ]);

  return Object.fromEntries(filledEntries);
}

export type SampleRowInput = z.infer<typeof sampleRowSchema>;

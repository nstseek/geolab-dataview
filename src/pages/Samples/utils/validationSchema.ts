import { z } from "zod";

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

export type SampleRowInput = z.infer<typeof sampleRowSchema>;

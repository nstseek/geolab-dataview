import { z } from 'zod'

export const sampleRowSchema = z.object({
  sampleId: z.string().min(1, 'Sample ID is required'),
  moisture: z.number().nonnegative('Moisture must be ≥ 0'),
  dryDensity: z.number().nonnegative('Dry Density must be ≥ 0'),
  correctionFactor: z.number().nonnegative('Correction Factor must be ≥ 0'),
  porosity: z.number().nonnegative('Porosity must be ≥ 0'),
})

export type SampleRowInput = z.infer<typeof sampleRowSchema>

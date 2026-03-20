import Papa from 'papaparse'
import type { SampleRow } from './types'

const DEFAULT_CORRECTION_FACTOR = 5
const DEFAULT_POROSITY = 30

export function calcAdjustedMoisture(moisture: number, correctionFactor: number): number {
  return moisture * (1 + correctionFactor / 100)
}

export function calcAdjustedDensity(dryDensity: number, porosity: number): number {
  return dryDensity * (1 - porosity / 100)
}

export function recalcRow(row: SampleRow): SampleRow {
  return {
    ...row,
    adjustedMoisture: calcAdjustedMoisture(row.moisture, row.correctionFactor),
    adjustedDensity: calcAdjustedDensity(row.dryDensity, row.porosity),
  }
}

type RawCsvRow = [string, string, string, string, string]

export function parseCSV(file: File): Promise<SampleRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawCsvRow>(file, {
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows: SampleRow[] = results.data.map((cols, index) => {
            const sampleId = String(cols[0] ?? '').trim()
            const moisture = parseFloat(String(cols[1]))
            const dryDensity = parseFloat(String(cols[2]))
            const correctionFactor = cols[3] !== undefined && String(cols[3]).trim() !== ''
              ? parseFloat(String(cols[3]))
              : DEFAULT_CORRECTION_FACTOR
            const porosity = cols[4] !== undefined && String(cols[4]).trim() !== ''
              ? parseFloat(String(cols[4]))
              : DEFAULT_POROSITY

            const row: SampleRow = {
              id: `${sampleId}-${index}`,
              sampleId,
              moisture: isNaN(moisture) ? 0 : moisture,
              dryDensity: isNaN(dryDensity) ? 0 : dryDensity,
              correctionFactor: isNaN(correctionFactor) ? DEFAULT_CORRECTION_FACTOR : correctionFactor,
              porosity: isNaN(porosity) ? DEFAULT_POROSITY : porosity,
              adjustedMoisture: 0,
              adjustedDensity: 0,
            }
            return recalcRow(row)
          })
          resolve(rows)
        } catch (err) {
          reject(err)
        }
      },
      error: (err) => reject(err),
    })
  })
}

export function exportCSV(rows: SampleRow[], fileName = 'samples_export.csv'): void {
  const exportData = rows.map(({ sampleId, moisture, dryDensity, correctionFactor, porosity }) => ({
    'Sample ID': sampleId,
    'Moisture (%)': moisture,
    'Dry Density (g/cm3)': dryDensity,
    'Correction Factor (%)': correctionFactor,
    'Porosity (%)': porosity,
  }))

  const csv = Papa.unparse(exportData)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

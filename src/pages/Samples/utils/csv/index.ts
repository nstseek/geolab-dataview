import { exportCSV, parseCSV } from '../../utils'
import type { SampleRow } from '../../types'

export async function handleFileUpload(
  file: File,
  loadRows: (rows: SampleRow[], fileName: string) => void,
): Promise<void> {
  const rows = await parseCSV(file)
  loadRows(rows, file.name)
}

export function handleExport(rows: SampleRow[]): void {
  exportCSV(rows)
}

import { useCallback, useMemo, useState } from "react";
import type { SampleRow } from "../types";
import { recalcRow } from "../utils/calc";

export interface SamplesSummary {
  avgMoisture: number;
  avgDensity: number;
  totalSamples: number;
}

export function useSamplesState() {
  const [rows, setRows] = useState<SampleRow[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [autoRecalc, setAutoRecalc] = useState(true);

  const visibleRows = useMemo(() => {
    if (!filter.trim()) return rows;
    const lower = filter.toLowerCase();
    return rows.filter((r) => r.id.toLowerCase().includes(lower));
  }, [rows, filter]);

  const summary: SamplesSummary = useMemo(() => {
    if (visibleRows.length === 0)
      return { avgMoisture: 0, avgDensity: 0, totalSamples: 0 };
    const avgMoisture =
      visibleRows.reduce((sum, r) => sum + r.adjustedMoisture, 0) /
      visibleRows.length;
    const avgDensity =
      visibleRows.reduce((sum, r) => sum + r.adjustedDensity, 0) /
      visibleRows.length;
    return { avgMoisture, avgDensity, totalSamples: visibleRows.length };
  }, [visibleRows]);

  /** Replace all rows and set the source file name (e.g. after CSV upload). */
  const loadRows = useCallback((newRows: SampleRow[], name: string) => {
    setRows(newRows);
    setFileName(name);
  }, []);

  /** Append a single row. */
  const addRow = useCallback((row: SampleRow) => {
    setRows((prev) => [...prev, row]);
  }, []);

  /** Replace a single row matched by id. */
  const updateRow = useCallback((updatedRow: SampleRow) => {
    setRows((prev) =>
      prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
    );
  }, []);

  /** Remove a row by id. */
  const deleteRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  /** Clear all rows and reset the file name. */
  const clearRows = useCallback(() => {
    setRows([]);
    setFileName(null);
  }, []);

  /** Re-run derived column calculations on every row. */
  const recalculateAll = useCallback(() => {
    setRows((prev) => prev.map(recalcRow));
  }, []);

  return {
    rows,
    visibleRows,
    summary,
    fileName,
    filter,
    setFilter,
    autoRecalc,
    setAutoRecalc,
    loadRows,
    addRow,
    updateRow,
    deleteRow,
    clearRows,
    recalculateAll,
  };
}

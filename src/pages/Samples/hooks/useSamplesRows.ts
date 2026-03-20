import { useCallback, useMemo, useState } from "react";
import type { SampleRow } from "../types";
import { recalcRow } from "../utils/calc";
import { toast } from "sonner";
import {
  fillRowDefaultValues,
  sampleRowSchema,
} from "../utils/validationSchema";

export interface SamplesSummary {
  avgMoisture: number;
  avgDensity: number;
  totalSamples: number;
}

export function useSamplesRows() {
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

  const loadRows = useCallback((newRows: SampleRow[], name: string) => {
    setRows(newRows);
    setFileName(name);
  }, []);

  const addRow = useCallback((row: SampleRow) => {
    setRows((prev) => [...prev, row]);
  }, []);

  const updateRow = useCallback((updatedRow: SampleRow) => {
    setRows((prev) =>
      prev.map((r) => (r.id === updatedRow.id ? updatedRow : r)),
    );
  }, []);

  const deleteRow = useCallback((id: string) => {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearRows = useCallback(() => {
    setRows([]);
    setFileName(null);
  }, []);

  const recalculateAll = useCallback(() => {
    setRows((prev) => prev.map(recalcRow));
  }, []);

  const processRowUpdate = useCallback(
    (newRow: SampleRow, oldRow: SampleRow): SampleRow => {
      const newRowFilteredEntries = Object.entries(newRow).filter(
        ([, value]) => value !== undefined,
      );
      const newRowFiltered = Object.fromEntries(newRowFilteredEntries);
      const merged = { ...oldRow, ...newRowFiltered };
      const autofilledRow = fillRowDefaultValues(merged);

      const result = sampleRowSchema.safeParse(autofilledRow);
      if (!result.success) {
        const message = result.error.issues[0]?.message ?? "Invalid row data";
        toast.error(["Failed to edit", message].join(" - "));
        return oldRow;
      } else {
        const updated = autoRecalc ? recalcRow(autofilledRow) : autofilledRow;
        updateRow(updated);
        return updated;
      }
    },
    [autoRecalc, updateRow],
  );

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
    processRowUpdate,
  };
}

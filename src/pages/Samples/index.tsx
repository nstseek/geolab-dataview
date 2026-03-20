import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useHeader } from "@context/HeaderContext";
import SamplesSummaryBar from "./components/SamplesSummary";
import SamplesToolbar from "./components/SamplesToolbar";
import { useSamplesState } from "./hooks/useSamplesState";
import type { SampleRow } from "./types";
import { fillRowDefaultValues, recalcRow } from "./utils/calc";
import { COMPUTED_CELL_CLASS, samplesColumns } from "./utils/columns";
import { handleExport, handleFileUpload } from "./utils/csv";
import { sampleRowSchema } from "./utils/validationSchema";

export default function Samples() {
  const { setHeader } = useHeader();
  const {
    rows,
    visibleRows,
    summary,
    fileName,
    filter,
    setFilter,
    autoRecalc,
    setAutoRecalc,
    loadRows,
    updateRow,
    recalculateAll,
  } = useSamplesState();

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

  useEffect(() => {
    const rowCount = `${summary.totalSamples} rows`;
    const filterInfo = filter ? ` (filtered: ${summary.totalSamples})` : "";
    const fileInfo = fileName ? `file: ${fileName}` : rowCount + filterInfo;
    setHeader("Samples", rows.length > 0 ? fileInfo : "");
  }, [setHeader, rows.length, summary.totalSamples, filter, fileName]);

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}
    >
      <SamplesToolbar
        filter={filter}
        onFilterChange={setFilter}
        autoRecalc={autoRecalc}
        onAutoRecalcChange={setAutoRecalc}
        onRecalculate={recalculateAll}
        onFileUpload={(file) => handleFileUpload(file, loadRows)}
        onExport={() => handleExport(visibleRows)}
        hasData={rows.length > 0}
      />

      {rows.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: 300,
            border: "2px dashed",
            borderColor: "divider",
            borderRadius: 2,
            color: "text.secondary",
          }}
        >
          <Typography variant="h6">No data loaded</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Upload a CSV file to get started.
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          <SamplesSummaryBar summary={summary} />
          <DataGrid
            rows={visibleRows}
            columns={samplesColumns}
            editMode="row"
            processRowUpdate={processRowUpdate}
            pageSizeOptions={[25, 50, 100]}
            initialState={{ pagination: { paginationModel: { pageSize: 25 } } }}
            sx={{
              flex: 1,
              minHeight: 0,
              [`& .${COMPUTED_CELL_CLASS}`]: {
                bgcolor: "action.selected",
                color: "text.secondary",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}

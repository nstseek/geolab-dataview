import {
  DataGrid,
  gridFilteredRowCountSelector,
  useGridApiRef,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import SamplesSummaryBar from "./components/SamplesSummary";
import SamplesToolbar from "./components/SamplesToolbar";
import { useSamplesRows } from "./hooks/useSamplesRows";
import { samplesColumns } from "./utils/columns";
import { handleExport, handleFileUpload } from "./utils/csv";
import { useHeader } from "@context/HeaderContext";
import { COMPUTED_CELL_CLASS } from "./utils/columns/constants";

export default function Samples() {
  const { setHeader } = useHeader();
  const apiRef = useGridApiRef();
  const [gridFilteredCount, setGridFilteredCount] = useState(0);
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
    processRowUpdate,
    recalculateAll,
  } = useSamplesRows();

  const isAnyFilterActive = !!filter || gridFilteredCount < visibleRows.length;

  useEffect(() => {
    if (rows.length === 0) {
      setHeader("Samples", "");
    } else if (isAnyFilterActive) {
      setHeader(
        "Samples",
        `${rows.length} rows (filtered: ${gridFilteredCount})`,
      );
    } else {
      setHeader("Samples", fileName ? `file: ${fileName}` : "");
    }
  }, [setHeader, rows.length, isAnyFilterActive, gridFilteredCount, fileName]);

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
            apiRef={apiRef}
            rows={visibleRows}
            columns={samplesColumns}
            editMode="row"
            processRowUpdate={processRowUpdate}
            onStateChange={() =>
              setGridFilteredCount(gridFilteredRowCountSelector(apiRef))
            }
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

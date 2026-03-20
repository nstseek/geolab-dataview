import { type GridColDef } from "@mui/x-data-grid";
import { z } from "zod";
import type { SampleRow } from "../../types";
import { COMPUTED_CELL_CLASS } from "./constants";
import { ComputedHeader } from "./ComputedHeader";
import { EditCellWithTooltip } from "./EditCellWithTooltip";

const COL_MIN_WIDTH = 120;

export const samplesColumns: GridColDef<SampleRow>[] = [
  {
    field: "id",
    headerName: "Sample ID",
    flex: 1,
    minWidth: COL_MIN_WIDTH,
    preProcessEditCellProps: (params) => {
      const result = z
        .string()
        .min(1, "Required")
        .safeParse(params.props.value);
      const error = result.success
        ? undefined
        : result.error.issues[0]?.message;
      return { ...params, props: { ...params.props, error } };
    },
    renderEditCell: (params) => <EditCellWithTooltip {...params} />,
  },
  {
    field: "moisture",
    headerName: "Moisture (%)",
    type: "number",
    flex: 1,
    minWidth: COL_MIN_WIDTH,
    editable: true,
    renderEditCell: (params) => <EditCellWithTooltip {...params} />,
  },
  {
    field: "dryDensity",
    headerName: "Dry Density (g/cm³)",
    type: "number",
    flex: 1,
    minWidth: COL_MIN_WIDTH,
    editable: true,
    renderEditCell: (params) => <EditCellWithTooltip {...params} />,
  },
  {
    field: "correctionFactor",
    headerName: "Correction Factor (%)",
    type: "number",
    flex: 1,
    minWidth: COL_MIN_WIDTH,
    editable: true,
    renderEditCell: (params) => <EditCellWithTooltip {...params} />,
  },
  {
    field: "porosity",
    headerName: "Porosity (%)",
    type: "number",
    flex: 1,
    minWidth: COL_MIN_WIDTH,
    editable: true,
    renderEditCell: (params) => <EditCellWithTooltip {...params} />,
  },
  {
    field: "adjustedMoisture",
    headerName: "Adjusted Moisture (%)",
    type: "number",
    flex: 1,
    minWidth: COL_MIN_WIDTH,
    cellClassName: COMPUTED_CELL_CLASS,
    renderHeader: (params) => <ComputedHeader {...params} />,
    valueFormatter: (value: number) => value.toFixed(4),
  },
  {
    field: "adjustedDensity",
    headerName: "Adjusted Density (g/cm³)",
    type: "number",
    flex: 1,
    minWidth: COL_MIN_WIDTH,
    cellClassName: COMPUTED_CELL_CLASS,
    renderHeader: (params) => <ComputedHeader {...params} />,
    valueFormatter: (value: number) => value.toFixed(4),
  },
];

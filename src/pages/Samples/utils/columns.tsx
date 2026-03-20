import FunctionsIcon from "@mui/icons-material/Functions";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import {
  GridEditInputCell,
  type GridColDef,
  type GridColumnHeaderParams,
} from "@mui/x-data-grid";
import { z } from "zod";
import type { SampleRow } from "../types";

export const COMPUTED_CELL_CLASS = "computed-cell";

const COL_MIN_WIDTH = 120;

function EditCellWithTooltip(
  props: Parameters<NonNullable<GridColDef["renderEditCell"]>>[0],
) {
  return (
    <Tooltip
      open={!props.hasFocus && !!props.error}
      title={typeof props.error === "string" ? props.error : ""}
      placement="top"
      arrow
    >
      <span style={{ width: "100%", display: "flex" }}>
        <GridEditInputCell
          {...props}
          sx={{
            "& input": {
              textAlign: "right",
              "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&[type=number]": {
                MozAppearance: "textfield",
              },
            },
          }}
        />
      </span>
    </Tooltip>
  );
}

function ComputedHeader({ colDef }: GridColumnHeaderParams<SampleRow>) {
  return (
    <Tooltip
      title="This column is automatically computed and cannot be edited"
      arrow
      placement="top"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          cursor: "default",
        }}
      >
        <span>{colDef.headerName}</span>
        <FunctionsIcon fontSize="small" sx={{ opacity: 0.6 }} />
      </Box>
    </Tooltip>
  );
}

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

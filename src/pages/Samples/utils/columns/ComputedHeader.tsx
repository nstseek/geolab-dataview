import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import type { GridColumnHeaderParams } from "@mui/x-data-grid";
import type { SampleRow } from "@pages/Samples/types";
import FunctionsIcon from "@mui/icons-material/Functions";

export function ComputedHeader({ colDef }: GridColumnHeaderParams<SampleRow>) {
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

import Tooltip from "@mui/material/Tooltip";
import { type GridColDef, GridEditInputCell } from "@mui/x-data-grid";

export function EditCellWithTooltip(
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

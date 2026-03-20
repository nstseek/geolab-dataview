import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { COUNTRIES } from "./countries";

interface NewsToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  country: string;
  onCountryChange: (value: string) => void;
}

export default function NewsToolbar({
  search,
  onSearchChange,
  country,
  onCountryChange,
}: NewsToolbarProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      <TextField
        size="small"
        label="Search articles"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ minWidth: 260, width: { xs: "100%", sm: "auto" } }}
      />
      <FormControl
        size="small"
        sx={{ minWidth: 180, width: { xs: "100%", sm: "auto" } }}
      >
        <InputLabel>Country</InputLabel>
        <Select
          value={country}
          label="Country"
          onChange={(e) => onCountryChange(e.target.value)}
        >
          {COUNTRIES.map((c) => (
            <MenuItem key={c.code} value={c.code}>
              {c.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

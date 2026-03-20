import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useHeader } from "@context/HeaderContext";

interface HeaderProps {
  sidebarOpen: boolean;
  onMenuClick: () => void;
}

export default function Header({ sidebarOpen, onMenuClick }: HeaderProps) {
  const { pageTitle, contextSuffix } = useHeader();

  const title = contextSuffix ? `${pageTitle} – ${contextSuffix}` : pageTitle;

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Toggle navigation menu"
          aria-controls="nav-sidebar"
          aria-expanded={sidebarOpen}
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 1, display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="h1"
          sx={{ fontWeight: 600, letterSpacing: 0.5 }}
        >
          GeoLab
        </Typography>
        <Typography
          variant="h6"
          aria-hidden="true"
          sx={{
            ml: 2,
            color: "text.secondary",
            fontWeight: 400,
            display: { xs: "none", sm: "block" },
          }}
        >
          /
        </Typography>
        <Typography
          variant="h6"
          sx={{ ml: 2, fontWeight: 500, display: { xs: "none", sm: "block" } }}
        >
          {title}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

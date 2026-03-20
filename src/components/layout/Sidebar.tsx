import ArticleIcon from "@mui/icons-material/Article";
import HomeIcon from "@mui/icons-material/Home";
import ScienceIcon from "@mui/icons-material/Science";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { NavLink, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 240;

const navItems = [
  { label: "Home", path: "/", icon: <HomeIcon /> },
  { label: "Samples", path: "/samples", icon: <ScienceIcon /> },
  { label: "News", path: "/news", icon: <ArticleIcon /> },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const drawerPaperSx = {
  width: DRAWER_WIDTH,
  boxSizing: "border-box",
  top: 64,
  height: "calc(100% - 64px)",
};

export default function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { pathname } = useLocation();

  function isActive(path: string) {
    return path === "/" ? pathname === "/" : pathname.startsWith(path);
  }

  const drawerContent = (
    <>
      <Typography
        variant="overline"
        aria-hidden="true"
        sx={{ px: 2, pt: 2, pb: 1, color: "text.secondary", letterSpacing: 2 }}
      >
        Navigation
      </Typography>
      <List component="nav" aria-label="Main navigation">
        {navItems.map(({ label, path, icon }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              component={NavLink}
              to={path}
              end={path === "/"}
              aria-current={isActive(path) ? "page" : undefined}
              onClick={isMobile ? onClose : undefined}
              sx={{
                "&.active": {
                  backgroundColor: "primary.dark",
                  "& .MuiListItemIcon-root": { color: "secondary.main" },
                  "& .MuiListItemText-primary": {
                    color: "secondary.main",
                    fontWeight: 600,
                  },
                },
                "&:hover": { backgroundColor: "action.hover" },
                borderRadius: 1,
                mx: 1,
                mb: 0.5,
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  if (isMobile) {
    return (
      <Drawer
        id="nav-sidebar"
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ "& .MuiDrawer-paper": drawerPaperSx }}
      >
        {drawerContent}
      </Drawer>
    );
  }

  return (
    <Drawer
      id="nav-sidebar"
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": drawerPaperSx,
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

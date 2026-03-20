import ArticleIcon from "@mui/icons-material/Article";
import ScienceIcon from "@mui/icons-material/Science";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "@context/HeaderContext";

const pages = [
  {
    title: "Samples",
    description:
      "Upload and manage soil sample data. Edit, filter, recalculate, and export CSV.",
    path: "/samples",
    icon: <ScienceIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
  },
  {
    title: "News",
    description:
      "Browse the latest geotechnical and environmental news from around the world.",
    path: "/news",
    icon: <ArticleIcon sx={{ fontSize: 48, color: "secondary.main" }} />,
  },
];

export default function Home() {
  const { setHeader } = useHeader();
  const navigate = useNavigate();

  useEffect(() => {
    setHeader("Home", "");
  }, [setHeader]);

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        GeoLab Home
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Welcome to GeoLab DataView — manage your geotechnical sample data and
        stay up to date with regional geo news.
      </Typography>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>
        {pages.map((page) => (
          <Card
            key={page.path}
            variant="outlined"
            sx={{
              width: { xs: "100%", sm: 280 },
              transition: "border-color 0.2s",
              "&:hover": { borderColor: "secondary.main" },
            }}
          >
            <CardActionArea onClick={() => navigate(page.path)} sx={{ p: 1 }}>
              <CardContent sx={{ textAlign: "center" }}>
                {page.icon}
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 600 }}>
                  {page.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {page.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
  );
}

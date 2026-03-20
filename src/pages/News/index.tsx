import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDebouncedState } from "@hooks/useDebouncedState";
import { useNewsQuery } from "@queries/news/useNewsQuery";
import type { NewsArticle } from "@queries/news/types";
import NewsArticleDetail from "./NewsArticleDetail";
import NewsArticleList from "./NewsArticleList";
import NewsToolbar from "./NewsToolbar";
import { COUNTRIES } from "./NewsToolbar/countries";
import { useHeader } from "@context/HeaderContext";

export default function News() {
  const { setHeader } = useHeader();
  const [search, debouncedSearch, setSearch] = useDebouncedState("");
  const [country, setCountry] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );

  const { data, isLoading, isError } = useNewsQuery({
    q: debouncedSearch || undefined,
    country: country || undefined,
  });

  useEffect(() => {
    const countryLabel = country
      ? (COUNTRIES.find((c) => c.code === country)?.label ?? "")
      : "";
    const parts = [countryLabel, selectedArticle?.title ?? ""].filter(Boolean);
    setHeader("News", parts.join(" – "));
  }, [setHeader, selectedArticle, country]);

  useEffect(() => {
    if (isError) toast.error("Failed to load news. Check your API key.");
  }, [isError]);

  return (
    <Box>
      <NewsToolbar
        search={search}
        onSearchChange={setSearch}
        country={country}
        onCountryChange={setCountry}
      />

      <NewsArticleList
        articles={data?.results ?? []}
        isLoading={isLoading}
        onSelect={setSelectedArticle}
      />

      <NewsArticleDetail
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </Box>
  );
}

import { useCallback, useState } from "react";
import { HeaderContext } from "./context";

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [pageTitle, setPageTitle] = useState("Home");
  const [contextSuffix, setContextSuffix] = useState("");

  const setHeader = useCallback((title: string, suffix: string) => {
    setPageTitle(title);
    setContextSuffix(suffix);
    document.title = suffix
      ? `${title} – ${suffix} | GeoLab`
      : `${title} | GeoLab`;
  }, []);

  return (
    <HeaderContext value={{ pageTitle, contextSuffix, setHeader }}>
      {children}
    </HeaderContext>
  );
}

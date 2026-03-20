import { createContext } from "react";

interface HeaderContextValue {
  pageTitle: string;
  contextSuffix: string;
  setHeader: (title: string, suffix: string) => void;
}

export const HeaderContext = createContext<HeaderContextValue | null>(null);

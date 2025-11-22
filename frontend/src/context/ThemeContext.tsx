//src/context/ThemeContext.tsx
import { createContext, useContext, useEffect, useState} from "react";
import type { ReactNode } from "react";

type Theme = "light" | "dark" | "blue";
type FontSize = "small" | "medium" | "large";
type Contrast = "normal" | "high";

interface ThemeContextType {
  theme: Theme;
  fontSize: FontSize;
  contrast: Contrast;
  toggleTheme: () => void;
  cycleFontSize: () => void;
  toggleContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem("theme") as Theme) || "blue");
  const [fontSize, setFontSize] = useState<FontSize>(() => (localStorage.getItem("fontSize") as FontSize) || "medium");
  const [contrast, setContrast] = useState<Contrast>(() => (localStorage.getItem("contrast") as Contrast) || "normal");

  useEffect(() => {
    document.documentElement.className = `${theme} ${fontSize} ${contrast}`;
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);
    localStorage.setItem("contrast", contrast);
  }, [theme, fontSize, contrast]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : prev === "dark" ? "blue" : "light"));
  };

  const cycleFontSize = () => {
    setFontSize(prev => (prev === "small" ? "medium" : prev === "medium" ? "large" : "small"));
  };

  const toggleContrast = () => {
    setContrast(prev => (prev === "normal" ? "high" : "normal"));
  };

  return (
    <ThemeContext.Provider value={{ theme, fontSize, contrast, toggleTheme, cycleFontSize, toggleContrast }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return context;
};

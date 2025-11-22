// src/components/ThemeWrapper.tsx
import { useTheme } from "../context/ThemeContext";
import type { ReactNode } from "react";

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  const { theme, fontSize, contrast } = useTheme();

  return (
    <div
      className="min-h-screen transition-all duration-300"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        fontSize:
          fontSize === "small"
            ? "14px"
            : fontSize === "large"
            ? "18px"
            : "16px",
      }}
      data-theme={theme}
      data-contrast={contrast}
    >
      <style>{`
        :root {
          --icon-color-light: rgb(29 78 216 / 0.8); /* text-blue-700/80 */
          --icon-color-dark: #93C5FD; /* text-blue-300 */
          --icon-color-blue: #93C5FD; /* mismo que dark */
        }

        [data-theme="light"] .sidebar-icon {
          color: var(--icon-color-light);
        }
        [data-theme="dark"] .sidebar-icon {
          color: var(--icon-color-dark);
        }
        [data-theme="blue"] .sidebar-icon {
          color: var(--icon-color-blue);
        }
      `}</style>

      {children}
    </div>
  );
}
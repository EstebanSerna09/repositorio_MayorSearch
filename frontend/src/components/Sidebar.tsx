import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  User,
  Bookmark,
  Home,
  Compass,
  Settings,
  HelpCircle,
  Pencil,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext"; // 👈 IMPORTANTE

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapse }: SidebarProps) {
  const { user, isAuthenticated } = useAuth();
  const { theme } = useTheme(); // 👈 obtenemos el tema actual

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [navItems, setNavItems] = useState<any[]>([]);

  useEffect(() => {
    const userRol =
      typeof user === "object" && user?.rol
        ? user.rol
        : localStorage.getItem("rol") || "visitante";

    const baseItems = [
      { to: "/", label: "Inicio", icon: Home },
      { to: "/explorar", label: "Explorar", icon: Compass },
      { to: "/profile", label: "Mi perfil", icon: User },
      { to: "/profile", label: "Guardados", icon: Bookmark },
    ];

    const adminItems =
      userRol === "docente" || userRol === "admin"
        ? [{ to: "/admin/recursos", label: "Gestor de Recursos", icon: Pencil }]
        : [];

    const footerItems = [
      { to: "/ayuda", label: "Ayuda", icon: HelpCircle },
      { to: "/ajustes", label: "Ajustes", icon: Settings },
    ];

    setNavItems([...baseItems, ...adminItems, ...footerItems]);
  }, [isAuthenticated, user]);

  const toggleMobile = () => setIsMobileOpen(!isMobileOpen);
  const toggleCollapse = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    onCollapse?.(newValue);
  };

  // 👇 Aquí elegimos el logo según el tema actual
  const logoSrc =
    theme === "light"
      ? "/images/LogoMayorSearch.png"
      : "/images/LogoMayorSearch2.png";

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md shadow transition"
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
        onClick={toggleMobile}
        aria-label="Abrir menú"
      >
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={toggleMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen shadow-lg transition-all duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
        ${isCollapsed ? "md:w-20" : "md:w-64"}`}
        style={{
          backgroundColor: "var(--card-bg)",
          color: "var(--text-color)",
        }}
      >
        <div className="flex flex-col h-full">
          {/* 🔹 Encabezado con logo dinámico */}
          <div
            className="flex items-center justify-between p-4 border-b transition-colors"
            style={{
              borderColor: "rgba(128,128,128,0.2)",
            }}
          >
            {!isCollapsed && (
              <Link to="/">
                <img
                  src={logoSrc}
                  alt="Logo MayorSearch"
                  className="w-40 object-contain transition-all duration-300"
                />
              </Link>
            )}
            <button
              onClick={toggleCollapse}
              className="hidden md:flex p-2 rounded-md transition"
              style={{
                backgroundColor: "transparent",
                color: "var(--text-color)",
              }}
              aria-label="Colapsar menú"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* 🔹 Navegación */}
          <nav className="flex-1 overflow-y-auto py-4 space-y-1">
            {navItems.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition-all ${
                  isCollapsed ? "justify-center" : ""
                }`}
                style={{
                  color: "var(--text-color)",
                  backgroundColor: "transparent",
                }}
                title={isCollapsed ? label : ""}
              >
                <Icon className="w-5 h-5 sidebar-icon transition-colors" />
                {!isCollapsed && <span>{label}</span>}
              </Link>
            ))}
          </nav>

          {/* 🔹 Footer */}
          <div
            className="p-4 text-xs border-t transition-colors"
            style={{
              borderColor: "rgba(128,128,128,0.2)",
              color: "var(--text-color)",
            }}
          >
            {!isCollapsed && <p>© 2025 MayorSearch</p>}
          </div>
        </div>
      </aside>
    </>
  );
}

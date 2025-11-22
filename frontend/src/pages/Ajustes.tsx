import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";


export default function Ajustes() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { theme, fontSize, contrast, toggleTheme, cycleFontSize, toggleContrast } = useTheme();

  const handleRedirect = () => {
    navigate("/reset-password");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-(--bg-color) text-(--text-color) transition-all">
      <h1 className="text-3xl font-bold mb-8"> Ajustes</h1>

      <div className="bg-(--card-bg) p-8 rounded-2xl w-[400px] shadow-md text-center space-y-6">
        {/* ===== Sección de accesibilidad ===== */}
        <section>
          <h2 className="text-xl font-semibold mb-4"> Accesibilidad</h2>

          {/* Tema */}
          <div className="mb-4 text-left">
            <label className="block font-medium mb-1"> Tema actual</label>
            <div className="flex items-center justify-between">
              <span className="capitalize">{theme}</span>
              <button
                onClick={toggleTheme}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-sm transition-all"
              >
                Cambiar tema
              </button>
            </div>
          </div>

          {/* Tamaño de fuente */}
          <div className="mb-4 text-left">
            <label className="block font-medium mb-1"> Tamaño de fuente</label>
            <div className="flex items-center justify-between">
              <span className="capitalize">{fontSize}</span>
              <button
                onClick={cycleFontSize}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-sm transition-all"
              >
                Cambiar tamaño
              </button>
            </div>
          </div>

          {/* Contraste */}
          <div className="text-left">
            <label className="block font-medium mb-2"> Contraste</label>
            <button
              onClick={toggleContrast}
              className={`w-full py-2 rounded font-semibold transition-all ${
                contrast === "high"
                  ? "bg-yellow-500 text-black"
                  : "bg-gray-600 hover:bg-gray-500 text-white"
              }`}
            >
              {contrast === "high" ? "Desactivar contraste" : "Activar contraste"}
            </button>
          </div>

          <p className="text-sm text-gray-400 mt-4">
            Los cambios se guardan automáticamente en tu dispositivo.
          </p>
        </section>

        {/* ===== Sección de cuenta (solo logueados) ===== */}
        {isAuthenticated && (
          <section className="pt-6 border-t border-gray-500/30">
            <h2 className="text-xl font-semibold mb-4">Cuenta</h2>
            <p className="text-sm text-gray-300 mb-4">
              Opciones disponibles solo para usuarios registrados.
            </p>

            <button
              onClick={handleRedirect}
              className="w-full bg-[#007bff] hover:bg-[#006ae6] text-white font-semibold py-2 rounded-lg transition-all"
            >
              Restablecer contraseña
            </button>
          </section>
        )}
      </div>
    </div>
  );
}

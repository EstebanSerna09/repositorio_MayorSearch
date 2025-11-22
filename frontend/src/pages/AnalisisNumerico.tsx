// src/pages/AnalisisNumerico.tsx
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import UserMenu from "../components/UserMenu";
import ResourceCard from "../components/ResourceCard";
import SearchBarAnalisisNumerico from "../components/SearchBarAnalisisNumerico";
import { buscarRecursos } from "../services/recursoService";
import { Link } from "react-router-dom";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react"; // import de íconos
import { useTheme } from "../context/ThemeContext";

export default function AnalisisNumerico() {
  const { theme } = useTheme();

  const colors = {
    titulo:
      theme === "dark"
        ? "#d05252"
        : theme === "blue"
          ? "#ff6b6b"
          : "#7a1212",
    texto:
      theme === "dark"
        ? "#d1d5db"
        : theme === "blue"
          ? "#dbeafe"
          : "#0a1a3d",
    borde:
      theme === "dark"
        ? "rgba(255,255,255,0.08)"
        : theme === "blue"
          ? "rgba(255,107,107,0.25)"
          : "rgba(0,0,0,0.08)",
    cardBg:
      theme === "dark"
        ? "#0f172a"
        : theme === "blue"
          ? "#e9f1ff"
          : "#ffffff",
    accent:
      theme === "dark"
        ? "#d05252"
        : theme === "blue"
          ? "#ff6b6b"
          : "#7a1212",
  };

  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTop, setShowTop] = useState(true);
  const [ordenAsc, setOrdenAsc] = useState(true); // nuevo estado

  // Efecto de scroll (mismo que en Teoría de Grafos)
  useEffect(() => {
    const scrollContainer = document.querySelector(".scroll-area") || window;
    let lastScrollTop = 0;

    const onScroll = () => {
      const currentScroll =
        scrollContainer === window
          ? window.scrollY
          : (scrollContainer as HTMLElement).scrollTop;

      const goingDown = currentScroll > lastScrollTop + 5;
      setShowTop(!goingDown || currentScroll < 80);
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", onScroll);
  }, []);

  // handleSearch con "Analisis numerico" fijo
  type SearchPayload = {
    q?: string;
    etiquetas?: string;
    tipo?: string;
    nivel?: string;
    idioma?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    [k: string]: any;
  };

  const handleSearch = async (payload: SearchPayload | undefined) => {
    if (!payload) return;

    // Aseguramos que "Analisis numerico" esté presente en etiquetas
    const etiquetasActuales = payload.etiquetas ? String(payload.etiquetas).trim() : "";
    const etiquetasArray = etiquetasActuales
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (!etiquetasArray.includes("Analisis numerico")) {
      etiquetasArray.push("Analisis numerico");
    }

    const etiquetasFinal = etiquetasArray.join(",");

    const params: any = {
      ...payload,
      etiquetas: etiquetasFinal,
    };

    if (params.asignatura) delete params.asignatura;

    console.log(" Parámetros enviados a buscarRecursos (Análisis Numérico):", params);

    setLoading(true);
    try {
      const data = await buscarRecursos(params);
      // Orden inicial A-Z
      const sorted = (data.resultados || []).sort((a: any, b: any) =>
        a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })
      );
      setResultados(sorted);
      setLastQuery(params.q || "");
      setOrdenAsc(true);
    } catch (err: any) {
      console.error("Error al buscar recursos:", err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  // Alternar orden alfabético
  const toggleOrden = () => {
    const nuevoOrdenAsc = !ordenAsc;
    setOrdenAsc(nuevoOrdenAsc);
    const ordenados = [...resultados].sort((a, b) =>
      nuevoOrdenAsc
        ? a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })
        : b.titulo.localeCompare(a.titulo, "es", { sensitivity: "base" })
    );
    setResultados(ordenados);
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      {/* Sidebar sincronizada */}
      <Sidebar onCollapse={setIsCollapsed} />

      {/* UserMenu animado */}
      <div
        className={`fixed top-6 right-8 z-9999 transition-all duration-500 ease-in-out transform ${
          showTop ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6 pointer-events-none"
        }`}
      >
        <UserMenu />
      </div>

      {/* Contenedor principal */}
      <main
        className={`flex-1 flex flex-col items-center justify-start relative transition-all duration-500 ease-in-out ${
          isCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <div className="overflow-y-auto h-[calc(100vh-40px)] w-full flex justify-center scroll-area">
          <div
            className={`w-full max-w-6xl mt-20 transform transition-transform duration-500 ease-in-out ${
              isCollapsed ? "scale-100" : "scale-95"
            }`}
            style={{ transformOrigin: "center top" }}
          >
            {/* Título y barra */}
            <h1 className="text-4xl font-bold mb-8 text-center transition-all duration-500"
              style={{ color: colors.titulo }}>
              Análisis Numérico
            </h1>

            {/* Barra especializada */}
            <SearchBarAnalisisNumerico onSearch={handleSearch} />

            {lastQuery && (
              <div className="mt-10 text-left ml-[30px]">
                <p className="text-sm mb-2" style={{ color: colors.titulo }}>
                  Búsqueda / <span className="font-semibold">“{lastQuery}”</span>
                </p>

                {/* Encabezado con botón A-Z/Z-A */}
                <div className="flex items-center justify-between pr-6">
                  <h2 className="text-3xl font-bold mb-1" style={{ color: colors.titulo }}>
                    Resultados para: <span style={{ color: colors.titulo }}>“{lastQuery}”</span>
                  </h2>

                  {resultados.length > 0 && (
                    <button
                      onClick={toggleOrden}
                      style={{
                        color: colors.titulo,
                        border: `1px solid ${colors.titulo}`,
                        backgroundColor: "transparent",
                        transition: "all 0.2s ease",
                      }}
                      className="flex items-center gap-2 font-semibold rounded-md px-3 py-2 text-sm"
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = colors.titulo;
                        (e.currentTarget as HTMLButtonElement).style.color =
                          theme === "dark" ? "#0a1a3d" : theme === "blue" ? "#f8f5ee" : "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLButtonElement).style.color = colors.titulo;
                      }}
                    >
                      {ordenAsc ? (
                        <>
                          <ArrowUpAZ size={16} /> A-Z
                        </>
                      ) : (
                        <>
                          <ArrowDownAZ size={16} /> Z-A
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* ---> Frase-enlace discreta centrada */}
            <div className="mt-3 mb-6 text-sm text-center" style={{ color: colors.titulo }}>
              ¿Quieres navegar por todos los recursos de{" "}
              <Link
                to="/recursosanalisisnumerico"
                className="font-semibold underline transition-colors"
                style={{ color: colors.titulo }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = colors.accent)
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = colors.titulo)
                }
              >
                Análisis numérico
              </Link>
              ?
            </div>

            {/* Resultados */}
            <div className="mt-6">
              {loading && <p className="text-gray-500 text-center">Buscando...</p>}

              {!loading && resultados.length > 0 ? (
                <div
                  className={`space-y-6 transition-all duration-500 ease-in-out ${
                    isCollapsed ? "scale-95 opacity-90" : "scale-100 opacity-100"
                  }`}
                >
                  {resultados.map((r) => (
                    <ResourceCard key={r.idrecurso} r={r} />
                  ))}
                </div>
              ) : (
                !loading &&
                lastQuery && (
                  <p className="text-gray-400 text-center italic mt-6">
                    No se encontraron resultados para “{lastQuery}”.
                  </p>
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

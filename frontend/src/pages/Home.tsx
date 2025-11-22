// src/pages/Home.tsx
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import SearchBar from "../components/SearchBar";
import UserMenu from "../components/UserMenu";
import ResourceCard from "../components/ResourceCard";
import { buscarRecursos } from "../services/recursoService";
import { ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
export default function Home() {
  const { theme } = useTheme();
  const colors = {
    titulo:
      theme === "dark"
        ? "#a7c7ff"
        : theme === "blue"
          ? "#4a90e2"
          : "#0a3d91",
    texto:
      theme === "dark"
        ? "#e6e9ee"
        : theme === "blue"
          ? "#f8f5ee"
          : "#0a1a3d",
    borde:
      theme === "dark"
        ? "rgba(255,255,255,0.06)"
        : theme === "blue"
          ? "rgba(180,200,255,0.12)"
          : "rgba(0,0,0,0.06)",
    cardBg:
      theme === "dark"
        ? "var(--card-bg)"
        : "var(--card-bg)",
    inputFocus:
      theme === "dark"
        ? "#a7c7ff"
        : theme === "blue"
          ? "#4a90e2"
          : "#0a3d91",
  };
  const [resultados, setResultados] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [ordenAsc, setOrdenAsc] = useState(true); // ← NUEVO
  const [showTop, setShowTop] = useState(true);

  const mapFiltersToParams = (payload: Record<string, any> = {}) => {
    const params: Record<string, any> = {};
    if (payload.q && String(payload.q).trim() !== "") {
      params.q = String(payload.q).trim();
      setLastQuery(String(payload.q).trim());
    }
    if (payload.idioma) {
      const idi = String(payload.idioma).toLowerCase();
      if (idi.includes("inglés") || idi.includes("ingles")) params.idioma = "en";
      else if (idi.includes("español") || idi.includes("espanol")) params.idioma = "es";
      else params.idioma = payload.idioma;
    }
    const etiquetas: string[] = [];
    if (payload.asignatura) etiquetas.push(String(payload.asignatura).trim());
    if (payload.tipo) etiquetas.push(String(payload.tipo).trim());
    if (payload.nivel) etiquetas.push(String(payload.nivel).trim());
    if (payload.etiquetas && String(payload.etiquetas).trim() !== "") {
      params.etiquetas = String(payload.etiquetas).trim();
    } else if (etiquetas.length > 0) {
      params.etiquetas = etiquetas.join(",");
    }
    if (payload.fecha_inicio) params.fecha_inicio = payload.fecha_inicio;
    if (payload.fecha_fin) params.fecha_fin = payload.fecha_fin;
    if (payload.verificado !== undefined) params.verificado = payload.verificado;
    if (payload.ubicacion) params.ubicacion = payload.ubicacion;
    params.limit = payload.limit ?? 10;
    params.offset = payload.offset ?? 0;
    return params;
  };

  const handleSearch = async (payload: Record<string, any> | undefined) => {
    if (!payload) return;
    const params = mapFiltersToParams(payload);
    const hasAnyFilter =
      Boolean(params.q) ||
      Boolean(params.etiquetas) ||
      (params.fecha_inicio && params.fecha_fin) ||
      Boolean(params.idioma) ||
      params.verificado !== undefined ||
      Boolean(params.ubicacion);
    if (!hasAnyFilter) return;
    setLoading(true);
    try {
      const data = await buscarRecursos(params);
      const sortedData = (data.resultados || []).sort((a: any, b: any) =>
        a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })
      );
      setResultados(sortedData);
    } catch (err: any) {
      console.error("Error al buscar recursos:", err);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen flex overflow-hidden" style={{
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
    }}>
      <Sidebar onCollapse={setIsCollapsed} />

      <div
        className={`fixed top-6 right-8 z-9999 transition-all duration-500 ease-in-out transform ${showTop
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-6 pointer-events-none"
          }`}
      >
        <UserMenu />
      </div>

      <main
        className={`flex-1 flex flex-col items-center justify-start relative transition-all duration-500 ease-in-out ${isCollapsed ? "md:pl-20" : "md:pl-64"
          }`}
      >
        <div className="overflow-y-auto h-[calc(100vh-40px)] w-full flex justify-center scroll-area">
          <div
            className={`w-full max-w-6xl mt-20 transform transition-transform duration-500 ease-in-out ${isCollapsed ? "scale-100" : "scale-95"
              }`}
            style={{ transformOrigin: "center top" }}
          >
            <h1
  className="
    text-2xl 
    sm:text-3xl 
    md:text-4xl 
    font-bold 
    mb-8 
    text-center 
    transition-all 
    duration-500
  "
  style={{ color: colors.titulo }}
>
              ¿Qué estás buscando ahora?
            </h1>

            <SearchBar onSearch={handleSearch} />

            {lastQuery && (
              <div className="mt-10 text-left ml-[30px]">
                <p className="text-sm mb-2" style={{ color: colors.texto }}>
                  Búsqueda / <span className="font-semibold">“{lastQuery}”</span>
                </p>

                <div className="flex items-center justify-between pr-6">
                  <h2 className="text-3xl font-bold mb-1" style={{ color: colors.titulo }}>
                    Resultados para: <span>“{lastQuery}”</span>
                  </h2>

                  {/* Botón de orden A-Z / Z-A */}
                  {resultados.length > 0 && (
                    <button
                      onClick={toggleOrden}
                      style={{
                        color: colors.titulo,
                        border: `1px solid ${colors.titulo}`,
                        backgroundColor: "transparent",
                        transition: "all 0.25s ease",
                      }}
                      className="flex items-center gap-2 font-semibold rounded-md px-3 py-2 text-sm"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.titulo;
                        e.currentTarget.style.color =
                          theme === "dark" ? "#0a1a3d" : theme === "blue" ? "#f8f5ee" : "#ffffff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = colors.titulo;
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

            <div className="mt-6">
              {loading && (
                <p className="text-gray-500 text-center">Buscando...</p>
              )}

              {!loading && resultados.length > 0 ? (
                <div
                  className={`space-y-6 transition-all duration-500 ease-in-out ${isCollapsed ? "scale-95 opacity-90" : "scale-100 opacity-100"
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
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  GitBranch,
  Calculator,
  Feather,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import UserMenu from "../components/UserMenu";
import ResourceCard from "../components/ResourceCard";
import { buscarRecursos } from "../services/recursoService";
import type { BuscarParams } from "../services/recursoService";
import { useTheme } from "../context/ThemeContext";
export default function Explorar() {
  // sincronizamos con Sidebar
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const [ultimos, setUltimos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  // Mostrar/ocultar user menu por scroll (igual que en Home)
  const [showTop, setShowTop] = useState(true);
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

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      try {
        const params: Partial<BuscarParams> = { limit: 10, offset: 0 };
        const resp = await buscarRecursos(params);
        if (resp && resp.resultados) setUltimos(resp.resultados);
      } catch (err) {
        console.error("Error cargando últimos recursos:", err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // Carrusel corregido
  const scrollBy = (direction: "left" | "right") => {
    const el = carouselRef.current;
    if (!el) return;
    const card = el.querySelector("div > div"); // primera tarjeta
    const cardWidth = card ? (card as HTMLElement).offsetWidth + 16 : 720; // 16 = gap-4
    el.scrollBy({
      left: direction === "right" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };
  const colors = {
    grafos:
      theme === "dark"
        ? "#3ca968"
        : theme === "blue"
          ? "#7fffd4"
          : "#0f5d38", // original
    numerico:
      theme === "dark"
        ? "#d05252"
        : theme === "blue"
          ? "#ff6b6b"
          : "#7a1212",
    autores:
      theme === "dark"
        ? "#d6a43a"
        : theme === "blue"
          ? "#ffd166"
          : "#8a6b12",
    titulo:
      theme === "dark"
        ? "#7ba8ff"
        : theme === "blue"
          ? "#9acbff"
          : "#0a3d91",
    textoSecundario:
      theme === "dark"
        ? "#d1d5db"
        : theme === "blue"
          ? "#dbeafe"
          : "#374151",
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

      {/* UserMenu fijo con animación de desaparición */}
      <div
        className={`fixed top-6 right-8 z-9999 transition-all duration-500 ease-in-out transform ${showTop
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-6 pointer-events-none"
          }`}
      >
        <UserMenu />
      </div>

      {/* Contenedor principal con efecto de zoom y padding dinámico */}
      <main
        className={`flex-1 flex flex-col items-center justify-start relative transition-all duration-500 ease-in-out ${isCollapsed ? "md:pl-20" : "md:pl-64"
          }`}
      >
        <div className="overflow-y-auto h-[calc(100vh-40px)] w-full flex justify-start scroll-area pl-2 sm:pl-4 md:pl-8 lg:justify-center lg:pl-0">
          <div
            className={`w-full max-w-6xl mt-20 px-8 transform transition-transform duration-500 ease-in-out ${isCollapsed ? "scale-100" : "scale-95"
              }`}
            style={{ transformOrigin: "center top" }}
          >
            <div
              className="text-sm mb-2 transition-colors duration-500"
              style={{ color: colors.titulo }}
            >
             <Link to="/"> Inicio </Link> / Explorar
            </div>
            <h1
              className="text-4xl font-bold mb-10 text-left transition-all duration-500"
              style={{ color: colors.titulo }}
            >
              Explorar
            </h1>


            {/* Tres contenedores superiores */}
            {/* NOTA: este bloque reemplaza SOLO la sección de las 3 tarjetas */}
            {/* Grid: 1 columna en móvil, 2 en tablet, 3 en desktop; reducido padding lateral para no forzar overflow */}

            <div
              className="
    grid grid-cols-1 
    gap-6 mb-14 
    w-full 
    px-3 sm:px-4 
    max-w-[92vw]
    md:max-w-[710px] md:grid-cols-1 
    lg:max-w-[880px]
    xl:max-w-6xl xl:grid-cols-3
    relative 
    -left-5 sm:-left-8 md:-left-10px lg:left-0
  "
            >
              {/* Teoría de Grafos */}
              <div
                className="border rounded-xl p-4 sm:p-6 shadow-sm w-full box-border max-w-[calc(100vw-32px)] transition-transform duration-200"
                style={{ borderColor: colors.grafos }}
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold leading-tight wrap-break-words" style={{ color: colors.grafos }}>
                    Teoría de Grafos
                  </h2>
                  <div
                    className="p-2 sm:p-3 rounded-full border shrink-0"
                    style={{ borderColor: colors.grafos }}
                  >
                    <GitBranch size={28} style={{ color: colors.grafos }} />
                  </div>
                </div>

                <div className="mt-3 text-sm" style={{ color: colors.grafos }}>
                  <h3 className="font-semibold mb-2" style={{ color: colors.grafos }}>
                    Explora todos los recursos
                  </h3>
                  <p className="text-sm wrap-break-words">
                    Rama de las matemáticas que estudia los grafos, estructuras compuestas por vértices (nodos)
                    y aristas (líneas que los conectan) para modelar relaciones entre objetos.
                  </p>
                </div>

                <div className="mt-4">
                  <Link
                    to="/teoriadegrafos"
                    className="inline-flex items-center gap-2 font-medium hover:underline"
                    style={{ color: colors.grafos }}
                  >
                    Explorar <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Análisis numérico */}
              <div
                className="border rounded-xl p-4 sm:p-6 shadow-sm w-full box-border max-w-[calc(100vw-32px)] transition-transform duration-200"
                style={{ borderColor: colors.numerico }}
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold leading-tight wrap-break-words" style={{ color: colors.numerico }}>
                    Análisis numérico
                  </h2>
                  <div
                    className="p-2 sm:p-3 rounded-full border shrink-0"
                    style={{ borderColor: colors.numerico }}
                  >
                    <Calculator size={28} style={{ color: colors.numerico }} />
                  </div>
                </div>

                <div className="mt-3 text-sm" style={{ color: colors.numerico }}>
                  <h3 className="font-semibold mb-2" style={{ color: colors.numerico }}>
                    Explora todos los recursos
                  </h3>
                  <p className="text-sm wrap-break-words" style={{ color: colors.numerico }}>
                    Rama de las matemáticas y la informática que desarrolla y aplica algoritmos para encontrar soluciones
                    numéricas aproximadas a problemas matemáticos complejos.
                  </p>
                </div>

                <div className="mt-4">
                  <Link
                    to="/analisisnumerico"
                    className="inline-flex items-center gap-2 font-medium hover:underline"
                    style={{ color: colors.numerico }}
                  >
                    Explorar <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Autores */}
              <div
                className="border rounded-xl p-4 sm:p-6 shadow-sm w-full box-border max-w-[calc(100vw-32px)] transition-transform duration-200"
                style={{ borderColor: colors.autores }}
              >
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-2xl sm:text-3xl font-bold leading-tight wrap-break-words" style={{ color: colors.autores }}>
                    Autores
                  </h2>
                  <div
                    className="p-2 sm:p-3 rounded-full border shrink-0"
                    style={{ borderColor: colors.autores }}
                  >
                    <Feather size={28} style={{ color: colors.autores }} />
                  </div>
                </div>

                <div className="mt-3 text-sm" style={{ color: colors.autores }}>
                  <h3 className="font-semibold mb-2" style={{ color: colors.autores }}>
                    Explora todos los autores
                  </h3>
                  <p className="text-sm wrap-break-words" style={{ color: colors.autores }}>
                    Encuentra todos los autores y sus recursos subidos en el repositorio MayorSearch.
                  </p>
                </div>

                <div className="mt-4">
                  <Link
                    to="/autores"
                    className="inline-flex items-center gap-2 font-medium hover:underline"
                    style={{ color: colors.autores }}
                  >
                    Explorar <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

            </div>

            {/* Últimos recursos subidos */}
            <div className="mb-6 text-left">
              <h3 className="text-2xl font-bold" style={{ color: colors.titulo }}>
                Últimos recursos subidos:
              </h3>
            </div>

            {/* Carrusel responsivo */}
            <div className="relative w-full flex justify-center mt-10">
              <div className="w-full flex justify-center">
                <div
                  className="
        overflow-hidden 
        w-full 
        max-w-[92vw]
        md:max-w-[680px] 
        lg:max-w-[880px]
        xl:max-w-[1200px]
        relative isolate  
        -left-7 sm:-left-8 md:-left-8 lg:left-0
      "
                >
                  <div
                    ref={carouselRef}
                    className="
          flex flex-col lg:flex-row
          flex-wrap md:flex-nowrap
          gap-5 pb-4 
          overflow-y-auto lg:overflow-x-auto 
          items-center lg:items-start 
          scroll-smooth
          justify-center md:justify-start
        "
                  >
                    {loading ? (
                      <div className="p-8">Cargando...</div>
                    ) : ultimos.length === 0 ? (
                      <div className="p-8 text-gray-600">No hay recursos recientes.</div>
                    ) : (
                      ultimos.map((r) => (
                        <div
                          key={r.idrecurso}
                          className="
                w-[92vw] sm:w-[88vw] 
                md:w-[78vw] lg:min-w-[740px]
                xl:max-w-[1080px]
                shrink-0 
                mx-auto md:mx-0
                transition-transform duration-300 
                hover:scale-[1.02]
              "
                        >
                          <ResourceCard r={r} />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Flechas*/}
              <button
                onClick={() => scrollBy("left")}
                className="hidden lg:flex absolute -left-14 top-1/3 bg-white border rounded-full p-3 shadow-md hover:scale-105 transition z-30"
                aria-label="Anterior"
              >
                <ArrowLeft size={20} className="text-[#0a3d91]" />
              </button>

              <button
                onClick={() => scrollBy("right")}
                className={`hidden lg:flex absolute top-1/3 bg-white border rounded-full p-3 shadow-md hover:scale-105 transition z-30
    ${isCollapsed ? "-right-14" : "-right-4"}
  `}
                aria-label="Siguiente"
              >
                <ArrowRight size={20} className="text-[#0a3d91]" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

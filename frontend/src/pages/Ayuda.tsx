// src/pages/Ayuda.tsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UserMenu from "../components/UserMenu";
import { Mail, BookOpen, HelpCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Link } from "react-router-dom";
export default function Ayuda() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTop, setShowTop] = useState(true);
  const { theme } = useTheme();

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

  const colors = {
    titulo:
      theme === "dark"
        ? "#7ba8ff"
        : theme === "blue"
        ? "#9acbff"
        : "#0a3d91",
    subtitulo:
      theme === "dark"
        ? "#a5b4fc"
        : theme === "blue"
        ? "#3b82f6"
        : "#1e40af",
    texto:
      theme === "dark"
        ? "#d1d5db"
        : theme === "blue"
        ? "#e0f2fe"
        : "#374151",
    borde:
      theme === "dark"
        ? "#374151"
        : theme === "blue"
        ? "#bfdbfe"
        : "#d1d5db",
  };

  return (
    <div
      className="min-h-screen flex overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}
    >
      <Sidebar onCollapse={setIsCollapsed} />

      {/* UserMenu flotante */}
      <div
        className={`fixed top-6 right-8 z-9999 transition-all duration-500 ease-in-out transform ${
          showTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-6 pointer-events-none"
        }`}
      >
        <UserMenu />
      </div>

      <main
        className={`flex-1 flex flex-col items-center justify-start relative transition-all duration-500 ease-in-out ${
          isCollapsed ? "md:pl-20" : "md:pl-64"
        }`}
      >
        <div className="overflow-y-auto h-[calc(100vh-40px)] w-full flex justify-start scroll-area pl-2 sm:pl-4 md:pl-8 lg:justify-center lg:pl-0">
          <div
            className={`w-full max-w-5xl mt-20 px-8 transform transition-transform duration-500 ease-in-out ${
              isCollapsed ? "scale-100" : "scale-95"
            }`}
            style={{ transformOrigin: "center top" }}
          >
            {/* Breadcrumbs */}
            <div className="text-sm mb-2" style={{ color: colors.titulo }}>
              Inicio / Ayuda
            </div>

            {/* Título */}
            <h1
              className="text-4xl font-bold mb-8"
              style={{ color: colors.titulo }}
            >
              Centro de Ayuda
            </h1>

            {/* Sección 1: Guía rápida */}
            <section
              className="mb-10 border-l-4 pl-5 py-3 rounded-md"
              style={{ borderColor: colors.subtitulo }}
            >
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={22} style={{ color: colors.subtitulo }} />
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: colors.subtitulo }}
                >
                  Guía rápida de uso
                </h2>
              </div>
              <p className="text-base leading-relaxed" style={{ color: colors.texto }}>
                En esta plataforma puedes buscar, filtrar y guardar tus recursos favoritos
                de <strong> <Link to="/teoriadegrafos"> Teoría de Grafos </Link> </strong> y <strong><Link to="/analisisnumerico"> Análisis numérico </Link></strong>.
                Todo lo que necesitas está organizado en un repositorio fácil de usar.
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-1" style={{ color: colors.texto }}>
                <li>Usa la barra de búsqueda para encontrar recursos por palabra clave.</li>
                <li>Filtra por asignatura, autor, nivel académico, tema, idioma o fecha</li>
                <li>Guarda tus recursos favoritos con el icono de guardar.</li>
                <li>Accede a tu perfil para ver tus datos y recursos guardados.</li>
                <li>Accede al perfil de un autor para ver tus datos y recursos asociados.</li>
              </ul>
            </section>

            {/* Sección 2: Preguntas frecuentes */}
            <section
              className="mb-10 border-l-4 pl-5 py-3 rounded-md"
              style={{ borderColor: colors.subtitulo }}
            >
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle size={22} style={{ color: colors.subtitulo }} />
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: colors.subtitulo }}
                >
                  Preguntas frecuentes
                </h2>
              </div>

              <div className="mt-3 space-y-4" style={{ color: colors.texto }}>
                <div>
                  <p className="font-semibold">¿Cómo descargo un recurso?</p>
                  <p>En la tarjeta del recurso, haz clic en “Ver detalles” y luego en “Descargar”.</p>
                </div>
                <div>
                  <p className="font-semibold">¿Cómo agrego un favorito?</p>
                  <p>Solo da clic en el icono de guardar y se guardará en tu perfil automáticamente.</p>
                </div>
                <div>
                  <p className="font-semibold">¿Puedo subir mis propios recursos?</p>
                  <p>Sí, si eres docente puedes subir recursos desde el panel de gestión. Solo un adinistrador puede editar y eliminar un recurso</p>
                </div>
              </div>
            </section>

            {/* Sección 3: Contacto */}
            <section
              className="border-l-4 pl-5 py-3 rounded-md mb-14"
              style={{ borderColor: colors.subtitulo }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Mail size={22} style={{ color: colors.subtitulo }} />
                <h2
                  className="text-2xl font-semibold"
                  style={{ color: colors.subtitulo }}
                >
                  ¿Necesitas más ayuda?
                </h2>
              </div>
              <p className="text-base" style={{ color: colors.texto }}>
                Si algo no funciona como debería,
                escríbenos a:
              </p>
              <a
                href="mailto:soporte@mayorsearch.edu.co"
                className="block mt-2 font-medium hover:underline"
                style={{ color: colors.titulo }}
              >
                soporte@mayorsearch.edu.co
              </a>
            </section>

            {/* Footer simpático */}
            <div
              className="text-center text-sm pb-8 opacity-80"
              style={{ color: colors.texto }}
            >
              MayorSearch © {new Date().getFullYear()} — Trabajo de grado
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

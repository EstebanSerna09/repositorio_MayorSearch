// src/pages/RecursosCRUD.tsx
import { useEffect, useState } from "react";
import {
  PlusCircle,
  FileText,
  Search,
  ArrowUpAZ,
  ArrowDownAZ,
  User,
  Tags,
  BookOpen,
  Globe,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import recursoCrudService from "../services/recursoCrudService";
import type { Recurso } from "../services/recursoCrudService";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserMenu from "../components/UserMenu";
import { useTheme } from "../context/ThemeContext";
export default function RecursosCRUD() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [filtered, setFiltered] = useState<Recurso[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [ordenAsc, setOrdenAsc] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showTop, setShowTop] = useState(true);
  const { theme } = useTheme(); // <-- NUEVO

  // Paleta adaptativa (manteniendo el azul oscuro #081B33 como base en light)
  const colors = {
    titulo:
      theme === "dark"
        ? "#82b6ff" // un azul clarito visible sobre fondo oscuro
        : theme === "blue"
          ? "#9acbff" // azul fuerte pero legible sobre el fondo azul claro
          : "#081B33",

    texto:
      theme === "dark"
        ? "#dce3f3" // texto base clarito en dark
        : theme === "blue"
          ? "#dce3f3" // azul grisáceo más oscuro, más contraste
          : "#081B33",

    subtleText:
      theme === "dark"
        ? "#9cb4d8" // textos secundarios más claros en dark
        : theme === "blue"
          ? "#dce3f3" // un azul grisáceo legible
          : "#6b7280",

    borde:
      theme === "dark"
        ? "rgba(255,255,255,0.06)"
        : theme === "blue"
          ? "rgba(11,102,255,0.12)"
          : "rgba(0,0,0,0.08)",

    bg:
      theme === "dark"
        ? "#0f172a"
        : theme === "blue"
          ? "#eef4ff"
          : "#ffffff",

    cardBg:
      theme === "dark"
        ? "var(--card-bg)"
        : theme === "blue"
          ? "var(--card-bg)"
          : "var(--card-bg)",

    azul: theme === "dark" ? "#6ea8ff"
      : theme === "blue" ? "#6fb1ff"
        : "#0a3d91",

    morado: theme === "dark" ? "#c2a7ff"
      : theme === "blue" ? "#c9b3ff"
        : "#6b21a8",

    verde: theme === "dark" ? "#8ee0b3"
      : theme === "blue" ? "#9af5c3"
        : "#047857",

    inputRing:
      theme === "dark"
        ? "#6ea8ff"
        : theme === "blue"
          ? "#6fb1ff"
          : "#081B33",

  };

  const rol = typeof user === "object" && user?.rol ? user.rol : null;
  const idusuario = typeof user === "object" && user?.idusuario ? user.idusuario : null;

  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const data = await recursoCrudService.getAll();
        const ordenados = data.sort((a, b) =>
          a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })
        );
        setRecursos(ordenados);
        setFiltered(ordenados);
      } catch (err) {
        console.error("Error al obtener recursos:", err);
        setError("No se pudieron cargar los recursos");
      } finally {
        setLoading(false);
      }
    };
    fetchRecursos();
  }, []);

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
    const term = busqueda.trim().toLowerCase();
    if (!term) setFiltered(recursos);
    else setFiltered(recursos.filter((r) => r.titulo.toLowerCase().includes(term)));
  }, [busqueda, recursos]);

  const toggleOrden = () => {
    const nuevoOrdenAsc = !ordenAsc;
    setOrdenAsc(nuevoOrdenAsc);
    const ordenados = [...filtered].sort((a, b) =>
      nuevoOrdenAsc
        ? a.titulo.localeCompare(b.titulo, "es", { sensitivity: "base" })
        : b.titulo.localeCompare(a.titulo, "es", { sensitivity: "base" })
    );
    setFiltered(ordenados);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return alert("ID inválido");
    if (!confirm("¿Seguro que deseas eliminar este recurso? ")) return;
    try {
      await recursoCrudService.delete(id);
      setRecursos((prev) => prev.filter((r) => r.idrecurso !== id));
      alert("Recurso eliminado correctamente ");
    } catch {
      alert("Error al eliminar el recurso ");
    }
  };

  const handleEdit = (id?: number) => {
    if (!id) return alert("ID del recurso no disponible ");
    navigate(`/admin/recursos/editar/${id}`);
  };

  const handleNew = () => navigate(`/admin/recursos/nuevo`);

  if (!rol || (rol !== "admin" && rol !== "docente")) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-xl font-semibold"> Acceso denegado</p>
        <p className="text-gray-600">
          Solo los administradores o docentes pueden gestionar recursos.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex overflow-hidden" style={{
      backgroundColor: "var(--bg-color)",
      color: "var(--text-color)",
    }}>
      <Sidebar onCollapse={setIsCollapsed} />

      <div
        className={`fixed top-6 right-8 z-50 transition-all duration-500 ease-in-out transform ${showTop
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
        <div
  className={`
    w-full
    mx-auto
    mt-20
    transform
    transition-all
    duration-500
    ease-in-out
    px-4
    max-w-[102vw]
    sm:max-w-[450px]
    md:max-w-[750px]
    lg:max-w-[880px]
    xl:max-w-[1000px]
    2xl:max-w-[950px]
    ${isCollapsed ? "scale-100 translate-x-0" : "scale-100 translate-x-1.5"}
  `}
  style={{ transformOrigin: "center top" }}
>
          <div
            className={`w-full max-w-6xl mt-5 px-8 transform transition-transform duration-500 ease-in-out ${isCollapsed ? "scale-100" : "scale-95"
              }`}
            style={{ transformOrigin: "center top" }}
          >
            <div className="text-sm mb-2 opacity-70" style={{ color: colors.titulo }}>
              Inicio / Recursos
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
              <h1 className="text-4xl font-bold" style={{ color: colors.titulo }}>
                Gestión de Recursos
              </h1>

              <div
  className="
    flex items-center gap-2
    justify-between sm:justify-end
    flex-nowrap
    [&>button]:text-xs [&>button]:px-2 [&>button]:py-1
    [&>div>input]:text-xs [&>div>input]:py-1 [&>div>input]:w-28
    sm:[&>button]:text-sm sm:[&>button]:px-3 sm:[&>button]:py-2
    sm:[&>div>input]:text-sm sm:[&>div>input]:py-2 sm:[&>div>input]:w-48
  "
>
                <button
                  onClick={toggleOrden}
                  style={{
                    color: colors.titulo,
                    border: `1px solid ${colors.titulo}`,
                    backgroundColor: "transparent",
                    transition: "all 0.20s ease",
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

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Buscar recurso..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-9 pr-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#081B33] transition w-48"
                  />
                </div>

                <button
                  onClick={handleNew}
                  style={{
                    backgroundColor:
                      theme === "dark"
                        ? "#2b4c7e" // azul medio clarito para dark
                        : theme === "blue"
                          ? "#6ea8ff" // azul claro que combina con el fondo azulito
                          : "#081B33", // mantiene el azul oscuro en light
                    color: theme === "dark" || theme === "blue" ? "#ffffff" : "#ffffff",
                    transition: "all 0.25s ease",
                  }}
                  className="flex items-center gap-2 font-semibold px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      theme === "dark"
                        ? "#82b6ff" // más clarito en hover dark
                        : theme === "blue"
                          ? "#9acbff" // más brillante en hover blue
                          : "#0a3d91";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      theme === "dark"
                        ? "#2b4c7e"
                        : theme === "blue"
                          ? "#6ea8ff"
                          : "#081B33";
                  }}
                >
                  <PlusCircle className="w-5 h-5" /> Nuevo recurso
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-gray-600">Cargando recursos... </p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="text-gray-600">
                No hay recursos aún. ¡Sube el primero!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pb-10">
                {filtered.map((r) => (
                  <div
                    key={r.idrecurso}
                    className="p-5 rounded-2xl shadow-md hover:shadow-lg transition"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.borde}`,
                      color: colors.texto,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className=" w-6 h-6" style={{ color: colors.azul }} />
                      <h2
                        className="text-lg font-semibold"
                        style={{ color: colors.titulo }}
                      >{r.titulo}</h2>
                    </div>

                    <p className="text-sm line-clamp-3 mb-4" style={{ color: colors.subtleText }}>
                      {r.descripcion || "Sin descripción "}
                    </p>

                    {/* Info adicional como en ResourceCard */}
                    <div className="space-y-2 text-sm mb-4" style={{ color: colors.texto }}>
                      {r.autores && (
                        <div className="flex items-center gap-2">
                          <User style={{ color: colors.azul }} size={15} />
                          <span style={{ color: colors.subtleText }}>{r.autores}</span>
                        </div>
                      )}
                      {r.temas && (
                        <div className="flex items-center gap-2">
                          <BookOpen style={{ color: colors.morado }} size={15} />
                          <span style={{ color: colors.subtleText }}>{r.temas}</span>
                        </div>
                      )}
                      {r.etiquetas && (
                        <div className="flex items-center gap-2">
                          <Tags style={{ color: colors.verde }} size={15} />
                          <span style={{ color: colors.subtleText }}>
                            {r.etiquetas.split(",").join(", ")}
                          </span>
                        </div>
                      )}

                      {r.idioma && (
                        <div className="flex items-center gap-2">
                          <Globe style={{ color: colors.azul }} size={15} />
                          <span>{r.idioma.toUpperCase()}</span>
                        </div>
                      )}
                      {r.fechapublicacion && (
                        <div className="flex items-center gap-2">
                          <Calendar style={{ color: colors.azul }} size={15} />
                          <span>
                            {new Date(r.fechapublicacion).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      {r.verificado && (
                        <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          <CheckCircle size={14} />
                          Verificado
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                      <span style={{ color: colors.subtleText }}>{r.tiporecurso || "Sin tipo"}</span>
                      <span style={{ color: colors.subtleText }}>ID: {r.idrecurso}</span>
                    </div>

                    <div className="mt-4 flex gap-2 justify-end">
                      {(rol === "admin" || idusuario === r.idusuario_creador) && (
                        <>
                          <button
                            onClick={() => handleEdit(r.idrecurso)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(r.idrecurso)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// src/pages/Profile.tsx
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import UserMenu from "../components/UserMenu";
import ResourceCard from "../components/ResourceCard";
import { getFavoritos } from "../services/recursoService";
import { useAuth } from "../hooks/useAuth";
import axios from "../services/api";
import { Edit3, UserCircle2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function Profile() {
  const { user, token } = useAuth();
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); 

  const [form, setForm] = useState({
    nombreusuario: "",
    telefono: "",
    email: "",
    codigoestudiantil: "",
    rol: "normal",
  });

  const { theme } = useTheme();

  const colors = {
    titulo:
      theme === "dark" ? "#d6a43a" : theme === "blue" ? "#ffd166" : "#0a3d91",
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
          ? "rgba(210,180,80,0.12)"
          : "rgba(0,0,0,0.06)",
    cardBg:
      theme === "dark"
        ? "var(--card-bg)"
        : "var(--card-bg)",
    inputFocus:
      theme === "dark" ? "#d6a43a" : theme === "blue" ? "#ffd166" : "#0a3d91",
  };

  // ---------------------------
  // Obtener datos reales desde backend (/usuarios/me)
  // ---------------------------
  useEffect(() => {
    const fetchUsuarioMe = async (tk: string) => {
      try {
        const resp = await axios.get("/usuarios/me", {
          headers: { Authorization: `Bearer ${tk}` },
        });
        const data = resp.data;
        setForm({
          nombreusuario: data?.nombreusuario ?? "",
          telefono: data?.telefono ?? "",
          email: data?.email ?? "",
          codigoestudiantil: data?.codigoestudiantil ?? "",
          rol: data?.rol ?? "normal",
        });
      } catch (err: any) {
        console.error("[ERROR] No se pudo obtener /usuarios/me", err);
      }
    };

    const tk =
      token ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");
    if (tk) fetchUsuarioMe(tk);
  }, [token, user]);

  // ---------------------------
  // Cargar favoritos
  // ---------------------------
  useEffect(() => {
    const tk =
      token ||
      localStorage.getItem("access_token") ||
      localStorage.getItem("token");
    if (!tk) {
      setLoading(false);
      setFavoritos([]);
      return;
    }

    const fetchFavoritos = async () => {
      try {
        const data = await getFavoritos(tk);
        setFavoritos(data || []);
      } catch (err) {
        console.error("[ERROR] favoritos:", err);
        setFavoritos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, [token]);

  // ---------------------------
  // Manejar cambios en formulario
  // ---------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ---------------------------
  // Guardar perfil (igual que antes)
  // ---------------------------
  const handleGuardar = async () => {
    try {
      const tk =
        token ||
        localStorage.getItem("access_token") ||
        localStorage.getItem("token");
      if (!tk) {
        alert(" No hay token válido. Inicia sesión nuevamente.");
        return;
      }

      const payload: Record<string, any> = {};
      if (form.nombreusuario) payload.nombreusuario = form.nombreusuario;
      if (form.telefono !== undefined) payload.telefono = form.telefono;
      if (form.codigoestudiantil !== undefined)
        payload.codigoestudiantil = form.codigoestudiantil;

      await axios.put("/usuarios/me", payload, {
        headers: { Authorization: `Bearer ${tk}` },
      });

      alert(" Datos actualizados correctamente");
      setEditando(false);
    } catch (err: any) {
      console.error("[ERROR] PUT /usuarios/me failed:", err);
      alert(" No se pudieron actualizar los datos");
    }
  };

  // ---------------------------
  //  Colores dinámicos según rol
  // ---------------------------
  const getColorByRol = (rol: string) => {
    switch (rol?.toLowerCase()) {
      case "docente":
        return {
          color: "text-purple-700",
          bg: "bg-purple-100",
          accent: "#7e22ce",
        };
      case "admin":
        return {
          color: "text-orange-700",
          bg: "bg-orange-100",
          accent: "#ea580c",
        };
      default:
        return { color: "text-blue-700", bg: "bg-blue-100", accent: "#1e40af" };
    }
  };

  const rolColor = getColorByRol(form.rol);


  const [showTop, setShowTop] = useState(true);

  // Ocultar el top cuando el usuario hace scroll hacia abajo
  useEffect(() => {
    const scrollContainer =
      document.querySelector(".scroll-area") || window; // si no hay scroll interno, escucha al window

    let lastScrollTop = 0;

    const onScroll = () => {
      const currentScroll =
        scrollContainer === window
          ? window.scrollY
          : (scrollContainer as HTMLElement).scrollTop;

      const goingDown = currentScroll > lastScrollTop + 5; // margen para evitar falsos positivos

      // Si baja, oculta; si sube o está arriba, muestra
      setShowTop(!goingDown || currentScroll < 80);

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    };

    scrollContainer.addEventListener("scroll", onScroll, { passive: true });
    return () =>
      scrollContainer.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen flex overflow-hidden transition-colors duration-500"
      style={{
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
      }}>
      {/* Sidebar con sincronización */}
      <Sidebar onCollapse={setIsCollapsed} />

      {/* UserMenu fijo arriba a la derecha */}
      <div
        className={`fixed top-6 right-8 z-9999 transition-all duration-500 ease-in-out transform ${showTop
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-6 pointer-events-none"
          }`}
      >
        <UserMenu />
      </div>

      {/* Contenedor principal */}
      <main
        className={`flex-1 flex flex-col items-center justify-start relative transition-all duration-500 ease-in-out ${isCollapsed ? "md:pl-20" : "md:pl-64"
          }`}
      >
        {/* Contenedor scrollable y con zoom controlado */}
        <div className="overflow-y-auto h-[calc(100vh-40px)] w-full flex justify-center scroll-area">
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
    max-w-[90vw]
    sm:max-w-[420px]
    md:max-w-[550px]
    lg:max-w-[650px]
    xl:max-w-[850px]
    2xl:max-w-[950px]
    ${isCollapsed ? "scale-110 translate-x-0" : "scale-100 translate-x-2.5"}
  `}
  style={{ transformOrigin: "center top" }}
>
            <div className="shadow-lg rounded-2xl p-8 relative transition-all duration-500 hover:scale-[1.02]"
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.borde}`,
                color: colors.texto,
              }}>
              {/* Ícono de usuario */}
              <div className="flex items-center mb-6">
                <UserCircle2
                  size={90}
                  className={`mr-4 ${rolColor.color}`}
                  strokeWidth={1.5}
                />
                <div>
                  <h1 className="text-3xl font-bold" style={{ color: colors.titulo }}>
                    {form.nombreusuario || "Usuario"}
                  </h1>
                  <p className="text-sm" style={{ color: colors.texto }}>Correo: {form.email}</p>
                  <p className="text-sm" style={{ color: colors.texto }}>
                    Teléfono: {form.telefono || "—"}
                  </p>
                  <p className="text-sm" style={{ color: colors.texto }}>
                    Código estudiantil: {form.codigoestudiantil || "—"}
                  </p>
                  <div
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${rolColor.bg} ${rolColor.color}`}
                  >
                    Rol:{" "}
                    {form.rol?.charAt(0).toUpperCase() + form.rol?.slice(1)}
                  </div>
                </div>

                {/* Botón de edición */}
                <button
                  onClick={() => setEditando(!editando)}
                  className="absolute top-6 right-6 text-[#0a3d91] hover:text-[#082e70] transition"
                >
                  <Edit3 size={22} />
                </button>
              </div>

              {/* Campos editables */}
              {editando && (
                <div className="mt-4 border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField
                      label="Nombre de Usuario"
                      name="nombreusuario"
                      value={form.nombreusuario}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Teléfono"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleChange}
                    />
                    <InputField
                      label="Código Estudiantil"
                      name="codigoestudiantil"
                      value={form.codigoestudiantil}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleGuardar}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      Guardar cambios
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* ---- Favoritos ---- */}
            <h2 className="text-2xl font-bold mt-10 mb-4" style={{ color: colors.titulo }}>
              Mis recursos favoritos
            </h2>

            {loading ? (
              <p className="text-gray-500 text-center animate-pulse">
                Cargando favoritos...
              </p>
            ) : favoritos.length > 0 ? (
              <div
                className={`space-y-6 transition-all duration-500 ease-in-out ${isCollapsed ? "scale-102 opacity-90" : "scale-100 opacity-100"
                  }`}
              >
                {favoritos.map((r) => (
                  <ResourceCard key={r.idrecurso} r={r} />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 italic text-center">
                Aún no tienes recursos favoritos. ¡Ve y marca alguno!
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function InputField({ label, name, value, onChange }: any) {
  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>
      <input
        type="text"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full border rounded-lg p-2 mt-1 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}

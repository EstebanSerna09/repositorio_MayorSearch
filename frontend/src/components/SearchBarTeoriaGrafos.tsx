// src/components/SearchBarTeoriaGrafos.tsx
import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import DatePicker from "react-datepicker";
import { useTheme } from "../context/ThemeContext";

type FiltersState = {
  tipo: string;
  nivel: string;
  fecha: string;
  idioma: string;
  etiquetas: string;
  fecha_inicio?: string;
  fecha_fin?: string;
};

type Props = {
  onSearch: (params: Partial<FiltersState & { q: string; etiquetas: string }>) => void;
  placeholder?: string;
};

export default function SearchBarTeoriaGrafos({
  onSearch,
  placeholder = "Busca un autor, tema o recurso dentro de Teoría de Grafos",
}: Props) {
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState<FiltersState>({
    tipo: "",
    nivel: "",
    fecha: "",
    idioma: "",
    etiquetas: "",
  });

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  // Maneja clics en filtros (tipo, nivel, idioma)
  const handleFilterClick = (key: keyof FiltersState, value: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [key]: prev[key] === value ? "" : value,
      };

      // etiquetas agrupa tipo + nivel (como en la SearchBar original)
      const etiquetas = [newFilters.tipo, newFilters.nivel].filter((v) => v).join(",");
      newFilters.etiquetas = etiquetas;

      return newFilters;
    });
  };

  // ---- NUEVO handleSubmit: ENVIAMOS etiquetas que incluyen "Teoria de grafos" ----
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const etiquetasActuales = filters.etiquetas ? String(filters.etiquetas).trim() : "";
    const etiquetasCombined = [etiquetasActuales, "Teoria de grafos"]
      .map((s) => s?.trim())
      .filter(Boolean)
      .join(",");

    // Traducción del idioma (igual que en el buscador central)
    let idiomaCode = "";
    if (filters.idioma === "Español") idiomaCode = "es";
    else if (filters.idioma === "Inglés") idiomaCode = "en";
    else if (filters.idioma === "Otro...") idiomaCode = "otro";

    const params: any = {
      q: q.trim() || "",
      etiquetas: etiquetasCombined,
      tipo: filters.tipo || undefined,
      nivel: filters.nivel || undefined,
      idioma: idiomaCode || undefined, // ahora sí correcto
    };

    if (fechaInicio && fechaFin) {
      params.fecha_inicio = fechaInicio.toISOString().split("T")[0];
      params.fecha_fin = fechaFin.toISOString().split("T")[0];
    }

    console.log(" Params enviados (Teoría de Grafos):", params);
    onSearch(params);
  };

  const { theme } = useTheme();

  const colors = {
    fondo:
      theme === "dark"
        ? "#0f172a"
        : theme === "blue"
          ? "#e9f1ff"
          : "#ffffff",

    borde:
      theme === "dark"
        ? "rgba(255,255,255,0.08)"
        : theme === "blue"
          ? "rgba(127,255,212,0.25)"
          : "rgba(0,0,0,0.06)",

    texto:
      theme === "dark"
        ? "#d1d5db"
        : theme === "blue"
          ? "#dbeafe"
          : "#0f5d38",// tono verde oscuro del tema

    icono:
      theme === "dark"
        ? "#3ca968"
        : theme === "blue"
          ? "#4a90e2"
          : "#0f5d38",

    inputFocus:
      theme === "dark"
        ? "#3ca968"
        : theme === "blue"
          ? "#4a90e2"
          : "#0f5d38",

    cardBg:
      theme === "dark"
        ? "#0f172a"
        : theme === "blue"
          ? "#e9f1ff"
          : "#ffffff",
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Barra principal */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-3/4 max-w-3xl rounded-2xl shadow-sm px-4 py-2 transition-all duration-300 backdrop-blur-sm"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
          border: "1px solid var(--text-color)",
        }}
      >

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="grow outline-none transition-colors"
          style={{
            backgroundColor: "transparent",
            color: colors.texto,
            caretColor: colors.inputFocus,
          }}
        />
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="ml-2 p-2 rounded-full hover:bg-gray-100"
          aria-label="Mostrar filtros"
        >
          <SlidersHorizontal className="text-gray-600" />
        </button>
        <button
          type="submit"
          className="ml-3 w-10 h-10 bg-[#0f5d38] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
          aria-label="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>

      {/* Filtros desplegables */}
      {showFilters && (
        <div className="mt-4 p-4 w-3/4 max-w-3xl rounded-xl shadow-md border transition-all duration-300"
          style={{
            backgroundColor: "var(--bg-color)",
            borderColor: "var(--text-color)",
            color: "var(--text-color)",
          }}>
          <h3 className="font-semibold mb-2" style={{ color: colors.icono }}>
            Filtros de búsqueda (Teoria de grafos)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm" style={{ color: colors.icono }}>
            {/* Tipo de recurso */}
            <div>
              <strong style={{ color: colors.texto }}>Tipo de recurso</strong>
              {["Libro", "Articulo", "Tesis", "Monografia", "Documento", "Apuntes"].map(
                (x) => (
                  <p
                    key={x}
                    onClick={() => handleFilterClick("tipo", x)}
                    className="cursor-pointer transition-colors"
                    style={{
                      color: filters.tipo === x ? colors.inputFocus : colors.texto,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = colors.inputFocus)}
                    onMouseLeave={(e) =>
                    (e.currentTarget.style.color =
                      filters.tipo === x ? colors.inputFocus : colors.texto)
                    }
                  >
                    {x}
                  </p>
                )
              )}
            </div>

            {/* Nivel académico */}
            <div>
              <strong style={{ color: colors.texto }}>Nivel académico</strong>
              {["Basico", "Intermedio", "Avanzado"].map((x) => (
                <p
                  key={x}
                  onClick={() => handleFilterClick("nivel", x)}
                  className="cursor-pointer transition-colors"
                  style={{
                    color: filters.nivel === x ? colors.inputFocus : colors.texto,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.inputFocus)}
                  onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    filters.nivel === x ? colors.inputFocus : colors.texto)
                  }
                >
                  {x}
                </p>
              ))}
            </div>

            {/* Idioma */}
            <div>
              <strong style={{ color: colors.texto }}>Idioma</strong>
              {["Inglés", "Español", "Otro..."].map((x) => (
                <p
                  key={x}
                  onClick={() => handleFilterClick("idioma", x)}
                  className="cursor-pointer transition-colors"
                  style={{
                    color: filters.idioma === x ? colors.inputFocus : colors.texto,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = colors.inputFocus)}
                  onMouseLeave={(e) =>
                  (e.currentTarget.style.color =
                    filters.idioma === x ? colors.inputFocus : colors.texto)
                  }
                >
                  {x}
                </p>
              ))}
            </div>

            {/* Fecha */}
            <div className="relative">
              <strong style={{ color: colors.texto }}>Fecha</strong>
              <p
                onClick={() => setMostrarCalendario(!mostrarCalendario)}
                className="cursor-pointer" style={{ color: colors.texto }}
              >
                Rango de fecha
              </p>

              {mostrarCalendario && (
                <div
                  className="absolute z-50 rounded-lg shadow-lg p-3 mt-2 transition-all duration-300"
                  style={{
                    backgroundColor: "var(--bg-color)",
                    color: "var(--text-color)",
                    border: "1px solid var(--text-color)",
                  }}
                >
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.texto }}>
                    Selecciona el rango
                  </p>
                  <div className="flex gap-2 items-center">
                    <DatePicker
                      selected={fechaInicio}
                      onChange={(date) => {
                        setFechaInicio(date);
                        if (fechaFin && date && date > fechaFin) setFechaFin(null);
                      }}
                      selectsStart
                      startDate={fechaInicio ?? undefined}
                      endDate={fechaFin ?? undefined}
                      placeholderText="Desde"
                      className="border border-gray-300 rounded-md p-1 text-sm"
                      dateFormat="yyyy-MM-dd"
                    />
                    <DatePicker
                      selected={fechaFin}
                      onChange={(date) => setFechaFin(date)}
                      selectsEnd
                      startDate={fechaInicio ?? undefined}
                      endDate={fechaFin ?? undefined}
                      minDate={fechaInicio ?? undefined}
                      placeholderText="Hasta"
                      className="border border-gray-300 rounded-md p-1 text-sm"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        if (fechaInicio && fechaFin) {
                          const filtrosAplicados = {
                            ...filters,
                            fecha: "rango",
                            fecha_inicio: fechaInicio.toISOString().split("T")[0],
                            fecha_fin: fechaFin.toISOString().split("T")[0],
                          };

                          setFilters(filtrosAplicados);

                          // Traducción del idioma (igual que en handleSubmit)
                          let idiomaCode = "";
                          if (filtrosAplicados.idioma === "Español") idiomaCode = "es";
                          else if (filtrosAplicados.idioma === "Inglés") idiomaCode = "en";
                          else if (filtrosAplicados.idioma === "Otro...") idiomaCode = "otro";

                          // Etiquetas combinadas (tipo, nivel y asignatura fija)
                          const etiquetasActuales = filtrosAplicados.etiquetas
                            ? String(filtrosAplicados.etiquetas).trim()
                            : "";
                          const etiquetasCombined = [etiquetasActuales, "Teoria de grafos"]
                            .map((s) => s?.trim())
                            .filter(Boolean)
                            .join(",");

                          const params: any = {
                            q: q.trim() || undefined,
                            etiquetas: etiquetasCombined,
                            tipo: filtrosAplicados.tipo || undefined,
                            nivel: filtrosAplicados.nivel || undefined,
                            idioma: idiomaCode || undefined, // ahora se traduce correctamente
                            fecha_inicio: filtrosAplicados.fecha_inicio,
                            fecha_fin: filtrosAplicados.fecha_fin,
                          };

                          console.log("📤 Aplicando filtro de fecha (Teoría de Grafos):", params);

                          onSearch(params);
                        }
                        setMostrarCalendario(false);
                      }}
                      className="bg-[#0f5d38] text-white text-sm px-3 py-1 rounded-md hover:opacity-90"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

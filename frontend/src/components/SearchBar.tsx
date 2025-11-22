// src/components/SearchBar.tsx
import React, { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import DatePicker from "react-datepicker";
import { useTheme } from "../context/ThemeContext";

type FiltersState = {
  asignatura: string;
  tipo: string;
  nivel: string;
  fecha: string;
  idioma: string;
  etiquetas: string; // campo para agrupar todas las etiquetas aplicables
};

type Props = {
  onSearch: (params: Partial<FiltersState & { q: string }>) => void;
  placeholder?: string;
};

export default function SearchBar({
  onSearch,
  placeholder = "Busca un autor, un tema, categoría o asignatura específica",
}: Props) {
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FiltersState>({
    asignatura: "",
    tipo: "",
    nivel: "",
    fecha: "",
    idioma: "",
    etiquetas: "",
  }
  );

  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  // Función que maneja clics en filtros
  const handleFilterClick = (key: keyof FiltersState, value: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [key]: prev[key] === value ? "" : value,
      };

      // Cada grupo se traduce a una etiqueta para el backend
      const etiquetas = [
        newFilters.asignatura,
        newFilters.tipo,
        newFilters.nivel,
      ]
        .filter((v) => v) // eliminamos vacíos
        .join(","); // se envían separadas por coma al backend

      newFilters.etiquetas = etiquetas;

      return newFilters;
    });
  };

  // Envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Creamos el objeto base
    const params: any = {
      q: q.trim(),
      ...filters,
    };

    // Si hay fechas seleccionadas, las añadimos al query
    if (fechaInicio && fechaFin) {
      params.fecha_inicio = fechaInicio.toISOString().split("T")[0];
      params.fecha_fin = fechaFin.toISOString().split("T")[0];
    }
    console.log(" Params enviados a buscarRecursos:", params);
    onSearch(params);
  };
  const { theme } = useTheme();

  const colors = {
    fondo:
      theme === "dark"
        ? "#0f172a" // fondo principal dark
        : theme === "blue"
          ? "#e9f1ff" // fondo azul pastel suave (coincide con Explorar blue)
          : "#ffffff",

    borde:
      theme === "dark"
        ? "rgba(255,255,255,0.08)"
        : theme === "blue"
          ? "rgba(10,61,145,0.15)"
          : "rgba(0,0,0,0.06)",

    texto:
      theme === "dark"
        ? "#e2e8f0"
        : theme === "blue"
          ? "#f8f5ee"
          : "#0a3d91",

    icono:
      theme === "dark"
        ? "#a7c7ff"
        : theme === "blue"
          ? "#4a90e2"
          : "#0a3d91",

    inputFocus:
      theme === "dark"
        ? "#a7c7ff"
        : theme === "blue"
          ? "#4a90e2"
          : "#0a3d91",

    // Aquí el ajuste crucial:
    cardBg:
      theme === "dark"
        ? "#0f172a" // mismo que fondo dark
        : theme === "blue"
          ? "#e9f1ff" // mismo que fondo blue
          : "#ffffff",
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Barra de búsqueda */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-3/4 max-w-3xl rounded-2xl shadow-sm px-4 py-2 transition-all duration-300 backdrop-blur-sm"
        style={{
          backgroundColor: "var(--bg-color)",
          color: "var(--text-color)",
          border: "1px solid var(--text-color)",
        }}
      >
        <Search className="text-gray-500 mr-2 w-5 h-5" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="grow outline-none transition-colors"
          style={{
            backgroundColor: "transparent",
            color: colors.texto, // 👈 usa tu color dinámico
            caretColor: colors.inputFocus, // cursor del mismo tono del tema
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
          className="ml-3 w-10 h-10 bg-[#0C4A7B] text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
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
          <h3 className="font-semibold mb-2" style={{ color: colors.texto }}>Filtros de búsqueda</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm" style={{ color: colors.texto }}>
            <div>
              <strong style={{ color: colors.texto }}>Asignatura</strong>
              {["Teoria de grafos", "Analisis numerico"].map((x) => (
                <p
                  key={x}
                  onClick={() => handleFilterClick("asignatura", x)}
                  className={`cursor-pointer hover:text-blue-700 ${filters.asignatura === x ? "text-blue-700 font-semibold" : ""
                    }`}
                >
                  {x}
                </p>
              ))}
            </div>

            <div>
              <strong>Tipo de recurso</strong>
              {["Libro", "Articulo", "Tesis", "Monografia", "Documento", "Apuntes"].map(
                (x) => (
                  <p
                    key={x}
                    onClick={() => handleFilterClick("tipo", x)}
                    className={`cursor-pointer hover:text-blue-700 ${filters.tipo === x ? "text-blue-700 font-semibold" : ""
                      }`}
                  >
                    {x}
                  </p>
                )
              )}
            </div>

            <div>
              <strong>Nivel académico</strong>
              {["Basico", "Intermedio", "Avanzado"].map((x) => (
                <p
                  key={x}
                  onClick={() => handleFilterClick("nivel", x)}
                  className={`cursor-pointer hover:text-blue-700 ${filters.nivel === x ? "text-blue-700 font-semibold" : ""
                    }`}
                >
                  {x}
                </p>
              ))}
            </div>

            <div className="relative">
              <strong>Fecha</strong>
              <p
                onClick={() => setMostrarCalendario(!mostrarCalendario)}
                className="cursor-pointer hover:text-blue-700"
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
                  <p className="text-sm font-semibold mb-2" style={{ color: colors.texto }}>Selecciona el rango</p>
                  <div className="flex gap-2 items-center">
                    <DatePicker
                      selected={fechaInicio}
                      onChange={(date) => {
                        setFechaInicio(date);
                        if (fechaFin && date && date > fechaFin) setFechaFin(null); // evitar rango inválido
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
                      minDate={fechaInicio ?? undefined} // <-- aquí resolvimos el tipo Date | undefined
                      placeholderText="Hasta"
                      className="border border-gray-300 rounded-md p-1 text-sm"
                      dateFormat="yyyy-MM-dd"
                    />
                  </div>

                  <div className="flex justify-end mt-3">
                    <button
                      onClick={() => {
                        if (fechaInicio && fechaFin) {
                          // Actualizamos los filtros con las fechas
                          const filtrosAplicados = {
                            ...filters,
                            fecha: "rango",
                            fecha_inicio: fechaInicio.toISOString().split("T")[0],
                            fecha_fin: fechaFin.toISOString().split("T")[0],
                          };

                          // Guardamos las fechas en el estado principal de filtros
                          setFilters(filtrosAplicados);

                          // Construimos los params a enviar
                          const params: any = {
                            q: q.trim(),
                            ...filtrosAplicados,
                          };

                          console.log(" Aplicando filtro de fecha y enviando params:", params); // 

                          onSearch(params);
                        }
                        setMostrarCalendario(false);
                      }}
                      className="bg-blue-700 text-white text-sm px-3 py-1 rounded-md hover:opacity-90"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>


            <div>
              <strong>Idioma</strong>
              {["Inglés", "Español", "Otro..."].map((x) => (
                <p
                  key={x}
                  onClick={() => handleFilterClick("idioma", x)}
                  className={`cursor-pointer hover:text-blue-700 ${filters.idioma === x ? "text-blue-700 font-semibold" : ""
                    }`}
                >
                  {x}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

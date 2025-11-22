// src/components/AuthorCard.tsx
import { Link } from "react-router-dom";
import { BookOpen, ExternalLink } from "lucide-react"; // Eliminado UserCircle2 (ya no se usa)
import { useEffect, useState } from "react";
import autorService from "../services/autorService";
import type { Autor, RecursoAutor } from "../services/autorService";
import { useTheme } from "../context/ThemeContext"; 
type Props = {
  autor: Autor;
};

export default function AuthorCard({ autor }: Props) {
  const [recursos, setRecursos] = useState<RecursoAutor[]>([]);
  const { theme } = useTheme();

  const colors = {
    titulo:
      theme === "dark" ? "#d6a43a" : theme === "blue" ? "#ffd166" : "#8a6b12",
    texto:
      theme === "dark"
        ? "#e6e9ee"
        : theme === "blue"
        ? "#f8f5ee"
        : "#3b3b3b",
    borde:
      theme === "dark"
        ? "rgba(255,255,255,0.06)"
        : theme === "blue"
        ? "rgba(210,180,80,0.12)"
        : "rgba(0,0,0,0.06)",
    cardBg:
      theme === "dark" ? "var(--card-bg)" : "var(--card-bg)", // ThemeWrapper controla var(--card-bg)
    linkHoverText:
      theme === "dark" ? "#0b1726" : theme === "blue" ? "#0b1726" : "#ffffff",
    icon:
      theme === "dark" ? "#d6a43a" : theme === "blue" ? "#ffd166" : "#8a6b12",
  };

  // Cargar los recursos asociados al autor
  useEffect(() => {
    const fetchRecursos = async () => {
      try {
        const data = await autorService.getRecursosByAutor(autor.idautor);
        setRecursos(data || []);
      } catch (err) {
        console.error("Error al cargar recursos del autor:", err);
      }
    };
    fetchRecursos();
  }, [autor.idautor]);

  return (
    <div
      key={autor.idautor}
      className="relative border  rounded-xl hover:shadow-lg transition-all p-5" // color principal dorado
      style={{
        backgroundColor: colors.cardBg,
        color: "var(--text-color)",
        border: `1px solid ${colors.borde}`,
      }}
    >
      {/* Cabecera del autor (foto eliminada) */}
      <div className="mb-3">
        <h3 className="font-bold text-xl truncate" style={{ color: colors.titulo }}>{autor.nombreautor}</h3>
        {autor.orcid && (
          <p className="text-sm flex items-center gap-1 mt-1 truncate max-w-full overflow-hidden" style={{ color: colors.texto }}>
            <ExternalLink size={14} />
            ORCID:&nbsp;
            <a
              href={`https://orcid.org/${autor.orcid}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline break-all"
              style={{
                color: colors.titulo,
                wordBreak: "break-word",
              }}
            >
              {autor.orcid}
            </a>
          </p>
        )}
      </div>

      {/* Cantidad de recursos */}
      <div className="flex items-center gap-2 text-sm mb-4" style={{ color: colors.texto }}>
        <BookOpen size={16} />
        {recursos.length > 0 ? (
          <span>
            {recursos.length} recurso{recursos.length > 1 ? "s" : ""} asociado
          </span>
        ) : (
          <span>Sin recursos registrados</span>
        )}
      </div>

      {/* Botón de perfil */}
      <div className="flex justify-end">
        <Link
          to={`/autores/${autor.idautor}`}
          className="inline-flex items-center gap-1 border text-xs px-3 py-1.5 rounded-md transition shadow-sm"
          style={{
            border: `1px solid ${colors.titulo}`,
            color: colors.titulo,
            backgroundColor: "transparent",
          }}
        >
          <ExternalLink size={14} /> Ver perfil
        </Link>
      </div>
    </div>
  );
}

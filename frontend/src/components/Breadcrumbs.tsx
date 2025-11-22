// src/components/Breadcrumbs.tsx
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  
  // Dividimos la ruta actual en segmentos (ignorando los vacíos)
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="text-sm text-gray-600 my-3">
      <ul className="flex flex-wrap items-center gap-1">
        {/* Primer elemento: Inicio */}
        <li>
          <Link to="/" className="text-blue-600 hover:underline">
            Inicio
          </Link>
        </li>

        {pathnames.map((segment, index) => {
          const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
          const isLast = index === pathnames.length - 1;

          // Convertir el slug a un texto más bonito (opcional)
          const label =
            segment.charAt(0).toUpperCase() +
            segment.slice(1).replace(/-/g, " ");

          return (
            <li key={routeTo} className="flex items-center">
              <span className="mx-1 text-gray-400">/</span>
              {isLast ? (
                <span className="font-normal">{label}</span>
              ) : (
                <Link to={routeTo} className="text-blue-600 hover:underline">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;

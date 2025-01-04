import { Link } from "react-router-dom";

/**
 * Componente Botón
 * @param type Tipo de botón
 * @param text Texto a mostrar en el botón
 * @param className Clase CSS a aplicar al botón
 * @param to Ruta a la que redirigir al hacer click
 * @returns Componente de React que renderiza un botón
 */
const Button = ({ type, text, className, to }) => {
  return (
    <Link to={to} className={`btn btn-${type ?? "primary"} ${className ?? ""}`}>
      {text}
    </Link>
  );
};

export default Button;
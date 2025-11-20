//Componente reutilizable
// Crear botón con variantes
export const Button = ({ children, onClick, variant = "primary" }) => {
 const responsiveSizes = `
    text-xs px-4 py-2
    sm:text-sm sm:px-5 sm:py-2.5
    md:text-base md:px-6 md:py-3
    lg:text-lg lg:px-7 lg:py-3.5
  `;
  const base =
    "px-4 py-2 rounded-xl font-semibold transition cursor-pointer " +
    "text-sm sm:text-base md:text-lg lg:text-xl";

  // Ahora sí 3 variantes, respetando tu estructura original
  let styles = "";

  if (variant === "primary") {
    styles = `
      bg-gray-700 text-white
      hover:bg-amber-600
      active:bg-amber-800
    `;
  } else if (variant === "secondary") {
    styles = `
      bg-gray-100 text-black
      hover:bg-amber-600
      active:bg-amber-800
    `;
  } else if (variant === "tertiary") {
    styles = `
      bg-transparent text-white
      hover:bg-amber-600
      hover:text-white
      active:bg-amber-800
    `;
  }

  return (
    <button onClick={onClick} className={`${responsiveSizes} ${base} ${styles}`}>
      {children}
    </button>
  );
};

export default Button;

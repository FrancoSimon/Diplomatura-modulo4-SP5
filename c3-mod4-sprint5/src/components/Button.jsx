// Componente Button mejorado
export const Button = ({ 
  children, 
  onClick, 
  variant = "primary",
  disabled = false,
  type = "button"
}) => {
  // Clases base comunes para todos los botones
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-xl font-semibold transition-all duration-200
    cursor-pointer select-none
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500
    disabled:opacity-50 disabled:cursor-not-allowed
    min-h-[44px] /* Altura mínima consistente para accesibilidad */
  `;

  // Clases responsivas para tamaño y espaciado
  const responsiveClasses = `
    text-sm px-4 py-2
    sm:text-base sm:px-5 sm:py-2.5
    md:text-lg md:px-6
    lg:px-7
  `;

  // Variantes de estilo
  const variantClasses = {
    primary: `
      bg-gray-700 text-white
      hover:bg-amber-600 hover:shadow-lg
      active:bg-amber-700 active:shadow-md
      focus:ring-amber-500
    `,
    secondary: `
      bg-gray-100 text-gray-900 border border-gray-300
      hover:bg-amber-600 hover:text-white hover:border-amber-600
      active:bg-amber-700 active:border-amber-700
      focus:ring-amber-500
    `,
    tertiary: `
      bg-transparent text-white border border-white
      hover:bg-amber-600 hover:text-white hover:border-amber-600
      active:bg-amber-700 active:border-amber-700
      focus:ring-amber-500
    `
  };

  // Clases para estado disabled
  const disabledClasses = disabled ? `
    opacity-60 cursor-not-allowed
    hover:transform-none hover:shadow-none
  ` : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${responsiveClasses}
        ${variantClasses[variant]}
        ${disabledClasses}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
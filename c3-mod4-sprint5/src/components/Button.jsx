// Componente Button mejorado y responsive
export const Button = ({ 
  children, 
  onClick, 
  variant = "primary",
  disabled = false,
  type = "button",
  className = "",
  size = "medium" // Nueva prop para controlar el tamaño
}) => {
  // Clases base comunes para todos los botones
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-xl font-semibold transition-all duration-200
    cursor-pointer select-none
    whitespace-nowrap
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
  `;

  // Tamaños del botón
  const sizeClasses = {
    small: `
      text-xs px-3 py-1 min-h-8
    `,
    medium: `
      text-sm px-4 py-2 min-h-10
      sm:text-base sm:px-5 sm:py-2.5
    `,
    large: `
      text-base px-6 py-3 min-h-12
      sm:text-lg sm:px-7 sm:py-3.5
    `,
    auto: `
      text-sm px-3 py-1 min-h-8
      flex-1 min-w-0
    `
  };

  // Variantes de estilo
  const variantClasses = {
    primary: `
      bg-gray-700 text-white
      hover:bg-amber-600 hover:shadow-lg
      active:bg-amber-700 active:shadow-md
      ${!disabled && 'hover:transform hover:scale-105'}
    `,
    secondary: `
      bg-gray-100 text-gray-900 border border-gray-300
      hover:bg-amber-600 hover:text-white hover:border-amber-600
      active:bg-amber-700 active:border-amber-700
    `,
    tertiary: `
      bg-transparent text-white border border-white
      hover:bg-amber-600 hover:text-white hover:border-amber-600
      active:bg-amber-700 active:border-amber-700
    `,
    icon: `
      bg-transparent text-white border-none
      hover:bg-amber-600 hover:text-white
      active:bg-amber-700
      p-2 min-h-0
    `
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
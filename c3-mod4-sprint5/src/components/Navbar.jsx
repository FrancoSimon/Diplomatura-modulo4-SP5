import { useState, useEffect } from "react";
import { useWeather } from "../context/WeatherContext";
import FavoritosModal from "./FavoritosModal";
import { useWatchlist } from "../context/WatchlistContext";

// Importar imágenes
import logo from "../assets/logo.png";
import fiambalaLogo from "../assets/fiambala.png";

const Navbar = () => {
  // Estados del componente
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);

  // Contextos para datos externos
  const { weatherData, loading, getWeather } = useWeather();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  // Efecto para obtener y actualizar datos del clima
  useEffect(() => {
    // Cargar datos iniciales al montar el componente
    getWeather("Fiambalá");
    

    // Configurar actualización automática cada 10 minutos
    const interval = setInterval(() => {
      getWeather("Fiambalá");
    }, 600000); // 600000 ms = 10 minutos

    // Limpieza: eliminar intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  // Función para alternar menú móvil
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Procesamiento de datos del clima para mostrar en navbar
  let weatherInfo = null;
  if (weatherData && !loading) {
    const { main, weather, dt } = weatherData;
    const iconCode = weather[0]?.icon;
    const URL = import.meta.env.VITE_ICONWEATHER;
    const iconUrl = `${URL}${iconCode}@2x.png`;

    // Formatear fecha y hora para Fiambalá
    const localDate = new Date(dt * 1000);
    const horaFiambala = localDate.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Argentina/Catamarca",
    });

    const fechaFiambala = localDate.toLocaleDateString("es-AR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      timeZone: "America/Argentina/Catamarca",
    });

    // Componente de información meteorológica
    weatherInfo = (
      <div className="flex flex-col space-y-0">
        <div className="flex items-center gap-2 text-white text-sm">
          <img src={iconUrl} alt="Icono del clima" className="w-8 h-8" />
          <span>{main.temp.toFixed(1)}°C</span>
          <span className="hidden sm:inline text-gray-300 text-xs">
            {horaFiambala}
          </span>
        </div>
        <div className="mt-0 p-0">
          <span className="hidden sm:inline text-gray-300 text-xs">
            {fechaFiambala}
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-black/80 z-50 transition-all duration-300">
        <div className="flex justify-between items-center sm:px-12 sm:py-6 px-4">
          {/* ===== LOGO Y CLIMA ===== */}
          <div className="flex items-center space-x-2">
            {/* Logo principal que redirige al inicio */}
            <a className="flex items-center cursor-pointer" href="/">
              <img
                src={logo} // Usar imagen importada
                alt="Logo de Fiambalá"
                className="w-[60px] hover:opacity-80 transition-opacity"
              />
              <img
                src={fiambalaLogo} // Usar imagen importada
                alt="Texto Fiambalá"
                className="w-[60px] hover:opacity-80 transition-opacity"
              />
            </a>

            {/* Información del clima que redirige a sección clima */}
            <a href="#clima" className="flex items-center cursor-pointer">
              {weatherInfo}
            </a>
          </div>

          {/* ===== BOTÓN HAMBURGUESA (MÓVIL) ===== */}
          <button
            className="md:hidden text-white p-2"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {/* Icono cambia entre hamburguesa y X */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12" // Icono X
                    : "M4 6h16M4 12h16M4 18h16" // Icono hamburguesa
                }
              />
            </svg>
          </button>

          {/* ===== MENÚ PRINCIPAL (ESCRITORIO) ===== */}
          <div className="hidden md:block">
            <ul className="flex sm:space-x-8 space-x-4 px-4">
              {/* Enlace Inicio */}
              <li>
                <a
                  href="/"
                  className="sm:text-lg text-sm text-white hover:text-orange-400 transition-transform duration-300 transform hover:scale-110 inline-block"
                >
                  Inicio
                </a>
              </li>

              {/* Enlace Destinos */}
              <li>
                <a
                  href="#servicios"
                  className="sm:text-lg text-sm text-white hover:text-orange-400 transition-transform duration-300 transform hover:scale-110 inline-block"
                >
                  Destinos
                </a>
              </li>

              {/* Enlace Clima */}
              <li>
                <a
                  href="#clima"
                  className="sm:text-lg text-sm text-white hover:text-orange-400 transition-transform duration-300 transform hover:scale-110 inline-block"
                >
                  Clima
                </a>
              </li>

              {/* Enlace Contacto */}
              <li>
                <a
                  href="/"
                  className="sm:text-lg text-sm text-white hover:text-orange-400 transition-transform duration-300 transform hover:scale-110 inline-block"
                >
                  Contacto
                </a>
              </li>

              {/* Botón Favoritos con contador */}
              <li>
                <button
                  className="text-orange-400 hover:text-red-500 block mx-auto relative group cursor-pointer"
                  onClick={() => setFavOpen(true)}
                  aria-label="Abrir favoritos"
                >
                  <i className="bi bi-heart-fill"></i>

                  {/* Tooltip que muestra cantidad de favoritos */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap z-10 pointer-events-none">
                    <span className="font-medium">Favoritos</span> (
                    {watchlist.length}){/* Flecha del tooltip */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-white"></div>
                  </div>
                </button>
              </li>
            </ul>
          </div>

          {/* ===== REDES SOCIALES (ESCRITORIO) ===== */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-sky-100 transition-all duration-300 hover:scale-125"
              aria-label="Instagram"
            >
              <i className="bi bi-instagram"></i>
            </a>
            <a
              href="https://www.github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-sky-100 transition-all duration-300 hover:scale-125"
              aria-label="GitHub"
            >
              <i className="bi bi-github"></i>
            </a>
            <a
              href="/"
              className="text-white hover:text-sky-100 transition-all duration-300 hover:scale-125"
              aria-label="Iniciar sesión"
            >
              <i className="bi bi-box-arrow-in-right"></i>
            </a>
          </div>
        </div>

        {/* ===== MENÚ MÓVIL ===== */}
        <div
          className={`md:hidden absolute w-full bg-black/80 transition-all duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <ul className="flex flex-col px-4 py-2">
            {/* Los mismos enlaces que en versión desktop pero en columna */}
            <li className="py-2 text-center">
              <a
                href="/"
                className="text-white hover:text-sky-100 block"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </a>
            </li>

            <li className="py-2 text-center">
              <a
                href="#servicios"
                className="text-white hover:text-sky-100 block"
                onClick={() => setIsMenuOpen(false)}
              >
                Destinos
              </a>
            </li>

            <li className="py-2 text-center">
              <a
                href="#clima"
                className="text-white hover:text-sky-100 block"
                onClick={() => setIsMenuOpen(false)}
              >
                Clima
              </a>
            </li>

            <li className="py-2 text-center">
              <a
                href="/"
                className="text-white hover:text-sky-100 block"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
              </a>
            </li>

            {/* Botón Favoritos en móvil */}
            <li className="py-2 text-center">
              <button
                className="text-orange-400 hover:text-red-500 block mx-auto relative group cursor-pointer"
                onClick={() => {
                  setFavOpen(true);
                  setIsMenuOpen(false);
                }}
              >
                <i className="bi bi-heart-fill"></i>
                Favoritos ({watchlist.length})
              </button>
            </li>
          </ul>

          {/* Redes sociales en versión móvil */}
          <div className="flex space-x-4 px-4 py-2 border-t bg-black justify-center">
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-sky-100"
            >
              <i className="bi bi-instagram"></i>
            </a>
            <a
              href="https://www.github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-sky-100"
            >
              <i className="bi bi-github"></i>
            </a>
            <a href="/" className="text-white hover:text-sky-100">
              <i className="bi bi-box-arrow-in-right"></i>
            </a>
          </div>
        </div>
      </nav>

      {/* ===== MODAL DE FAVORITOS ===== */}
      <FavoritosModal
        isOpen={favOpen}
        onClose={() => setFavOpen(false)}
        watchlist={watchlist}
        removeFromWatchlist={removeFromWatchlist}
      />
    </>
  );
};

export default Navbar;

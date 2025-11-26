import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useWeather } from "../context/WeatherContext";
import FavoritosModal from "./FavoritosModal";
import { useWatchlist } from "../context/WatchlistContext";

// Importar imágenes
import logo from "../assets/logo.png";
import fiambalaLogo from "../assets/fiambala.png";

const Navbar = () => {
  //esatdo del componente
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [favOpen, setFavOpen] = useState(false);

  // Contextos para datos externos
  const { weatherData, loading, getWeather } = useWeather();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  //obtener y actualizar datos del clima
  useEffect(() => {
    // Cargar datos iniciales al montar el componente
    getWeather("Fiambalá");

    // Configurar actualización automática cada 10 minutos
    const interval = setInterval(() => {
      getWeather("Fiambalá");
    }, 600000);

    // Limpieza: eliminar intervalo al desmontar el componente
    return () => clearInterval(interval);
  }, []);

  // Función para alternar menú móvil
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // INFO CLIMA
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
          {/* Logo y Clima */}
          <div className="flex items-center space-x-2">
            {/* Logo principal que redirige al inicio */}
            <Link to="/" className="flex items-center cursor-pointer">
              <img
                src={logo}
                alt="Logo"
                className="w-[60px] hover:opacity-80"
              />
              <img
                src={fiambalaLogo}
                alt="fiambala"
                className="w-[60px] hover:opacity-80"
              />
            </Link>

            <Link to="/clima" className="flex items-center cursor-pointer">
              {weatherInfo}
            </Link>
          </div>

          {/* BOTON MOVIL */}
          <button
            className="md:hidden text-white p-2"
            onClick={toggleMenu}
            aria-label="menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12"
                    : "M4 6h16M4 12h16M4 18h16"
                }
              />
            </svg>
          </button>

          {/* MENU PRINCIPAL (DESKTOP)  */}
          <div className="hidden md:block">
            <ul className="flex sm:space-x-8 space-x-4 px-4">
              {/* Enlace Inicio */}
              <li>
                <NavLink
                  to="/"
                  className="sm:text-lg text-sm text-white hover:text-orange-400"
                >
                  Inicio
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/destinos"
                  className="sm:text-lg text-sm text-white hover:text-orange-400"
                >
                  Destinos
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/clima"
                  className="sm:text-lg text-sm text-white hover:text-orange-400"
                >
                  Clima
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/contacto"
                  className="sm:text-lg text-sm text-white hover:text-orange-400"
                >
                  Contacto
                </NavLink>
              </li>

              {/* FAVORITOS */}
              <li>
                <button
                  className="text-orange-400 hover:text-red-500 relative group cursor-pointer"
                  onClick={() => setFavOpen(true)}
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

        {/* MENU MOVIL */}
        <div
          className={`md:hidden absolute w-full bg-black/80 transition-all duration-300 ${
            isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <ul className="flex flex-col px-4 py-2">
            <li className="py-2 text-center">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white"
              >
                Inicio
              </Link>
            </li>

            <li className="py-2 text-center">
              <Link
                to="/destinos"
                onClick={() => setIsMenuOpen(false)}
                className="text-white"
              >
                Destinos
              </Link>
            </li>

            <li className="py-2 text-center">
              <Link
                to="/clima"
                onClick={() => setIsMenuOpen(false)}
                className="text-white"
              >
                Clima
              </Link>
            </li>

            <li className="py-2 text-center">
              <Link
                to="/contacto"
                onClick={() => setIsMenuOpen(false)}
                className="text-white"
              >
                Contacto
              </Link>
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
                Favoritos<br/> ({watchlist.length})
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* MODAL */}
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

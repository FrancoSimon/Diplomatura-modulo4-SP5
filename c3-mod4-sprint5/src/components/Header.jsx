import { useState, useEffect } from "react";
import { Motionhearder } from "./Motionhearder";

// Importar todas las imágenes
import fondo from "../assets/Fondo-1200x600.jpg";
import angostura from "../assets/angostura.jpeg";
import cerrocolores from "../assets/cerrocolores.jpeg";
import laguna6000 from "../assets/laguna6000.jpg";
import medanosalposo from "../assets/medanosalposo.jpg";
import nochetermas from "../assets/nochetermas.JPG";

export const Header = () => {
  const images = [
    fondo,
    angostura,
    cerrocolores,
    laguna6000,
    medanosalposo,
    nochetermas,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Iniciar transición con zoom
      setIsTransitioning(true);
      
      // Cambiar imagen después de la transición de zoom
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 800); // Tiempo del efecto zoom
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <header className="min-h-screen w-full text-black flex items-center justify-center relative overflow-hidden">
      {/* Fondo con transición y zoom */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
            index === currentIndex 
              ? isTransitioning 
                ? "opacity-100 scale-110" // Zoom al 110%
                : "opacity-100 scale-100" // Tamaño normal
              : "opacity-0 scale-100"
          }`}
          style={{ 
            backgroundImage: `url(${img})`,
            // Asegurar que cubra todo el contenedor responsive
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
      ))}

      {/* Overlay para mejor legibilidad del texto */}
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      {/* Contenido animado */}
      <div className="relative z-10">
        <Motionhearder>
          <h1 className="font-VollkornSC text-4xl md:text-6xl lg:text-7xl font-bold flex flex-col text-white text-center drop-shadow-lg px-4">
            Fiambalá
            <span className="text-xl md:text-2xl lg:text-3xl italic text-gray-200 mt-2">
              Tierra de Encantos
            </span>
          </h1>
          <p className="font-OpenSans mt-4 md:mt-6 text-gray-200 text-base md:text-xl lg:text-2xl text-center drop-shadow-md px-4 max-w-2xl mx-auto">
            Descubrí Fiambalá, donde cada rincón guarda una historia por contar.
          </p>
        </Motionhearder>
      </div>

      {/* Indicadores de slides */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            onClick={() => {
              setCurrentIndex(index);
              setIsTransitioning(false);
            }}
            aria-label={`Ir a imagen ${index + 1}`}
          />
        ))}
      </div>
    </header>
  );
};


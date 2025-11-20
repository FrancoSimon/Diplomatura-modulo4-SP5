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
  // Usar las imágenes importadas
  const images = [
    fondo,
    angostura,
    cerrocolores,
    laguna6000,
    medanosalposo,
    nochetermas,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // cambia cada 5 segundos
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <header className="min-h-screen w-full text-black flex items-center justify-center relative overflow-hidden">
      {/* Fondo con transición */}
      {images.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url(${img})` }}
        />
      ))}

      {/* Contenido animado */}
      <Motionhearder>
        <h1 className="font-VollkornSC text-4xl md:text-6xl font-bold flex flex-col text-white text-center drop-shadow-lg">
          Fiambalá
          <span className="text-2xl italic text-gray-200">
            Tierra de Encantos
          </span>
        </h1>
        <p className="font-OpenSans mt-4 text-gray-200 text-lg md:text-2xl text-center drop-shadow-md">
          Descubrí Fiambalá, donde cada rincón guarda una historia por contar.
        </p>
      </Motionhearder>
    </header>
  );
};

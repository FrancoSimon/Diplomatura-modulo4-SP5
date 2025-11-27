import React, { useState } from "react";
import { useWeather } from "../context/WeatherContext";
import Button from "./Button";
import { toast } from "react-toastify";

const SearchForm = () => {
  const [city, setCity] = useState(""); // manejar la consulta
  const [isSearching, setIsSearching] = useState(false); // estado de carga
  const { getWeather } = useWeather(); // obtiene la función del contexto

  const handleSubmit = async (e) => {
    e.preventDefault(); // evita recargar la página
    
    if (city.trim() === "") {
      toast.warn("Ingrese una ciudad");
      return;
    } // evita búsquedas vacías
    
    setIsSearching(true);
    
    try {
      await getWeather(city); // llama a la API
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setIsSearching(false);
    }
    
    setCity(""); // limpia el input
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="flex flex-col sm:flex-row gap-3 mb-6 justify-center items-stretch w-full max-w-2xl mx-auto px-4"
    >
      <div className="flex-1">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Ingrese ciudad o provincia..."
          className="w-full p-3 sm:p-4 bg-white border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 outline-none text-gray-800 placeholder-gray-500"
          disabled={isSearching}
        />
      </div>

      <Button
        type="submit" 
        variant="primary"
        size="auto"
        disabled={isSearching}
        className="whitespace-nowrap min-h-[50px] sm:min-h-[60px] flex items-center justify-center px-6 sm:px-8 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {isSearching ? (
          <>
            <i className="bi bi-arrow-repeat animate-spin mr-2"></i>
            Buscando...
          </>
        ) : (
          <>
            <i className="bi bi-search mr-2"></i>
            Buscar Clima
          </>
        )}
      </Button>
    </form>
  );
};

export default SearchForm;
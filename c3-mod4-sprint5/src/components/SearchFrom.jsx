import React, { useState } from "react";
import { useWeather } from "../context/WeatherContext";
import Button from "./Button";
import { toast } from "react-toastify";

const SearchForm = () => {
  const [city, setCity] = useState(""); // manejar la consulta
  const { getWeather } = useWeather(); // obtiene la función del contexto

  const handleSubmit = (e) => {
    e.preventDefault(); // evita recargar la página
    if (city.trim() === "") {
      toast.warn("Ingrese una ciudad");
      return;
    } // evita búsquedas vacías
    getWeather(city); // llama a la API
    setCity(""); // limpia el input
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6 justify-center">
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Ingrese ciudad o provincia"
        className="p-2 bg-white border border-gray-700 rounded  shadow shadow-white w-64"
      />
      <Button type="submit" variant="primary">
        Buscar
      </Button>
    </form>
  );
};

export default SearchForm;

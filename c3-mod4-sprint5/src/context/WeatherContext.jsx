import { createContext, useState, useContext } from "react";
import { fetchWeather } from "../services/WeatherApi";
import { toast } from "react-toastify";

const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weatherData, setWeatherData] = useState(null); //par ala informacion del tiempo del clima
  const [loading, setLoading] = useState(false); //estado de carga
  const [error, setError] = useState(null);

  const getWeather = async (city) => {
    //Validación campo vacío
    if (!city || !city.trim()) {
      toast.warn("Ingrese una ciudad válida");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(city); //recibe la info de api
      setWeatherData(data);
      //console.log(data);
    } catch (err) {
      console.error(err);
      // Manejo específico de error 404
      if (err.response?.status === 404) {
        toast.error("Ciudad no encontrada");
      } else {
        toast.error("Error al obtener el clima");
      }
      //setError("No se encontró la ciudad");
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider
      value={{ weatherData, loading, error, getWeather }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => useContext(WeatherContext);

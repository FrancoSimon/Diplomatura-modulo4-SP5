import { useWeather } from "../context/WeatherContext";
import { SpinnerDiamond } from "spinners-react";
import { toast } from "react-toastify";

const WeatherCard = () => {
  const { weatherData, loading, error } = useWeather();

  if (loading)
    return (
      <div className="flex justify-center items-center py-6">
        <SpinnerDiamond
          size={70}
          thickness={100}
          speed={100}
          color="#36ad47"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;
  if (!weatherData)
    return <p className="text-gray-700">No hay datos disponibles.</p>;

  const { name, weather, main, dt } = weatherData;

  // Fecha y hora de Fiambalá (UTC−3)
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

  // Ícono del clima
  const iconCode = weather[0]?.icon;
  const URL = import.meta.env.VITE_ICONWEATHER;
  const iconUrl = `${URL}${iconCode}@2x.png`;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-xl mx-auto mb-3">
      <h2 className="text-2xl font-bold mb-1">
        Pronóstico del tiempo en {name} hoy
      </h2>
      <p className="capitalize text-gray-600">{fechaFiambala}</p>
      <p className="text-gray-700 mb-3">Hora: {horaFiambala}</p>

      <div className="flex justify-center items-center mb-2">
        <img
          src={iconUrl}
          alt={weather[0]?.description}
          className="w-20 h-20"
        />
      </div>

      <p className="text-lg font-semibold capitalize mb-1">
        {weather[0]?.description}
      </p>

      <p className="text-4xl font-bold my-3">{main?.temp.toFixed(1)}°C</p>

      <p className="mt-2 text-gray-700">Humedad: {main?.humidity}%</p>
    </div>
  );
};

export default WeatherCard;

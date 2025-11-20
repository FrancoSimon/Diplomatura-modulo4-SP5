// WeatherApi.js
import axios from "axios";

const apiKey = import.meta.env.VITE_APIWEATHERFIAM_KEY;
const country = import.meta.env.VITE_COUNTRY;

export const fetchWeather = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&units=metric&lang=es&appid=${apiKey}`;
  const response = await axios.get(url);
  return response.data;
};

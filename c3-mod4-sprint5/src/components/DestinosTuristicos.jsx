import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useWatchlist } from "../context/WatchlistContext";
import Button from "./Button";

const DestinosTuristicos = () => {
  const [turisticos, setTuristicos] = useState([]);
  const [error, setError] = useState(null);
  const [number, setNumber] = useState("");
  const [search, setSearch] = useState("");

  const { addToWatchlist } = useWatchlist();

  // Obtener por cantidad
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSearch("");
    setTuristicos([]);

    const cantidad = parseInt(number);
    if (isNaN(cantidad) || cantidad <= 0) {
      toast.warning("Debe ingresar un número válido mayor a cero");
      return;
    }

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVTUR_KEY}?page=1&limit=${cantidad}`
      );
      setTuristicos(data);
      toast.success("Servicios obtenidos correctamente");
    } catch (err) {
      console.error(err);
      toast.error("Error al obtener los servicios turísticos.");
    }
  };

  // Buscar por nombre
  const handleBusqueda = async (e) => {
    e.preventDefault();
    setError("");
    setNumber("");
    setTuristicos([]);

    const termino = search.trim().toLowerCase();
    if (!termino) {
      toast.warning("Debe ingresar un nombre para buscar");
      return;
    }

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_SERVTUR_KEY}`);
      const resultado = data.filter((item) =>
        item.nombre.toLowerCase().includes(termino)
      );

      if (resultado.length === 0) {
        toast.error("No se encontraron destinos con ese nombre");
      } else {
        setTuristicos(resultado);
        toast.success("Servicios encontrados correctamente");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al obtener los servicios turísticos.");
    }
  };

  return (
    <div
      id="servicios"
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 pt-[98px]"
    >
      <h1 className="text-3xl font-bold mb-6">Destinos</h1>

      {/* Formulario por cantidad */}
      <form onSubmit={handleSubmit} className="mb-6 flex items-center gap-3">
        <input
          type="number"
          placeholder="Ingrese un número"
          className="p-2 rounded bg-gray-800 border shadow shadow-gray-200"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
        />
        <Button type="submit" variant="primary">
          Obtener Destinos
        </Button>
      </form>

      {/* Formulario por búsqueda */}
      <form onSubmit={handleBusqueda} className="mb-6 flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          className="p-2 rounded bg-gray-800 border shadow shadow-gray-200"
          value={search}
          onChange={(e) => {
            const soloTexto = e.target.value.replace(
              /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
              ""
            );
            setSearch(soloTexto);
          }}
        />
        <Button type="submit" variant="primary">
          Buscar Destino
        </Button>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Resultado */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6 w-full max-w-6xl">
        {Array.isArray(turisticos) &&
          turisticos.map((turistico) => (
            <div
              key={turistico.id}
              className="bg-gray-800 rounded-2xl shadow-lg p-4 flex flex-col justify-between hover:scale-105 transition-transform duration-200"
            >
              <div>
                <img
                  src={turistico.imagen}
                  alt={turistico.nombre}
                  className="rounded-xl mb-4 w-full h-40 object-cover"
                />
                <h2 className="text-xl font-semibold mb-2">
                  {turistico.nombre}
                </h2>
                <p className="text-sm text-gray-300 mb-3">
                  {turistico.descripcion}
                </p>
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  onClick={() => addToWatchlist(turistico)}
                  variant="tertiary"
                >
                  <i className="bi bi-heart-fill text-red-500"></i> Agregar a
                  Favoritos
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default DestinosTuristicos;

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useWatchlist } from "../context/WatchlistContext";
import Button from "./Button";

const DestinosTuristicos = () => {
  const [turisticos, setTuristicos] = useState([]);
  const [error, setError] = useState(null);
  const [number, setNumber] = useState("");
  const [search, setSearch] = useState("");
  const [editingDestino, setEditingDestino] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({
    nombre: "",
    descripcion: "",
    imagen: "",
  });
  const [newDestino, setNewDestino] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    imagen: "",
  });

  const { addToWatchlist } = useWatchlist();

  // Función para cargar 3 destinos
  const cargarTresDestinos = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_SERVTUR_KEY}?page=1&limit=3`
      );
      setTuristicos(data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar los destinos.");
    }
  };

  // Cargar 3 destinos al iniciar
  useEffect(() => {
    cargarTresDestinos();
  }, []);

  // Buscar por nombre
  const handleBusqueda = async (e) => {
    e.preventDefault();
    setError("");
    setNumber("");

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
        return;
      } else {
        setTuristicos(resultado);
        toast.success("Servicios encontrados correctamente");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error al obtener los servicios turísticos.");
    }
  };

  // Abrir modal de edición
  const handleEditar = (destino) => {
    setEditingDestino(destino);
    setEditForm({
      nombre: destino.nombre || "",
      descripcion: destino.descripcion || "",
      imagen: destino.imagen || "",
    });
  };

  // Cerrar modal de edición
  const handleCloseModal = () => {
    setEditingDestino(null);
    setEditForm({ nombre: "", descripcion: "", imagen: "" });
  };

  // Abrir modal de agregar
  const handleOpenAddModal = () => {
    setShowAddModal(true);
    setNewDestino({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
    });
  };

  // Cerrar modal de agregar
  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setNewDestino({
      nombre: "",
      descripcion: "",
      precio: "",
      imagen: "",
    });
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambios en el formulario de agregar
  const handleNewInputChange = (e) => {
    const { name, value } = e.target;
    setNewDestino((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios de edicion
  const handleSaveEdit = async () => {
    if (
      !editForm.nombre.trim() ||
      !editForm.descripcion.trim() ||
      !editForm.imagen.trim()
    ) {
      toast.warning("Todos los campos son obligatorios");
      return;
    }

    try {
      await axios.put(
        `${import.meta.env.VITE_SERVTUR_KEY}/${editingDestino.id}`,
        editForm
      );

      toast.success("Destino actualizado correctamente");
      handleCloseModal();
      cargarTresDestinos();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el destino");
    }
  };

  // Guardar nuevo destino
  const handleSaveNewDestino = async () => {
    if (
      !newDestino.nombre.trim() ||
      !newDestino.descripcion.trim() ||
      !newDestino.precio.trim() ||
      !newDestino.imagen.trim()
    ) {
      toast.warning("Todos los campos son obligatorios");
      return;
    }

    // Validar que el precio sea un número válido
    const precioNumero = parseFloat(newDestino.precio);
    if (isNaN(precioNumero) || precioNumero <= 0) {
      toast.warning("El precio debe ser un número válido mayor a 0");
      return;
    }

    try {
      const destinoData = {
        ...newDestino,
        precio: precioNumero,
        createdAt: new Date().toISOString(),
      };

      await axios.post(`${import.meta.env.VITE_SERVTUR_KEY}`, destinoData);

      toast.success("Destino agregado correctamente");
      handleCloseAddModal();
      cargarTresDestinos();
    } catch (err) {
      console.error(err);
      toast.error("Error al agregar el destino");
    }
  };

  // Eliminar destino turístico con SweetAlert2
  const handleEliminar = async (id) => {
    const destino = turisticos.find((t) => t.id === id);

    if (!destino) {
      toast.error("No se encontró el destino a eliminar");
      return;
    }

    const nombreDestino = destino.nombre || "este destino";

    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Quieres eliminar el destino "${nombreDestino}"? Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#1f2937",
      color: "#fff",
      iconColor: "#ef4444",
      customClass: {
        popup: "bg-gray-800",
        title: "text-white",
        htmlContainer: "text-gray-300",
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_SERVTUR_KEY}/${id}`);

        await Swal.fire({
          title: "¡Eliminado!",
          text: `El destino "${nombreDestino}" ha sido eliminado correctamente.`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          background: "#1f2937",
          color: "#fff",
          iconColor: "#10b981",
        });

        await cargarTresDestinos();
      } catch (err) {
        console.error(err);

        await Swal.fire({
          title: "Error",
          text: "No se pudo eliminar el destino turístico.",
          icon: "error",
          confirmButtonColor: "#d33",
          background: "#1f2937",
          color: "#fff",
          iconColor: "#ef4444",
        });
      }
    }
  };

  return (
    <div
      id="servicios"
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-500 text-white flex flex-col items-center p-4 sm:p-6 pt-24 sm:pt-32"
    >
      {/* Títulos */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif mb-4 sm:mb-6 text-center px-4">
        Destinos
      </h1>
      <h2 className="text-xl sm:text-2xl lg:text-3xl p-4 mb-6 text-center px-4 max-w-4xl">
        Explora los destinos imperdibles para tus próximas aventuras en
        Fiambalá.
      </h2>

      {/* Formulario de Búsqueda */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-2xl">
        <form
          onSubmit={handleBusqueda}
          className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-3 min-w-0"
        >
          <input
            type="text"
            placeholder="Buscar por nombre..."
            className="flex-1 p-3 sm:p-2 rounded-lg bg-gray-800 border border-gray-600 text-white min-w-0 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            value={search}
            onChange={(e) => {
              const soloTexto = e.target.value.replace(
                /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                ""
              );
              setSearch(soloTexto);
            }}
          />
          <Button
            type="submit"
            variant="secondary"
            size="auto"
            className="whitespace-nowrap min-h-[44px] flex items-center justify-center"
          >
            <i className="bi bi-search mr-2"></i>
            Buscar Destino
          </Button>
        </form>

        <Button
          onClick={handleOpenAddModal}
          variant="secondary"
          size="auto"
          className="whitespace-nowrap min-h-[44px] flex items-center justify-center"
        >
          <i className="bi bi-plus-circle text-green-500 mr-2"></i>
          Agregar Destino
        </Button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-200 max-w-2xl w-full text-center">
          {error}
        </div>
      )}

      {/* Grid de Tarjetas*/}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 w-full max-w-6xl px-4 sm:px-6">
        {Array.isArray(turisticos) && turisticos.length > 0 ? (
          turisticos.map((turistico) => (
            <div
              key={turistico.id}
              className="bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-5 flex flex-col justify-between hover:scale-105 transition-transform duration-200 border border-gray-700 hover:border-amber-500/30"
            >
              <div className="flex-1">
                <img
                  src={turistico.imagen}
                  alt={turistico.nombre}
                  className="rounded-xl mb-4 w-full h-40 sm:h-48 object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x300/1f2937/6b7280?text=Imagen+No+Disponible";
                  }}
                />
                <h2 className="text-xl sm:text-2xl font-semibold mb-2 line-clamp-2">
                  {turistico.nombre}
                </h2>
                <p className="text-sm text-gray-300 mb-3 line-clamp-3">
                  {turistico.descripcion}
                </p>
                {/*{turistico.precio && (
                  <div className="flex items-center justify-between mb-3 pt-3 border-t border-gray-700">
                    <span className="text-sm text-gray-400">Precio:</span>
                    <span className="text-lg font-bold text-amber-400">
                      ${turistico.precio.toLocaleString()}
                    </span>
                  </div>
                )}*/}
              </div>

              {/* Botones de Acción  */}
              <div className="flex justify-between mt-4 gap-2">
                <button
                  onClick={() => addToWatchlist(turistico)}
                  className="group bg-transparent p-2 sm:p-3 rounded-xl border border-white hover:bg-amber-600 hover:border-amber-600 transition-all duration-200 flex-1 flex items-center justify-center relative min-h-[44px]"
                >
                  <i className="bi bi-heart-fill text-white group-hover:text-red-600 transition-colors text-sm sm:text-base"></i>
                  <span className="sr-only">Agregar Favorito</span>

                  <span className="hidden lg:block absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none border border-gray-600 z-20">
                    Agregar Favorito
                  </span>
                </button>

                <button
                  onClick={() => handleEliminar(turistico.id)}
                  className="group bg-transparent p-2 sm:p-3 rounded-xl border border-white hover:bg-amber-600 hover:border-amber-600 transition-all duration-200 flex-1 flex items-center justify-center relative min-h-[44px]"
                >
                  <i className="bi bi-trash3 text-white group-hover:text-black transition-colors text-sm sm:text-base"></i>
                  <span className="sr-only">Eliminar</span>

                  <span className="hidden lg:block absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none border border-gray-600 z-20">
                    Eliminar
                  </span>
                </button>

                <button
                  onClick={() => handleEditar(turistico)}
                  className="group bg-transparent p-2 sm:p-3 rounded-xl border border-white hover:bg-amber-600 hover:border-amber-600 transition-all duration-200 flex-1 flex items-center justify-center relative min-h-[44px]"
                >
                  <i className="bi bi-pencil-square text-white group-hover:text-green-400 transition-colors text-sm sm:text-base"></i>
                  <span className="sr-only">Editar</span>

                  <span className="hidden lg:block absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none border border-gray-600 z-20">
                    Editar
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 sm:py-16">
            <i className="bi bi-geo-alt-fill text-6xl text-gray-500 mb-4"></i>
            <p className="text-xl text-gray-400 mb-2">
              No hay destinos para mostrar
            </p>
            <p className="text-gray-500 max-w-md mx-auto">
              {search
                ? "Intenta con otros términos de búsqueda"
                : 'Agrega el primer destino turístico usando el botón "Agregar Destino"'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Editar */}
      {editingDestino && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Editar Destino
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={editForm.nombre}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Nombre del destino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={editForm.descripcion}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descripción del destino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  name="imagen"
                  value={editForm.imagen}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                onClick={handleCloseModal}
                variant="secondary"
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEdit}
                variant="primary"
                className="flex-1 sm:flex-none"
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregar Destino */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-gray-800 rounded-2xl p-4 sm:p-6 w-full max-w-md mx-2 sm:mx-0 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold mb-4 text-white">
              Agregar Nuevo Destino
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={newDestino.nombre}
                  onChange={handleNewInputChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Nombre del destino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={newDestino.descripcion}
                  onChange={handleNewInputChange}
                  rows="4"
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Descripción del destino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Precio
                </label>
                <input
                  type="number"
                  name="precio"
                  value={newDestino.precio}
                  onChange={handleNewInputChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="30000"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  name="imagen"
                  value={newDestino.imagen}
                  onChange={handleNewInputChange}
                  className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                onClick={handleCloseAddModal}
                variant="secondary"
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveNewDestino}
                variant="primary"
                className="flex-1 sm:flex-none"
              >
                Agregar Destino
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DestinosTuristicos;

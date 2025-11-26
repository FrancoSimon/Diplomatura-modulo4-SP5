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
        // Mantener las tarjetas actuales en lugar de limpiarlas
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
      cargarTresDestinos(); // Recargar los destinos
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
    // Encontrar el destino por ID para obtener el nombre
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

        // Mostrar confirmación de éxito
        await Swal.fire({
          title: "¡Eliminado!",
          text: `El destino "${nombreDestino}" ha sido eliminado correctamente.`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          background: "#1f2937",
          color: "#fff",
          iconColor: "#10b981",
        });

        // Recargar automáticamente 3 destinos después de eliminar
        await cargarTresDestinos();
      } catch (err) {
        console.error(err);

        // Mostrar error con SweetAlert2
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

  {
    /*// Función para limpiar búsqueda y mostrar 3 destinos
  const limpiarBusqueda = () => {
    setSearch("");
    cargarTresDestinos();
  };
*/
  }
  return (
    <div
      id="servicios"
      className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6 pt-[120px]"
    >
      <h1 className="text-6xl font-serif mb-6">Destinos</h1>
      <h2 className="text-3xl p-4 mb-6">
        Explora los destinos imperdibles para tus próximas aventuras en
        Fiambalá.
      </h2>

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
        <Button
          onClick={handleOpenAddModal}
          variant="secondary"
          className="ml-2"
        >
          <i className="bi bi-plus-circle text-green-500 mr-2"></i>
          Agregar Destino
        </Button>
        {/* {search && (
          <Button 
            type="button" 
            onClick={limpiarBusqueda} 
            variant="secondary"
          >
            Limpiar
          </Button>
        )}*/}
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Resultado */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6 w-full max-w-6xl">
        {Array.isArray(turisticos) && turisticos.length > 0 ? (
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
                  <i className="bi bi-heart-fill text-red-500"></i>
                  Favoritos
                </Button>
                <Button
                  onClick={() => handleEliminar(turistico.id)}
                  variant="tertiary"
                >
                  <i className="bi bi-trash3 text-red-500"></i> Eliminar
                </Button>
                <Button
                  onClick={() => handleEditar(turistico)}
                  variant="tertiary"
                >
                  <i className="bi bi-pencil-square text-red-500"></i>Editar
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-xl text-gray-400">
              No hay destinos para mostrar
            </p>
          </div>
        )}
      </div>

      {/* Modal de Edición */}
      {editingDestino && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4">Editar Destino</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={editForm.nombre}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  placeholder="Nombre del destino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={editForm.descripcion}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white resize-none"
                  placeholder="Descripción del destino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  name="imagen"
                  value={editForm.imagen}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={handleCloseModal} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} variant="primary">
                Guardar Cambios
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Agregar Destino */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-semibold mb-4">
              Agregar Nuevo Destino
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={newDestino.nombre}
                  onChange={handleNewInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  placeholder="Nombre del destino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={newDestino.descripcion}
                  onChange={handleNewInputChange}
                  rows="3"
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white resize-none"
                  placeholder="Descripción del destino"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={newDestino.precio}
                  onChange={handleNewInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  placeholder="30000"
                  min="0"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  URL de la Imagen
                </label>
                <input
                  type="url"
                  name="imagen"
                  value={newDestino.imagen}
                  onChange={handleNewInputChange}
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button onClick={handleCloseAddModal} variant="secondary">
                Cancelar
              </Button>
              <Button onClick={handleSaveNewDestino} variant="primary">
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

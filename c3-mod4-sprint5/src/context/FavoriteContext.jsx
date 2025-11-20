//contexto de favoritos
import {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favoritosFiambala");
    return saved ? JSON.parse(saved) : [];
  });

  // Guardar en localStorage solo cuando favorites cambia
  useEffect(() => {
    localStorage.setItem("favoritosFiambala", JSON.stringify(favorites));
  }, [favorites]);

  // Funciones optimizadas con useCallback

  const addToFavorites = useCallback(
    (servicio) => {
      setFavorites((prev) => {
        const existe = prev.some((item) => item.id === servicio.id);
        if (existe) return prev;
        return [...prev, servicio];
      });
    },
    [] // No depende de nada externo → no se recrea nunca
  );

  const removeFromFavorites = useCallback((id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    clearFavorites,
  };

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoriteContext);

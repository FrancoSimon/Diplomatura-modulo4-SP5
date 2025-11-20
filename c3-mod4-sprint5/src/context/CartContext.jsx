//contexto del carrito

import { createContext, useState, useEffect, useContext, useCallback } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("carritoFiambala");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("carritoFiambala", JSON.stringify(cart));
  }, [cart]);


  // Funciones optimizadas con useCallback
 
  const addToCart = useCallback((servicio) => {
    setCart((prev) => {
      const existe = prev.find((item) => item.id === servicio.id);

      if (existe) {
        return prev.map((item) =>
          item.id === servicio.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prev, { ...servicio, cantidad: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const item = prev.find((s) => s.id === id);

      if (!item) return prev;

      if (item.cantidad > 1) {
        return prev.map((s) =>
          s.id === id ? { ...s, cantidad: s.cantidad - 1 } : s
        );
      }

      return prev.filter((s) => s.id !== id);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);

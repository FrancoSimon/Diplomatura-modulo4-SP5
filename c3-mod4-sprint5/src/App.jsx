import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

import Navbar from "./components/Navbar.jsx";
import { Footer } from "./components/Footer.jsx";

import RoutesApp from "./Router/RoutesApp.jsx";


import { WeatherProvider } from "./context/WeatherContext.jsx";
import { WatchlistProvider } from "./context/WatchlistContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { FavoriteProvider } from "./context/FavoriteContext.jsx";

import "react-toastify/dist/ReactToastify.css";

const App = () => {
  useEffect(() => {
    toast.info("Bienvenido a Tierra de Encantos");
  }, []);

  return (
    <>
      <WeatherProvider>
        <WatchlistProvider>
          <FavoriteProvider>
            <CartProvider>
              <Navbar />

              <div className="flex flex-col min-h-screen">
                <main className="grow">
                  <RoutesApp />
                </main>

                <Footer />
              </div>
            </CartProvider>
          </FavoriteProvider>
        </WatchlistProvider>
      </WeatherProvider>

      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar
        pauseOnHover={false}
        theme="dark"
      />
    </>
  );
};

export default App;

import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";

// STORE
import Home from "./modules/store/Home.jsx";
import ProductList from "./modules/store/ProductList.jsx";
import ProductDetail from "./modules/store/ProductDetail.jsx";
import Cart from "./modules/store/Cart.jsx";
import Checkout from "./modules/store/Checkout.jsx";
import About from "./modules/store/About.jsx";
import Soporte from "./modules/store/Soporte.jsx";

// ADMIN
import AdminMain from "./modules/admin/AdminMain.jsx";

// AUTH
import Login from "./modules/auth/Login.jsx";
import Register from "./modules/auth/Register.jsx";
import Profile from "./modules/auth/Profile.jsx";

import { Routes, Route, useLocation, useNavigate } from "react-router-dom";

import autoLogoutService from "./modules/auth/services/autoLogoutService.js";
import cartService from "./modules/store/services/cartService.js";

import { useEffect } from "react";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Obtener usuario actual desde localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

  // AUTO LOGOUT
  useEffect(() => {
    if (currentUser) {
      autoLogoutService.startAutoLogout(() => {
        console.log("Cerrando sesión por inactividad…");

        // 1. Limpiar usuario en storage
        localStorage.removeItem("currentUser");
        sessionStorage.removeItem("currentUser");

        // 2. Limpiar carrito y dejarlo en guest
        try {
          cartService.clearCart();
          cartService.setUser("guest");
        } catch (_) {}

        // 3. Notificar a toda la app que ya NO hay usuario
        try {
          window.dispatchEvent(
            new CustomEvent("auth:changed", { detail: { user: null } })
          );
        } catch (_) {}

        // 4. Redirigir al login
        navigate("/login");
      });
    } else {
      autoLogoutService.stopAutoLogout();
    }
  }, [currentUser, navigate]);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      {!isAdminRoute && <Navbar />}

      <main className="flex-1">
        <Routes>
          {/* Tienda */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/about" element={<About />} />
          <Route path="/soporte" element={<Soporte />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminMain />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/cuenta" element={<Profile />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;

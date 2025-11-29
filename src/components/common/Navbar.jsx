import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import cartService from "@/modules/store/services/cartService";

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [cartCount, setCartCount] = useState(() => {
    try {
      const items = cartService.getCart();
      return items.reduce((s, it) => s + (it.quantity || 0), 0);
    } catch (_e) {
      return 0;
    }
  });

  // Cargar usuario de localStorage y escuchar actualizaciones
  useEffect(() => {
    function loadUser() {
      try {
        const user = JSON.parse(localStorage.getItem("currentUser") || "null");
        setCurrentUser(user);
      } catch (_) {
        // ignorar errores de parseo
        setCurrentUser(null);
      }
    }

    function handleAuthChange(e) {
      // Si el evento contiene el usuario, usarlo directamente
      if (e && e.detail && e.detail.user) {
        setCurrentUser(e.detail.user);
      } else {
        // Si no, cargar desde localStorage
        loadUser();
      }
    }

    loadUser();
    window.addEventListener("storage", loadUser);
    window.addEventListener("auth:changed", handleAuthChange);
    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("auth:changed", handleAuthChange);
    };
  }, []);

  // Actualizar carrito desde eventos
  useEffect(() => {
    function updateFromEvent(e) {
      try {
        if (e && e.detail && typeof e.detail.total === "number") {
          setCartCount(e.detail.total);
          return;
        }
      } catch (_) {
        // recalcular desde el servicio
      }
      const items = cartService.getCart();
      setCartCount(items.reduce((s, it) => s + (it.quantity || 0), 0));
    }

    // listen to custom cart events
    window.addEventListener("cart:changed", updateFromEvent);

    // also listen to storage events (cross-tab)
    function onStorage() {
      const items = cartService.getCart();
      setCartCount(items.reduce((s, it) => s + (it.quantity || 0), 0));
    }
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cart:changed", updateFromEvent);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const handleLogout = () => {
    // Limpiar usuario y carrito al cerrar sesión
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    try {
      // Limpiar carrito completamente (items y userId)
      cartService.clearCart();
    } catch (_) {
      // ignorar
    }
    try {
      window.dispatchEvent(
        new CustomEvent("auth:changed", { detail: { user: null } })
      );
    } catch (_) {
      // ignorar
    }
    navigate("/");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="hover:opacity-70 transition-opacity">
            <img
              src="/images/bellas-boutique-logo.png"
              alt="Logo de Bellas Boutique"
              className="h-20 w-auto"
            />
          </Link>

          {/* NAV DESKTOP */}
          <nav className="hidden md:flex items-center gap-10 text-base md:text-lg">
            <Link
              to="/"
              className="font-medium tracking-wide text-brand-dark hover:text-brand transition-colors"
            >
              Inicio
            </Link>

            <Link
              to="/products"
              className="font-medium tracking-wide text-brand-dark hover:text-brand transition-colors"
            >
              Colecciones
            </Link>

            <Link
              to="/about"
              className="font-medium tracking-wide text-brand-dark hover:text-brand transition-colors"
            >
              Sobre Nosotros
            </Link>
          </nav>

          {/* LADO DERECHO: CUENTA / BUSCAR / CARRITO */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4">
              {currentUser ? (
                <>
                  <button
                    onClick={() => {
                      if (currentUser && currentUser.rol === "Administrador") {
                        navigate("/admin");
                      }
                      // if Cliente, do nothing on click
                    }}
                    className="text-sm md:text-base text-brand-dark font-medium hover:opacity-90"
                  >
                    {currentUser.nombre}
                  </button>
                  <button
                    onClick={() => {
                      // limpiar propiedad del carrito y cerrar sesión
                      try {
                        cartService.setUser("guest");
                      } catch (_) {
                        // ignorar
                      }
                      handleLogout();
                    }}
                    className="text-sm md:text-base text-brand-dark hover:text-brand transition-colors underline"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm md:text-base text-brand-dark hover:text-brand transition-colors"
                >
                  Cuenta
                </Link>
              )}
            </div>

            {/* Search Icon */}
            <button
              aria-label="Buscar"
              className="text-brand-dark hover:text-brand transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
            </button>

            {/* Cart Icon with Badge */}
            <Link
              to="/cart"
              className="relative text-brand-dark hover:text-brand transition-colors"
              aria-label="Carrito de compras"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[1rem] px-1 items-center justify-center rounded-full bg-brand-dark text-[10px] text-white font-medium">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

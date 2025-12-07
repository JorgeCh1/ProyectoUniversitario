import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import cartService from "@/modules/store/services/cartService";

export default function Navbar() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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
        setCurrentUser(null);
      }
    }

    function handleAuthChange(e) {
      if (e && e.detail && e.detail.user) {
        setCurrentUser(e.detail.user);
      } else {
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
    // Limpiar usuario
    localStorage.removeItem("currentUser");
    sessionStorage.removeItem("currentUser");
    setCurrentUser(null);

    try {
      cartService.clearCart();
      cartService.setUser("guest");
    } catch (_) {}

    try {
      window.dispatchEvent(
        new CustomEvent("auth:changed", { detail: { user: null } })
      );
    } catch (_) {}

    setIsMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
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

          {/* LADO DERECHO DESKTOP */}
          <div className="hidden md:flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-4">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        if (!currentUser) return;

                        if (
                          currentUser.rol === "Administrador" ||
                          currentUser.rol === "Vendedor"
                        ) {
                          navigate("/admin");
                        } else {
                          // Cliente u otro rol
                          navigate("/cuenta");
                        }
                      }}
                      className="text-sm md:text-base text-brand-dark font-medium hover:opacity-90"
                    >
                      {currentUser.nombre}
                    </button>
                    <button
                      onClick={() => {
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
            </div>

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

          {/* LADO DERECHO MOBILE */}
          <div className="flex items-center gap-4 md:hidden">
            {/* Cart small */}
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
                className="w-6 h-6"
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

            {/* Botón menú mobile */}
            <button
              type="button"
              aria-label="Abrir menú"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              className="text-brand-dark hover:text-brand transition-colors"
            >
              {isMobileOpen ? (
                // icono X
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // icono hamburguesa
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MENÚ MOBILE */}
      {isMobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="max-w-7xl mx-auto px-6 py-3 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">
                {currentUser
                  ? `Hola, ${currentUser.nombre}`
                  : "Bienvenido, invitado"}
              </span>

              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="text-xs text-brand-dark hover:text-brand underline"
                >
                  Cerrar sesión
                </button>
              )}
            </div>

            <nav className="flex flex-col gap-2 text-sm">
              <Link
                to="/"
                onClick={() => setIsMobileOpen(false)}
                className="py-1 text-brand-dark hover:text-brand transition-colors"
              >
                Inicio
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMobileOpen(false)}
                className="py-1 text-brand-dark hover:text-brand transition-colors"
              >
                Colecciones
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileOpen(false)}
                className="py-1 text-brand-dark hover:text-brand transition-colors"
              >
                Sobre Nosotros
              </Link>

              {!currentUser && (
                <Link
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="py-1 text-brand-dark hover:text-brand transition-colors"
                >
                  Iniciar sesión / Crear cuenta
                </Link>
              )}

              {currentUser && currentUser.rol === "Administrador" && (
                <button
                  type="button"
                  onClick={() => {
                    navigate("/admin");
                    setIsMobileOpen(false);
                  }}
                  className="py-1 text-left text-brand-dark hover:text-brand transition-colors font-medium"
                >
                  Panel administrativo
                </button>
              )}

              {currentUser && currentUser.rol === "Cliente" && (
                <button
                  type="button"
                  onClick={() => {
                    navigate("/cuenta");
                    setIsMobileOpen(false);
                  }}
                  className="py-1 text-left text-brand-dark hover:text-brand transition-colors font-medium"
                >
                  Mi cuenta
                </button>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

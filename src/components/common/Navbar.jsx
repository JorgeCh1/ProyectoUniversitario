import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-2xl font-light tracking-wide text-brand-dark hover:opacity-70 transition-opacity"
          >
            mila
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-sm text-brand-dark hover:text-brand transition-colors"
            >
              Nuevas Llegadas
            </Link>
            <Link
              to="/products"
              className="text-sm text-brand-dark hover:text-brand transition-colors"
            >
              Traje de Baño
            </Link>
            <Link
              to="/products"
              className="text-sm text-brand-dark hover:text-brand transition-colors"
            >
              Colecciones
            </Link>
            <Link
              to="/about"
              className="text-sm text-brand-dark hover:text-brand transition-colors"
            >
              Sobre Nosotros
            </Link>
            <Link
              to="/demos"
              className="text-sm text-brand-dark hover:text-brand transition-colors"
            >
              Demostraciones
            </Link>
          </nav>

          <div className="flex items-center gap-6">
            <Link
              to="/account"
              className="text-sm text-brand-dark hover:text-brand transition-colors hidden md:block"
            >
              Cuenta
            </Link>

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
            <a
              href="/cart"
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
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-dark text-[10px] text-white font-medium">
                0
              </span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

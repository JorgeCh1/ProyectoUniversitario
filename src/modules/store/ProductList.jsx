// src/modules/store/ProductList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import productService from "@/modules/store/services/productService";
import cartService from "@/modules/store/services/cartService";
import CartAddedDialog from "@/components/CartAddedDialog";

export default function ProductList() {
  const [heroVisible, setHeroVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // animación del hero
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const getMainImage = (p) =>
  p?.images?.[0] ||
  p?.imagen ||
  p?.image ||
  "/images/placeholder.png";


  // cargar catálogo
  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.list();
        if (!cancelled) setProducts(data);
      } catch (err) {
        console.error("Error cargando productos:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  // categorías únicas
  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set)];
  }, [products]);

  // filtrado por categoría y disponibilidad
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory =
        selectedCategory === "all" || p.category === selectedCategory;
      const matchStock = !showInStockOnly || p.stock > 0;
      return matchCategory && matchStock;
    });
  }, [products, selectedCategory, showInStockOnly]);

  const handleAddToCart = (product) => {
    // price puede venir como número o string, lo normalizamos
    const price = Number(product.price);

    const updatedCart = cartService.addItem({
      id: product.id,
      name: product.name,
      price,
      image: getMainImage(product),
      quantity: 1,
      color: null,
      size: null,
    });

    console.log("Carrito actualizado:", updatedCart);
  };

  const formatPrice = (price) => `₡${Number(price).toLocaleString("es-CR")}`;

  const collections = [
    { name: "Viernes Negro", image: "/images/bellas-boutique-1.webp" },
    {
      name: "Una nueva perspectiva",
      image: "/images/bellas-boutique-3.webp",
    },
    { name: "Mujeres", image: "/images/bellas-boutique-2.webp" },
  ];

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/bellas-boutique-4.webp')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div
            className={`max-w-lg space-y-4 transform transition-all duration-700 ease-out
              ${
                heroVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }
            `}
          >
            <p className="uppercase tracking-[0.2em] text-sm text-slate-100/80">
              Más vendidos
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              Comprometidos con colecciones conscientes y sostenibles.
            </h1>
            <p className="text-slate-100/90 text-sm md:text-base">
              Descubre nuestras piezas más vendidas, elaboradas para perdurar
              más allá de una temporada.
            </p>
          </div>
        </div>
      </section>

      {/* OUR COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Nuestras Colecciones
          </h2>
        </div>

        {/* Mobile: slider horizontal; sm+: grid de 3 */}
        <div
          className="
            flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory
            sm:grid sm:grid-cols-3 sm:gap-4 sm:overflow-visible sm:snap-none
          "
        >
          {collections.map((c) => (
            <article
              key={c.name}
              className="
                relative h-72 overflow-hidden rounded-lg group shadow-sm
                transition-transform duration-500 ease-out
                hover:-translate-y-1 hover:shadow-lg
                min-w-[80%] snap-center
                sm:min-w-0
              "
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${c.image}')` }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative h-full flex flex-col justify-end p-5 text-white">
                <h3 className="text-lg font-medium">{c.name}</h3>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-100/80">
                  Compra ahora
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MAIN CATALOG SECTION */}
      <section className="max-w-7xl mx-auto px-4 pb-16 flex flex-col md:flex-row gap-10">
        {/* SIDEBAR FILTROS */}
        <aside className="w-full md:w-64 md:flex-shrink-0 space-y-6 md:space-y-8 md:sticky md:top-24">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-slate-500 uppercase mb-3">
              Filtros
            </h2>
            <p className="text-xs text-slate-400">
              Refina tu búsqueda y encuentra más rápido tus prendas favoritas.
            </p>
          </div>

          {/* Disponibilidad */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white/60">
            <h3 className="text-sm font-semibold mb-2 text-slate-800">
              Disponibilidad
            </h3>
            <div className="space-y-1 text-sm text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span>Mostrar solo productos en stock</span>
              </label>
              <p className="text-xs text-slate-400 pl-6">
                Desmarca esta opción para incluir artículos agotados.
              </p>
            </div>
          </div>

          {/* Categoría */}
          <div className="border border-slate-200 rounded-lg p-4 bg-white/60">
            <h3 className="text-sm font-semibold mb-2 text-slate-800">
              Tipo de producto
            </h3>
            <div className="space-y-1 text-sm text-slate-700">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-3 py-1.5 rounded-full border text-xs md:text-sm transition ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white hover:bg-slate-100 border-slate-200"
                  }`}
                >
                  {cat === "all" ? "Todos los productos" : cat}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* GRID DE PRODUCTOS */}
        <div className="flex-1">
          {loading ? (
            <p className="text-sm text-slate-500">Cargando productos…</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-slate-500">
              No se encontraron productos para este filtro.
            </p>
          ) : (
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((p) => (
                <article
                  key={p.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
                >
                  <Link to={`/products/${p.id}`}>
                    <div className="aspect-[3/4] bg-slate-100">
                      <img
                        src={getMainImage(p)}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </Link>
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <div>
                      <Link to={`/products/${p.id}`}>
                        <h3 className="text-sm font-medium text-slate-900 line-clamp-1 hover:underline">
                          {p.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {p.description}
                      </p>
                    </div>

                    <div className="mt-auto space-y-1">
                      <p className="text-sm font-medium">
                        {formatPrice(p.price)}
                      </p>
                      <p
                        className={`text-xs ${
                          p.stock > 0 ? "text-emerald-600" : "text-slate-400"
                        }`}
                      >
                        {p.stock > 0 ? `${p.stock} en stock` : "Agotado"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Categoría: {p.category} · Proveedor: {p.provider}
                      </p>
                      <Button
                        onClick={() => handleAddToCart(p)}
                        className="mt-2 w-full rounded-full py-2 text-xs"
                      >
                        Añadir al carrito
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <CartAddedDialog />
    </div>
  );
}

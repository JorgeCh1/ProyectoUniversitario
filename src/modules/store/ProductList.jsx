// src/modules/store/ProductList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import productService from "@/modules/store/services/productService";
import cartService from "@/modules/store/services/cartService";

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
      image: product.image,
      quantity: 1,
      color: null,
      size: null,
    });

    console.log("Carrito actualizado:", updatedCart);
  };

  const formatPrice = (price) => `£${Number(price).toFixed(2)}`;

  const collections = [
    {
      name: "Elite",
      image: "/images/collections/elite.png",
    },
    {
      name: "Chamarel",
      image: "/images/collections/chamarel.png",
    },
    {
      name: "Wildside",
      image: "/images/collections/wildside.png",
    },
    {
      name: "Messina",
      image: "/images/collections/messina.png",
    },
  ];

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/placeholder.png')" }}
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
              Best Sellers
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              We are committed to mindful, sustainable collections.
            </h1>
            <p className="text-slate-100/90 text-sm md:text-base">
              Discover our best-selling pieces, crafted to last beyond one
              season.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 py-10 space-y-6">
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">
          Featured Collections
        </h2>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {collections.map((c) => (
            <article
              key={c.name}
              className="group relative overflow-hidden rounded-lg h-52 md:h-64 cursor-pointer"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url('${c.image}')` }}
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative h-full flex items-end p-4">
                <h3 className="text-white text-lg font-medium">{c.name}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* MAIN CATALOG SECTION */}
      <section className="max-w-7xl mx-auto px-4 pb-16 flex flex-col md:flex-row gap-10">
        {/* SIDEBAR FILTROS */}
        <aside className="w-full md:w-64 md:flex-shrink-0 space-y-8">
          {/* Disponibilidad */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Availability</h3>
            <div className="space-y-1 text-sm text-slate-700">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showInStockOnly}
                  onChange={(e) => setShowInStockOnly(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <span>In stock</span>
              </label>
              <p className="text-xs text-slate-400 pl-6">
                (Out of stock se mostrará solo si desmarcas este filtro)
              </p>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <h3 className="text-sm font-semibold mb-2">Product type</h3>
            <div className="space-y-1 text-sm text-slate-700">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`block w-full text-left px-2 py-1 rounded ${
                    selectedCategory === cat
                      ? "bg-slate-900 text-white"
                      : "hover:bg-slate-100"
                  }`}
                >
                  {cat === "all" ? "All products" : cat}
                </button>
              ))}
            </div>
          </div>

          {/* (Opcional) otros filtros visuales: color, size, sort, etc. */}
        </aside>

        {/* GRID DE PRODUCTOS */}
        <div className="flex-1">
          {loading ? (
            <p className="text-sm text-slate-500">Loading products…</p>
          ) : filteredProducts.length === 0 ? (
            <p className="text-sm text-slate-500">
              No products found for this filter.
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
                        src={p.image || "/images/placeholder.png"}
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
                        {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Category: {p.category} · Provider: {p.provider}
                      </p>
                      <Button
                        onClick={() => handleAddToCart(p)}
                        className="mt-2 w-full rounded-full py-2 text-xs"
                      >
                        Add to cart
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

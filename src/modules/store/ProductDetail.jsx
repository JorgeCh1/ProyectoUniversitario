import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "@/modules/store/services/productService";
import { Button } from "@/components/ui/button";
import cartService from "@/modules/store/services/cartService";
import ProductDetailAddedDialog from "@/components/ProductDetailAddedDialog";

// arriba del componente ProductDetail

const SIZE_PRESETS = {
  Ropa: ["XS", "S", "M", "L", "XL"],
  Zapato: ["35", "36", "37", "38", "39", "40"],
  "Joyería": [], // normalmente sin talla
};


export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // productos recomendados
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleRelatedClick = (relatedId) => {
    if (Number(relatedId) === Number(id)) return;

    navigate(`/products/${relatedId}`);
    setActiveSlide(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getMainImage = (p) =>
    p?.images?.[0] || p?.imagen || p?.image || "/images/placeholder.png";

  // Cargar producto
  useEffect(() => {
    let cancelled = false;

    const loadRelated = async (currentId) => {
      try {
        const all = await productService.listFeatured(8); // o list()
        const filtered = all.filter((p) => p.id !== Number(currentId));
        setRelatedProducts(filtered);
        setActiveSlide(0);
      } catch (err) {
        console.error("Error cargando productos relacionados:", err);
      }
    };

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await productService.getById(id);

        if (!cancelled) {
          if (!data) {
            setError("Producto no encontrado.");
          } else {
            setProduct(data);
            if (data.sizes?.length) setSelectedSize(data.sizes[0]);
            loadRelated(data.id);
          }
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("Ocurrió un error al cargar el producto.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProduct();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const images = useMemo(() => {
    if (!product) return [];
    if (product.imagenes?.length) return product.imagenes;
    if (product.images?.length) return product.images; // fallback
    const base = product.image || "/images/placeholder.png";
    return [base, base, base, base];
  }, [product]);

  const stock = product?.stock ?? 0;
  const sizes = useMemo(() => {
  if (!product) return [];

  // Si el producto ya trae tallas desde el admin / storage
  if (Array.isArray(product.sizes) && product.sizes.length > 0) {
    return product.sizes;
  }

  // Si no trae, usamos los presets según categoría
  const cat = product.category || product.categoria || "";
  if (SIZE_PRESETS[cat]) {
    return SIZE_PRESETS[cat];
  }

  // Categorías que no manejan talla (joyería, accesorios, etc.)
  return [];
}, [product]);


  const priceLabel = product
    ? `₡${Number(product.price).toLocaleString("es-CR")}`
    : "₡0";

  const handleBack = () => navigate(-1);

  const handleAddToCart = () => {
    if (!product) return;

    const size = selectedSize || (product.sizes?.[0] ?? null);

    const updated = cartService.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: getMainImage(product),
      size,
      quantity,
    });

    console.log("Cart updated:", updated);
  };

  const incrementQty = () => setQuantity((q) => Math.min(q + 1, stock || 1));
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // ===== SLIDER RECOMENDADOS =====
  const itemsPerSlide = 4;
  const totalSlides = Math.max(
    1,
    Math.ceil(relatedProducts.length / itemsPerSlide)
  );

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10">
        <p className="text-sm text-slate-500">Cargando producto…</p>
      </section>
    );
  }

  if (error || !product) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-10 space-y-4">
        <p className="text-sm text-red-600">
          {error ?? "Producto no encontrado."}
        </p>
        <Button variant="outline" onClick={handleBack}>
          Volver
        </Button>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* LAYOUT PRINCIPAL */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* COLLAGE DE IMÁGENES */}
        <>
          {/* Mobile: slider deslizable */}
          <div className="md:hidden">
            <div className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth">
              {images.slice(0, 4).map((src, idx) => (
                <div key={idx} className="min-w-full snap-center px-1">
                  <div className="aspect-[4/5] overflow-hidden rounded-xl bg-slate-100">
                    <img
                      src={src}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop / tablet: tu grid original */}
          <div className="hidden md:grid gap-4 md:grid-cols-2">
            {images.slice(0, 4).map((src, idx) => (
              <div
                key={idx}
                className="aspect-[4/5] overflow-hidden rounded-xl bg-slate-100"
              >
                <img
                  src={src}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </>

        {/* PANEL DERECHO */}
        <div className="space-y-6">
          {/* categoría y proveedor del productService */}
          <p className="text-xs text-slate-400">
            {product.category || "Collection"} · {product.provider || "Brand"}
          </p>

          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {product.name}
            </h1>
            <p className="text-lg font-medium text-slate-900">{priceLabel}</p>
            {/* descripción corta principal */}
            {product.description && (
              <p className="text-sm text-slate-600">{product.description}</p>
            )}
            {/* stock principal */}
            <p
              className={`text-xs font-medium ${
                stock > 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {stock > 0 ? `${stock} en stock` : "Agotado"}
            </p>
          </div>

          {/* Size (solo si hay tallas) */}
{sizes.length > 0 && (
  <div className="space-y-2">
    <p className="text-xs font-medium text-slate-700 uppercase tracking-[0.18em]">
      Talla
    </p>
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => setSelectedSize(s)}
          className={`h-9 w-9 text-xs flex items-center justify-center rounded-full border ${
            selectedSize === s
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-300 text-slate-700 hover:border-slate-900"
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  </div>
)}


          {/* Cantidad + botones */}
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center rounded-full border border-slate-300">
              <button
                type="button"
                onClick={decrementQty}
                className="h-9 w-9 flex items-center justify-center text-lg text-slate-700"
              >
                –
              </button>
              <span className="w-10 text-center text-sm font-medium">
                {quantity}
              </span>
              <button
                type="button"
                onClick={incrementQty}
                className="h-9 w-9 flex items-center justify-center text-lg text-slate-700"
              >
                +
              </button>
            </div>

            <Button
              disabled={stock === 0}
              className="flex-1 rounded-full py-2 text-sm font-medium"
              onClick={handleAddToCart}
            >
              {stock === 0 ? "Agotado" : "Añadir al carrito"}
            </Button>
          </div>

          {/* Service / benefits boxes */}
          <div className="grid gap-4 sm:grid-cols-3 mt-6">
            {/* Free Shipping */}
            <div className="flex flex-col items-center text-center gap-2 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
              <svg
                className="w-6 h-6 text-slate-800"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 7.5h11.25v9H3.75A1.5 1.5 0 0 1 2.25 15V7.5Zm11.25 0H18l3.75 3.75V15A1.5 1.5 0 0 1 20.25 16.5H18"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 18.75a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm10.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
                />
              </svg>

              <h4 className="text-sm font-semibold text-slate-900">
                Envío gratis
              </h4>

              <p className="text-xs text-slate-600">
                Envío estándar gratuito en todos los pedidos superiores a
                ₡50,000.
              </p>
            </div>

            {/* 30-day Guarantee */}
            <div className="flex flex-col items-center text-center gap-2 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
              <svg
                className="w-6 h-6 text-slate-800"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3.75 5.25 6v6.75A8.25 8.25 0 0 0 12 20.25a8.25 8.25 0 0 0 6.75-7.5V6L12 3.75Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9.75 12.75 1.5 1.5 3-3"
                />
              </svg>

              <h4 className="text-sm font-semibold text-slate-900">
                Garantía de 30 días
              </h4>

              <p className="text-xs text-slate-600">
                Devoluciones o cambios fáciles dentro de 30 días de la compra.
              </p>
            </div>

            {/* Personalised support */}
            <div className="flex flex-col items-center text-center gap-2 p-6 border border-slate-200 rounded-xl bg-white shadow-sm">
              <svg
                className="w-6 h-6 text-slate-800"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12a7.5 7.5 0 0 1 15 0v4.125A3.375 3.375 0 0 1 16.125 19.5h-1.5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7.125 19.5h-1.5A3.375 3.375 0 0 1 2.25 16.125V12m4.875 7.5h6"
                />
              </svg>

              <h4 className="text-sm font-semibold text-slate-900">
                Apoyo personalizado
              </h4>

              <p className="text-xs text-slate-600">
                Nuestro equipo está aquí para ayudarte a encontrar el ajuste y
                estilo perfecto.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================== YOU MAY ALSO LIKE (SLIDER) ================== */}
      {relatedProducts.length > 0 && (
        <div className="mt-6 pt-6 border-t border-slate-200">
          <h2 className="text-lg md:text-xl font-semibold tracking-tight mb-4">
            También te puede gustar
          </h2>

          <div className="relative">
            {/* MOBILE: slider deslizable por scroll */}
            <div className="md:hidden">
              <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1">
                {relatedProducts.map((p) => (
                  <article
                    key={p.id}
                    role="button"
                    onClick={() => handleRelatedClick(p.id)}
                    className="snap-center min-w-[70%] cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                  >
                    <div className="aspect-[3/4] bg-slate-100">
                      <img
                        src={getMainImage(p)}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3 space-y-1">
                      <h3 className="text-sm font-medium text-slate-900 line-clamp-1">
                        {p.name}
                      </h3>
                      <p className="text-xs text-slate-500">{p.provider}</p>
                      <p className="text-sm text-slate-700">
                        £{Number(p.price).toFixed(2)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* DESKTOP / TABLET: slider por páginas como ya lo tenías */}
            <div className="hidden md:block">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500"
                  style={{ transform: `translateX(-${activeSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => {
                    const start = slideIndex * itemsPerSlide;
                    const end = start + itemsPerSlide;
                    const slice = relatedProducts.slice(start, end);

                    return (
                      <div
                        key={slideIndex}
                        className="grid shrink-0 w-full grid-cols-2 md:grid-cols-4 gap-6"
                      >
                        {slice.map((p) => (
                          <article
                            key={p.id}
                            role="button"
                            onClick={() => handleRelatedClick(p.id)}
                            className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                          >
                            <div className="aspect-[3/4] bg-slate-100">
                              <img
                                src={getMainImage(p)}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="p-3 space-y-1">
                              <h3 className="text-sm font-medium text-slate-900 line-clamp-1">
                                {p.name}
                              </h3>
                              <p className="text-xs text-slate-500">
                                {p.provider}
                              </p>
                              <p className="text-sm text-slate-700">
                                ₡{Number(p.price).toFixed(2)}
                              </p>
                            </div>
                          </article>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToSlide(index)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeSlide === index
                        ? "w-4 bg-slate-800"
                        : "w-2 bg-slate-400"
                    }`}
                    aria-label={`Ir al slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <ProductDetailAddedDialog />
    </section>
  );
}

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import productService from "@/modules/store/services/productService";
import { Link } from "react-router-dom";
import cartService from "@/modules/store/services/cartService";
import CartAddedDialog from "@/components/CartAddedDialog";

export default function Home() {
  const collections = [
    { name: "Viernes Negro", image: "/images/placeholder.png" },
    {
      name: "Una nueva perspectiva",
      image: "/images/placeholder.png",
    },
    { name: "Mujeres", image: "/images/placeholder.png" },
  ];

  // 🔽 antes era una constante, ahora viene del servicio
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [heroVisible, setHeroVisible] = useState(false);
  const [activeCollection, setActiveCollection] = useState(0);
  const [addedToBag] = useState(false);

  const featuredSectionRef = useRef(null);

  // cargar productos destacados
  useEffect(() => {
    let cancelled = false;

    const loadFeatured = async () => {
      try {
        const data = await productService.listFeatured(8);
        if (!cancelled) {
          setFeaturedProducts(data);
        }
      } catch (err) {
        console.error("Error cargando productos destacados:", err);
      }
    };

    loadFeatured();

    return () => {
      cancelled = true;
    };
  }, []);

  // animación hero
  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleHeroClick = () => {
    if (featuredSectionRef.current) {
      featuredSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAddToBag = (p) => {
    cartService.addItem({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image,
      quantity: 1,
      color: null,
      size: null,
    });
  };

  const formatPrice = (price) => `₡${Number(price).toLocaleString("es-CR")}`;

  return (
    <div className="bg-white text-slate-900">
      {/* HERO */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center text-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/placeholder.png')",
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
            <p className="uppercase tracking-[0.2em] text-sm text-slate-100/80 ">
              Nueva colección
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold text-white leading-tight">
              Impacto máximo
            </h1>
            <p className="text-slate-100/90">
              Compra nuestra colección seleccionada de estilos, bellamente
              elaborada en tonos neutros de temporada.
            </p>
            <Button
              onClick={handleHeroClick}
              className="mt-4 inline-flex rounded-full px-6 py-2 text-sm font-medium"
            >
              Ver los estilos
            </Button>
          </div>
        </div>
      </section>

      {/* OUR COLLECTIONS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold tracking-tight">
            Nuestras Colecciones
          </h2>
          <button className="text-sm text-slate-500 hover:text-slate-800 transition">
            Ver todas
          </button>
        </div>

        {/* En mobile: carrusel (1 card); en md+: las 3 */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
          {collections.map((c, index) => (
            <article
              key={c.name}
              className={`
                relative h-72 overflow-hidden rounded-lg group shadow-sm
                transition-transform duration-500 ease-out
                hover:-translate-y-1 hover:shadow-lg
                ${index === activeCollection ? "block" : "hidden sm:block"}
              `}
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

        {/* puntitos tipo slider (solo mobile) */}
        <div className="mt-4 flex justify-center gap-2 sm:hidden">
          {collections.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCollection(index)}
              className={`
                h-1.5 rounded-full transition-all
                ${
                  index === activeCollection
                    ? "w-4 bg-brand-dark"
                    : "w-1.5 bg-brand-light"
                }
              `}
              aria-label={`Ir a colección ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section
        ref={featuredSectionRef}
        className="max-w-7xl mx-auto px-4 pb-16"
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Productos destacados
            </h2>
            <p className="text-sm text-slate-500">
              Piezas cuidadosamente seleccionadas para esta temporada.
            </p>
          </div>
          <button className="text-sm text-brand-dark underline underline-offset-4 hover:text-brand transition">
            Ir a la tienda completa
          </button>
        </div>

        <div className="grid gap-6 grid-cols-2 md:grid-cols-4">
          {featuredProducts.map((p) => (
            <article
              key={p.id}
              className="rounded-lg border bg-white overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <Link to={`/products/${p.id}`}>
                <div
                  className="h-40 md:h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url('${p.image}')` }}
                />
              </Link>
              <div className="p-4 space-y-2">
                <Link to={`/products/${p.id}`}>
                  <h3 className="text-sm font-medium tracking-tight line-clamp-1 hover:underline">
                    {p.name}
                  </h3>
                </Link>
                <p className="text-sm text-slate-500">{formatPrice(p.price)}</p>
                <Button
                  onClick={() => handleAddToBag(p)}
                  className="mt-2 w-full rounded-full py-2 text-xs"
                >
                  Añadir a bolsa
                </Button>
              </div>
            </article>
          ))}
        </div>

        {addedToBag && (
          <p className="mt-3 text-xs text-emerald-600">
            Producto añadido a tu bolsa ✓
          </p>
        )}
      </section>

      {/* ABOUT US + OUR MISSION */}
      <section className="max-w-7xl mx-auto px-4 pb-16 grid md:grid-cols-2 gap-10 items-start">
        {/* About us */}
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
            Sobre nosotros
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">
            La historia de Bellas Boutique
          </h2>
          <p className="text-sm text-slate-600">
            Bellas Boutique nace con la idea de ofrecer una experiencia de moda
            cálida, cercana y accesible, reuniendo en un solo lugar ropa,
            calzado y accesorios que realzan el estilo personal de cada cliente.
          </p>
          <p className="text-sm text-slate-600">
            Cuidamos cada detalle: desde la selección de las prendas hasta la
            forma en que las presentaremos en nuestra tienda en línea, para que
            puedas combinar, crear outfits y sentirte segura al comprar desde
            cualquier lugar.
          </p>
          <button className="text-sm underline underline-offset-4 text-brand-dark hover:text-brand transition">
            Más información sobre Bellas Boutique
          </button>
        </div>

        {/* Our mission */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm bg-brand-dark text-white p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300 mb-2">
            Nuestra misión
          </p>
          <h3 className="text-xl font-semibold mb-3">
            Hacer que cada persona se sienta bella, cómoda y segura al vestir.
          </h3>
          <p className="text-sm text-slate-100/90 mb-4">
            Creamos una experiencia de compra moderna y confiable, combinando
            moda, tecnología y un servicio cercano. Nuestro objetivo es que tu
            proceso de elegir, comprar y recibir tus prendas sea tan agradable
            como usarlas.
          </p>
          <p className="text-xs text-slate-300">
            Moda con intención. Compras seguras. Estilo para el día a día.
          </p>
        </div>
      </section>

      {/* CTA FINAL / LOOKBOOK */}
      <section className="relative h-[60vh] min-h-[400px] mt-8 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage: "url('/images/placeholder.png')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative h-full max-w-6xl mx-auto px-4 flex items-center">
          <div className="max-w-md space-y-3 text-white">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-100/80">
              Novedades
            </p>
            <h2 className="text-3xl font-semibold">
              Nuestro lookbook de verano
            </h2>
            <p className="text-sm text-slate-100/90">
              Descubre las piezas diseñadas juntas para los días que se
              convierten en noches.
            </p>
            <Button className="inline-flex rounded-full px-6 py-2 text-sm font-medium">
              Ver la colección
            </Button>
          </div>
        </div>
      </section>

      <CartAddedDialog />
    </div>
  );
}

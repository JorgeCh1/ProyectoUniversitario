export default function Home() {
  const categories = [
    'Electrónica',
    'Moda',
    'Hogar',
    'Deportes',
  ];
  const products = Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Producto ${i + 1}`,
    price: (i + 1) * 9.99,
  }));

  return (
    <div className="">
      {/* Hero */}
      <section className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                Tu ecommerce demo, listo para crecer
              </h1>
              <p className="mt-4 text-slate-600">
                Explora categorías, descubre productos y simula un checkout sencillo.
              </p>
              <div className="mt-6 flex gap-2">
                <input
                  className="flex-1 rounded-md border border-slate-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Buscar productos..."
                />
                <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                  Buscar
                </button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="h-56 md:h-64 w-full rounded-xl bg-gradient-to-br from-indigo-200 via-sky-200 to-emerald-200 border shadow-inner" />
            </div>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold text-slate-900">Categorías</h2>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c} className="rounded-lg border bg-white p-4 hover:shadow-sm transition">
              <div className="h-24 rounded-md bg-slate-100 mb-3" />
              <div className="font-medium text-slate-800">{c}</div>
              <p className="text-sm text-slate-500">Explora {c.toLowerCase()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Productos destacados */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-slate-900">Destacados</h2>
          <button className="text-sm text-indigo-700 hover:text-indigo-800">Ver todos</button>
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.id} className="rounded-lg border bg-white overflow-hidden hover:shadow-sm transition">
              <div className="h-40 bg-slate-100" />
              <div className="p-4">
                <div className="font-medium text-slate-800">{p.name}</div>
                <div className="text-slate-600">${p.price.toFixed(2)}</div>
                <button className="mt-3 w-full rounded-md bg-slate-900 text-white py-2 text-sm hover:bg-slate-800">
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">¿Listo para probar el flujo de compra?</h3>
            <p className="text-slate-300">Simula un checkout con productos de ejemplo.</p>
          </div>
          <button className="rounded-md bg-indigo-600 px-4 py-2 hover:bg-indigo-700">Ir al checkout</button>
        </div>
      </section>
    </div>
  );
}
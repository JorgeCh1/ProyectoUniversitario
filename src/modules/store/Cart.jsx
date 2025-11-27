// src/modules/store/Cart.jsx
import { useEffect, useMemo, useState } from "react";
import cartService from "@/modules/store/services/cartService";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ userId: "guest", createdAt: "" });

  useEffect(() => {
    setItems(cartService.getCart());
    setMeta(cartService.getCartMeta());
  }, []);

  const createdAtLabel = meta.createdAt
    ? new Date(meta.createdAt).toLocaleString()
    : "";

  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0
      ),
    [items]
  );

  const formatPrice = (price) => `₡${Number(price).toLocaleString("es-CR")}`;

  const handleQtyChange = (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);
    const updated = cartService.updateQuantity(
      item.id,
      { color: item.color || null, size: item.size || null },
      newQty
    );
    setItems(updated);
  };

  const handleRemove = (item) => {
    const updated = cartService.removeItem(item.id, {
      color: item.color || null,
      size: item.size || null,
    });
    setItems(updated);
  };

  const handleClear = () => {
    const updated = cartService.clearCart();
    setItems(updated);
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-center text-2xl md:text-3xl font-semibold tracking-tight mb-8">
        Carrito de compras
      </h1>

      <p className="text-center text-[11px] text-slate-500 mb-6">
        Carrito para usuario: <span className="font-medium">{meta.userId}</span>{" "}
        · Creado en: {createdAtLabel}
      </p>

      {items.length === 0 ? (
        <p className="text-center text-sm text-slate-500">
          Tu carrito está vacío.
        </p>
      ) : (
        <>
          {/* CABECERA */}
          <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] text-xs text-slate-500 border-b border-slate-200 pb-2 mb-4">
            <span>Producto</span>
            <span className="text-right">Precio</span>
            <span className="text-center">Cantidad</span>
            <span className="text-right">Total</span>
          </div>

          {/* FILAS */}
          <div className="space-y-4 border-b border-slate-200 pb-6">
            {items.map((item) => (
              <div
                key={`${item.id}-${item.color || ""}-${item.size || ""}`}
                className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-4 text-sm"
              >
                {/* PRODUCTO */}
                <div className="flex items-center gap-3 col-span-4 md:col-span-1">
                  <div className="h-16 w-16 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={item.image || "/images/placeholder.png"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.color && <span>{item.color}</span>}
                      {item.color && item.size && <span> · </span>}
                      {item.size && <span>Size {item.size}</span>}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleRemove(item)}
                      className="mt-1 text-xs text-slate-400 underline hover:text-slate-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* PRICE */}
                <div className="col-span-2 md:col-span-1 md:text-right text-xs text-slate-700">
                  <span className="md:hidden mr-1 font-medium">Precio:</span>
                  {formatPrice(item.price)}
                </div>

                {/* QUANTITY */}
                <div className="col-span-2 md:col-span-1 flex justify-start md:justify-center">
                  <div className="inline-flex items-center rounded-full border border-slate-300">
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item, -1)}
                      className="h-7 w-7 flex items-center justify-center text-lg text-slate-700"
                    >
                      –
                    </button>
                    <span className="w-9 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQtyChange(item, +1)}
                      className="h-7 w-7 flex items-center justify-center text-lg text-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* TOTAL */}
                <div className="col-span-4 md:col-span-1 md:text-right text-xs md:text-sm text-slate-900">
                  <span className="md:hidden mr-1 font-medium">Total:</span>
                  {formatPrice(Number(item.price) * Number(item.quantity))}
                </div>
              </div>
            ))}
          </div>

          {/* UPDATE / CONTINUE */}
          <div className="flex justify-between items-center text-xs text-slate-500 py-4">
            <button
              type="button"
              onClick={handleClear}
              className="underline hover:text-slate-800"
            >
              Limpiar carrito
            </button>
            <p>
              <span className="underline cursor-pointer">
                Actualizar carrito
              </span>{" "}
              |{" "}
              <span className="underline cursor-pointer">Seguir comprando</span>
            </p>
          </div>

          {/* SUBTOTAL */}
          <div className="flex justify-between items-center border-t border-slate-200 pt-4 mb-6">
            <span className="text-sm font-medium">Subtotal</span>
            <span className="text-sm font-medium">{formatPrice(subtotal)}</span>
          </div>

          {/* NOTA */}
          <div className="mb-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-center text-slate-500 mb-2">
              Añade una nota a tu pedido
            </p>
            <textarea
              className="w-full border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
              rows={3}
              placeholder="Ingresa una nota"
            />
          </div>

          {/* INFO TAX + CHECKOUT */}
          <p className="text-[11px] text-center text-slate-500 mb-3">
            Impuestos incluidos y envío calculado en el checkout.
          </p>

          <div className="flex justify-center">
            <Button className="rounded-full px-10 py-2 text-sm bg-[#d3a8ff] hover:bg-[#c995ff] text-white">
              Pagar
            </Button>
          </div>
        </>
      )}
    </section>
  );
}

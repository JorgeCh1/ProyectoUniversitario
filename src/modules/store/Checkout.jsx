// Página de checkout y finalización de compra
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "@/modules/store/services/cartService";
import { Button } from "@/components/ui/button";
import productService from "@/modules/store/services/productService";
import salesService from "@/modules/admin/services/SalesService";

export default function Checkout() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ userId: "guest", createdAt: "" });
  const [currentUser, setCurrentUser] = useState(null);

  // datos del formulario de envío
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");

  // método de pago y estado
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | sinpe | transfer
  const [paymentStatus, setPaymentStatus] = useState("PENDING"); // PENDING | SUCCESS | FAILED

  const [submitted, setSubmitted] = useState(false);

  // CAMPOS DE TARJETA (SIMULADO)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // FACTURA GENERADA (para mostrar resumen al usuario)
  const [lastInvoice, setLastInvoice] = useState(null);

  useEffect(() => {
    // Cargar carrito y pre-llenar con datos del usuario
    setItems(cartService.getCart());
    setMeta(cartService.getCartMeta());
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      setCurrentUser(user);
      if (user) {
        setName(user.nombre || "");
        setEmail(user.email || "");
        setPhone(user.telefono || "");
        setAddress(user.direccion || "");
      }
    } catch (_) {
      // ignorar errores de parseo
      setCurrentUser(null);
    }
    // Escuchar cambios de autenticación para actualizar formulario
    function onAuthChanged(e) {
      try {
        const user =
          e && e.detail
            ? e.detail.user
            : JSON.parse(localStorage.getItem("currentUser") || "null");
        setCurrentUser(user);
        if (user) {
          setName(user.nombre || "");
          setEmail(user.email || "");
          setPhone(user.telefono || "");
          setAddress(user.direccion || "");
        }
      } catch (_) {
        // ignorar errores
        setCurrentUser(null);
      }
    }

    window.addEventListener("auth:changed", onAuthChanged);
    return () => window.removeEventListener("auth:changed", onAuthChanged);
  }, []);

  // totales de la factura
  const subtotal = useMemo(
    () =>
      items.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.quantity),
        0
      ),
    [items]
  );

  const tax = subtotal * 0.13;
  const total = subtotal + tax;

  const formatPrice = (price) => `₡${Number(price).toLocaleString("es-CR")}`;

  const cardHasErrors =
    paymentMethod === "card" &&
    (!cardNumber.trim() ||
      !cardName.trim() ||
      !cardExpiry.trim() ||
      !cardCvc.trim());

  const hasErrors =
    !name.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !country ||
    !address.trim() ||
    cardHasErrors;

  const getPaymentMethodLabel = (method) => {
    if (method === "card") return "Tarjeta de crédito / débito";
    if (method === "sinpe") return "SINPE Móvil";
    if (method === "transfer") return "Transferencia bancaria";
    return method;
  };

  const handleConfirmPayment = async () => {
    setSubmitted(true);
    if (hasErrors || items.length === 0) return;

    // Simulación lado cliente – aquí NO hay pago real
    const now = new Date();
    const payment = {
      method: paymentMethod, // "card" | "sinpe" | "transfer"
      status: "SUCCESS", // en backend se validaría de verdad
      paidAt: now.toISOString(),
      amount: total,
      // Solo para demo, guardamos los campos de tarjeta (en real NO se guardarían así)
      cardInfo:
        paymentMethod === "card"
          ? {
              cardNumber,
              cardName,
              cardExpiry,
              cardCvc,
            }
          : null,
    };

    // Factura digital generada en el cliente (luego se enviaría al backend)
    const invoice = {
      invoiceNumber: `BB-${now.getTime()}`, // identificador simple
      userId: meta.userId,
      cartCreatedAt: meta.createdAt,
      subtotal,
      tax,
      taxRate: 0.13,
      total,
      createdAt: now.toISOString(),
      products: items.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: Number(item.price),
      })),
      payment, // lo asociamos directamente
      shippingInfo: {
        name,
        email,
        phone,
        country,
        address,
        note,
      },
    };

    console.log("Invoice generated (client-side):", invoice);

    // Guardamos la factura en estado para mostrar el resumen
    setLastInvoice(invoice);
    setPaymentStatus("SUCCESS");

    // 1) Guardar venta para el panel admin
    try {
      salesService.addFromInvoice(invoice);
    } catch (e) {
      console.error("Error guardando venta:", e);
    }

    // 2) Actualizar stock de productos
    (async () => {
      try {
        const allProducts = await productService.list();
        const updatedProducts = allProducts.map((p) => {
          const line = invoice.products.find(
            (it) => String(it.productId) === String(p.id)
          );
          if (!line) return p;

          const currentStock = Number(p.stock || 0);
          const qty = Number(line.quantity || 0);

          return {
            ...p,
            stock: Math.max(0, currentStock - qty),
          };
        });

        await productService.saveAll(updatedProducts);
      } catch (e) {
        console.error("Error actualizando stock:", e);
      }
    })();

    // Simulación: después de 1.5s redirige a home
    setTimeout(() => {
      cartService.clearCart();
      navigate("/");
    }, 10000);
  };

  const createdAtLabel = meta.createdAt
    ? new Date(meta.createdAt).toLocaleString()
    : "";

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {paymentStatus === "SUCCESS" ? (
        <div className="space-y-5 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-semibold text-brand-dark">
              ¡Gracias por tu compra!
            </h1>
            <p className="text-slate-600">
              Tu pedido ha sido confirmado exitosamente.
            </p>
            {lastInvoice?.shippingInfo?.email && (
              <p className="text-sm text-slate-500">
                Hemos enviado el resumen de tu compra al correo{" "}
                <strong>{lastInvoice.shippingInfo.email}</strong> (simulado).
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2">
              Serás redirigido a la página principal en breve...
            </p>
          </div>

          {/* RESUMEN DE LA COMPRA */}
          {lastInvoice && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
                    Resumen de la compra
                  </p>
                  <p className="text-sm text-slate-700">
                    Factura:{" "}
                    <span className="font-semibold">
                      {lastInvoice.invoiceNumber}
                    </span>
                  </p>
                </div>
                <div className="text-sm text-slate-600 md:text-right">
                  <p>
                    Monto total:{" "}
                    <span className="font-semibold">
                      {formatPrice(lastInvoice.total)}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Método de pago:{" "}
                    {getPaymentMethodLabel(lastInvoice.payment.method)}
                  </p>
                </div>
              </div>

              {/* Productos */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Productos incluidos
                </p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-slate-50">
                      <tr className="text-left text-slate-500">
                        <th className="px-3 py-2 font-medium">Producto</th>
                        <th className="px-3 py-2 font-medium text-right">
                          Cantidad
                        </th>
                        <th className="px-3 py-2 font-medium text-right">
                          Precio unitario
                        </th>
                        <th className="px-3 py-2 font-medium text-right">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {lastInvoice.products.map((prod, idx) => (
                        <tr
                          key={`${prod.productId}-${idx}`}
                          className="border-t border-slate-100"
                        >
                          <td className="px-3 py-2 text-slate-700">
                            {prod.name}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {prod.quantity}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatPrice(prod.unitPrice)}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {formatPrice(prod.unitPrice * prod.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className="space-y-1 text-sm text-slate-700 max-w-xs ml-auto">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(lastInvoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Impuesto ({lastInvoice.taxRate * 100}%)</span>
                  <span>{formatPrice(lastInvoice.tax)}</span>
                </div>
                <div className="border-t border-slate-200 my-1" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(lastInvoice.total)}</span>
                </div>
              </div>

              {/* Datos de envío */}
              <div className="pt-3 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Datos de envío
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Nombre:</strong> {lastInvoice.shippingInfo.name}
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Teléfono:</strong> {lastInvoice.shippingInfo.phone}
                </p>
                <p className="text-xs text-slate-600">
                  <strong>País:</strong>{" "}
                  {lastInvoice.shippingInfo.country.toUpperCase()}
                </p>
                <p className="text-xs text-slate-600">
                  <strong>Dirección:</strong> {lastInvoice.shippingInfo.address}
                </p>
                {lastInvoice.shippingInfo.note && (
                  <p className="text-xs text-slate-500 mt-1">
                    <strong>Nota del pedido:</strong>{" "}
                    {lastInvoice.shippingInfo.note}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* TÍTULO */}
          <h1 className="text-center text-2xl md:text-3xl font-semibold tracking-tight mb-1">
            <span className="text-slate-400">Carrito de compras</span>{" "}
            <span className="text-slate-400">›</span>{" "}
            <span className="text-slate-900">Dirección y Pago</span>
          </h1>
          {currentUser && (
            <p className="text-center text-sm text-brand-dark font-medium mb-2">
              Bienvenido, {currentUser.nombre}
            </p>
          )}
          <p className="text-center text-[11px] text-slate-500 mb-8">
            Carrito para usuario:{" "}
            <span className="font-medium">{meta.userId}</span> · Creado en:{" "}
            {createdAtLabel}
          </p>
          <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            {/* FORM ENVÍO + MÉTODO DE PAGO */}
            <div className="space-y-6 md:pr-6 md:border-r md:border-slate-200">
              <div>
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Información de envío
                </h2>

                {/* Name */}
                <div className="space-y-1 mb-3">
                  <label className="text-xs font-medium text-slate-700">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                    placeholder="Ingresa tu nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  {submitted && !name.trim() && (
                    <p className="text-[11px] text-red-500">
                      El nombre es requerido.
                    </p>
                  )}
                </div>

                {/* Email + Phone */}
                <div className="grid gap-4 md:grid-cols-2 mb-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                      placeholder="Ingresa tu correo"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {submitted && !email.trim() && (
                      <p className="text-[11px] text-red-500">
                        El correo es requerido.
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-700">
                      Número de teléfono *
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                      placeholder="Ingresa tu número de teléfono"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {submitted && !phone.trim() && (
                      <p className="text-[11px] text-red-500">
                        El teléfono es requerido.
                      </p>
                    )}
                  </div>
                </div>

                {/* Country */}
                <div className="space-y-1 mb-3">
                  <label className="text-xs font-medium text-slate-700">
                    País *
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-300"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option value="">Selecciona País</option>
                    <option value="cr">Costa Rica</option>
                    <option value="us">Estados Unidos</option>
                    <option value="uk">Reino Unido</option>
                    <option value="other">Otro</option>
                  </select>
                  {submitted && !country && (
                    <p className="text-[11px] text-red-500">
                      El país es requerido.
                    </p>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-1 mb-3">
                  <label className="text-xs font-medium text-slate-700">
                    Tu dirección *
                  </label>
                  <textarea
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                    rows={3}
                    placeholder="Ingresa la dirección completa"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  {submitted && !address.trim() && (
                    <p className="text-[11px] text-red-500">
                      La dirección es requerida.
                    </p>
                  )}
                </div>

                {/* Note opcional */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-700">
                    Nota (opcional)
                  </label>
                  <textarea
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                    rows={2}
                    placeholder="Añade una nota para tu pedido"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              {/* MÉTODO DE PAGO */}
              <div className="pt-4 border-t border-slate-200">
                <h2 className="text-sm font-semibold text-slate-900 mb-2">
                  Método de pago
                </h2>

                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={() => setPaymentMethod("card")}
                    />
                    <span>Tarjeta de crédito / débito</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="sinpe"
                      checked={paymentMethod === "sinpe"}
                      onChange={() => setPaymentMethod("sinpe")}
                    />
                    <span>SINPE</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="transfer"
                      checked={paymentMethod === "transfer"}
                      onChange={() => setPaymentMethod("transfer")}
                    />
                    <span>Transferencia bancaria</span>
                  </label>
                </div>

                {/* CAMPOS DE TARJETA (SOLO SI TARJETA) */}
                {paymentMethod === "card" && (
                  <div className="mt-4 border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
                    <p className="text-xs font-semibold text-slate-700 uppercase tracking-[0.16em]">
                      Detalles de la tarjeta (simulado)
                    </p>

                    {/* Número de tarjeta */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">
                        Número de tarjeta *
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={19}
                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                        placeholder="4242 4242 4242 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                      {submitted && !cardNumber.trim() && (
                        <p className="text-[11px] text-red-500">
                          El número de tarjeta es requerido.
                        </p>
                      )}
                    </div>

                    {/* Nombre en la tarjeta */}
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-slate-700">
                        Nombre en la tarjeta *
                      </label>
                      <input
                        type="text"
                        className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                        placeholder="Bellas Boutique Test"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                      />
                      {submitted && !cardName.trim() && (
                        <p className="text-[11px] text-red-500">
                          El nombre en la tarjeta es requerido.
                        </p>
                      )}
                    </div>

                    {/* Fecha de vencimiento + CVC */}
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">
                          Fecha de vencimiento (MM/AA) *
                        </label>
                        <input
                          type="text"
                          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                          placeholder="12/28"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                        />
                        {submitted && !cardExpiry.trim() && (
                          <p className="text-[11px] text-red-500">
                            La fecha de vencimiento es requerida.
                          </p>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">
                          CVC *
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                        />
                        {submitted && !cardCvc.trim() && (
                          <p className="text-[11px] text-red-500">
                            El CVC es requerido.
                          </p>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-1">
                      Este formulario es solo de demostración. No se realiza
                      ningún cobro real.
                    </p>
                  </div>
                )}

                {submitted && items.length === 0 && (
                  <p className="mt-2 text-[11px] text-red-500">
                    Tu carrito está vacío.
                  </p>
                )}

                <Button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="mt-4 rounded-full px-6 py-2 text-sm bg-[#d3a8ff] hover:bg-[#c995ff] text-white"
                >
                  Confirmar pago
                </Button>

                {paymentStatus === "SUCCESS" && (
                  <p className="mt-2 text-[11px] text-emerald-600">
                    Pago registrado como EXITOSO (simulación del lado del
                    cliente).
                  </p>
                )}
              </div>
            </div>

            {/* RESUMEN DE FACTURA */}
            <aside className="space-y-4">
              <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-[0.18em]">
                Resumen de factura
              </h2>

              <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Impuesto (13%)</span>
                  <span className="text-slate-900">{formatPrice(tax)}</span>
                </div>

                <hr className="my-2 border-slate-200" />

                <div className="flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Información temporal según método de pago seleccionado */}
              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {paymentMethod === "card" && (
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">
                      Tarjeta de crédito / débito (Demo)
                    </p>
                    <p>Ejemplo de datos de prueba:</p>
                    <ul className="mt-2 text-xs space-y-1">
                      <li>
                        • Número de tarjeta:{" "}
                        <strong>4242 4242 4242 4242</strong>
                      </li>
                      <li>
                        • Vencimiento: <strong>12 / 28</strong>
                      </li>
                      <li>
                        • CVC: <strong>123</strong>
                      </li>
                      <li>
                        • Nombre: <strong>Bellas Boutique Test</strong>
                      </li>
                    </ul>
                  </div>
                )}

                {paymentMethod === "sinpe" && (
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">
                      SINPE Móvil
                    </p>
                    <p>Envía el pago al siguiente número:</p>
                    <ul la className="mt-2 text-xs space-y-1">
                      <li>
                        • Número: <strong>+506 8888-1234</strong>
                      </li>
                      <li>
                        • Nombre: <strong>Bellas Boutique CR</strong>
                      </li>
                      <li>
                        • Banco: <strong>BAC Credomatic</strong>
                      </li>
                    </ul>
                  </div>
                )}

                {paymentMethod === "transfer" && (
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">
                      Transferencia bancaria
                    </p>
                    <p>Realiza la transferencia a:</p>
                    <ul className="mt-2 text-xs space-y-1">
                      <li>
                        • Banco: <strong>Banco Nacional</strong>
                      </li>
                      <li>
                        • Número de cuenta:{" "}
                        <strong>CR05 0150 0200 0001 2345 67</strong>
                      </li>
                      <li>
                        • Titular de la cuenta:{" "}
                        <strong>Bellas Boutique S.A.</strong>
                      </li>
                      <li>
                        • Referencia: <strong>Orden #{Date.now()}</strong>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </>
      )}
    </section>
  );
}

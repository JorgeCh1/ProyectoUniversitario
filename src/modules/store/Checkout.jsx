// Página de checkout y finalización de compra
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "@/modules/store/services/cartService";
import { Button } from "@/components/ui/button";

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

  const hasErrors =
    !name.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !country ||
    !address.trim();

  const handleConfirmPayment = () => {
    setSubmitted(true);
    if (hasErrors || items.length === 0) return;

    // Simulación lado cliente – aquí NO hay pago real
    const now = new Date();
    const payment = {
      method: paymentMethod, // "card" | "sinpe" | "transfer"
      status: "SUCCESS", // en backend se validaría de verdad
      paidAt: now.toISOString(),
      amount: total,
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

    setPaymentStatus("SUCCESS");

    // Simulación: después de 1.5s redirige a home
    setTimeout(() => {
      cartService.clearCart();
      navigate("/");
    }, 1500);
  };

  const createdAtLabel = meta.createdAt
    ? new Date(meta.createdAt).toLocaleString()
    : "";

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {paymentStatus === "SUCCESS" ? (
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-semibold text-brand-dark">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-slate-600">
            Tu pedido ha sido confirmado exitosamente.
          </p>
          {currentUser && (
            <p className="text-sm text-slate-500">
              Confirmación enviada a: <strong>{email}</strong>
            </p>
          )}
          <p className="text-xs text-slate-400 mt-4">
            Serás redirigido a la página principal en breve...
          </p>
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
                    <p>Utiliza la siguiente información de demostración:</p>
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
                    <ul className="mt-2 text-xs space-y-1">
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

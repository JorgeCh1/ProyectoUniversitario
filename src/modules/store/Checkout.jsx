// src/modules/store/Checkout.jsx
import { useEffect, useMemo, useState } from "react";
import cartService from "@/modules/store/services/cartService";
import { Button } from "@/components/ui/button";

export default function Checkout() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ userId: "guest", createdAt: "" });

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
    setItems(cartService.getCart());
    setMeta(cartService.getCartMeta());
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

  const formatPrice = (price) => `₡${Number(price).toFixed(2)}`; // o £

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
  };

  const createdAtLabel = meta.createdAt
    ? new Date(meta.createdAt).toLocaleString()
    : "";

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      {/* TÍTULO */}
      <h1 className="text-center text-2xl md:text-3xl font-semibold tracking-tight mb-1">
        <span className="text-slate-400">Shopping cart</span>{" "}
        <span className="text-slate-400">›</span>{" "}
        <span className="text-slate-900">Address & Payment</span>
      </h1>
      <p className="text-center text-[11px] text-slate-500 mb-8">
        Cart for user: <span className="font-medium">{meta.userId}</span> ·
        Created at: {createdAtLabel}
      </p>

      <div className="grid gap-10 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* FORM ENVÍO + MÉTODO DE PAGO */}
        <div className="space-y-6 md:pr-6 md:border-r md:border-slate-200">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Shipping information
            </h2>

            {/* Name */}
            <div className="space-y-1 mb-3">
              <label className="text-xs font-medium text-slate-700">
                Name *
              </label>
              <input
                type="text"
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {submitted && !name.trim() && (
                <p className="text-[11px] text-red-500">Name is required.</p>
              )}
            </div>

            {/* Email + Phone */}
            <div className="grid gap-4 md:grid-cols-2 mb-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Email address *
                </label>
                <input
                  type="email"
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {submitted && !email.trim() && (
                  <p className="text-[11px] text-red-500">Email is required.</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-700">
                  Phone number *
                </label>
                <input
                  type="tel"
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                {submitted && !phone.trim() && (
                  <p className="text-[11px] text-red-500">Phone is required.</p>
                )}
              </div>
            </div>

            {/* Country */}
            <div className="space-y-1 mb-3">
              <label className="text-xs font-medium text-slate-700">
                Country *
              </label>
              <select
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-300"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="">Select Country</option>
                <option value="cr">Costa Rica</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="other">Other</option>
              </select>
              {submitted && !country && (
                <p className="text-[11px] text-red-500">Country is required.</p>
              )}
            </div>

            {/* Address */}
            <div className="space-y-1 mb-3">
              <label className="text-xs font-medium text-slate-700">
                Your address *
              </label>
              <textarea
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                rows={3}
                placeholder="Enter full address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {submitted && !address.trim() && (
                <p className="text-[11px] text-red-500">Address is required.</p>
              )}
            </div>

            {/* Note opcional */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700">
                Note (optional)
              </label>
              <textarea
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-slate-300"
                rows={2}
                placeholder="Add a note for your order"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>

          {/* MÉTODO DE PAGO */}
          <div className="pt-4 border-t border-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 mb-2">
              Payment method
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
                <span>Credit / Debit card</span>
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
                <span>Bank transfer</span>
              </label>
            </div>

            {submitted && items.length === 0 && (
              <p className="mt-2 text-[11px] text-red-500">
                Your cart is empty.
              </p>
            )}

            <Button
              type="button"
              onClick={handleConfirmPayment}
              className="mt-4 rounded-full px-6 py-2 text-sm bg-[#d3a8ff] hover:bg-[#c995ff] text-white"
            >
              Confirm payment
            </Button>

            {paymentStatus === "SUCCESS" && (
              <p className="mt-2 text-[11px] text-emerald-600">
                Payment registered as SUCCESS (client-side simulation).
              </p>
            )}
          </div>
        </div>

        {/* RESUMEN DE FACTURA */}
        <aside className="space-y-4">
          <h2 className="text-xs font-semibold text-slate-700 uppercase tracking-[0.18em]">
            Invoice summary
          </h2>

          <div className="border border-slate-200 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal</span>
              <span className="text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Tax (13%)</span>
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
                  Credit / Debit Card (Demo)
                </p>
                <p>Use the following demo information:</p>
                <ul className="mt-2 text-xs space-y-1">
                  <li>
                    • Card number: <strong>4242 4242 4242 4242</strong>
                  </li>
                  <li>
                    • Expiration: <strong>12 / 28</strong>
                  </li>
                  <li>
                    • CVC: <strong>123</strong>
                  </li>
                  <li>
                    • Name: <strong>Bellas Boutique Test</strong>
                  </li>
                </ul>
              </div>
            )}

            {paymentMethod === "sinpe" && (
              <div>
                <p className="font-semibold text-slate-900 mb-1">SINPE Móvil</p>
                <p>Send the payment to the following number:</p>
                <ul className="mt-2 text-xs space-y-1">
                  <li>
                    • Number: <strong>+506 8888-1234</strong>
                  </li>
                  <li>
                    • Name: <strong>Bellas Boutique CR</strong>
                  </li>
                  <li>
                    • Bank: <strong>BAC Credomatic</strong>
                  </li>
                </ul>
              </div>
            )}

            {paymentMethod === "transfer" && (
              <div>
                <p className="font-semibold text-slate-900 mb-1">
                  Bank Transfer
                </p>
                <p>Make the transfer to:</p>
                <ul className="mt-2 text-xs space-y-1">
                  <li>
                    • Bank: <strong>Banco Nacional</strong>
                  </li>
                  <li>
                    • Account Number:{" "}
                    <strong>CR05 0150 0200 0001 2345 67</strong>
                  </li>
                  <li>
                    • Account Holder: <strong>Bellas Boutique S.A.</strong>
                  </li>
                  <li>
                    • Reference: <strong>Order #{Date.now()}</strong>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

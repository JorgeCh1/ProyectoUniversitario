import React, { useState } from "react";

export default function SupportPage() {
  const faqs = [
    {
      id: 1,
      question: "¿Cómo puedo realizar una compra en Bellas Boutique?",
      answer:
        "Primero debes crear una cuenta o iniciar sesión. Luego puedes navegar el catálogo, añadir productos al carrito y seguir el flujo de checkout donde seleccionarás el método de pago (Tarjeta, SINPE o Transferencia).",
    },
    {
      id: 2,
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "En la simulación del sistema se admiten pagos por Tarjeta, SINPE y Transferencia. Cada pago queda registrado con su método, fecha y estado (Exitoso, Pendiente o Fallido).",
    },
    {
      id: 3,
      question: "¿Puedo ver mi historial de compras?",
      answer:
        "Sí. Desde tu cuenta puedes ver el historial de facturas y compras realizadas, con el detalle de productos, fechas y montos.",
    },
    {
      id: 4,
      question: "¿Dónde puedo reportar un problema con mi pedido?",
      answer:
        "Puedes utilizar el formulario de sugerencias y soporte en esta misma página para reportar errores, problemas con la compra o cualquier incidente relacionado con el sistema.",
    },
    {
      id: 5,
      question: "¿El chat en línea queda registrado?",
      answer:
        "Sí. Los mensajes se almacenan en la tabla de MensajesChat, lo que permite dar seguimiento a las conversaciones entre clientes y vendedores.",
    },
  ];

  const [openFaqId, setOpenFaqId] = useState(faqs[0]?.id || null);

  const [feedbackType, setFeedbackType] = useState("sugerencia");
  const [rating, setRating] = useState(0);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setSubmitted(false);
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación sencilla
    if (!formValues.subject.trim() || !formValues.message.trim()) {
      alert("Por favor completa al menos el asunto y el mensaje.");
      return;
    }

    // Aquí podrías enviar los datos a tu backend o guardarlos en una tabla de soporte
    console.log("Enviando feedback:", {
      ...formValues,
      feedbackType,
      rating,
    });

    setSubmitted(true);
    setFormValues({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setFeedbackType("sugerencia");
    setRating(0);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pt-10 pb-8">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 mb-2">
          Soporte y ayuda
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 mb-3">
          ¿Necesitas ayuda con Bellas Boutique?
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl">
          En esta sección encontrarás respuestas rápidas a preguntas frecuentes,
          un espacio para compartir sugerencias y un formulario para reportar
          problemas, dudas o comentarios sobre tu experiencia en la tienda.
        </p>
      </section>

      {/* GRID PRINCIPAL */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-start">
          {/* FAQS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
              Preguntas frecuentes (FAQ)
            </h2>
            <p className="text-sm text-slate-600 mb-4">
              Revisa estas preguntas antes de contactar al equipo. Es posible
              que la respuesta que buscas ya esté aquí.
            </p>

            <div className="divide-y divide-slate-200">
              {faqs.map((faq) => {
                const isOpen = openFaqId === faq.id;
                return (
                  <button
                    key={faq.id}
                    type="button"
                    onClick={() =>
                      setOpenFaqId((prev) => (prev === faq.id ? null : faq.id))
                    }
                    className="w-full text-left py-3 md:py-4 focus:outline-none"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm md:text-base font-medium text-slate-900">
                          {faq.question}
                        </p>
                        {isOpen && (
                          <p className="mt-2 text-xs md:text-sm text-slate-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-slate-500 text-xs">
                        {isOpen ? "–" : "+"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* PANEL DERECHO: CONTACTO RÁPIDO / INFO */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-slate-50 p-5 md:p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-2">
                Soporte al cliente
              </h3>
              <p className="text-sm text-slate-600 mb-3">
                Este proyecto incluye un módulo de soporte que permite a los
                usuarios enviar sugerencias, comentarios y reportar problemas.
                Toda esta información puede ser registrada en la base de datos
                para análisis y mejora continua.
              </p>
              <ul className="text-xs md:text-sm text-slate-600 space-y-1.5">
                <li>• Encuestas de satisfacción (puntaje 1 a 5).</li>
                <li>• Sugerencias y comentarios enviados al administrador.</li>
                <li>• Preguntas frecuentes de uso general del sistema.</li>
                <li>• Posible integración con chat en línea.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900 mb-1">
                Horario de atención (simulado)
              </h3>
              <p className="text-xs md:text-sm text-slate-600 mb-3">
                Lunes a sábado, de 9:00 a.m. a 6:00 p.m.
              </p>
              <p className="text-xs md:text-sm text-slate-600">
                Para efectos del proyecto, estos datos pueden ser ajustados o
                conectados a un módulo real de soporte en producción.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORMULARIO DE SUGERENCIAS / RETROALIMENTACIÓN */}
      <section className="border-t border-slate-200 bg-white/80">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-12">
          <div className="max-w-3xl">
            <h2 className="text-lg md:text-xl font-semibold text-slate-900 mb-2">
              Sugerencias, comentarios y retroalimentación
            </h2>
            <p className="text-sm md:text-base text-slate-600 mb-5">
              Cuéntanos cómo ha sido tu experiencia usando Bellas Boutique.
              Puedes reportar un problema, dejar una sugerencia o simplemente
              compartir una opinión para ayudarnos a mejorar el sistema.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-6 shadow-sm"
          >
            {/* Tipo de feedback */}
            <div className="flex flex-wrap gap-2">
              <label className="text-xs font-semibold text-slate-500 w-full">
                Tipo de mensaje
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: "sugerencia", label: "Sugerencia" },
                  { value: "comentario", label: "Comentario" },
                  { value: "problema", label: "Reporte de problema" },
                  { value: "felicitacion", label: "Felicitación" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFeedbackType(option.value)}
                    className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition-colors ${
                      feedbackType === option.value
                        ? "border-purple-500 bg-purple-50 text-purple-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1">
                ¿Cómo valorarías tu experiencia general? (1 a 5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`h-8 w-8 rounded-full border text-xs font-semibold flex items-center justify-center transition-colors ${
                      rating >= value
                        ? "bg-yellow-300 border-yellow-400 text-slate-900"
                        : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {value}
                  </button>
                ))}
                <span className="text-xs text-slate-500 ml-2">
                  Este campo es opcional.
                </span>
              </div>
            </div>

            {/* Nombre y correo */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="text-xs font-semibold text-slate-500 block mb-1"
                >
                  Nombre (opcional)
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  placeholder="Escribe tu nombre"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-slate-500 block mb-1"
                >
                  Correo electrónico (opcional)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                  placeholder="tucorreo@ejemplo.com"
                />
              </div>
            </div>

            {/* Asunto */}
            <div>
              <label
                htmlFor="subject"
                className="text-xs font-semibold text-slate-500 block mb-1"
              >
                Asunto <span className="text-red-500">*</span>
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                value={formValues.subject}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400"
                placeholder="Ejemplo: Problema al finalizar la compra"
                required
              />
            </div>

            {/* Mensaje */}
            <div>
              <label
                htmlFor="message"
                className="text-xs font-semibold text-slate-500 block mb-1"
              >
                Mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={formValues.message}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 resize-y"
                placeholder="Describe tu sugerencia, comentario o el problema que encontraste con el mayor detalle posible."
                required
              />
            </div>

            {/* Mensaje de éxito */}
            {submitted && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs md:text-sm text-emerald-800">
                ¡Gracias por tu mensaje! Tu retroalimentación ha sido registrada
                correctamente (simulado para efectos del proyecto).
              </div>
            )}

            {/* Botón */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
              >
                Enviar mensaje
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

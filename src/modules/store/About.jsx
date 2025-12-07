import React from "react";

export default function AboutPage() {
  const PROJECT_TITLE = "Sistema Web para la Gestión de Bellas Boutique";

  const team = [
    {
      id: 1,
      name: "Jorge Alberto Chávez Avilés",
      career: "Estudiante de Ingeniería En Sistemas de la Información",
      role: "Líder de Equipo y Gestión de Proyecto",
      description:
        "Coordina el trabajo del equipo, la organización de tareas y la entrega del proyecto.",
      image: "/images/team/integrante-1.jpg",
    },
    {
      id: 2,
      name: "Norman Josué Romero Meza",
      career: "Estudiante de Ingeniería En Sistemas de la Información",
      role: "Diseño UI/UX",
      description:
        "Responsable de la maqueta en Figma, definición de estilos y experiencia de usuario.",
      image: "/images/team/integrante-2.jpg",
    },
    {
      id: 3,
      name: "Daniel Cordero Coto",
      career: "Estudiante de Ingeniería Informática",
      role: "Desarrollo frontend",
      description:
        "Implementa las vistas en React y apoya en las pruebas y ajustes finales.",
      image: "/images/team/integrante-3.jpg",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* HERO / PROYECTO */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pt-10 pb-10">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500 mb-2">
          Equipo #1 · Proyecto del curso
        </p>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-900 mb-3">
          Sobre el proyecto de Bellas Boutique
        </h1>
        <p className="text-sm md:text-base text-slate-600 mb-3">
          Universidad Internacional de las Américas · Escuela de Ingeniería
          Informática
        </p>

        <div className="inline-flex flex-wrap items-center gap-2 text-[12px] md:text-sm text-slate-600 mb-6">
          <span className="inline-flex h-7 px-3 items-center justify-center rounded-full bg-purple-100 text-[11px] font-semibold text-purple-700">
            Curso: DISEÑO DE LA INTERACCIÓN HUMANO – COMPUTADORA
          </span>
          <span className="text-slate-400">·</span>
          <span>Docente: Luis Miguel Sequeira Cascante</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 md:p-7 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-2">
            {PROJECT_TITLE}
          </h2>
          <p className="text-sm md:text-base text-slate-600 leading-relaxed">
            Desarrollamos el frontend de un sistema web para{" "}
            <strong>Bellas Boutique</strong>, una tienda de moda, integrando el
            diseño en Figma con una aplicación funcional en React. El enfoque
            principal es aplicar principios de UI/UX, usabilidad y diseño
            centrado en el usuario para ofrecer una experiencia clara, moderna y
            agradable tanto para clientes como para administradores.
          </p>
        </div>
      </section>

      {/* MÓDULOS PRINCIPALES */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-10">
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
            Módulos principales del sistema
          </h2>
          <p className="text-sm md:text-base text-slate-600 mt-1">
            El sistema se organiza en dos grandes vistas: una para el cliente y
            otra para la administración de la tienda.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* Vista Cliente */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Vista de Cliente
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Login y registro de usuarios.</li>
              <li>• Catálogo de productos (ropa, zapatos y joyería).</li>
              <li>• Carrito de compras con subtotal e impuestos.</li>
              <li>• Simulación de pago con Tarjeta, SINPE o Transferencia.</li>
              <li>• Confirmación de compra y resumen de factura.</li>
            </ul>
          </div>

          {/* Vista Admin */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">
              Vista de Administración
            </h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Gestión de productos y stock.</li>
              <li>• Consulta de ventas y facturas generadas.</li>
              <li>• Monitoreo de métodos de pago y estados.</li>
              <li>• Visualización de información básica de usuarios.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* EQUIPO */}
      <section className="max-w-5xl mx-auto px-4 md:px-6 pb-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">
              Equipo de desarrollo
            </h2>
            <p className="text-sm md:text-base text-slate-600 mt-1">
              Somos tres estudiantes de Ingeniería Informática que unimos
              diseño, programación y organización para dar vida a Bellas
              Boutique en la web.
            </p>
          </div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
            Equipo #1 · UIA · 2025
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative h-24 w-24 rounded-full overflow-hidden border border-slate-200 bg-slate-100 mb-3">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {member.name}
                </h3>
                <p className="text-xs text-purple-700 font-medium mt-1">
                  {member.role}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {member.career}
                </p>
                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default function Footer() {
  return (
    <footer className="bg-brand-light text-slate-700 text-sm pt-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-10 pb-8">
        {/* LOGO + DESCRIPCIÓN + MONEDA */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <img
              src="/images/bellas-boutique-logo.png"
              alt="Logo de Bellas Boutique"
              className="h-20 w-auto"
            />
          </div>

          <p className="text-slate-600 leading-relaxed text-sm">
            Bellas Boutique es tu tienda en línea de ropa, calzado y accesorios,
            donde combinamos estilo, comodidad y tendencias modernas en un solo
            lugar. Compra con seguridad y recibe soporte personalizado en cada
            pedido.
          </p>

          {/* Moneda / país */}
          <p className="text-slate-700 text-xs">
            País: <span className="font-medium">Costa Rica</span> &nbsp;|&nbsp;
            Moneda: <span className="font-medium">CRC ₡</span>
          </p>
        </div>

        {/* NAVEGACIÓN / USEFUL LINKS */}
        <div>
          <h3 className="font-semibold text-brand-dark mb-4">
            Navegación / Useful links
          </h3>
          <ul className="space-y-2 text-slate-600">
            <li>
              <a href="/products" className="hover:text-brand-dark transition">
                Tienda
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-brand-dark transition">
                Acerca de nosotros
              </a>
            </li>
            <li>
              <a href="/contacto" className="hover:text-brand-dark transition">
                Contacto
              </a>
            </li>
            <li>
              <a href="/soporte" className="hover:text-brand-dark transition">
                Soporte
              </a>
            </li>
          </ul>
        </div>

        {/* INFORMACIÓN DE CONTACTO */}
        <div className="space-y-4">
          <h3 className="font-semibold text-brand-dark mb-2">
            Información de contacto
          </h3>
          <ul className="space-y-2 text-slate-600">
            <li>
              Teléfono: <span className="font-medium">+506 2222-2222</span>
            </li>
            <li>
              Correo:{" "}
              <a
                href="mailto:contacto@bellasboutique.com"
                className="hover:text-brand-dark transition font-medium"
              >
                contacto@bellasboutique.com
              </a>
            </li>
            <li>Dirección: San José, Costa Rica</li>
          </ul>

          {/* Social icons (opcional) 
          <div className="flex gap-4 text-xl text-slate-700 pt-2">
            <span className="cursor-pointer hover:text-brand-dark transition">
              📘
            </span>
            <span className="cursor-pointer hover:text-brand-dark transition">
              📷
            </span>
            <span className="cursor-pointer hover:text-brand-dark transition">
              🐦
            </span>
            <span className="cursor-pointer hover:text-brand-dark transition">
              🎵
            </span>
          </div>*/}
        </div>
      </div>

      {/* AFTER FOOTER */}
      <div className="bg-brand-dark text-xs text-slate-100 py-3">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} Bellas Boutique. Todos los derechos
            reservados.
          </span>
          <span className="italic">Desarrollado por Equipo #1</span>
        </div>
      </div>
    </footer>
  );
}

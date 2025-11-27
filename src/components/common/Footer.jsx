export default function Footer() {
  return (
    <footer className="bg-brand-light text-slate-700 text-sm pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">
        {/* TALK ABOUT YOUR STORE */}
        <div className="space-y-4">
          <h3 className="font-semibold text-brand-dark">
            Habla sobre tu tienda
          </h3>
          <p className="text-slate-600 leading-relaxed text-sm">
            Sea Level Swim presenta una amplia selección de trajes de baño de
            contorneado de precisión y moldeados al cuerpo hecha de nylon
            regenerado. El resultado es una hermosa alineación de piezas de lujo
            de alta calidad que se sienten bien para los tiempos y están
            diseñadas para perdurar.
          </p>
          <p className="italic text-brand text-lg">– Lorem</p>
        </div>

        {/* SHOP */}
        <div>
          <h3 className="font-semibold text-brand-dark mb-4">Tienda</h3>
          <ul className="space-y-2 text-slate-600">
            <li>Trajes de baño completos</li>
            <li>Tops de baño</li>
            <li>Fondos de baño</li>
            <li>Tankinis</li>
            <li>Trajes de surf y camisetas rashguard</li>
            <li>Baño sostenible</li>
          </ul>
        </div>

        {/* HELP */}
        <div>
          <h3 className="font-semibold text-brand-dark mb-4">Ayuda</h3>
          <ul className="space-y-2 text-slate-600">
            <li>Buscar</li>
            <li>Sobre nosotros</li>
            <li>Contáctanos</li>
            <li>Preguntas frecuentes</li>
          </ul>
        </div>

        {/* NEWSLETTER */}
        <div className="space-y-4">
          <h3 className="font-semibold text-brand-dark">Boletín informativo</h3>
          <p className="text-slate-600">
            Suscríbete a nuestro boletín para recibir solo cosas buenas.
          </p>

          <div className="border-b border-slate-400 pb-1">
            <input
              type="email"
              placeholder="Ingresa tu correo"
              className="bg-transparent outline-none text-sm w-full"
            />
          </div>

          {/* Social icons */}
          <div className="flex gap-4 text-xl text-slate-700">
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
          </div>
        </div>
      </div>

      {/* COUNTRY + PAY ICONS */}
      <div className="max-w-7xl mx-auto px-6 mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="text-slate-700 text-sm">Costa Rica (CRC ₡)</div>

        <div className="flex gap-2 text-2xl opacity-80">
          <span>💳</span>
          <span>💰</span>
          <span>💳</span>
          <span>🏦</span>
          <span>💳</span>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="max-w-7xl mx-auto px-6 mt-8 text-xs text-slate-600">
        © {new Date().getFullYear()} mila. Powered by Shopify
      </div>
    </footer>
  );
}

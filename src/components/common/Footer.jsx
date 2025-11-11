export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-slate-600">
        <small>© {new Date().getFullYear()} Ecommerce Demo. Todos los derechos reservados.</small>
      </div>
    </footer>
  );
}
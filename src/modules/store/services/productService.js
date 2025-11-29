// src/modules/store/services/productService.js

const products = [
  {
    id: 1,
    name: "Vestido Midi Lila Encaje",
    description:
      "Vestido midi en tono lila con detalle de encaje en el busto y falda vaporosa. Ideal para eventos de día o noche.",
    price: 38900,
    stock: 6,
    category: "Ropa",
    provider: "Bellas Boutique",
    image: "/images/placeholder.png",
  },
  {
    id: 2,
    name: "Blusa Satinada Hombros Descubiertos",
    description:
      "Blusa satinada de hombros descubiertos, corte relajado y caída suave, perfecta para combinar con jeans o faldas.",
    price: 21500,
    stock: 10,
    category: "Ropa",
    provider: "Colección Bellas",
    image: "/images/placeholder.png",
  },
  {
    id: 3,
    name: "Jeans Mom Fit Azul Clásico",
    description:
      "Jeans mom fit tiro alto en color azul clásico, tela resistente y cómoda, favorece la silueta.",
    price: 29500,
    stock: 7,
    category: "Ropa",
    provider: "Bellas Boutique",
    image: "/images/placeholder.png",
  },
  {
    id: 4,
    name: "Sandalias de Tacón Nude Correa Fina",
    description:
      "Sandalias de tacón medio en color nude con correa fina al tobillo. Combinan con cualquier outfit elegante.",
    price: 32900,
    stock: 4,
    category: "Calzado",
    provider: "Bellas Boutique",
    image: "/images/placeholder.png",
  },
  {
    id: 5,
    name: "Tenis Blancos Plataforma Urbana",
    description:
      "Tenis blancos con plataforma ligera, estilo urbano y cómodo para el día a día.",
    price: 28900,
    stock: 5,
    category: "Calzado",
    provider: "Urban Bellas",
    image: "/images/placeholder.png",
  },
  {
    id: 6,
    name: "Bolso Cruzado Lavanda Minimal",
    description:
      "Bolso cruzado en tono lavanda con diseño minimalista, compartimentos internos y correa ajustable.",
    price: 24900,
    stock: 8,
    category: "Accesorios",
    provider: "Bellas Boutique",
    image: "/images/placeholder.png",
  },
  {
    id: 7,
    name: "Collar Doble Dorado con Dije",
    description:
      "Collar doble en acabado dorado con dije delicado. Aporta un toque elegante a cualquier look.",
    price: 13500,
    stock: 12,
    category: "Accesorios",
    provider: "Colección Bellas",
    image: "/images/placeholder.png",
  },
  {
    id: 8,
    name: "Set Scrunchies Satinados Pastel (x3)",
    description:
      "Set de tres scrunchies satinados en tonos pastel, ideales para complementar tus peinados.",
    price: 7500,
    stock: 15,
    category: "Accesorios",
    provider: "Bellas Boutique",
    image: "/images/placeholder.png",
  },
];

const productService = {
  list: async () => {
    return products;
  },
  listFeatured: async (limit = 8) => {
    return products.slice(0, limit);
  },
  getById: async (id) => {
    return products.find((p) => p.id === Number(id)) ?? null;
  },
};

export default productService;

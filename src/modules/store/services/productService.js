// src/modules/store/services/productService.js

const STORAGE_KEY = "products";

// Por si no hay nada en storage todavía
const SEED_PRODUCTS = [
  // ZAPATOS
  {
    id: "P001",
    nombre: "Sandalias de Tacón Minimalistas Nude",
    descripcion: "Sandalias elegantes de tacón bajo estilo minimalista.",
    precio: 35000,
    stock: 20,
    categoria: "Zapato",
    proveedor: "Proveedor Zapatos",
    imagenes: [
      "/images/products/bellas-boutique-products-020.webp",
      "/images/products/bellas-boutique-products-021.webp",
      "/images/products/bellas-boutique-products-022.webp",
      "/images/products/bellas-boutique-products-021.webp",
    ],
    estado: "Activo",
  },
  {
    id: "P002",
    nombre: "Tenis Urbanos Blancos Plataforma",
    descripcion: "Tenis urbanos con plataforma y acabado blanco.",
    precio: 42000,
    stock: 30,
    categoria: "Zapato",
    proveedor: "Proveedor Zapatos",
    // si quieres, luego le pones sus 4 imágenes
    imagenes: [
      "/images/products/bellas-boutique-products-026.webp",
      "/images/products/bellas-boutique-products-018.webp",
      "/images/products/bellas-boutique-products-019.webp",
      "/images/products/bellas-boutique-products-026.webp",
    ],
    estado: "Activo",
  },
  {
    id: "P003",
    nombre: "Botines Negros de Cuero Premium",
    descripcion: "Botines de cuero genuino estilo premium.",
    precio: 80000,
    stock: 15,
    categoria: "Zapato",
    proveedor: "Proveedor Zapatos",
    imagenes: [
      "/images/products/bellas-boutique-products-017.webp",
      "/images/products/bellas-boutique-products-024.webp",
      "/images/products/bellas-boutique-products-023.webp",
      "/images/products/bellas-boutique-products-025.webp",
    ],
    estado: "Activo",
  },

  // ROPA
  {
    id: "P004",
    nombre: "Vestido Midi Floral Primavera",
    descripcion: "Vestido de corte midi con estampado floral.",
    precio: 55000,
    stock: 25,
    categoria: "Ropa",
    proveedor: "Proveedor Ropa",
    imagenes: [
      "/images/products/bellas-boutique-products-014.webp",
      "/images/products/bellas-boutique-products-016.webp",
      "/images/products/bellas-boutique-products-027.webp",
      "/images/products/bellas-boutique-products-015.webp",
    ],
    estado: "Activo",
  },
  {
    id: "P005",
    nombre: "Blusa Satinada Manga Globo",
    descripcion: "Blusa satinada elegante con mangas tipo globo.",
    precio: 30000,
    stock: 40,
    categoria: "Ropa",
    proveedor: "Proveedor Ropa",
    imagenes: [
      "/images/products/bellas-boutique-products-006.webp",
      "/images/products/bellas-boutique-products-002.webp",
      "/images/products/bellas-boutique-products-012.webp",
      "/images/products/bellas-boutique-products-002.webp",
    ],
    estado: "Activo",
  },
  {
    id: "P006",
    nombre: "Pantalón Palazzo Beige Elegante",
    descripcion: "Pantalón palazzo beige de tela suave y elegante.",
    precio: 32000,
    stock: 35,
    categoria: "Ropa",
    proveedor: "Proveedor Ropa",
    imagenes: [
      "/images/products/bellas-boutique-products-029.webp",
      "/images/products/bellas-boutique-products-013.webp",
      "/images/products/bellas-boutique-products-007.webp",
      "/images/products/bellas-boutique-products-001.webp",
    ],
    estado: "Activo",
  },

  // JOYERÍA
  {
    id: "P007",
    nombre: "Collar Dorado Minimalista con Dije",
    descripcion: "Collar delgado dorado con dije minimalista.",
    precio: 18000,
    stock: 50,
    categoria: "Joyería",
    proveedor: "Proveedor Joyería",
    imagenes: [
      "/images/products/bellas-boutique-products-008.webp",
      "/images/products/bellas-boutique-products-011.webp",
      "/images/products/bellas-boutique-products-005.webp",
      "/images/products/bellas-boutique-products-009.webp",
    ],
    estado: "Activo",
  },
  {
    id: "P008",
    nombre: "Aretes Aro Plata 925 Premium",
    descripcion: "Aretes tipo aro fabricados en plata 925.",
    precio: 25000,
    stock: 45,
    categoria: "Joyería",
    proveedor: "Proveedor Joyería",
    imagenes: [
      "/images/products/bellas-boutique-products-010.webp",
      "/images/products/bellas-boutique-products-028.webp",
      "/images/products/bellas-boutique-products-004.webp",
      "/images/products/bellas-boutique-products-003.webp",
    ],
    estado: "Activo",
  },
];

function loadFromStorage() {
  if (typeof window === "undefined") return SEED_PRODUCTS;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    // Si no existe nada en el storage, sembrar la semilla
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }

    const parsed = JSON.parse(raw);

    // Si por error se guardó otra cosa, resembrar
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
      return SEED_PRODUCTS;
    }

    return parsed;
  } catch (e) {
    console.error("Error leyendo productos. Reseteando catálogo:", e);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
}

function saveToStorage(list) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Error guardando productos:", e);
  }
}

/**
 * Normaliza un producto del storage (español)
 * al formato que espera el frontend (inglés).
 */
function normalizeProduct(p) {
  const images =
  p.images ??
  p.imagenes ??
  (p.imagen && p.imagen.trim()
    ? [p.imagen.trim()]
    : p.image && p.image.trim()
      ? [p.image.trim()]
      : []);


  return {
  id: p.id,
  name: p.name ?? p.nombre ?? "",
  description: p.description ?? p.descripcion ?? "",
  price: p.price ?? p.precio ?? 0,
  stock: p.stock ?? 0,
  category: p.category ?? p.categoria ?? "",
  provider: p.provider ?? p.proveedor ?? "",
  images,
  image: p.image ?? p.imagen ?? images[0] ?? "",
  status: p.status ?? p.estado ?? "Activo",
  colors: p.colors ?? [],
  sizes: p.sizes ?? [],
  raw: p,
};

}

const productService = {
  // Siempre regresa al menos la semilla, pero NORMALIZADA
  list: async () => {
    const raw = loadFromStorage();
    return raw.map(normalizeProduct);
  },

  listFeatured: async (limit = 8) => {
    const raw = loadFromStorage();
    return raw.slice(0, limit).map(normalizeProduct);
  },

  getById: async (id) => {
    const raw = loadFromStorage();
    const found =
      raw.find((p) => String(p.id) === String(id)) ??
      null;
    return found ? normalizeProduct(found) : null;
  },

  // Guardar catálogo completo (para Admin)
  saveAll: async (products) => {
    // aquí guardamos "crudo" como venga del admin
    saveToStorage(products);
    return products.map(normalizeProduct);
  },

  // Restar stock cuando se realiza una compra
  updateStockAfterSale: async (cartItems) => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return;

    const products = loadFromStorage();

    const updated = products.map((p) => {
      // cantidad total comprada de este producto
      const qty = cartItems
        .filter((item) => String(item.id) === String(p.id))
        .reduce((sum, item) => sum + Number(item.quantity || 0), 0);

      if (!qty) return p;

      const newStock = Math.max(0, Number(p.stock) - qty);

      return {
        ...p,
        stock: newStock,
      };
    });

    saveToStorage(updated);

    // devolvemos normalizados
    return updated.map(normalizeProduct);
  },
};

export default productService;

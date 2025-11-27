// src/modules/store/services/productService.js

const products = [
  {
    id: 1,
    name: "Messina Pantaleta Bikini Regular",
    description:
      "Pantaleta bikini de cintura media con corte favorecedor y tela suave.",
    price: 26000,
    stock: 5,
    category: "Traje de baño",
    provider: "Sea Level Swim",
    image: "/images/products/messina-regular.png",
  },
  {
    id: 2,
    name: "Elite Pantaleta Cintura Alta",
    description:
      "Pantaleta de cintura alta diseñada para comodidad todo el día.",
    price: 33500,
    stock: 8,
    category: "Traje de baño",
    provider: "Sea Level Swim",
    image: "/images/products/elite-high-waist.png",
  },
  {
    id: 3,
    name: "Elite Traje Completo Cuello Alto",
    description: "Elegante traje completo con cuello alto y espalda abierta.",
    price: 67000,
    stock: 2,
    category: "Traje Completo",
    provider: "Sea Level Swim",
    image: "/images/products/elite-high-neck.png",
  },
  {
    id: 4,
    name: "Tango Top Bikini Cruzado",
    description: "Top bikini cruzado con correas ajustables.",
    price: 29750,
    stock: 0,
    category: "Tops",
    provider: "Sea Level Swim",
    image: "/images/products/tango-cross-front.png",
  },
  {
    id: 5,
    name: "Messina Traje Completo Cruzado",
    description: "Traje completo cruzado en un vibrante estampado de verano.",
    price: 75500,
    stock: 3,
    category: "Traje Completo",
    provider: "Sea Level Swim",
    image: "/images/products/messina-cross-front.png",
  },
  {
    id: 6,
    name: "Lola Pantaleta Bikini Brillo Cintura Media",
    description: "Pantaleta bikini de cintura media con brillo sutil.",
    price: 26000,
    stock: 6,
    category: "Traje de baño",
    provider: "Sea Level Swim",
    image: "/images/products/lola-shimmer-mid.png",
  },
  {
    id: 7,
    name: "Lola Top Singlet Brillo",
    description: "Top singlet con brillo a juego y correas ajustables.",
    price: 39250,
    stock: 4,
    category: "Tops",
    provider: "Sea Level Swim",
    image: "/images/products/lola-shimmer-top.png",
  },
  {
    id: 8,
    name: "Wildside Pantaleta Bikini Estampado Animal",
    description:
      "Pantaleta bikini con estampado animal y ajuste de cintura media.",
    price: 20900,
    stock: 7,
    category: "Traje de baño",
    provider: "Sea Level Swim",
    image: "/images/products/wildside-mid.png",
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

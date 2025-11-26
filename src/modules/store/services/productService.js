// src/modules/store/services/productService.js

const products = [
  {
    id: 1,
    name: "Messina Regular Bikini Pant",
    description:
      "Mid-rise bikini bottom with a flattering cut and soft fabric.",
    price: 41,
    stock: 5,
    category: "Swimwear",
    provider: "Sea Level Swim",
    image: "/images/products/messina-regular.png",
  },
  {
    id: 2,
    name: "Elite High Waist Pant",
    description: "High-waisted pant designed for all-day comfort.",
    price: 53,
    stock: 8,
    category: "Swimwear",
    provider: "Sea Level Swim",
    image: "/images/products/elite-high-waist.png",
  },
  {
    id: 3,
    name: "Elite High Neck One Piece",
    description: "Elegant one-piece with a high neck and open back.",
    price: 106,
    stock: 2,
    category: "One Piece",
    provider: "Sea Level Swim",
    image: "/images/products/elite-high-neck.png",
  },
  {
    id: 4,
    name: "Tango Cross Front Bra Top",
    description: "Cross-front bra top with adjustable straps.",
    price: 47,
    stock: 0,
    category: "Tops",
    provider: "Sea Level Swim",
    image: "/images/products/tango-cross-front.png",
  },
  {
    id: 5,
    name: "Messina Cross Front One Piece",
    description: "Cross-front one-piece in a vibrant summer print.",
    price: 119,
    stock: 3,
    category: "One Piece",
    provider: "Sea Level Swim",
    image: "/images/products/messina-cross-front.png",
  },
  {
    id: 6,
    name: "Lola Shimmer Mid Bikini Pant",
    description: "Shimmer mid-rise bikini pant with subtle shine.",
    price: 41,
    stock: 6,
    category: "Swimwear",
    provider: "Sea Level Swim",
    image: "/images/products/lola-shimmer-mid.png",
  },
  {
    id: 7,
    name: "Lola Shimmer Singlet Top",
    description: "Matching shimmer singlet top with adjustable straps.",
    price: 62,
    stock: 4,
    category: "Tops",
    provider: "Sea Level Swim",
    image: "/images/products/lola-shimmer-top.png",
  },
  {
    id: 8,
    name: "Wildside Mid Bikini Pant",
    description: "Animal-print bikini pant with mid-rise fit.",
    price: 33,
    stock: 7,
    category: "Swimwear",
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

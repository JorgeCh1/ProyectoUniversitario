// Servicio de productos (stubs)
const productService = {
  list: async () => {
    // TODO: obtener productos
    return [
      { id: 1, name: "Producto A", price: 10.99 },
      { id: 2, name: "Producto B", price: 19.99 },
    ];
  },
  getById: async (id) => {
    // TODO: obtener producto por id
    return { id, name: `Producto ${id}`, price: 9.99 + id };
  },
};

export default productService;
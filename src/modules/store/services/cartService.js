// Servicio de carrito (stubs)
const cartService = {
  getCart: async () => {
    // TODO: obtener carrito
    return { items: [], total: 0 };
  },
  addItem: async (product, qty = 1) => {
    // TODO: agregar al carrito
    return { ok: true, product, qty };
  },
  removeItem: async (productId) => {
    // TODO: eliminar del carrito
    return { ok: true, productId };
  },
};

export default cartService;
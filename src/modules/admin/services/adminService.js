// Servicio de administración (stubs)
const adminService = {
  listUsers: async () => {
    return [{ id: 1, name: "Admin" }];
  },
  createUser: async (user) => {
    return { ok: true, id: Date.now(), ...user };
  },
  listProducts: async () => {
    return [{ id: 1, name: "Producto A", price: 10.99 }];
  },
  createProduct: async (product) => {
    return { ok: true, id: Date.now(), ...product };
  },
  listOrders: async () => {
    return [{ id: 101, total: 29.99 }];
  },
};

export default adminService;
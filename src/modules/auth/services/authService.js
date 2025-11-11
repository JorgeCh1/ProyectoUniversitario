// Servicio de autenticación (stubs)
const authService = {
  login: async (credentials) => {
    // TODO: implementar login
    return { ok: true, user: { id: 1, email: credentials?.email } };
  },
  register: async (data) => {
    // TODO: implementar registro
    return { ok: true, userId: Date.now() };
  },
  getProfile: async () => {
    // TODO: obtener perfil
    return { id: 1, name: "Usuario Demo", email: "demo@ecom.com" };
  },
};

export default authService;
/*
  Plan inicial de rutas (no conectado aún):
  - '/': Home
  - '/productos': ProductList
  - '/producto/:id': ProductDetail
  - '/carrito': Cart
  - '/checkout': Checkout
  - '/login': Login
  - '/registro': Register
  - '/cuenta': Profile
  - '/admin': Dashboard
  - '/admin/usuarios': Users
  - '/admin/productos': AdminProducts
  - '/admin/pedidos': Orders
*/

export const routesPlan = [
  { path: '/', component: 'Home' },
  { path: '/productos', component: 'ProductList' },
  { path: '/producto/:id', component: 'ProductDetail' },
  { path: '/carrito', component: 'Cart' },
  { path: '/checkout', component: 'Checkout' },
  { path: '/login', component: 'Login' },
  { path: '/registro', component: 'Register' },
  { path: '/cuenta', component: 'Profile' },
  { path: '/admin', component: 'Dashboard' },
  { path: '/admin/usuarios', component: 'Users' },
  { path: '/admin/productos', component: 'AdminProducts' },
  { path: '/admin/pedidos', component: 'Orders' },
];
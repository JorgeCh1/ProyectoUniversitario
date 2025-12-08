"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import salesService from "@/modules/admin/services/SalesService";
import productService from "@/modules/store/services/productService";
import { listUsersRaw } from "@/modules/auth/services/authService";

import AdminHeader from "./components/AdminHeader.jsx";
import AdminSidebar from "./components/AdminSidebar.jsx";
import UsersManagementView from "./components/UsersManagement.jsx";
import ProductsManagementView from "./components/ProductsManagement.jsx";
import SalesManagementView from "./components/SalesManagement.jsx";
import PaymentsMonitoringView from "./components/PaymentsMonitoring.jsx";


// CLIENTE ➜ ADMIN (formato normalizado ➜ admin en español)
function mapClientToAdminProducts(clientProducts) {
  return clientProducts.map((p) => ({
    id: p.id,
    nombre: p.name,
    descripcion: p.description,
    precio: p.price,
    stock: p.stock,
    categoria: p.category,
    proveedor: p.provider,
    // tomo la principal y también guardo arreglo
    imagen: p.image ?? p.images?.[0] ?? "",
    imagenes: p.images ?? (p.image ? [p.image] : []),
    estado: p.status ?? "Activo",
  }));
}

// ADMIN ➜ CLIENTE (lo que se guarda en localStorage)
function mapAdminToClientProducts(adminProducts) {
  return adminProducts.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    descripcion: p.descripcion,
    precio: p.precio,
    stock: p.stock,
    categoria: p.categoria,
    proveedor: p.proveedor,
    imagenes: p.imagenes && p.imagenes.length
      ? p.imagenes
      : p.imagen
        ? [p.imagen]
        : [],
    estado: p.estado ?? "Activo",
  }));
}


// Por si no hay nada en storage todavía
const initialAdminProducts = [
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const [users, setUsers] = useState([]);

  const [products, setProducts] = useState(initialAdminProducts);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    try {
      const rawUsers = listUsersRaw(); // viene de authService

      const adminUsers = rawUsers.map((u) => ({
        id: u.idUser, // mapeamos idUser -> id para el admin
        nombre: u.nombre,
        apellidos: u.apellidos,
        email: u.email,
        telefono: u.telefono,
        direccion: u.direccion,
        rol: u.rol,
        estado: u.estado || "Activo", // por si alguno no tiene estado aún
      }));

      setUsers(adminUsers);
    } catch (error) {
      console.error("Error cargando usuarios para admin:", error);
      setUsers([]); // fallback
    }
  }, []);

  useEffect(() => {
  let cancelled = false;

  const loadProductsForAdmin = async () => {
    try {
      const clientProducts = await productService.list();

      if (cancelled) return;

      if (clientProducts && clientProducts.length > 0) {
        // ya hay catálogo del lado cliente
        setProducts(mapClientToAdminProducts(clientProducts));
      } else {
        // no hay nada en localStorage → usamos los iniciales
        setProducts(initialAdminProducts);

        const clientMapped = mapAdminToClientProducts(initialAdminProducts);
        try {
          productService.saveAll(clientMapped);
        } catch (err) {
          console.error("Error guardando productos iniciales:", err);
        }
      }
    } catch (e) {
      console.error("Error cargando productos para admin:", e);

      if (!cancelled) {
        setProducts(initialAdminProducts);
        const clientMapped = mapAdminToClientProducts(initialAdminProducts);
        try {
          productService.saveAll(clientMapped);
        } catch (err) {
          console.error("Error guardando productos iniciales (fallback):", err);
        }
      }
    } finally {
      if (!cancelled) setLoadingProducts(false);
    }
  };

  loadProductsForAdmin();
  return () => {
    cancelled = true;
  };
}, []);


  const [sales, setSales] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const loadSales = async () => {
      try {
        const data = await salesService.list();
        if (!cancelled) setSales(data);
      } catch (e) {
        console.error("Error cargando ventas:", e);
        if (!cancelled) setSales([]);
      }
    };

    loadSales();

    // escuchar cambios de ventas (cuando Checkout guarda una nueva)
    function onSalesChanged(e) {
      if (cancelled) return;
      if (e && e.detail && Array.isArray(e.detail.sales)) {
        setSales(e.detail.sales);
      } else {
        loadSales();
      }
    }

    window.addEventListener("sales:changed", onSalesChanged);
    return () => {
      cancelled = true;
      window.removeEventListener("sales:changed", onSalesChanged);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <AdminHeader />

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-5xl font-light text-brand-dark tracking-tight mb-4">
            Panel administrativo
          </h1>
          <h2 className="text-base md:text-lg text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
            Gestiona usuarios, productos, ventas y pagos desde un solo lugar.
            Monitorea el rendimiento de tu negocio en tiempo real.
          </h2>
        </div>
        {/* </CHANGE> */}
        <div className="md:hidden mb-6 space-y-3">
          <button
            onClick={() => setActiveTab("users")}
            className={`w-full text-center px-6 py-3 text-sm rounded-none border transition-colors shadow-sm ${
              activeTab === "users"
                ? "bg-brand-dark text-white border-transparent"
                : "bg-white text-brand-dark border-slate-200 hover:bg-gray-50"
            }`}
          >
            Gestión de Usuarios
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full text-center px-6 py-3 text-sm rounded-none border transition-colors shadow-sm ${
              activeTab === "products"
                ? "bg-brand-dark text-white border-transparent"
                : "bg-white text-brand-dark border-slate-200 hover:bg-gray-50"
            }`}
          >
            Gestión de Productos
          </button>
          <button
            onClick={() => setActiveTab("sales")}
            className={`w-full text-center px-6 py-3 text-sm rounded-none border transition-colors shadow-sm ${
              activeTab === "sales"
                ? "bg-brand-dark text-white border-transparent"
                : "bg-white text-brand-dark border-slate-200 hover:bg-gray-50"
            }`}
          >
            Ventas y Facturación
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`w-full text-center px-6 py-3 text-sm rounded-none border transition-colors shadow-sm ${
              activeTab === "payments"
                ? "bg-brand-dark text-white border-transparent"
                : "bg-white text-brand-dark border-slate-200 hover:bg-gray-50"
            }`}
          >
            Monitoreo de Pagos
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          <AdminSidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            users={users}
            products={products}
            sales={sales}
          />

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === "users" && (
              <UsersManagementView users={users} setUsers={setUsers} />
            )}

            {activeTab === "products" && !loadingProducts && (
              <ProductsManagementView
                products={products}
                setProducts={setProducts}
              />
            )}

            {activeTab === "sales" && <SalesManagementView sales={sales} />}

            {activeTab === "payments" && (
              <PaymentsMonitoringView sales={sales} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function UsersManagement({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null)

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setEditingUser(null)
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200">
      <div className="px-4 md:px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-brand-dark">Gestión de Usuarios</h2>
        <p className="text-sm text-slate-500 mt-1">Visualiza y gestiona la información de los usuarios registrados</p>
      </div>

      <div className="p-4 md:p-6 overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.id}</TableCell>
                <TableCell>{`${user.nombre} ${user.apellidos}`}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.telefono}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                      user.rol === "Administrador"
                        ? "bg-purple-100 text-purple-800"
                        : user.rol === "Vendedor"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.rol}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                      user.estado === "Activo"
                        ? "bg-green-100 text-green-800"
                        : user.estado === "Suspendido"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.estado}
                  </span>
                </TableCell>
                <TableCell>
                  <Dialog open={Boolean(editingUser)} onOpenChange={(open) => { if (!open) setEditingUser(null) }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingUser(user)} className="text-xs">
                        Editar
                      </Button>
                    </DialogTrigger>
                  <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl md:p-8">
                      <DialogHeader>
                        <DialogTitle className="text-3xl md:text-4xl font-semibold text-slate-900">Editar Usuario</DialogTitle>
                        <DialogDescription className="text-sm md:text-base text-slate-600">
                          Modifica la información del usuario. El ID y email no pueden ser modificados.
                        </DialogDescription>
                      </DialogHeader>
                      {editingUser && (
                        <UserEditForm
                          user={editingUser}
                          onSave={handleUpdateUser}
                          onCancel={() => setEditingUser(null)}
                        />
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function UserEditForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState(user)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">ID *</legend>
          <Input id="id" value={formData.id} disabled className="border-none focus:ring-0 px-0 bg-gray-50" />
        </fieldset>
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Email *</legend>
          <Input id="email" type="email" value={formData.email} disabled className="border-none focus:ring-0 px-0 bg-gray-50" />
        </fieldset>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Nombre *</legend>
          <Input
            id="nombre"
            className="border-none focus:ring-0 px-0"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </fieldset>
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Apellidos *</legend>
          <Input
            id="apellidos"
            className="border-none focus:ring-0 px-0"
            value={formData.apellidos}
            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
            required
          />
        </fieldset>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Teléfono *</legend>
          <Input
            id="telefono"
            className="border-none focus:ring-0 px-0"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            required
          />
        </fieldset>
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Rol *</legend>
          <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
            <SelectTrigger className="border-none focus:ring-0 px-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Administrador">Administrador</SelectItem>
              <SelectItem value="Vendedor">Vendedor</SelectItem>
              <SelectItem value="Cliente">Cliente</SelectItem>
            </SelectContent>
          </Select>
        </fieldset>
      </div>

      <fieldset className="border border-slate-300 rounded-lg p-3">
        <legend className="text-xs text-slate-600 px-2">Dirección *</legend>
        <Input
          id="direccion"
          className="border-none focus:ring-0 px-0"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          required
        />
      </fieldset>

      <fieldset className="border border-slate-300 rounded-lg p-3">
        <legend className="text-xs text-slate-600 px-2">Estado de la cuenta *</legend>
        <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
          <SelectTrigger className="border-none focus:ring-0 px-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
            <SelectItem value="Suspendido">Suspendido</SelectItem>
          </SelectContent>
        </Select>
      </fieldset>

      <div className="flex justify-center gap-4 pt-6">
        <Button type="button" variant="outline" className="rounded-full px-6 border-brand-dark text-brand-dark" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-brand-dark hover:bg-brand rounded-full px-6 shadow-sm">
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}

function ProductsManagement({ products, setProducts }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // NUEVO: sincroniza admin ➜ cliente
  const syncWithStore = (updatedAdminProducts) => {
    setProducts(updatedAdminProducts);
    const clientProducts = mapAdminToClientProducts(updatedAdminProducts);
    try {
      productService.saveAll(clientProducts);
    } catch (err) {
      console.error("Error sincronizando catálogo de cliente:", err);
    }
  };

  const handleSaveProduct = (product) => {
    let updated;

    if (isAddingNew) {
      const newId = `P${String(products.length + 1).padStart(3, "0")}`;
      updated = [...products, { ...product, id: newId }];
      setIsAddingNew(false);
    } else {
      updated = products.map((p) => (p.id === product.id ? product : p));
    }

    setEditingProduct(null);
    syncWithStore(updated);
  };

  const handleDeleteProduct = (productId) => {
    const updated = products.map((p) =>
      p.id === productId ? { ...p, estado: "Inactivo" } : p
    );
    syncWithStore(updated);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200 flex items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
          <div>
            <h2 className="text-lg font-semibold text-brand-dark">
              Gestión de Productos
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Administra el catálogo de productos de tu tienda
            </p>
          </div>
          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button className="bg-brand-dark hover:bg-brand">
                Registrar Nuevo Producto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl md:p-8">
              <DialogHeader>
                <DialogTitle className="text-3xl md:text-4xl font-semibold text-slate-900">
                  Registrar Nuevo Producto
                </DialogTitle>
                <DialogDescription className="text-sm md:text-base text-slate-600">
                  Completa la información del nuevo producto para el catálogo
                </DialogDescription>
              </DialogHeader>
              <ProductForm
                product={{
                  id: "",
                  nombre: "",
                  descripcion: "",
                  precio: 0,
                  stock: 0,
                  categoria: "",
                  proveedor: "",
                  imagen: "",
                  imagenes: [],
                  estado: "Activo",
                }}
                onSave={handleSaveProduct}
                onCancel={() => setIsAddingNew(false)}
                isNew
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-4 md:p-6 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.id}</TableCell>
                  <TableCell>{product.nombre}</TableCell>
                  <TableCell>{product.categoria}</TableCell>
                  <TableCell>₡{product.precio.toLocaleString()}</TableCell>
                  <TableCell>
                    <span
                      className={
                        product.stock < 10 ? "text-red-600 font-medium" : ""
                      }
                    >
                      {product.stock}
                    </span>
                  </TableCell>
                  <TableCell>{product.proveedor}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        product.estado === "Activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.estado}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog
                        open={Boolean(editingProduct)}
                        onOpenChange={(open) => {
                          if (!open) setEditingProduct(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                            className="text-xs"
                          >
                            Editar
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[95vw] sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Editar Producto</DialogTitle>
                            <DialogDescription>
                              Modifica la información del producto
                            </DialogDescription>
                          </DialogHeader>
                          {editingProduct && (
                            <ProductForm
                              product={{
                                ...editingProduct,
                                imagenes: editingProduct.imagenes || [],
                              }}
                              onSave={handleSaveProduct}
                              onCancel={() => setEditingProduct(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      {product.estado === "Activo" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Dar de baja
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel,
  isNew = false,
}) {
  const [formData, setFormData] = useState(product)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Nombre del Producto *</legend>
          <Input
            id="nombre"
            className="border-none focus:ring-0 px-0"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </fieldset>
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Categoría *</legend>
          <Input
            id="categoria"
            className="border-none focus:ring-0 px-0"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            required
          />
        </fieldset>
      </div>

      <fieldset className="border border-slate-300 rounded-lg p-3">
        <legend className="text-xs text-slate-600 px-2">Descripcion *</legend>
        <Textarea
          id="descripcion"
          className="border-none focus:ring-0 px-0"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          required
          rows={3}
        />
      </fieldset>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Precio *</legend>
          <Input
            id="precio"
            type="number"
            className="border-none focus:ring-0 px-0"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
            required
            min="0"
          />
        </fieldset>
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Stock disponible *</legend>
          <Input
            id="stock"
            type="number"
            className="border-none focus:ring-0 px-0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            required
            min="0"
          />
        </fieldset>
      </div>

      <fieldset className="border border-slate-300 rounded-lg p-3">
        <legend className="text-xs text-slate-600 px-2">Proveedor *</legend>
        <Input
          id="proveedor"
          className="border-none focus:ring-0 px-0"
          value={formData.proveedor}
          onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
          required
        />
      </fieldset>

      <fieldset className="border border-slate-300 rounded-lg p-3">
        <legend className="text-xs text-slate-600 px-2">URL de la imagen</legend>
        <Input
          id="imagen"
          type="url"
          className="border-none focus:ring-0 px-0"
          value={formData.imagen}
          onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </fieldset>

      <div className="flex justify-center gap-4 pt-6">
        <Button type="button" variant="outline" className="rounded-full px-6 border-brand-dark text-brand-dark" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-brand-dark hover:bg-brand rounded-full px-6 shadow-sm">
          {isNew ? "Registrar Producto" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  )
}

function SalesManagement({ sales }) {
  const today = new Date().toISOString().split("T")[0]
  const todaySales = sales.filter((s) => s.fecha === today)

  const totalToday = todaySales.reduce((sum, sale) => sum + sale.total, 0)
  const productsToday = todaySales.reduce((sum, sale) => sum + sale.productos, 0)

  const totalMonth = sales.reduce((sum, sale) => sum + sale.total, 0)
  const productsMonth = sales.reduce((sum, sale) => sum + sale.productos, 0)
  const [invoiceSale, setInvoiceSale] = useState(null)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reporte Diario</CardTitle>
            <CardDescription>Ventas de hoy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Productos vendidos:</span>
              <span className="text-lg font-semibold text-brand-dark">{productsToday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Ingresos generados:</span>
              <span className="text-lg font-semibold text-brand-dark">₡{totalToday.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Número de ventas:</span>
              <span className="text-lg font-semibold text-brand-dark">{todaySales.length}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reporte Mensual</CardTitle>
            <CardDescription>Ventas del mes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Productos vendidos:</span>
              <span className="text-lg font-semibold text-brand-dark">{productsMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Ingresos generados:</span>
              <span className="text-lg font-semibold text-brand-dark">₡{totalMonth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Número de ventas:</span>
              <span className="text-lg font-semibold text-brand-dark">{sales.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-brand-dark">Historial de Ventas</h2>
          <p className="text-sm text-slate-500 mt-1">Visualiza todas las ventas y facturas generadas</p>
        </div>

        <div className="p-4 md:p-6 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID Venta</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Productos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{new Date(sale.fecha).toLocaleDateString("es-CR")}</TableCell>
                  <TableCell>{sale.cliente}</TableCell>
                  <TableCell>{sale.productos}</TableCell>
                  <TableCell className="font-medium">₡{sale.total.toLocaleString()}</TableCell>
                  <TableCell>{sale.metodoPago}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        sale.estadoPago === "Exitoso"
                          ? "bg-green-100 text-green-800"
                          : sale.estadoPago === "Pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sale.estadoPago}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog open={Boolean(invoiceSale)} onOpenChange={(open) => { if (!open) setInvoiceSale(null) }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => setInvoiceSale(sale)}
                        >
                          Ver factura
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl md:p-8">
                        <DialogHeader>
                          <DialogTitle className="text-3xl md:text-4xl font-semibold text-slate-900">Factura #{invoiceSale?.id}</DialogTitle>
                          <DialogDescription className="text-sm md:text-base text-slate-600">Detalle de la venta y facturación</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">ID Venta</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={invoiceSale?.id || ''} disabled />
                            </fieldset>
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Fecha</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={invoiceSale ? new Date(invoiceSale.fecha).toLocaleDateString('es-CR') : ''} disabled />
                            </fieldset>
                          </div>
                          <fieldset className="border border-slate-300 rounded-lg p-3">
                            <legend className="text-xs text-slate-600 px-2">Cliente</legend>
                            <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={invoiceSale?.cliente || ''} disabled />
                          </fieldset>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Productos</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={invoiceSale?.productos ?? ''} disabled />
                            </fieldset>
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Total</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={invoiceSale ? `₡${invoiceSale.total.toLocaleString()}` : ''} disabled />
                            </fieldset>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Método de Pago</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={invoiceSale?.metodoPago || ''} disabled />
                            </fieldset>
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Estado del Pago</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={invoiceSale?.estadoPago || ''} disabled />
                            </fieldset>
                          </div>
                          <div className="flex justify-center gap-4 pt-6">
                            <Button type="button" variant="outline" className="rounded-full px-6 border-brand-dark text-brand-dark" onClick={() => setInvoiceSale(null)}>
                              Cerrar
                            </Button>
                            <Button type="button" className="bg-brand-dark hover:bg-brand rounded-full px-6 shadow-sm">
                              Descargar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

function PaymentsMonitoring({ sales }) {
  const paymentsByMethod = sales.reduce(
    (acc, sale) => {
      acc[sale.metodoPago] = (acc[sale.metodoPago] || 0) + 1
      return acc
    },
    {},
  )

  const paymentsByStatus = sales.reduce(
    (acc, sale) => {
      acc[sale.estadoPago] = (acc[sale.estadoPago] || 0) + 1
      return acc
    },
    {},
  )
  const [detailSale, setDetailSale] = useState(null)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pagos por Método</CardTitle>
            <CardDescription>Distribución de métodos de pago</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(paymentsByMethod).map(([method, count]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="text-sm text-slate-500">{method}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-dark" style={{ width: `${(count / sales.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-brand-dark w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Estado de Pagos</CardTitle>
            <CardDescription>Resumen de estados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(paymentsByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between">
                <span className="text-sm text-slate-500">{status}</span>
                <span className="text-lg font-semibold text-brand-dark">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="px-4 md:px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-brand-dark">Monitoreo de Pagos</h2>
          <p className="text-sm text-slate-500 mt-1">Estado detallado de todos los pagos registrados</p>
        </div>

        <div className="p-4 md:p-6 overflow-x-auto">
          <Table className="min-w-[900px]">
            <TableHeader>
              <TableRow>
                <TableHead>ID Venta</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Estado del Pago</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell>{new Date(sale.fecha).toLocaleDateString("es-CR")}</TableCell>
                  <TableCell>{sale.cliente}</TableCell>
                  <TableCell className="font-medium">₡{sale.total.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                      {sale.metodoPago}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        sale.estadoPago === "Exitoso"
                          ? "bg-green-100 text-green-800"
                          : sale.estadoPago === "Pendiente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sale.estadoPago}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Dialog open={Boolean(detailSale)} onOpenChange={(open) => { if (!open) setDetailSale(null) }}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs bg-transparent"
                          onClick={() => setDetailSale(sale)}
                        >
                          Ver detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl md:p-8">
                        <DialogHeader>
                          <DialogTitle className="text-3xl md:text-4xl font-semibold text-slate-900">Detalles de Pago</DialogTitle>
                          <DialogDescription className="text-sm md:text-base text-slate-600">Información detallada de la venta y el pago</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">ID Venta</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={detailSale?.id || ''} disabled />
                            </fieldset>
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Fecha</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={detailSale ? new Date(detailSale.fecha).toLocaleDateString('es-CR') : ''} disabled />
                            </fieldset>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Cliente</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={detailSale?.cliente || ''} disabled />
                            </fieldset>
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Monto</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={detailSale ? `₡${detailSale.total.toLocaleString()}` : ''} disabled />
                            </fieldset>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Método de Pago</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={detailSale?.metodoPago || ''} disabled />
                            </fieldset>
                            <fieldset className="border border-slate-300 rounded-lg p-3">
                              <legend className="text-xs text-slate-600 px-2">Estado del Pago</legend>
                              <Input className="border-none focus:ring-0 px-0 bg-gray-50" value={detailSale?.estadoPago || ''} disabled />
                            </fieldset>
                          </div>
                          <div className="flex justify-center gap-4 pt-6">
                            <Button type="button" variant="outline" className="rounded-full px-6 border-brand-dark text-brand-dark" onClick={() => setDetailSale(null)}>
                              Cerrar
                            </Button>
                            <Button type="button" className="bg-brand-dark hover:bg-brand rounded-full px-6 shadow-sm">
                              Aceptar
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"



export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users")
  const [users, setUsers] = useState([
    {
      id: "001",
      nombre: "Juan",
      apellidos: "Pérez García",
      email: "juan@example.com",
      telefono: "8888-8888",
      direccion: "San José, Costa Rica",
      rol: "Cliente",
      estado: "Activo",
    },
    {
      id: "002",
      nombre: "María",
      apellidos: "González López",
      email: "maria@example.com",
      telefono: "7777-7777",
      direccion: "Heredia, Costa Rica",
      rol: "Vendedor",
      estado: "Activo",
    },
  ])

  const [products, setProducts] = useState([
    {
      id: "P001",
      nombre: "Producto A",
      descripcion: "Descripción del producto A",
      precio: 25000,
      stock: 50,
      categoria: "Electrónica",
      proveedor: "Proveedor 1",
      imagen: "",
      estado: "Activo",
    },
    {
      id: "P002",
      nombre: "Producto B",
      descripcion: "Descripción del producto B",
      precio: 15000,
      stock: 5,
      categoria: "Ropa",
      proveedor: "Proveedor 2",
      imagen: "",
      estado: "Activo",
    },
  ])

  const [sales] = useState([
    {
      id: "V001",
      fecha: "2025-01-10",
      cliente: "Juan Pérez",
      productos: 3,
      total: 75000,
      metodoPago: "Tarjeta",
      estadoPago: "Exitoso",
    },
    {
      id: "V002",
      fecha: "2025-01-11",
      cliente: "María González",
      productos: 1,
      total: 25000,
      metodoPago: "SINPE",
      estadoPago: "Pendiente",
    },
  ])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#e5e5e5]">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-[#1a1a1a]">mila</h1>
          <div className="flex items-center gap-6">
            <span className="text-sm text-[#6b6b6b]">Administrador</span>
            <Button variant="outline" size="sm" className="text-sm bg-transparent">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-light text-[#1a1a1a] tracking-tight mb-4">Panel administrativo</h1>
          <h2 className="text-lg text-[#6b6b6b] font-light leading-relaxed max-w-2xl mx-auto">
            Gestiona usuarios, productos, ventas y pagos desde un solo lugar. Monitorea el rendimiento de tu negocio en
            tiempo real.
          </h2>
        </div>
        {/* </CHANGE> */}

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab("users")}
                className={`w-full text-left px-6 py-3 text-sm rounded-md border border-[#e5e5e5] transition-colors ${
                  activeTab === "users" ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1a1a1a] hover:bg-gray-100"
                }`}
              >
                Gestión de Usuarios
              </button>
              <button
                onClick={() => setActiveTab("products")}
                className={`w-full text-left px-6 py-3 text-sm rounded-md border border-[#e5e5e5] transition-colors ${
                  activeTab === "products" ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1a1a1a] hover:bg-gray-100"
                }`}
              >
                Gestión de Productos
              </button>
              <button
                onClick={() => setActiveTab("sales")}
                className={`w-full text-left px-6 py-3 text-sm rounded-md border border-[#e5e5e5] transition-colors ${
                  activeTab === "sales" ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1a1a1a] hover:bg-gray-100"
                }`}
              >
                Ventas y Facturación
              </button>
              <button
                onClick={() => setActiveTab("payments")}
                className={`w-full text-left px-6 py-3 text-sm rounded-md border border-[#e5e5e5] transition-colors ${
                  activeTab === "payments" ? "bg-[#1a1a1a] text-white" : "bg-white text-[#1a1a1a] hover:bg-gray-100"
                }`}
              >
                Monitoreo de Pagos
              </button>
            </nav>

            {/* Stats Card */}
            <div className="mt-6 bg-white rounded-lg p-6 border border-[#e5e5e5]">
              <h3 className="text-sm font-medium text-[#1a1a1a] mb-4">Resumen</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6b6b]">Usuarios</span>
                  <span className="font-medium text-[#1a1a1a]">{users.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6b6b]">Productos</span>
                  <span className="font-medium text-[#1a1a1a]">{products.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b6b6b]">Ventas hoy</span>
                  <span className="font-medium text-[#1a1a1a]">{sales.length}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === "users" && <UsersManagement users={users} setUsers={setUsers} />}
            {activeTab === "products" && <ProductsManagement products={products} setProducts={setProducts} />}
            {activeTab === "sales" && <SalesManagement sales={sales} />}
            {activeTab === "payments" && <PaymentsMonitoring sales={sales} />}
          </main>
        </div>
      </div>
    </div>
  )
}

function UsersManagement({ users, setUsers }) {
  const [editingUser, setEditingUser] = useState(null)

  const handleUpdateUser = (updatedUser) => {
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    setEditingUser(null)
  }

  return (
    <div className="bg-white rounded-lg border-[#e5e5e5]">
      <div className="px-6 py-4 border-b border-[#e5e5e5]">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Gestión de Usuarios</h2>
        <p className="text-sm text-[#6b6b6b] mt-1">Visualiza y gestiona la información de los usuarios registrados</p>
      </div>

      <div className="p-6">
        <Table>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingUser(user)} className="text-xs">
                        Editar
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Editar Usuario</DialogTitle>
                        <DialogDescription>
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="id">ID *</Label>
          <Input id="id" value={formData.id} disabled className="bg-gray-50" />
        </div>
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" value={formData.email} disabled className="bg-gray-50" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="apellidos">Apellidos *</Label>
          <Input
            id="apellidos"
            value={formData.apellidos}
            onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="telefono">Teléfono *</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="rol">Rol *</Label>
          <Select value={formData.rol} onValueChange={(value) => setFormData({ ...formData, rol: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Administrador">Administrador</SelectItem>
              <SelectItem value="Vendedor">Vendedor</SelectItem>
              <SelectItem value="Cliente">Cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="direccion">Dirección *</Label>
        <Input
          id="direccion"
          value={formData.direccion}
          onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="estado">Estado de la cuenta *</Label>
        <Select value={formData.estado} onValueChange={(value) => setFormData({ ...formData, estado: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
            <SelectItem value="Suspendido">Suspendido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-[#1a1a1a] hover:bg-[#2a2a2a]">
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}

function ProductsManagement({
  products,
  setProducts,
}) {
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  const handleSaveProduct = (product) => {
    if (isAddingNew) {
      setProducts([...products, { ...product, id: `P${String(products.length + 1).padStart(3, "0")}` }])
      setIsAddingNew(false)
    } else {
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
    }
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId) => {
    setProducts(products.map((p) => (p.id === productId ? { ...p, estado: "Inactivo" } : p)))
  }

  const lowStockProducts = products.filter((p) => p.stock < 10 && p.estado === "Activo")

  return (
    <div className="space-y-6">
      {lowStockProducts.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="text-base text-yellow-800">⚠️ Alerta de Stock Bajo</CardTitle>
            <CardDescription className="text-yellow-700">
              {lowStockProducts.length} producto(s) con stock menor a 10 unidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-yellow-800">{product.nombre}</span>
                  <span className="font-medium text-yellow-900">{product.stock} unidades</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-lg border border-[#e5e5e5]">
        <div className="px-6 py-4 border-b border-[#e5e5e5] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#1a1a1a]">Gestión de Productos</h2>
            <p className="text-sm text-[#6b6b6b] mt-1">Administra el catálogo de productos de tu tienda</p>
          </div>
          <Dialog open={isAddingNew} onOpenChange={setIsAddingNew}>
            <DialogTrigger asChild>
              <Button className="bg-[#1a1a1a] hover:bg-[#2a2a2a]">Registrar Nuevo Producto</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Registrar Nuevo Producto</DialogTitle>
                <DialogDescription>Completa la información del nuevo producto para el catálogo</DialogDescription>
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
                  estado: "Activo",
                }}
                onSave={handleSaveProduct}
                onCancel={() => setIsAddingNew(false)}
                isNew
              />
            </DialogContent>
          </Dialog>
        </div>

        <div className="p-6">
          <Table>
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
                    <span className={product.stock < 10 ? "text-red-600 font-medium" : ""}>{product.stock}</span>
                  </TableCell>
                  <TableCell>{product.proveedor}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                        product.estado === "Activo" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {product.estado}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
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
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Editar Producto</DialogTitle>
                            <DialogDescription>Modifica la información del producto</DialogDescription>
                          </DialogHeader>
                          {editingProduct && (
                            <ProductForm
                              product={editingProduct}
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
  )
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nombre">Nombre del producto *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="categoria">Categoría *</Label>
          <Input
            id="categoria"
            value={formData.categoria}
            onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="descripcion">Descripción *</Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          required
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="precio">Precio (₡) *</Label>
          <Input
            id="precio"
            type="number"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: Number(e.target.value) })}
            required
            min="0"
          />
        </div>
        <div>
          <Label htmlFor="stock">Stock disponible *</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            required
            min="0"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="proveedor">Proveedor *</Label>
        <Input
          id="proveedor"
          value={formData.proveedor}
          onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="imagen">URL de la imagen</Label>
        <Input
          id="imagen"
          type="url"
          value={formData.imagen}
          onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-[#1a1a1a] hover:bg-[#2a2a2a]">
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reporte Diario</CardTitle>
            <CardDescription>Ventas de hoy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-[#6b6b6b]">Productos vendidos:</span>
              <span className="text-lg font-semibold text-[#1a1a1a]">{productsToday}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#6b6b6b]">Ingresos generados:</span>
              <span className="text-lg font-semibold text-[#1a1a1a]">₡{totalToday.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#6b6b6b]">Número de ventas:</span>
              <span className="text-lg font-semibold text-[#1a1a1a]">{todaySales.length}</span>
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
              <span className="text-sm text-[#6b6b6b]">Productos vendidos:</span>
              <span className="text-lg font-semibold text-[#1a1a1a]">{productsMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#6b6b6b]">Ingresos generados:</span>
              <span className="text-lg font-semibold text-[#1a1a1a]">₡{totalMonth.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-[#6b6b6b]">Número de ventas:</span>
              <span className="text-lg font-semibold text-[#1a1a1a]">{sales.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e5e5]">
        <div className="px-6 py-4 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Historial de Ventas</h2>
          <p className="text-sm text-[#6b6b6b] mt-1">Visualiza todas las ventas y facturas generadas</p>
        </div>

        <div className="p-6">
          <Table>
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
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Ver factura
                    </Button>
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

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pagos por Método</CardTitle>
            <CardDescription>Distribución de métodos de pago</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(paymentsByMethod).map(([method, count]) => (
              <div key={method} className="flex justify-between items-center">
                <span className="text-sm text-[#6b6b6b]">{method}</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#1a1a1a]" style={{ width: `${(count / sales.length) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-[#1a1a1a] w-8 text-right">{count}</span>
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
                <span className="text-sm text-[#6b6b6b]">{status}</span>
                <span className="text-lg font-semibold text-[#1a1a1a]">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e5e5]">
        <div className="px-6 py-4 border-b border-[#e5e5e5]">
          <h2 className="text-lg font-semibold text-[#1a1a1a]">Monitoreo de Pagos</h2>
          <p className="text-sm text-[#6b6b6b] mt-1">Estado detallado de todos los pagos registrados</p>
        </div>

        <div className="p-6">
          <Table>
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
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      Ver detalles
                    </Button>
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

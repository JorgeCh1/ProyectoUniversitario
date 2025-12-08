// src/modules/admin/components/ProductsManagement.jsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import productService from "@/modules/store/services/productService";

// Mapeo de productos ADMIN ➜ CLIENTE
// Lo que guardamos en localStorage para la tienda
function mapAdminToClientProducts(adminProducts) {
  return adminProducts.map((p) => ({
    id: p.id, // P001, P002, etc.
    name: p.nombre,
    description: p.descripcion,
    price: p.precio,
    stock: p.stock,
    category: p.categoria,
    provider: p.proveedor,
    // imagen principal: primera del array o la imagen suelta, o placeholder
    image:
      (Array.isArray(p.imagenes) && p.imagenes.length > 0
        ? p.imagenes[0]
        : p.imagen) || "/images/placeholder.png",
    // guardamos todas por si luego usamos slider en el front
    images:
      Array.isArray(p.imagenes) && p.imagenes.length > 0
        ? p.imagenes
        : p.imagen
        ? [p.imagen]
        : [],
    status: p.estado ?? "Activo",
  }));
}

// Formulario de producto con drag & drop de imágenes
function ProductForm({ product, onSave, onCancel, isNew = false }) {
  const [formData, setFormData] = useState({
    ...product,
    imagenes: product.imagenes || [],
  });
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files || []);
    if (!fileArray.length) return;

    // Usamos URL.createObjectURL para previsualizar (válido mientras la pestaña esté abierta)
    const newUrls = fileArray.map((file) => URL.createObjectURL(file));

    setFormData((prev) => ({
      ...prev,
      imagenes: [...(prev.imagenes || []), ...newUrls],
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeImage = (url) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((img) => img !== url),
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Nombre y categoría */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">
            Nombre del Producto *
          </legend>
          <Input
            id="nombre"
            className="border-none focus:ring-0 px-0"
            value={formData.nombre}
            onChange={(e) =>
              setFormData({ ...formData, nombre: e.target.value })
            }
            required
          />
        </fieldset>
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Categoría *</legend>
          <Input
            id="categoria"
            className="border-none focus:ring-0 px-0"
            value={formData.categoria}
            onChange={(e) =>
              setFormData({ ...formData, categoria: e.target.value })
            }
            required
          />
        </fieldset>
      </div>

      {/* Descripción */}
      <fieldset className="border border-slate-300 rounded-lg p-3">
        <legend className="text-xs text-slate-600 px-2">Descripción *</legend>
        <Textarea
          id="descripcion"
          className="border-none focus:ring-0 px-0"
          value={formData.descripcion}
          onChange={(e) =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          required
          rows={3}
        />
      </fieldset>

      {/* Precio y stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">Precio *</legend>
          <Input
            id="precio"
            type="number"
            className="border-none focus:ring-0 px-0"
            value={formData.precio}
            onChange={(e) =>
              setFormData({ ...formData, precio: Number(e.target.value) })
            }
            required
            min="0"
          />
        </fieldset>
        <fieldset className="border border-slate-300 rounded-lg p-3">
          <legend className="text-xs text-slate-600 px-2">
            Stock disponible *
          </legend>
          <Input
            id="stock"
            type="number"
            className="border-none focus:ring-0 px-0"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: Number(e.target.value) })
            }
            required
            min="0"
          />
        </fieldset>
      </div>

      {/* Proveedor */}
      <fieldset className="border border-slate-300 rounded-lg p-3">
        <legend className="text-xs text-slate-600 px-2">Proveedor *</legend>
        <Input
          id="proveedor"
          className="border-none focus:ring-0 px-0"
          value={formData.proveedor}
          onChange={(e) =>
            setFormData({ ...formData, proveedor: e.target.value })
          }
          required
        />
      </fieldset>

      {/* URL principal opcional */}
      <fieldset className="border border-slate-300 rounded-lg p-3">
        <legend className="text-xs text-slate-600 px-2">
          URL de la imagen principal (opcional)
        </legend>
        <Input
          id="imagen"
          type="url"
          className="border-none focus:ring-0 px-0"
          value={formData.imagen || ""}
          onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </fieldset>

      {/* Drag & Drop de imágenes extra */}
      <fieldset className="border border-slate-300 rounded-lg p-3 space-y-3">
        <legend className="text-xs text-slate-600 px-2">
          Imágenes del producto (drag & drop o seleccionar) *
        </legend>

        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg px-4 py-6 text-center cursor-pointer transition ${
            isDragging
              ? "border-brand-dark bg-slate-50"
              : "border-slate-300 bg-white"
          }`}
          onClick={() => {
            const input = document.getElementById("product-images-input");
            if (input) input.click();
          }}
        >
          <p className="text-xs md:text-sm text-slate-600">
            Arrastra y suelta tus imágenes aquí, o haz clic para seleccionarlas.
          </p>
          <p className="text-[11px] text-slate-400">
            Formatos permitidos: JPG, PNG, WEBP. Puedes subir varias.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-2 text-xs rounded-full px-4 border-brand-dark text-brand-dark"
          >
            Seleccionar archivos
          </Button>
          <input
            id="product-images-input"
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>

        {/* Previsualización de imágenes */}
        {formData.imagenes && formData.imagenes.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-slate-600 mb-2">
              Imágenes cargadas ({formData.imagenes.length}):
            </p>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {formData.imagenes.map((url, idx) => (
                <div
                  key={idx}
                  className="relative group border rounded-md overflow-hidden bg-slate-50"
                >
                  <img
                    src={url}
                    alt={`Imagen ${idx + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(url);
                    }}
                    className="absolute top-1 right-1 bg-black/60 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    Quitar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </fieldset>

      {/* Botones */}
      <div className="flex justify-center gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          className="rounded-full px-6 border-brand-dark text-brand-dark"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-brand-dark hover:bg-brand rounded-full px-6 shadow-sm"
        >
          {isNew ? "Registrar Producto" : "Guardar cambios"}
        </Button>
      </div>
    </form>
  );
}

// Vista principal de gestión de productos
export default function ProductsManagement({ products, setProducts }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Sincroniza ADMIN ➜ CLIENTE (localStorage)
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
                      <DialogContent className="max-w-[95vw] sm:max-w-xl md:max-w-2xl md:p-8">
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
  );
}

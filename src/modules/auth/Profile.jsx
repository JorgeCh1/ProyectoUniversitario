import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import cartService from "@/modules/store/services/cartService";

export default function Profile() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [status, setStatus] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "Femenino",
  });

  // Cargar usuario inicial
  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null");
      setCurrentUser(user);

      if (user) {
        setFormData({
          firstName: user.firstName || user.nombre || "",
          lastName: user.lastName || user.apellidos || "",
          email: user.email || "",
          phone: user.phone || user.telefono || "",
          gender: user.gender || user.genero || "Femenino",
        });
      }
    } catch (e) {
      console.error("Error cargando currentUser", e);
      setCurrentUser(null);
    }
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setStatus(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setStatus("error");
      return;
    }

    const updatedUser = {
      ...currentUser,
      firstName: formData.firstName,
      nombre: formData.firstName,
      lastName: formData.lastName,
      apellidos: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      telefono: formData.phone,
      gender: formData.gender,
      genero: formData.gender,
    };

    try {
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      setStatus("success");

      // Notificar a la app que cambió el usuario
      window.dispatchEvent(
        new CustomEvent("auth:changed", { detail: { user: updatedUser } })
      );
    } catch (err) {
      console.error("Error guardando perfil", err);
      setStatus("error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);

    try {
      cartService.setUser("guest");
      cartService.clearCart();
    } catch (_) {}

    try {
      window.dispatchEvent(
        new CustomEvent("auth:changed", { detail: { user: null } })
      );
    } catch (_) {}

    navigate("/login");
  };

  return (
    <section className="max-w-4xl mx-auto px-4 py-8 md:py-12">
      {/* Título general */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
          Mi cuenta
        </h1>

        <Button
          variant="outline"
          className="text-sm"
          type="button"
          onClick={handleLogout}
        >
          Cerrar sesión
        </Button>
      </div>

      {/* Card principal */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm px-4 py-6 md:px-8 md:py-8">
        {/* Encabezado: avatar + título */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="relative flex-shrink-0">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-slate-100 border-2 border-white shadow-md">
              <img
                src="/images/bellas-boutique-favicon-1.png"
                alt="Foto de perfil"
                className="h-full w-full object-cover"
              />
            </div>
            <button
              type="button"
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-indigo-500 flex items-center justify-center shadow text-white hover:bg-indigo-600"
              aria-label="Cambiar foto de perfil"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487 19.5 7.125m-2.638-2.638L10.5 11.488l-1.06 3.182 3.182-1.06 6.362-6.363m-2.638-2.638a1.875 1.875 0 1 1 2.652 2.652M5.25 6.75h4.5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 6.75A2.25 2.25 0 0 1 6.75 4.5h7.5A2.25 2.25 0 0 1 16.5 6.75v10.5A2.25 2.25 0 0 1 14.25 19.5h-7.5A2.25 2.25 0 0 1 4.5 17.25v-10.5Z"
                />
              </svg>
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Información personal
            </h2>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Actualiza tus datos de contacto y preferencias de cuenta.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nombre + Apellidos */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="firstName"
                className="text-xs font-medium text-slate-700"
              >
                Nombre *
              </Label>
              <Input
                id="firstName"
                placeholder="Nombre"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label
                htmlFor="lastName"
                className="text-xs font-medium text-slate-700"
              >
                Apellidos *
              </Label>
              <Input
                id="lastName"
                placeholder="Apellidos"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Email + Teléfono */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-slate-700"
              >
                Correo electrónico *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label
                htmlFor="phone"
                className="text-xs font-medium text-slate-700"
              >
                Teléfono *
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="12345678"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Género */}
          <div className="flex flex-col gap-1 max-w-xs">
            <Label
              htmlFor="gender"
              className="text-xs font-medium text-slate-700"
            >
              Género *
            </Label>
            <select
              id="gender"
              className="rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:ring-indigo-500"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
            >
              <option value="Femenino">Femenino</option>
              <option value="Masculino">Masculino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          </div>

          <Button
            type="submit"
            className="px-8 rounded-full bg-indigo-500 hover:bg-indigo-600 text-sm font-medium"
          >
            Actualizar
          </Button>

          {status === "success" && (
            <p className="text-xs text-emerald-600">
              Datos actualizados correctamente.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

// Clave donde guardamos los usuarios en localStorage
const STORAGE_KEY = "usuarios_app";

// Leer usuarios del localStorage
function getUsers() {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

// Guardar usuarios en el localStorage
function saveUsers(users) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// Opcional: crear un usuario de prueba si no hay ninguno
function ensureDefaultUser() {
  const users = getUsers();
  if (users.length === 0) {
    const defaultUser = {
      idUser: "1",
      cedula: "000-000-000",
      nombre: "Admin",
      apellidos: "Demo",
      email: "admin@demo.com",
      telefono: "00000000",
      direccion: "N/A",
      rol: "Administrador",
      password: "123456",
    };
    users.push(defaultUser);
    saveUsers(users);
  }
}
ensureDefaultUser();

// ---------- LOGIN ----------
export function login({ email, password }) {
  const users = getUsers();

  const user = users.find(
    (u) => u.email === email.trim() && u.password === password
  );

  if (!user) {
    return {
      success: false,
      error: "Correo o contraseña incorrectos.",
    };
  }

  return {
    success: true,
    user,
  };
}

// ---------- REGISTRO ----------
export function registerUser({
  idUser,
  cedula,
  nombre,
  apellidos,
  emailRegistro,
  telefono,
  direccion,
  rol,
  passwordRegistro,
}) {
  const users = getUsers();
  const email = emailRegistro.trim();

  if (!email || !passwordRegistro || !nombre) {
    return {
      success: false,
      message: "Nombre, correo y contraseña son obligatorios.",
    };
  }

  const exists = users.some((u) => u.email === email);
  if (exists) {
    return {
      success: false,
      message: "Ya existe un usuario registrado con este correo.",
    };
  }

  const newUser = {
    idUser: idUser || Date.now().toString(),
    cedula,
    nombre,
    apellidos,
    email,
    telefono,
    direccion,
    rol: rol || "Cliente",
    password: passwordRegistro,
  };

  users.push(newUser);
  saveUsers(users);

  return {
    success: true,
    message: "Usuario registrado correctamente.",
    user: newUser,
  };
}

// ---------- RESET PASSWORD ----------
export function resetPassword(email) {
  const users = getUsers();
  const userIndex = users.findIndex((u) => u.email === email.trim());

  if (userIndex === -1) {
    return {
      success: false,
      message: "No existe un usuario con ese correo.",
    };
  }

  const newPassword = Math.random().toString(36).slice(-8); // password simple
  users[userIndex].password = newPassword;
  saveUsers(users);

  return {
    success: true,
    message: "Contraseña restablecida correctamente",
    newPassword,
  };
}

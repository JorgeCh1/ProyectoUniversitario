import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, registerUser, resetPassword } from "./services/authService";
import cartService from "../store/services/cartService";

import Input from "../../components/ui/input";
import Button from "../../components/ui/button";

import "./auth.css";

export default function Login() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const navigate = useNavigate();

  // -------- estados LOGIN ----------
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // -------- estados REGISTRO ----------
  const [idUser, setIdUser] = useState("");
  const [cedula, setCedula] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [emailRegistro, setEmailRegistro] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [rol, setRol] = useState("Cliente");
  const [passwordRegistro, setPasswordRegistro] = useState("");
  const [registroMsg, setRegistroMsg] = useState("");

  // -------- estados MODAL "Olvidaste contraseña" ----------
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");

  // ------------- HANDLERS ----------------

  function handleLogin(e) {
    e.preventDefault();

    const { success, error, user } = login({
      email: loginEmail,
      password: loginPassword,
    });

    if (!success) {
      setLoginError(error || "Error al iniciar sesión.");
      return;
    }

    setLoginError("");

    // Guardar usuario actual en localStorage para que otros componentes conozcan el estado de autenticación
    try {
      localStorage.setItem("currentUser", JSON.stringify(user));
      // asociar carrito con este usuario
      try {
        cartService.setUser(user.idUser);
      } catch (_err) {
        // ignorar
      }
      // notificar a otras partes de la aplicación
      try {
        window.dispatchEvent(
          new CustomEvent("auth:changed", { detail: { user } })
        );
      } catch (_err) {
        // ignorar
      }
    } catch (err) {
      console.warn("Could not save currentUser to localStorage", err);
    }

    // Redirect based on role
    if (user.rol === "Cliente") {
      navigate("/");
    } else {
      navigate("/admin");
    }
  }

  function handleRegister(e) {
    e.preventDefault();
    setRegistroMsg("");

    const {
      success,
      message,
      user: createdUser,
    } = registerUser({
      idUser,
      cedula,
      nombre,
      apellidos,
      emailRegistro,
      telefono,
      direccion,
      rol,
      passwordRegistro,
    });

    setRegistroMsg(message);
    if (!success) return;

    // Si el registro devolvió el usuario creado, auto-iniciar sesión
    if (createdUser) {
      try {
        localStorage.setItem("currentUser", JSON.stringify(createdUser));
        try {
          cartService.setUser(createdUser.idUser);
        } catch (_err) {
          // ignorar
        }
        window.dispatchEvent(
          new CustomEvent("auth:changed", { detail: { user: createdUser } })
        );
      } catch (_err) {
        // ignorar
      }

      if (createdUser.rol === "Cliente") navigate("/");
      else navigate("/admin");
    }

    setIdUser("");
    setCedula("");
    setNombre("");
    setApellidos("");
    setEmailRegistro("");
    setTelefono("");
    setDireccion("");
    setRol("Cliente");
    setPasswordRegistro("");
  }

  function handleForgotPassword(e) {
    e.preventDefault();

    if (!forgotEmail.trim()) {
      setForgotError("Por favor ingresa tu correo electrónico.");
      return;
    }

    const { success, message, newPassword } = resetPassword(forgotEmail);

    if (!success) {
      setForgotError(message || "No se pudo restablecer la contraseña.");
      return;
    }

    alert(`${message}\nNueva contraseña: ${newPassword}`);

    setIsForgotOpen(false);
    setIsSignUpMode(false);
    setForgotEmail("");
  }

  return (
    <>
      <div className="auth-page">
        <div className={`auth-container ${isSignUpMode ? "sign-up-mode" : ""}`}>
          {/* LOGIN */}
          <div className="form-container sign-in-container">
            <form className="form" onSubmit={handleLogin}>
              <h2>Iniciar sesión</h2>

              <Input
                type="email"
                placeholder="Correo electrónico"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />

              <Input
                type="password"
                placeholder="Contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />

              <div className="form-extra">
                <label className="remember">
                  <input type="checkbox" /> Recuérdame
                </label>

                <button
                  type="button"
                  className="link"
                  onClick={() => {
                    setIsForgotOpen(true);
                    setIsSignUpMode(false);
                  }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {loginError && <p className="error-text">{loginError}</p>}

              <Button type="submit" className="btn main-btn">
                INGRESAR
              </Button>

              {/* SOLO PARA MOVIL */}
              <p className="mobile-switch">
                ¿No tienes cuenta?
                <button
                  type="button"
                  className="mobile-switch-link"
                  onClick={() => setIsSignUpMode(true)}
                >
                  Crear cuenta
                </button>
              </p>
            </form>
          </div>

          {/* REGISTRO */}
          <div className="form-container sign-up-container">
            <form className="form" onSubmit={handleRegister}>
              <h2>Crear cuenta</h2>

              <Input
                type="text"
                placeholder="Cédula"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Nombres"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Apellidos"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
              />
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={emailRegistro}
                onChange={(e) => setEmailRegistro(e.target.value)}
              />
              <Input
                type="tel"
                placeholder="Teléfono"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
              <Input
                type="text"
                placeholder="Dirección"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Contraseña"
                value={passwordRegistro}
                onChange={(e) => setPasswordRegistro(e.target.value)}
              />

              {registroMsg && (
                <p
                  className={
                    registroMsg.includes("correctamente")
                      ? "ok-text"
                      : "error-text"
                  }
                >
                  {registroMsg}
                </p>
              )}

              <Button type="submit" className="btn main-btn">
                REGISTRARSE
              </Button>

              {/* SOLO MOVIL */}
              <p className="mobile-switch">
                ¿Ya tienes cuenta?
                <button
                  type="button"
                  className="mobile-switch-link"
                  onClick={() => setIsSignUpMode(false)}
                >
                  Iniciar sesión
                </button>
              </p>
            </form>
          </div>

          {/* PANEL MORADO */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h2>¿Ya tienes cuenta?</h2>
                <p>Inicia sesión y administra tu cuenta fácilmente.</p>
                <Button
                  className="btn ghost-btn"
                  type="button"
                  onClick={() => setIsSignUpMode(false)}
                >
                  INICIAR SESIÓN
                </Button>
              </div>

              <div className="overlay-panel overlay-right">
                <h2>Bienvenido</h2>
                <p>Únete y disfruta de todos nuestros servicios.</p>
                <Button
                  className="btn ghost-btn"
                  type="button"
                  onClick={() => setIsSignUpMode(true)}
                >
                  CREAR CUENTA
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL "OLVIDASTE CONTRASEÑA" */}
      {isForgotOpen && (
        <div
          className="forgot-modal-backdrop"
          onClick={() => setIsForgotOpen(false)}
        >
          <div className="forgot-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-modal-btn"
              onClick={() => setIsForgotOpen(false)}
            >
              ✕
            </button>

            <h3>Recuperar contraseña</h3>
            <p>Ingresa tu correo electrónico para restablecer tu contraseña.</p>

            <form onSubmit={handleForgotPassword} className="forgot-form">
              <Input
                type="email"
                placeholder="Correo electrónico"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              {forgotError && <p className="error-text">{forgotError}</p>}

              <div className="forgot-actions">
                <button
                  type="button"
                  className="btn ghost-btn"
                  onClick={() => setIsForgotOpen(false)}
                >
                  Cancelar
                </button>

                <button type="submit" className="btn main-btn">
                  Aceptar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

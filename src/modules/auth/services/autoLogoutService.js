// autoLogoutService.js

let timerId = null;

const DEBUG_MODE = false; // poner true para pruebas rápidas
const INACTIVITY_TIME = DEBUG_MODE ? 10 * 1000 : 5 * 60 * 1000;


// eventos que indican actividad del usuario
const activityEvents = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
];

/**
 * Inicia la vigilancia de inactividad.
 * @param {Function} onLogout - función a ejecutar cuando se detecte inactividad
 */
function startAutoLogout(onLogout) {
  stopAutoLogout(); // por seguridad, limpiamos event listeners previos

  const resetTimer = () => {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      console.log("Sesión cerrada por inactividad (5 minutos)");
      onLogout && onLogout();
    }, INACTIVITY_TIME);
  };

  // asignar listeners
  activityEvents.forEach((eventName) => {
    window.addEventListener(eventName, resetTimer);
  });

  // inicializar por primera vez
  resetTimer();
}

/**
 * Detiene la vigilancia (se llama cuando el usuario cierra sesión manualmente).
 */
function stopAutoLogout() {
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }

  activityEvents.forEach((eventName) => {
    window.removeEventListener(eventName, () => {});
  });
}

export default {
  startAutoLogout,
  stopAutoLogout,
};

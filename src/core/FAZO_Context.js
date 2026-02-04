// ================================
// FAZO_Context.js
// Memoria viva del sistema FAZO OS
// ================================

export const FAZO_CONTEXT = {
  moduloActivo: "inicio",
  submodulo: null,
  ultimaActualizacion: null,
};

export function setFAZOContext(data) {
  Object.assign(FAZO_CONTEXT, data, {
    ultimaActualizacion: new Date().toISOString(),
  });

  // Exponer globalmente (CLAVE)
  window.__FAZO_CONTEXT__ = FAZO_CONTEXT;

  console.log("🧠 FAZO CONTEXT:", FAZO_CONTEXT);
}

// ======================================================================
//  AURA_NEXUS.js — Event Matrix & Router 2025 (Versión Final)
//  FAZO LOGÍSTICA — Conexión central entre AURA_Agent, AURAChat y FAZO OS
// ======================================================================

const listeners = new Set();

// ===============================================================
// 1) Subscribirse a eventos del sistema (AURAChat / FAZO / Agent)
// ===============================================================
export function nexus_subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// ===============================================================
// 2) Emitir evento a todos los subsistemas
// ===============================================================
export function nexus_emit(evento, data = {}) {
  listeners.forEach((fn) => {
    try {
      fn({ evento, data });
    } catch (e) {
      console.error("Error manejando evento en Nexus:", e);
    }
  });
}

// ===============================================================
// 3) Métodos rápidos para disparar eventos
// ===============================================================

export const Nexus = {
  // AURA AGENT → NOTIFICACIONES AUTOMÁTICAS
  alerta_operacional(sugerencias) {
    nexus_emit("AURA_ALERTA_OPERACIONAL", { sugerencias });
  },

  // AURA Inteligencia interna
  accion_interna(accion, payload) {
    nexus_emit("AURA_ACCION", { accion, payload });
  },

  // AURA → FAZO OS (navegación, subrutas, etc.)
  comando_fazo(cmd) {
    nexus_emit("AURA_COMANDO_OS", cmd);
  },

  // Logs útiles
  log(msg) {
    nexus_emit("AURA_LOG", { msg });
  },
};

// Export por defecto
export default Nexus;

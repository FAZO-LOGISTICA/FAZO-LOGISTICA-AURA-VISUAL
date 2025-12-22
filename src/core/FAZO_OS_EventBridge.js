// ======================================================================
//  FAZO_OS_EventBridge.js — Bus de Eventos Global FAZO OS 2025
//  Conexión entre: AURAChat ↔ NEXUS ↔ Agent ↔ App.js ↔ Iframes
//  Versión Oficial — Compatible con Autonomía y MultiModel
// ======================================================================

class EventBridge {
  constructor() {
    this.listeners = {};
  }

  // ------------------------------------------------------------
  // REGISTRAR SUSCRIPTORES
  // ------------------------------------------------------------
  on(evento, callback) {
    if (!this.listeners[evento]) {
      this.listeners[evento] = [];
    }
    this.listeners[evento].push(callback);
  }

  // ------------------------------------------------------------
  // EMITIR EVENTO A TODO EL SISTEMA
  // ------------------------------------------------------------
  emit(evento, payload = {}) {
    console.log("📡 Evento emitido:", evento, payload);

    // Enviar a todos los listeners internos
    if (this.listeners[evento]) {
      this.listeners[evento].forEach((cb) => cb(payload));
    }

    // Propagar también al navegador → AURAChat lo escucha
    window.dispatchEvent(
      new CustomEvent(evento, {
        detail: payload,
      })
    );
  }

  // ------------------------------------------------------------
  // LIMPIAR LISTENERS
  // ------------------------------------------------------------
  clear(evento) {
    if (this.listeners[evento]) {
      this.listeners[evento] = [];
    }
  }
}

// Instancia única global
export const FAZO_OS_EventBridge = new EventBridge();


// ======================================================================
//  WRAPPERS PARA EVENTOS ESPECÍFICOS DE AURA
// ======================================================================

// AURA abre módulo completo (AguaRuta, Flota, Traslado…)
export function eventoAbrirModulo(modulo) {
  FAZO_OS_EventBridge.emit("AURA_MODULO", { modulo });
}

// AURA abre panel interno (subruta)
export function eventoAbrirSubruta(modulo, ruta) {
  FAZO_OS_EventBridge.emit("AURA_SUBRUTA", { modulo, ruta });
}

// Acción del sistema (logout, filtros, etc.)
export function eventoAccionSistema(accion, payload = {}) {
  FAZO_OS_EventBridge.emit("AURA_ACCION", { accion, payload });
}

// Alertas del AURA Agent
export function eventoAnalisisAutomatico(sugerencias) {
  FAZO_OS_EventBridge.emit("AURA_ANALISIS_AUTOMATICO", { sugerencias });
}

// Envío genérico desde NEXUS
export function enviarEventoDesdeAURA(intent) {
  if (intent.tipo === "accion") {
    eventoAccionSistema(intent.accion, intent.payload || {});
    return;
  }

  if (intent.tipo === "modulo") {
    eventoAbrirModulo(intent.modulo);
    return;
  }

  if (intent.tipo === "subruta") {
    eventoAbrirSubruta("aguaruta", intent.ruta);
    return;
  }

  console.warn("⚠️ Intent desconocido recibido en EventBridge:", intent);
}

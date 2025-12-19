// ======================================================================
//  FAZO_OS_EventBridge.js — Puente Universal AURA → FAZO OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Router central entre acciones y App.js
// ======================================================================

// Suscriptores registrados (App.js y otros módulos)
const subscriptores = new Set();

/* ============================================================
   REGISTRAR SUBSISTEMA
   App.js u otros módulos llaman a esto para escuchar comandos
=============================================================== */
export function registrarSubsistema(callback) {
  if (typeof callback === "function") {
    subscriptores.add(callback);
  }
}

/* ============================================================
   ENVIAR EVENTO A TODOS LOS SUBSISTEMAS
=============================================================== */
export function emitirEvento(evento) {
  subscriptores.forEach((cb) => {
    try {
      cb(evento);
    } catch (err) {
      console.error("❌ Error en subsistema FAZO OS:", err);
    }
  });
}

/* ============================================================
   TIPOS DE EVENTOS ESTÁNDAR QUE AURA ENVÍA
=============================================================== */

export function eventoAbrirModulo(modulo) {
  emitirEvento({
    tipo: "AURA_MODULO",
    modulo,
  });
}

export function eventoAbrirSubruta(modulo, ruta) {
  emitirEvento({
    tipo: "AURA_SUBRUTA",
    modulo,
    ruta,
  });
}

export function eventoAccionSistema(accion, payload = {}) {
  emitirEvento({
    tipo: "AURA_ACCION",
    accion,
    payload,
  });
}

/* ============================================================
   EVENTOS ESPECIALES PARA ANÁLISIS AUTOMÁTICOS
=============================================================== */
export function eventoAnalisisAutomatico(sugerencias) {
  emitirEvento({
    tipo: "AURA_ANALISIS_AUTOMATICO",
    payload: { sugerencias },
  });
}

/* ============================================================
   ENVOLTORIO GENERAL — EL NEXUS LLAMA ESTO
=============================================================== */

export function enviarEventoDesdeAURA(intent) {
  // -------------------------------
  // ACCIÓN SIMPLE
  // -------------------------------
  if (intent.tipo === "accion") {
    eventoAccionSistema(intent.accion, intent.payload || {});
    return;
  }

  // -------------------------------
  // MÓDULO COMPLETO (AguaRuta, Flota, Traslado…)
  // -------------------------------
  if (intent.tipo === "modulo") {
    eventoAbrirModulo(intent.modulo);
    return;
  }

  // -------------------------------
  // SUBRUTA (paneles internos AguaRuta)
  // -------------------------------
  if (intent.tipo === "subruta") {
    eventoAbrirSubruta("aguaruta", intent.ruta);
    return;
  }

  console.warn("⚠️ Intent desconocido recibido en EventBridge:", intent);
}

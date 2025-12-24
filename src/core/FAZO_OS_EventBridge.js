// ======================================================================
//  FAZO_OS_EventBridge.js — Puente Universal AURA ↔ FAZO OS
//  VERSIÓN LOG — Paso 4 (Integración completa con FAZO_OS_Log)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Router central entre acciones, módulos y subrutas
// ======================================================================

import { LOG } from "./FAZO_OS_Log"; // 🔵 Logger global

// Lista de subscriptores (App.js + otros módulos)
const subscriptores = new Set();

/* ======================================================================
   REGISTRAR SUBSISTEMA (App.js u otros módulos)
====================================================================== */
export function registrarSubsistema(callback) {
  if (typeof callback === "function") {
    subscriptores.add(callback);
    LOG.evento("Subsistema registrado", { callback: callback.name || "anon" });
  } else {
    LOG.error("Intento de registrar subsistema inválido", { callback });
  }
}

/* ======================================================================
   EMITIR EVENTO A TODOS LOS SUBSISTEMAS
====================================================================== */
export function emitirEvento(evento) {
  LOG.evento("Emitiendo evento global FAZO OS", evento);

  subscriptores.forEach((cb) => {
    try {
      cb(evento);
    } catch (err) {
      LOG.error("❌ Error ejecutando callback de subsistema", {
        error: err.message || err,
        evento,
      });
    }
  });
}

/* ======================================================================
   EVENTOS DE ALTO NIVEL (AURA → FAZO OS)
====================================================================== */

// ---------------------------
// MÓDULO COMPLETO
// ---------------------------
export function eventoAbrirModulo(modulo) {
  LOG.evento("AURA solicita abrir módulo", { modulo });

  emitirEvento({
    tipo: "AURA_MODULO",
    modulo,
  });
}

// ---------------------------
// SUBRUTA (panel interno)
// ---------------------------
export function eventoAbrirSubruta(modulo, ruta) {
  LOG.evento("AURA solicita abrir subruta", { modulo, ruta });

  emitirEvento({
    tipo: "AURA_SUBRUTA",
    modulo,
    ruta,
  });
}

// ---------------------------
// ACCIONES DEL SISTEMA
// ---------------------------
export function eventoAccionSistema(accion, payload = {}) {
  LOG.evento("AURA ejecuta acción del sistema", { accion, payload });

  emitirEvento({
    tipo: "AURA_ACCION",
    accion,
    payload,
  });
}

// ---------------------------
// ANÁLISIS AUTOMÁTICO — AURA Agent
// ---------------------------
export function eventoAnalisisAutomatico(sugerencias) {
  LOG.evento("AURA Agent envía análisis automático", { sugerencias });

  emitirEvento({
    tipo: "AURA_ANALISIS_AUTOMATICO",
    payload: { sugerencias },
  });
}

/* ======================================================================
   ENVOLTORIO CENTRAL — NEXUS → EVENTBRIDGE
   (AURA_NEXUS llama este método)
====================================================================== */
export function enviarEventoDesdeAURA(intent) {
  LOG.evento("Intent recibido desde AURA_NEXUS", intent);

  switch (intent.tipo) {
    case "accion":
      eventoAccionSistema(intent.accion, intent.payload || {});
      break;

    case "modulo":
      eventoAbrirModulo(intent.modulo);
      break;

    case "subruta":
      eventoAbrirSubruta("aguaruta", intent.ruta);
      break;

    default:
      LOG.error("Intent desconocido en EventBridge", intent);
  }
}

// ======================================================================
// FIN DEL ARCHIVO — VERSIÓN COMPLETA
// ======================================================================

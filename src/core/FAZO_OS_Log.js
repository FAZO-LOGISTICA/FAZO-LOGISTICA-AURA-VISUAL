// ======================================================================
//  FAZO_OS_Log.js — Sistema de registros y diagnóstico FAZO OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Captura de eventos, acciones y errores
// ======================================================================

// KEY para almacenar en localStorage
const KEY = "FAZO_OS_LOG_V1";

// ============================================================
// Cargar logs existentes
// ============================================================
export function cargarLogs() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("❌ Error cargando logs:", err);
    return [];
  }
}

// ============================================================
// Guardar log en memoria persistente
// ============================================================
export function guardarLog(tipo, mensaje, extra = {}) {
  const logs = cargarLogs();

  logs.push({
    tipo,
    mensaje,
    fecha: new Date().toISOString(),
    extra,
  });

  localStorage.setItem(KEY, JSON.stringify(logs));
}

// ============================================================
// API rápida de logs
// ============================================================
export const LOG = {
  info(msg, extra) {
    guardarLog("INFO", msg, extra);
    console.log("ℹ️ INFO:", msg, extra || "");
  },

  accion(msg, extra) {
    guardarLog("ACCION", msg, extra);
    console.log("⚡ ACCIÓN:", msg, extra || "");
  },

  intent(msg, extra) {
    guardarLog("INTENT", msg, extra);
    console.log("🎯 INTENT:", msg, extra || "");
  },

  error(msg, extra) {
    guardarLog("ERROR", msg, extra);
    console.error("❌ ERROR:", msg, extra || "");
  },

  ia(msg, extra) {
    guardarLog("IA", msg, extra);
    console.log("🤖 IA:", msg, extra || "");
  },

  agente(msg, extra) {
    guardarLog("AGENTE", msg, extra);
    console.log("🛰️ AGENTE:", msg, extra || "");
  },
};

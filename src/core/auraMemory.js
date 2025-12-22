// ======================================================================
//  AURAMemory.js — Núcleo de Memoria Persistente de AURA OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Sistema de memoria estructural + aprendizaje continuo
// ======================================================================

// Clave para localStorage
const KEY = "AURA_MEMORY_V3";

// ============================================================
// Cargar memoria desde localStorage
// ============================================================
export function cargarMemoria() {
  try {
    const data = localStorage.getItem(KEY);
    if (!data) {
      return {
        preferencias: {},
        historialAcciones: [],
        patronesUso: {},
        alertasPersistentes: [],
        duplicadosHistoricos: [],
        puntosSinGeo: [],
      };
    }
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ Error cargando memoria AURA:", err);
    return {
      preferencias: {},
      historialAcciones: [],
      patronesUso: {},
      alertasPersistentes: [],
      duplicadosHistoricos: [],
      puntosSinGeo: [],
    };
  }
}

// ============================================================
// Guardar memoria
// ============================================================
export function guardarMemoria(mem) {
  try {
    localStorage.setItem(KEY, JSON.stringify(mem));
  } catch (err) {
    console.error("❌ Error guardando memoria AURA:", err);
  }
}

// ============================================================
// Registrar acción del usuario (para aprender hábitos)
// ============================================================
export function registrarAccion(accion, detalle = "") {
  const mem = cargarMemoria();

  mem.historialAcciones.push({
    accion,
    detalle,
    fecha: new Date().toISOString(),
  });

  // Guardar patrones: cuántas veces se usa cada módulo
  if (!mem.patronesUso[accion]) mem.patronesUso[accion] = 0;
  mem.patronesUso[accion]++;

  guardarMemoria(mem);
}

// ============================================================
// Guardar preferencias del sistema
// Ej: {avatar: "sin ojos", tamañoPanel: "xl"}
//
// ============================================================
export function guardarPreferencia(key, value) {
  const mem = cargarMemoria();
  mem.preferencias[key] = value;
  guardarMemoria(mem);
}

// ============================================================
// Obtener preferencia
// ============================================================
export function obtenerPreferencia(key, fallback = null) {
  const mem = cargarMemoria();
  return mem.preferencias[key] ?? fallback;
}

// ============================================================
// Guardar alertas recurrentes (ej: "puntos sin GPS")
// Para que AURA aprenda patrones de fallos
// ============================================================
export function registrarAlertaPersistente(texto) {
  const mem = cargarMemoria();

  if (!mem.alertasPersistentes.includes(texto)) {
    mem.alertasPersistentes.push(texto);
    guardarMemoria(mem);
  }
}

// ============================================================
// Guardar duplicados estructurales
// ============================================================
export function guardarDuplicados(lista) {
  const mem = cargarMemoria();
  mem.duplicadosHistoricos = lista;
  guardarMemoria(mem);
}

// ============================================================
// Guardar puntos sin coordenadas
// ============================================================
export function guardarPuntosSinGeo(lista) {
  const mem = cargarMemoria();
  mem.puntosSinGeo = lista;
  guardarMemoria(mem);
}

// ============================================================
// Obtener resumen de memoria para mostrar en AURA
// ============================================================
export function obtenerResumenMemoria() {
  const mem = cargarMemoria();

  return {
    preferencias: mem.preferencias,
    patronesUso: mem.patronesUso,
    alertasPersistentes: mem.alertasPersistentes,
    duplicadosHistoricos: mem.duplicadosHistoricos,
    puntosSinGeo: mem.puntosSinGeo,
    ultimasAcciones: mem.historialAcciones.slice(-8),
  };
}

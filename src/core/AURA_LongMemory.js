// ======================================================================
//  AURA_LongMemory.js — Memoria de Largo Plazo de AURA OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Sistema Persistente 2025
// ======================================================================

const KEY = "AURA_LONG_MEMORY_V1";

// Estructura base
function baseMemoria() {
  return {
    datos: [],       // Recuerdos estructurados
    preferencias: {}, // Configuraciones del usuario
    reglas: []        // Reglas para AutoFix / Nexus
  };
}

// ============================================================
//  Cargar memoria desde LocalStorage
// ============================================================
export function cargarLTM() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return baseMemoria();
    return JSON.parse(raw);
  } catch (e) {
    console.warn("⚠️ Error cargando memoria de AURA:", e);
    return baseMemoria();
  }
}

// ============================================================
//  Guardar memoria completa
// ============================================================
function guardarLTM(mem) {
  localStorage.setItem(KEY, JSON.stringify(mem));
}

// ============================================================
//  GUARDAR DATO (frases del usuario)
// ============================================================
export function memorizarDato(clave, valor) {
  const mem = cargarLTM();

  mem.datos.push({
    id: Date.now(),
    clave,
    valor,
    fecha: new Date().toISOString()
  });

  guardarLTM(mem);
}

// ============================================================
//  GUARDAR REGLA (para AutoFix o toma de decisiones)
// ============================================================
export function memorizarRegla(descripcion, condicion, accion) {
  const mem = cargarLTM();

  mem.reglas.push({
    id: Date.now(),
    descripcion,
    condicion,
    accion,
    fecha: new Date().toISOString(),
  });

  guardarLTM(mem);
}

// ============================================================
//  GUARDAR PREFERENCIA DEL USUARIO
// ============================================================
export function setPreferencia(key, value) {
  const mem = cargarLTM();
  mem.preferencias[key] = value;
  guardarLTM(mem);
}

// ============================================================
//  Obtener últimas memorias para ayudarse en análisis
// ============================================================
export function obtenerResumenMemoria() {
  const mem = cargarLTM();

  return {
    ultimosDatos: mem.datos.slice(-10),
    reglas: mem.reglas,
    preferencias: mem.preferencias
  };
}

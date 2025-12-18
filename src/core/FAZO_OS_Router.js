// ======================================================================
//  FAZO_OS_Router.js — Mensajería interna entre módulos FAZO OS
//  Envia alertas automáticas a AURA y otros subsistemas
// ======================================================================

import { AURA_Agent } from "./AURA_Agent";

let subsistemas = [];

export function registrarSubsistema(callback) {
  subsistemas.push(callback);
}

function emitir(evento) {
  subsistemas.forEach((fn) => fn(evento));
}

// =====================================================
// ANÁLISIS AUTOMÁTICO (cada X tiempo o manual)
// =====================================================
export async function analizarManual(getDataFn) {
  const datos = getDataFn ? getDataFn() : {};
  const problemas = AURA_Agent.analizarContexto(datos);
  const sugerencias = AURA_Agent.generarSugerencias();

  AURA_Agent.actuarSiEsNecesario();

  return { problemas, sugerencias };
}

// =====================================================
// AUTO-ANÁLISIS PROGRAMADO (opcional futuro cron)
// =====================================================
export function autoAnalisis(datos) {
  const problemas = AURA_Agent.analizarContexto(datos);
  const sugerencias = AURA_Agent.generarSugerencias();

  emitir({
    tipo: "AURA_ANALISIS_AUTOMATICO",
    payload: { problemas, sugerencias },
  });
}

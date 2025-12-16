// ========================================================================
//   AURA_Agent.js — Motor Autónomo FAZO OS v1.0
//   Razonamiento • Análisis de rutas • Decisiones automáticas
//   Autor: Mateo IA — Para Gustavo Oliva (FAZO LOGÍSTICA)
// ========================================================================

import interpretar from "./AURA_NaturalLanguage";

/*
ESTRUCTURA DEL AGENTE
---------------------
1) Interpreta el texto natural (modismos, frases ambiguas)
2) Deduce la INTENCIÓN REAL del usuario
3) Aplica reglas inteligentes
4) Devuelve una acción clara para el sistema:

{
  tipo: "accion",
  accion: "analizar-rutas",
  objetivo: "A1",
  frase: "Analizando rutas del camión A1…"
}
*/

export function AURA_Agent(texto) {
  if (!texto) return null;

  const base = interpretar(texto);
  const t = texto.toLowerCase();

  // ============================================================
  //   1) REGLAS DE DIAGNÓSTICO INTELIGENTE
  // ============================================================
  if (
    t.includes("raro") ||
    t.includes("mal") ||
    t.includes("desbalanceado") ||
    t.includes("mucho") ||
    t.includes("poco")
  ) {
    return {
      tipo: "analisis",
      accion: "diagnostico-operacional",
      frase: "Ejecutando diagnóstico inteligente de la operación.",
    };
  }

  // diagnosticar camión específico
  const camiones = ["a1", "a2", "a3", "a4", "a5", "m1", "m2", "m3"];
  const camionDetectado = camiones.find((c) => t.includes(c));

  if (camionDetectado) {
    return {
      tipo: "analisis",
      accion: "analizar-camion",
      objetivo: camionDetectado.toUpperCase(),
      frase: `Revisando comportamiento del camión ${camionDetectado.toUpperCase()}.`,
    };
  }

  // ============================================================
  //   2) REGLAS DE REDISTRIBUCIÓN
  // ============================================================
  if (t.includes("redistribuye") || t.includes("rebalancea") || t.includes("mueve rutas")) {
    return {
      tipo: "accion",
      accion: "redistribuir",
      modo: "total",
      frase: "Iniciando redistribución completa de rutas.",
    };
  }

  if (t.includes("equilibra") || t.includes("balancea")) {
    return {
      tipo: "accion",
      accion: "redistribuir",
      modo: "parcial",
      frase: "Realizando un balance de carga parcial.",
    };
  }

  // ============================================================
  //   3) ANÁLISIS DE DÍAS
  // ============================================================
  if (t.includes("viernes")) {
    return {
      tipo: "analisis",
      accion: "analizar-viernes",
      frase: "Analizando la carga del día viernes.",
    };
  }

  if (t.includes("lunes")) {
    return {
      tipo: "analisis",
      accion: "analizar-dia",
      objetivo: "lunes",
      frase: "Revisando operación del lunes.",
    };
  }

  // ============================================================
  //   4) PROBLEMAS POTENCIALES
  // ============================================================
  if (t.includes("duplicado") || t.includes("dos veces")) {
    return {
      tipo: "analisis",
      accion: "buscar-duplicados",
      frase: "Buscando registros duplicados.",
    };
  }

  if (t.includes("muchos litros") || t.includes("pocos litros")) {
    return {
      tipo: "analisis",
      accion: "analizar-litros",
      frase: "Verificando distribución de litros.",
    };
  }

  // ============================================================
  //   5) FALLBACK INTELIGENTE
  // ============================================================
  if (base?.tipo === "general") {
    return {
      tipo: "general",
      frase: "¿Quieres revisar rutas, litros, camiones o redistribución?",
    };
  }

  // ============================================================
  //   6) SI EL MÓDULO BASE YA DIO UNA RESPUESTA → USARLA
  // ============================================================
  return base;
}

export default AURA_Agent;

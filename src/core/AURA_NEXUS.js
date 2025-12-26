// ======================================================================
//  AURA_NEXUS.js — Núcleo de decisión de AURA (PASO 11 COMPLETO)
//  Integra:
//  - NLP (intents)
//  - Acciones del sistema
//  - Subrutas
//  - Módulos FAZO OS
//  - AutoFix (nuevo)
//  - IA Multimodel
//  - Modo offline
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { ejecutarAutoFix } from "./AURA_AutoFix";   // ⬅️ NUEVO
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { analizarManual } from "./FAZO_OS_Router";

// ======================================================================
//   FUNCIÓN PRINCIPAL
// ======================================================================

export async function AURA_NEXUS(texto, historial, online) {
  const intent = interpretar(texto);

  // ============================================================
  // 1) AUTOFIX — SISTEMA DE REPARACIÓN INTELIGENTE
  // ============================================================
  if (intent.tipo === "autofix") {
    const resultado = await ejecutarAutoFix(intent.modo);

    return {
      tipo: "autofix",
      respuesta: intent.frase + "\n" + resultado.mensaje,
    };
  }

  // ============================================================
  // 2) ACCIONES DIRECTAS DEL SISTEMA (logout, abrir mapa, etc.)
  // ============================================================
  if (intent.tipo === "accion") {
    ejecutarAccion(intent.accion, intent.payload || {});
    return {
      tipo: "accion",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 3) SUBRUTAS (pestañas internas de módulos)
  // ============================================================
  if (intent.tipo === "subruta") {
    ejecutarAccion("aguaruta-open-tab", { tab: intent.ruta });

    return {
      tipo: "subruta",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 4) MÓDULOS COMPLETOS (AGUARUTA, TRASLADO, FLOTa, INICIO)
  // ============================================================
  if (intent.tipo === "modulo") {
    ejecutarAccion("abrir-" + intent.modulo);
    return {
      tipo: "modulo",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 5) ANÁLISIS OPERATIVO MANUAL
  //    "revisa el sistema", "analiza rutas", etc.
  // ============================================================
  if (texto.includes("revisa") || texto.includes("analiza")) {
    const analisis = await analizarManual(() => window.__FAZO_DATA__); 
    const resumen = analisis.sugerencias.join("\n");

    return {
      tipo: "analisis",
      respuesta: "Análisis completado:\n" + resumen,
    };
  }

  // ============================================================
  // 6) IA MULTIMODEL — GPT / Claude / Gemini / Local
  // ============================================================
  if (online) {
    const { proveedor, respuesta } =
      await AURA_MultiModel_Process(texto, historial);

    return {
      tipo: "ia",
      proveedor,
      respuesta,
    };
  }

  // ============================================================
  // 7) MODO OFFLINE
  // ============================================================
  return {
    tipo: "offline",
    respuesta: "Estoy sin conexión, pero sigo operativa.",
  };
}

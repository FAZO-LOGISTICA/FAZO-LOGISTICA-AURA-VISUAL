// ======================================================================
//  AURA_NEXUS.js — El núcleo de decisión inteligente de AURA
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Integración total entre NLP, acciones, agente y multimodel
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { AURA_Agent } from "./AURA_Agent";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { analizarManual } from "./FAZO_OS_Router";

/*
   NEXUS IA:
   --------------------------------------------
   Decide QUÉ debe hacer AURA con cada mensaje.

   Orden de decisión:
   1) ¿Es instrucción del sistema? (NLP)
   2) ¿Es acción del OS?
   3) ¿Es análisis operativo?
   4) ¿Es una consulta para IA Multimodel?
*/

export async function AURA_NEXUS(texto, historial, online) {
  const intent = interpretar(texto);

  // ============================================================
  // 1) ACCIONES DIRECTAS DEL SISTEMA
  // ============================================================
  if (intent.tipo === "accion") {
    ejecutarAccion(intent.accion, intent.payload || {});
    return {
      tipo: "accion",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 2) SUBRUTAS AGUA RUTA
  // ============================================================
  if (intent.tipo === "subruta") {
    ejecutarAccion("aguaruta-open-tab", { tab: intent.ruta });
    return {
      tipo: "subruta",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 3) MÓDULOS COMPLETOS (AGUARUTA, FLOTa, TRASLADO, etc.)
  // ============================================================
  if (intent.tipo === "modulo") {
    ejecutarAccion("abrir-" + intent.modulo);
    return {
      tipo: "modulo",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 4) ANÁLISIS OPERACIONAL MANUAL
  // ============================================================
  if (texto.includes("revisa") || texto.includes("analiza")) {
    const analisis = await analizarManual(() => window.__FAZO_DATA__);
    const resumen = analisis.sugerencias.join("\n");

    return {
      tipo: "analisis",
      respuesta: "Análisis operativo completado:\n" + resumen,
    };
  }

  // ============================================================
  // 5) IA MULTIMODEL (OpenAI / Claude / Gemini / Local)
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
  // 6) MODO OFFLINE
  // ============================================================
  return {
    tipo: "offline",
    respuesta: "Estoy sin conexión, pero sigo operativa.",
  };
}

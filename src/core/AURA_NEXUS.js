// ======================================================================
//  AURA_NEXUS.js — Núcleo Inteligente de Decisión (Versión Profesional)
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { eventoAccionSistema, eventoAbrirModulo, eventoAbrirSubruta } from "./FAZO_OS_EventBridge";
import { analizarManual } from "./FAZO_OS_Router";

export async function AURA_NEXUS(texto, historial, online) {
  const intent = interpretar(texto);

  // ACCIÓN
  if (intent.tipo === "accion") {
    eventoAccionSistema(intent.accion, intent.payload || {});
    return { tipo: "accion", respuesta: intent.frase };
  }

  // SUBRUTA
  if (intent.tipo === "subruta") {
    eventoAbrirSubruta("aguaruta", intent.ruta);
    return { tipo: "subruta", respuesta: intent.frase };
  }

  // MÓDULO
  if (intent.tipo === "modulo") {
    eventoAbrirModulo(intent.modulo);
    return { tipo: "modulo", respuesta: intent.frase };
  }

  // ANÁLISIS OPERATIVO
  if (texto.includes("revisa") || texto.includes("analiza")) {
    const analisis = await analizarManual(() => window.__FAZO_DATA__);
    return {
      tipo: "analisis",
      respuesta: "Diagnóstico:\n" + analisis.sugerencias.join("\n"),
    };
  }

  // MULTIMODEL IA
  if (online) {
    const { proveedor, respuesta } = await AURA_MultiModel_Process(texto, historial);
    return {
      tipo: "ia",
      proveedor,
      respuesta,
    };
  }

  // MODO OFFLINE
  return {
    tipo: "offline",
    respuesta: "Sin conexión. Operando en modo local.",
  };
}

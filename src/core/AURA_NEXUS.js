// ======================================================================
//  AURA_NEXUS.js — Núcleo de Decisión Inteligente de AURA OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Arquitectura oficial FAZO-OS 2025
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { analizarManual } from "./FAZO_OS_Router";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { guardarMemoria } from "./AURAMemory";
import { responderAURA } from "./AURA_Responder";

// AutoFix (opcional, pero integrado)
import { AURA_AutoFix_Check } from "./AURA_AutoFix";

/*
   ORDEN DE DECISIÓN DE AURA:

   1) Intent Engine (accion / subruta / modulo)
   2) AutoFix (detección de errores comunes)
   3) Análisis manual solicitado por el usuario
   4) IA Multimodel (OpenAI / Claude / Gemini / Local)
   5) Modo Offline
*/


// ======================================================================
//  FUNCIÓN PRINCIPAL — El cerebro de AURA
// ======================================================================
export async function AURA_NEXUS(texto, historial = [], online = true) {

  // Guardamos el mensaje en memoria
  guardarMemoria(texto);

  // 1) Detectar intención del usuario
  const intent = interpretar(texto);


  // ============================================================
  // 1) ACCIONES directas del sistema
  // ============================================================
  if (intent.tipo === "accion") {
    ejecutarAccion(intent.accion, intent.payload || {});
    responderAURA(intent.frase);
    return {
      tipo: "accion",
      mensaje: intent.frase,
    };
  }


  // ============================================================
  // 2) SUBRUTAS (solo AguaRuta)
  // ============================================================
  if (intent.tipo === "subruta") {
    ejecutarAccion("aguaruta-open-tab", { tab: intent.ruta });
    responderAURA(intent.frase);
    return {
      tipo: "subruta",
      mensaje: intent.frase,
    };
  }


  // ============================================================
  // 3) MÓDULO COMPLETO (AguaRuta, Flota, Traslado, etc.)
  // ============================================================
  if (intent.tipo === "modulo") {
    ejecutarAccion("abrir-" + intent.modulo);
    responderAURA(intent.frase);
    return {
      tipo: "modulo",
      mensaje: intent.frase,
    };
  }


  // ============================================================
  // 4) AutoFix — Detectar errores frecuentes automáticamente
  // ============================================================
  const autofix = AURA_AutoFix_Check(texto);
  if (autofix) {
    responderAURA(autofix);
    return {
      tipo: "autofix",
      mensaje: autofix,
    };
  }


  // ============================================================
  // 5) Análisis Operacional Manual FAZO OS
  // ============================================================
  if (
    texto.includes("revisa") ||
    texto.includes("analiza") ||
    texto.includes("analisis")
  ) {
    const analisis = await analizarManual(() => window.__FAZO_DATA__);
    responderAURA("Revisión completa:\n" + analisis.sugerencias.join("\n"));
    return {
      tipo: "analisis",
      mensaje: analisis.sugerencias,
    };
  }


  // ============================================================
  // 6) IA MULTIMODEL — OpenAI / Claude / Gemini
  // ============================================================
  if (online) {
    try {
      const { proveedor, respuesta } = await AURA_MultiModel_Process(
        texto,
        historial
      );

      responderAURA(`🧠 (${proveedor.toUpperCase()}) → ${respuesta}`);

      return {
        tipo: "ia",
        proveedor,
        mensaje: respuesta,
      };
    } catch (err) {
      responderAURA("⚠️ Error con los modelos IA. Intentando modo offline.");
    }
  }


  // ============================================================
  // 7) MODO OFFLINE
  // ============================================================
  responderAURA(
    "Estoy sin conexión, pero sigo operativa. Puedo realizar acciones internas y análisis locales."
  );

  return {
    tipo: "offline",
    mensaje: "Sin conexión",
  };
}

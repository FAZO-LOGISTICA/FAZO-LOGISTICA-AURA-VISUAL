// ======================================================================
//  AURA_NEXUS.js — Centro de decisiones IA para AURA OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Integración con intents, agente, multimodel y logging
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { AURA_Agent } from "./AURA_Agent";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { analizarManual } from "./FAZO_OS_Router";
import { LOG } from "./FAZO_OS_Log"; // <<🔥 NUEVO: SISTEMA DE LOGS

/*
    NEXUS IA:
    ------------------------------------------------
    Decide qué hacer con cada mensaje:
    1) Intent del sistema
    2) Acción OS
    3) Subruta
    4) Módulo completo
    5) Análisis operativo
    6) IA Multimodel
    7) Modo Offline
*/

export async function AURA_NEXUS(texto, historial, online) {
  LOG.info("NEXUS recibió mensaje", { texto }); // 🔵 LOG

  const intent = interpretar(texto);
  LOG.intent("Intent detectado", intent); // 🔵 LOG

  // ============================================================
  // 1) ACCIÓN DIRECTA
  // ============================================================
  if (intent.tipo === "accion") {
    LOG.accion("Ejecutando acción OS", intent); // 🔵 LOG
    ejecutarAccion(intent.accion, intent.payload || {});
    return {
      tipo: "accion",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 2) SUBRUTA
  // ============================================================
  if (intent.tipo === "subruta") {
    LOG.accion("NEXUS abrirá subruta", intent); // 🔵 LOG
    ejecutarAccion("aguaruta-open-tab", { tab: intent.ruta });

    return {
      tipo: "subruta",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 3) MÓDULO COMPLETO
  // ============================================================
  if (intent.tipo === "modulo") {
    LOG.accion("NEXUS abrirá módulo", intent); // 🔵 LOG
    ejecutarAccion("abrir-" + intent.modulo);

    return {
      tipo: "modulo",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 4) ANÁLISIS OPERACIONAL
  // ============================================================
  if (texto.includes("revisa") || texto.includes("analiza")) {
    LOG.agente("Análisis manual solicitado", {}); // 🔵 LOG

    try {
      const analisis = await analizarManual(() => window.__FAZO_DATA__);
      const resumen = analisis.sugerencias.join("\n");

      LOG.agente("Análisis manual terminado", { resumen }); // 🔵 LOG

      return {
        tipo: "analisis",
        respuesta: "Análisis operativo completado:\n" + resumen,
      };
    } catch (err) {
      LOG.error("Error en análisis manual", err); // 🔵 LOG
      return {
        tipo: "error",
        respuesta: "Hubo un problema analizando los datos.",
      };
    }
  }

  // ============================================================
  // 5) IA MULTIMODEL (OpenAI / Claude / Gemini)
  // ============================================================
  if (online) {
    LOG.info("NEXUS usando IA Multimodel", {}); // 🔵 LOG

    try {
      const { proveedor, respuesta } =
        await AURA_MultiModel_Process(texto, historial);

      LOG.ia("Respuesta multimodel lista", {
        proveedor,
        respuesta,
      }); // 🔵 LOG

      return {
        tipo: "ia",
        proveedor,
        respuesta,
      };
    } catch (err) {
      LOG.error("Error en IA Multimodel", err); // 🔵 LOG
      return {
        tipo: "error",
        respuesta: "No pude procesar la IA en este momento.",
      };
    }
  }

  // ============================================================
  // 6) MODO OFFLINE
  // ============================================================
  LOG.info("NEXUS en modo offline", {}); // 🔵 LOG

  return {
    tipo: "offline",
    respuesta: "Estoy sin conexión, pero sigo operativa.",
  };
}

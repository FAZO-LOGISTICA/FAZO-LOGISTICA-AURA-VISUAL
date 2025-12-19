// ======================================================================
//  AURA_NEXUS.js — Núcleo de Decisión Inteligente 2025 (FINAL)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Conectado a:
//     ✔ AURA_NaturalLanguage (Intents)
//     ✔ AURA_Actions (acciones reales del sistema)
//     ✔ AURA_MultiModel (IA avanzada OpenAI / Claude / Gemini)
//     ✔ AURA_Agent (autonomía futura)
//     ✔ EventBridge (FAZO_OS_EventBridge.js)
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { analizarManual } from "./FAZO_OS_Router";

/*
   ORDEN DE DECISIÓN DE AURA (NEXUS)
   --------------------------------------------
   1) Intentos del lenguaje natural (NLP)
   2) Acciones del sistema (Actions.js)
   3) Subrutas y módulos
   4) Análisis operativo FAZO OS
   5) IA Multimodel (OpenAI / Claude / Gemini / Local)
   6) Modo Offline

   ❗ AURA_NEXUS NO ejecuta nada directamente.
      Delegamos toda acción a AURA_Actions.js
*/

export async function AURA_NEXUS(texto, historial, online) {
  const intent = interpretar(texto.toLowerCase().trim());

  // ============================================================
  // 1) ACCIONES DIRECTAS (cerrar sesión, filtros, etc.)
  // ============================================================
  if (intent.tipo === "accion") {
    ejecutarAccion(intent.accion, intent?.payload);
    return {
      tipo: "accion",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 2) SUBRUTAS (Abrir páginas dentro de AguaRuta)
  // ============================================================
  if (intent.tipo === "subruta") {
    ejecutarAccion("aguaruta-open-tab", { tab: intent.ruta });

    return {
      tipo: "subruta",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 3) MÓDULOS COMPLETOS (AguaRuta / Flota / Traslado / etc.)
  // ============================================================
  if (intent.tipo === "modulo") {
    ejecutarAccion(`abrir-${intent.modulo}`);

    return {
      tipo: "modulo",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 4) ANÁLISIS OPERATIVO FAZO OS (manual)
  // ============================================================
  if (
    texto.includes("analiza") ||
    texto.includes("revisa") ||
    texto.includes("diagnostico") ||
    texto.includes("verifica") ||
    texto.includes("buscar problemas")
  ) {
    const analisis = await analizarManual(() => window.__FAZO_DATA__);
    const resumen = analisis.sugerencias.join("\n");

    return {
      tipo: "analisis",
      respuesta:
        "🔍 Análisis operativo completado:\n\n" + resumen,
    };
  }

  // ============================================================
  // 5) MULTIMODEL IA (OpenAI / Claude / Gemini / Local)
  // ============================================================
  if (online) {
    try {
      const { proveedor, respuesta } = await AURA_MultiModel_Process(
        texto,
        historial
      );

      return {
        tipo: "ia",
        proveedor,
        respuesta,
      };
    } catch (e) {
      console.error("❌ Error MultiModel:", e);
      return {
        tipo: "ia",
        proveedor: "fallback",
        respuesta:
          "Hubo un error con los modelos principales. Probemos nuevamente.",
      };
    }
  }

  // ============================================================
  // 6) MODO OFFLINE
  // ============================================================
  return {
    tipo: "offline",
    respuesta: "Estoy sin conexión, pero sigo operativa.",
  };
}

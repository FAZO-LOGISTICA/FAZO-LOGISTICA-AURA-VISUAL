// ======================================================================
//  AURA_NEXUS.js — Núcleo de Decisión AURA (VERSIÓN AUTOFIX 2025)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Conexión directa entre comandos, IA y AutoFix
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { analizarManual } from "./FAZO_OS_Router";
import { AURA_AutoFix, AURA_AutoFix_AguaRuta } from "./AURA_AutoFix";

// ======================================================================
//  AURA NEXUS — Decide qué debe hacer AURA con cada mensaje
// ======================================================================
export async function AURA_NEXUS(texto, historial, online = true) {
  const intent = interpretar(texto);

  // ============================================================
  // A) COMANDOS DE REPARACIÓN (AUTO FIX)
  // ============================================================
  const t = texto.toLowerCase();

  // --- Auto Fix Total ---
  if (t.includes("arregla todo") || t.includes("fix total") || t.includes("repara el sistema")) {
    const r = await AURA_AutoFix(texto, historial, online);
    return {
      tipo: "autofix",
      proveedor: r.proveedor,
      respuesta: "🛠️ AutoFix Total ejecutado.\n\n" + r.respuesta,
    };
  }

  // --- Auto Fix AguaRuta ---
  if (
    t.includes("arregla aguaruta") ||
    t.includes("fix aguaruta") ||
    t.includes("repara aguaruta")
  ) {
    const r = await AURA_AutoFix_AguaRuta(texto, historial, online);
    return {
      tipo: "autofix",
      proveedor: r.proveedor,
      respuesta: "🚚 AutoFix AguaRuta ejecutado.\n\n" + r.respuesta,
    };
  }

  // ============================================================
  // B) INTENCIONES DEL SISTEMA (NLP)
  // ============================================================
  if (intent.tipo === "accion") {
    ejecutarAccion(intent.accion, intent.payload || {});
    return {
      tipo: "accion",
      respuesta: intent.frase,
    };
  }

  if (intent.tipo === "subruta") {
    ejecutarAccion("aguaruta-open-tab", { tab: intent.ruta });
    return {
      tipo: "subruta",
      respuesta: intent.frase,
    };
  }

  if (intent.tipo === "modulo") {
    ejecutarAccion("abrir-" + intent.modulo);
    return {
      tipo: "modulo",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // C) ANÁLISIS OPERATIVO MANUAL
  // ============================================================
  if (t.includes("revisa") || t.includes("analiza")) {
    const analisis = await analizarManual(() => window.__FAZO_DATA__ || {});
    return {
      tipo: "analisis",
      respuesta: "🔎 Análisis completado:\n" + analisis.sugerencias.join("\n"),
    };
  }

  // ============================================================
  // D) IA MULTIMODEL
  // ============================================================
  if (online) {
    const { proveedor, respuesta } = await AURA_MultiModel_Process(texto, historial);

    return {
      tipo: "ia",
      proveedor,
      respuesta,
    };
  }

  // ============================================================
  // E) OFFLINE
  // ============================================================
  return {
    tipo: "offline",
    respuesta: "Estoy sin conexión, pero sigo operativa.",
  };
}

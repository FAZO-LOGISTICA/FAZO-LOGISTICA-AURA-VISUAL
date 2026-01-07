// ======================================================================
//  AURA_NEXUS.js — Núcleo de decisión seguro
//  FAZO-OS 2025
//  NUNCA rompe la UI
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { auraThink } from "./AURA_AI_Provider";
import { AURA_Agent } from "./AURA_Agent";

// ============================================================
// NEXUS PRINCIPAL
// ============================================================
export async function AURA_NEXUS({
  texto,
  historial = [],
  online = true,
}) {
  let intent = null;

  // ------------------------------------------------------------
  // 1) NLP — interpretar intención (nunca falla)
  // ------------------------------------------------------------
  try {
    intent = interpretar(texto);
  } catch (err) {
    console.error("❌ Error NLP:", err);
    intent = { tipo: "desconocido" };
  }

  // ------------------------------------------------------------
  // 2) ACCIONES DIRECTAS DEL SISTEMA
  // ------------------------------------------------------------
  if (intent.tipo === "accion") {
    try {
      ejecutarAccion(intent.accion, intent.payload || {});
    } catch (err) {
      console.error("❌ Error ejecutando acción:", err);
    }

    return {
      tipo: "accion",
      respuesta: intent.frase || "Acción ejecutada.",
    };
  }

  // ------------------------------------------------------------
  // 3) SUBRUTAS / MÓDULOS
  // ------------------------------------------------------------
  if (intent.tipo === "subruta" || intent.tipo === "modulo") {
    try {
      ejecutarAccion(intent.tipo, intent);
    } catch (err) {
      console.error("❌ Error navegación:", err);
    }

    return {
      tipo: intent.tipo,
      respuesta: intent.frase || "Navegación realizada.",
    };
  }

  // ------------------------------------------------------------
  // 4) AGENTE AUTÓNOMO (no bloqueante)
  // ------------------------------------------------------------
  try {
    AURA_Agent.iniciar();
  } catch (err) {
    console.warn("⚠️ Agent no disponible:", err.message);
  }

  // ------------------------------------------------------------
  // 5) IA MULTIMODELO (AISLADA TOTAL)
  // ------------------------------------------------------------
  if (online) {
    try {
      const respuesta = await auraThink(texto);

      return {
        tipo: "ia",
        proveedor: "auto",
        respuesta,
      };
    } catch (err) {
      console.error("❌ Error IA (aislado):", err);

      return {
        tipo: "ia",
        proveedor: "fallback",
        respuesta:
          "Estoy operativa. Hubo un problema externo, pero puedo seguir ayudándote.",
      };
    }
  }

  // ------------------------------------------------------------
  // 6) OFFLINE ABSOLUTO
  // ------------------------------------------------------------
  return {
    tipo: "offline",
    respuesta:
      "Estoy funcionando en modo local. Las funciones del sistema siguen activas.",
  };
}

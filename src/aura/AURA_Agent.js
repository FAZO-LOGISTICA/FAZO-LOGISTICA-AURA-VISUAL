// ======================================================================
//  AURA_Agent.js — FAZO OS Autonomous Agent v2025
//  Gustavo Oliva — FAZO LOGÍSTICA
//  Motor oficial de autonomía de AURA
//  Ejecuta intenciones → crea planes → llama acciones reales
// ======================================================================

import { AURA_Intelligence } from "../intelligence/AURA_Intelligence";
import { AURA_Actions } from "../actions/AURA_Actions";

// ======================================================================
//  DEFICIÓN DEL AGENTE
// ======================================================================
export const AURA_Agent = {
  
  async procesarMensaje(texto) {
    try {
      if (!texto || typeof texto !== "string") return null;

      // 1) Pedimos a la IA que analice intención + plan
      const ai = await AURA_Intelligence.analizar(texto);

      if (!ai) {
        return {
          respuesta: "No pude procesar esa instrucción todavía, Gustavo.",
          accionEjecutada: false,
        };
      }

      const { intencion, modulo, accion, datos, plan, respuesta } = ai;

      // 2) Si el usuario solo está conversando → no ejecutar nada
      if (intencion === "conversacion") {
        return {
          respuesta: respuesta || "Entendido.",
          accionEjecutada: false,
        };
      }

      // 3) Si existe una acción reconocida en AURA_Actions
      if (accion && AURA_Actions[accion]) {
        const resultado = await AURA_Actions[accion]({
          modulo,
          datos,
          plan,
          textoOriginal: texto,
        });

        return {
          respuesta: resultado?.mensaje || respuesta || "Listo Gustavo.",
          accionEjecutada: true,
          detalle: resultado,
        };
      }

      // 4) SI NO SE RECONOCE LA ACCIÓN, PERO HAY MÓDULO → abrir módulo
      if (modulo && accion === "abrir-modulo") {
        return {
          respuesta: respuesta || `Abriendo ${modulo} Gustavo.`,
          accionEjecutada: true,
          accionFAZO: { tipo: "modulo", modulo },
        };
      }

      // 5) SI NO SE RECONOCE LA ACCIÓN → responder normal
      return {
        respuesta: respuesta || "Entendido Gustavo.",
        accionEjecutada: false,
      };

    } catch (err) {
      console.error("❌ Error en AURA_Agent:", err);
      return {
        respuesta: "Tuve un problema procesando la instrucción Gustavo.",
        accionEjecutada: false,
      };
    }
  },

  // ======================================================================
  //   FUNCIONES ESPECIALES DEL AGENTE
  // ======================================================================

  async ejecutarModulo(modulo) {
    return {
      respuesta: `Abriendo módulo ${modulo} ahora.`,
      accionFAZO: { tipo: "modulo", modulo },
    };
  },

  async ejecutarSubruta(modulo, ruta) {
    return {
      respuesta: `Entrando en ${ruta} dentro de ${modulo}.`,
      accionFAZO: { tipo: "subruta", modulo, ruta },
    };
  },

  async ejecutarPlan(plan) {
    if (!Array.isArray(plan)) return null;

    const logs = [];

    for (const paso of plan) {
      logs.push(`→ ${paso}`);
      await new Promise((r) => setTimeout(r, 80));
    }

    return logs.join("\n");
  },
};

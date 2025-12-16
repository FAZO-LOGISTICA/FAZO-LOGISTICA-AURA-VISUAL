// ========================================================================
//   AURA_Actions.js — Ejecutor Inteligente FAZO OS v1.0
//   Aquí AURA hace acciones reales en AguaRuta y FAZO OS
//   Autor: Mateo IA — Para Gustavo Oliva (FAZO LOGÍSTICA)
// ========================================================================

import config from "../config";

/*
RECIBE:
{
  tipo: "accion" | "analisis" | "general",
  accion: "redistribuir" | "analizar-camion" | "analizar-viernes" | ...
  objetivo: "A1" | "lunes" | null
  modo: "total" | "parcial"
  frase: "texto que AURA va a hablar"
}

DEVUELVE:
{
  ok: true | false,
  mensaje: "frase para AURA",
  data: (resultado real),
  sendToIframe: { ... }   // si debemos disparar algo en AguaRuta
}
*/

export async function ejecutarAccion(agent, onSendToIframe) {
  if (!agent) {
    return { ok: false, mensaje: "No entendí la instrucción." };
  }

  const { tipo, accion, objetivo, modo } = agent;

  // ===========================================================
  //   1) DIAGNÓSTICO DE CAMIÓN
  // ===========================================================
  if (accion === "analizar-camion") {
    const camion = objetivo;

    try {
      const res = await fetch(`${config.AGUARUTA_API}/diagnostico/${camion}`);
      const data = await res.json();

      return {
        ok: true,
        mensaje: `Análisis del camión ${camion}: ${data.resumen}`,
        data,
      };
    } catch (err) {
      return { ok: false, mensaje: "No pude analizar ese camión ahora." };
    }
  }

  // ===========================================================
  //   2) DIAGNÓSTICO GENERAL
  // ===========================================================
  if (accion === "diagnostico-operacional") {
    try {
      const res = await fetch(`${config.AGUARUTA_API}/diagnostico-general`);
      const data = await res.json();

      return {
        ok: true,
        mensaje: "Análisis general completado.",
        data,
      };
    } catch {
      return { ok: false, mensaje: "No pude realizar el diagnóstico general." };
    }
  }

  // ===========================================================
  //   3) REDISTRIBUCIÓN COMPLETA
  // ===========================================================
  if (accion === "redistribuir" && modo === "total") {
    try {
      const res = await fetch(`${config.AGUARUTA_API}/redistribuir`, {
        method: "POST",
      });
      const data = await res.json();

      onSendToIframe?.("aguaruta", {
        type: "FAZO_CMD",
        command: "update-redistribucion",
        payload: data,
      });

      return {
        ok: true,
        mensaje: "Redistribución completa ejecutada con éxito.",
        data,
      };
    } catch {
      return { ok: false, mensaje: "Redistribución falló." };
    }
  }

  // ===========================================================
  //   4) REDISTRIBUCIÓN PARCIAL
  // ===========================================================
  if (accion === "redistribuir" && modo === "parcial") {
    try {
      const res = await fetch(`${config.AGUARUTA_API}/redistribuir-parcial`, {
        method: "POST",
      });
      const data = await res.json();

      return {
        ok: true,
        mensaje: "Balance parcial realizado.",
        data,
      };
    } catch {
      return { ok: false, mensaje: "No pude realizar el rebalanceo parcial." };
    }
  }

  // ===========================================================
  //   5) ANÁLISIS DE DÍA (viernes, lunes, etc.)
  // ===========================================================
  if (accion === "analizar-viernes" || accion === "analizar-dia") {
    const dia = objetivo || "viernes";

    try {
      const res = await fetch(`${config.AGUARUTA_API}/analisis-dia/${dia}`);
      const data = await res.json();

      return {
        ok: true,
        mensaje: `Carga del día ${dia}: ${data.detalle}`,
        data,
      };
    } catch {
      return { ok: false, mensaje: `No pude analizar el día ${dia}.` };
    }
  }

  // ===========================================================
  //   6) BUSCAR DUPLICADOS
  // ===========================================================
  if (accion === "buscar-duplicados") {
    try {
      const res = await fetch(`${config.AGUARUTA_API}/duplicados`);
      const data = await res.json();

      return {
        ok: true,
        mensaje: `Encontré ${data.total} registros duplicados.`,
        data,
      };
    } catch {
      return {
        ok: false,
        mensaje: "No pude buscar duplicados ahora.",
      };
    }
  }

  // ===========================================================
  //   7) CONTROL DE LITROS
  // ===========================================================
  if (accion === "analizar-litros") {
    try {
      const res = await fetch(`${config.AGUARUTA_API}/analizar-litros`);
      const data = await res.json();

      return {
        ok: true,
        mensaje: "Revisé los litros: " + data.resumen,
        data,
      };
    } catch {
      return { ok: false, mensaje: "No pude analizar los litros." };
    }
  }

  // ===========================================================
  //   8) FALLBACK
  // ===========================================================
  return {
    ok: false,
    mensaje: "Tengo intención detectada, pero aún no tengo acción vinculada.",
  };
}

export default ejecutarAccion;

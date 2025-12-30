// ======================================================================
//  AURA_NEXUS.js — Router central de decisiones AURA OS
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { AURA_AutoFix } from "./AURA_AutoFix";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { analizarManual } from "./FAZO_OS_Router";
import { enviarEventoDesdeAURA } from "./FAZO_OS_EventBridge";

export async function AURA_NEXUS(texto, historial, online) {
  const intent = interpretar(texto);

  // ============================================================
  // 1) Acciones directas (logout, abrir rutas, etc.)
  // ============================================================
  if (intent.tipo === "accion") {
    enviarEventoDesdeAURA(intent);
    return { tipo: "accion", respuesta: intent.frase };
  }

  // ============================================================
  // 2) Subrutas AguaRuta
  // ============================================================
  if (intent.tipo === "subruta") {
    enviarEventoDesdeAURA(intent);
    return { tipo: "subruta", respuesta: intent.frase };
  }

  // ============================================================
  // 3) Módulos completos
  // ============================================================
  if (intent.tipo === "modulo") {
    enviarEventoDesdeAURA(intent);
    return { tipo: "modulo", respuesta: intent.frase };
  }

  // ============================================================
  // 4) AutoFix — Reparación automática
  // ============================================================
  if (
    texto.includes("autofix") ||
    texto.includes("auto fix") ||
    texto.includes("arregla") ||
    texto.includes("repara sistema")
  ) {
    const res = await AURA_AutoFix.autoFixAguaRuta();
    const mensaje =
      res?.fixes?.length > 0
        ? "Autofix completado:\n- " + res.fixes.join("\n- ")
        : "No encontré fallas que reparar.";

    return { tipo: "autofix", respuesta: mensaje };
  }

  // ============================================================
  // 5) Análisis sin corregir
  // ============================================================
  if (texto.includes("analiza") || texto.includes("diagnostico")) {
    const res = AURA_AutoFix.analizarAguaRuta();

    let mensaje = "Diagnóstico:\n";
    if (res.duplicados.length > 0)
      mensaje += `• ${res.duplicados.length} duplicados.\n`;

    if (res.sinGeo.length > 0)
      mensaje += `• ${res.sinGeo.length} puntos sin GPS.\n`;

    if (res.duplicados.length === 0 && res.sinGeo.length === 0)
      mensaje += "• Todo en orden.";

    return { tipo: "analisis", respuesta: mensaje };
  }

  // ============================================================
  // 6) IA MULTIMODEL
  // ============================================================
  if (online) {
    const { proveedor, respuesta } = await AURA_MultiModel_Process(texto, historial);
    return { tipo: "ia", proveedor, respuesta };
  }

  return {
    tipo: "offline",
    respuesta: "Estoy sin conexión, pero sigo operativa.",
  };
}

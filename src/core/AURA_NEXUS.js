// ======================================================================
//  AURA_NEXUS.js — Núcleo de Decisión Inteligente de AURA
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Router central entre: NLP → Acciones → OS → IA Multimodel
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";

import {
  eventoAbrirModulo,
  eventoAbrirSubruta,
  eventoAccionSistema,
  eventoAnalisisAutomatico,
} from "./FAZO_OS_EventBridge";

import {
  registrarAccion,
  registrarAlertaPersistente,
  guardarDuplicados,
  guardarPuntosSinGeo,
} from "./AURAMemory";

import { analizarManual } from "./FAZO_OS_Router";

// ======================================================================
//  FUNCIÓN PRINCIPAL — EL CEREBRO DE AURA
// ======================================================================
export async function AURA_NEXUS(texto, historial, online = true) {
  const cleaned = texto?.trim() || "";

  // Guardar acción del usuario
  registrarAccion("mensaje", cleaned);

  // Interpretar el texto en un intent
  const intent = interpretar(cleaned);

  // ==================================================================
  // 1) ACCIONES DIRECTAS DEL SISTEMA (logout, abrir rutas, etc.)
  // ==================================================================
  if (intent.tipo === "accion") {
    ejecutarAccion(intent.accion, intent.payload || {});
    eventoAccionSistema(intent.accion, intent.payload);

    return {
      tipo: "accion",
      proveedor: "nexus",
      respuesta: intent.frase,
    };
  }

  // ==================================================================
  // 2) SUBRUTAS de módulos (ej: rutas-activas, no-entregadas…)
  // ==================================================================
  if (intent.tipo === "subruta") {
    eventoAbrirSubruta("aguaruta", intent.ruta);

    return {
      tipo: "subruta",
      proveedor: "nexus",
      respuesta: intent.frase,
    };
  }

  // ==================================================================
  // 3) MÓDULOS COMPLETOS (AguaRuta, Traslado, Flota)
  // ==================================================================
  if (intent.tipo === "modulo") {
    eventoAbrirModulo(intent.modulo);

    return {
      tipo: "modulo",
      proveedor: "nexus",
      respuesta: intent.frase,
    };
  }

  // ==================================================================
  // 4) ANÁLISIS OPERACIONAL MANUAL — AguaRuta / Flota
  // ==================================================================
  if (cleaned.includes("revisa") || cleaned.includes("analiza")) {
    const analisis = await analizarManual(() => window.__FAZO_DATA__);

    // Guardar en memoria partes importantes
    if (analisis.duplicados) guardarDuplicados(analisis.duplicados);
    if (analisis.puntosSinGeo) guardarPuntosSinGeo(analisis.puntosSinGeo);

    // Enviar evento a FAZO OS
    eventoAnalisisAutomatico(analisis.sugerencias);

    return {
      tipo: "analisis",
      proveedor: "nexus",
      respuesta:
        "Análisis operativo completado:\n\n" +
        analisis.sugerencias.join("\n"),
    };
  }

  // ==================================================================
  // 5) IA MULTIMODEL (OpenAI / Claude / Gemini / Local)
  // ==================================================================
  if (online) {
    const { proveedor, respuesta } = await AURA_MultiModel_Process(
      cleaned,
      historial
    );

    return {
      tipo: "ia",
      proveedor,
      respuesta,
    };
  }

  // ==================================================================
  // 6) MODO OFFLINE
  // ==================================================================
  registrarAlertaPersistente("AURA sin conexión — modo offline ACTIVADO");

  return {
    tipo: "offline",
    proveedor: "local",
    respuesta:
      "Estoy sin conexión a internet. Activando modo offline para seguir operativa.",
  };
}

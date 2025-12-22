// ======================================================================
//  AURA_NEXUS.js — Núcleo de Decisión + Memoria Total
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Engine de decisiones + aprendizaje automático
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { AURA_Agent } from "./AURA_Agent";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { analizarManual } from "./FAZO_OS_Router";

import {
  guardarEnMemoria,
  obtenerRecuerdos,
} from "./AURAMemory";

/*
   NEXUS = Decide QUÉ hace AURA con cada mensaje.
   Ahora con:
   ✔ Memoria Total
   ✔ Aprendizaje Automático
   ✔ Reglas de experiencia histórica
*/

export async function AURA_NEXUS(texto, historial, online) {
  const intent = interpretar(texto);

  // ============================================================
  // GUARDAR TODO EN MEMORIA (AURA aprende tu estilo)
  // ============================================================
  guardarEnMemoria(texto);

  // AURA detecta patrones de uso repetido (aprendizaje básico)
  if (historial.length > 6) {
    const ultimos = historial.slice(-4).map((m) => m.content);
    if (ultimos.every((x) => x.includes("rutas"))) {
      guardarEnMemoria("El usuario consulta frecuentemente rutas activas.");
    }
  }

  // ============================================================
  // 1) ACCIONES DIRECTAS DEL SISTEMA
  // ============================================================
  if (intent.tipo === "accion") {
    ejecutarAccion(intent.accion, intent.payload || {});
    return {
      tipo: "accion",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 2) SUBRUTAS AGUARUTA
  // ============================================================
  if (intent.tipo === "subruta") {
    ejecutarAccion("aguaruta-open-tab", { tab: intent.ruta });
    return {
      tipo: "subruta",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 3) MÓDULOS COMPLETOS
  // ============================================================
  if (intent.tipo === "modulo") {
    ejecutarAccion("abrir-" + intent.modulo);
    return {
      tipo: "modulo",
      respuesta: intent.frase,
    };
  }

  // ============================================================
  // 4) ANÁLISIS OPERACIONAL MANUAL
  // ============================================================
  if (texto.includes("revisa") || texto.includes("analiza")) {
    const analisis = await analizarManual(() => window.__FAZO_DATA__);

    const recordatorio = `Análisis solicitado por usuario. Resultado: ${analisis.sugerencias.length} alertas.`;
    guardarEnMemoria(recordatorio);

    return {
      tipo: "analisis",
      respuesta:
        "Análisis operativo completado:\n" +
        analisis.sugerencias.join("\n"),
    };
  }

  // ============================================================
  // 5) IA MULTIMODEL — RESPUESTAS
  // ============================================================
  if (online) {
    const { proveedor, respuesta } =
      await AURA_MultiModel_Process(texto, historial);

    guardarEnMemoria(`AURA respondió usando ${proveedor}.`);

    return {
      tipo: "ia",
      proveedor,
      respuesta,
    };
  }

  // ============================================================
  // 6) MODO OFFLINE
  // ============================================================
  guardarEnMemoria("Usuario interactuó sin conexión.");
  return {
    tipo: "offline",
    respuesta: "Estoy sin conexión, pero sigo operativa.",
  };
}

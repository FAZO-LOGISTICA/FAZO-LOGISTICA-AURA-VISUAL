// ======================================================================
//  AURA_NEXUS.js — Núcleo de Decisión con Memoria Dinámica
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Nexus + NLP + Multimodel + AutoFix + Memoria
// ======================================================================

import { interpretar } from "./AURA_NaturalLanguage";
import { ejecutarAccion } from "./AURA_Actions";
import { AURA_MultiModel_Process } from "./AURA_MultiModel";
import { analizarManual } from "./FAZO_OS_Router";
import { cargarRecuerdos, guardarRecuerdo } from "./AURAMemory";
import { emitirEvento } from "./FAZO_OS_EventBridge";

/*
   ORDEN DE DECISIÓN DEL NEXUS:

   1) Memoria — ¿Esto se relaciona con un recuerdo previo?
   2) NLP — ¿Es acción, módulo o subruta?
   3) Acción del OS via EventBridge
   4) Auto análisis operativo
   5) IA Multimodel
   6) Modo Offline
*/

// ============================================================
//  AURA_NEXUS — PROCESADOR PRINCIPAL
// ============================================================
export async function AURA_NEXUS(texto, historial, online) {
  
  const recuerdosPrevios = cargarRecuerdos();

  // ------------------------------------------------------------
  // 1) DETECCIÓN DE PATRONES = MEMORIA DINÁMICA
  // ------------------------------------------------------------
  const lower = texto.toLowerCase();

  if (lower.includes("recuerdame")) {
    const contenido = texto.replace(/recuerdame/i, "").trim();
    if (contenido.length > 0) {
      guardarRecuerdo(contenido);

      return {
        tipo: "memoria",
        respuesta: `Perfecto Gustavo, ya lo guardé en memoria: "${contenido}".`
      };
    }
  }

  if (lower.includes("que recuerdas") || lower.includes("mis recuerdos")) {
    return {
      tipo: "memoria-lista",
      respuesta: formatearRecuerdos(recuerdosPrevios)
    };
  }

  // Si el mensaje coincide con un recuerdo, lo reforzamos
  for (let rec of recuerdosPrevios) {
    if (lower.includes(rec.texto.toLowerCase())) {
      return {
        tipo: "memoria-match",
        respuesta: `Sí Gustavo, recuerdo que mencionaste: "${rec.texto}".`
      };
    }
  }

  // ------------------------------------------------------------
  // 2) INTENT ENGINE (NLP)
  // ------------------------------------------------------------
  const intent = interpretar(texto);

  if (intent.tipo !== "desconocido") {
    ejecutarAccion(intent);
    return {
      tipo: intent.tipo,
      respuesta: intent.frase
    };
  }

  // ------------------------------------------------------------
  // 3) ANÁLISIS OPERATIVO MANUAL (AguaRuta / Flota)
  // ------------------------------------------------------------
  if (texto.includes("revisa") || texto.includes("analiza")) {
    const analisis = await analizarManual(() => window.__FAZO_DATA__);
    
    return {
      tipo: "analisis",
      respuesta: "Análisis operativo completado:\n" + analisis.sugerencias.join("\n")
    };
  }

  // ------------------------------------------------------------
  // 4) IA MULTIMODEL (OpenAI, Claude, Gemini, Llama…)
  // ------------------------------------------------------------
  if (online) {
    const { proveedor, respuesta } = await AURA_MultiModel_Process(texto, historial);

    // Guardamos como aprendizaje
    guardarRecuerdo(`AURA respondió: ${respuesta}`);

    return {
      tipo: "ia",
      proveedor,
      respuesta
    };
  }

  // ------------------------------------------------------------
  // 5) MODO OFFLINE
  // ------------------------------------------------------------
  return {
    tipo: "offline",
    respuesta: "Estoy sin conexión, pero sigo operativa."
  };
}


// ======================================================================
//  Función para formatear recuerdos bonitamente
// ======================================================================
function formatearRecuerdos(lista) {
  if (!lista.length) return "No tengo recuerdos guardados todavía.";

  return (
    "Aquí están tus últimos recuerdos:\n\n" +
    lista
      .slice(-10)
      .map((r, i) => `${i + 1}. ${r.texto} (${new Date(r.fecha).toLocaleString()})`)
      .join("\n")
  );
}

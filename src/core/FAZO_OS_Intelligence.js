// ======================================================================
//  FAZO_OS_Intelligence.js — Motor Maestro Multimodel 2025
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Elección automática del mejor modelo según tarea
// ======================================================================

import { AURA_MultiModel } from "./AURA_MultiModel";
import { ejecutarAccion } from "./AURA_Actions";
import { interpretar } from "./AURA_NaturalLanguage";

// ======================================================================
// ESTADO GLOBAL DEL MOTOR
// ======================================================================

export const FAZO_Intelligence = {
  historial: [],
  ultimoModelo: null,

  // ====================================================================
  //  1. CLASIFICAR LA TAREA
  // ====================================================================
  clasificar(texto) {
    const t = texto.toLowerCase();

    if (t.includes("reporte") || t.includes("explica") || t.includes("resume"))
      return "razonamiento";

    if (t.includes("codigo") || t.includes("react") || t.includes("fastapi"))
      return "programacion";

    if (t.includes("decision") || t.includes("sugiere") || t.includes("qué hago"))
      return "decision";

    if (t.includes("calculo") || /\d+\s*[*+/-]/.test(t))
      return "matematico";

    return "general";
  },

  // ====================================================================
  //  2. ELEGIR AUTOMÁTICAMENTE EL MODELO IDEAL
  // ====================================================================
  seleccionarModelo(tipo) {
    switch (tipo) {
      case "razonamiento":
        this.ultimoModelo = "anthropic"; // Claude
        return "anthropic";

      case "programacion":
        this.ultimoModelo = "openai"; // GPT expero en código
        return "openai";

      case "matematico":
        this.ultimoModelo = "google"; // Gemini destaca en cálculos
        return "google";

      case "decision":
        this.ultimoModelo = "openai"; // Más adecuado para análisis corto
        return "openai";

      default:
        this.ultimoModelo = "openai"; // Normal
        return "openai";
    }
  },

  // ====================================================================
  //  3. PROCESAR MENSAJE COMPLETO (AURAChat llama aquí)
  // ====================================================================
  async procesarMensaje(texto) {
    const tipo = this.clasificar(texto);
    const modelo = this.seleccionarModelo(tipo);

    this.historial.push({ user: texto, tipo, modelo });

    // -------------------------------------------
    // A) Intentos internos (módulos / comandos)
    // -------------------------------------------
    const intento = interpretar(texto);

    if (
      intento.tipo === "accion" ||
      intento.tipo === "subruta" ||
      intento.tipo === "modulo"
    ) {
      return {
        origen: "interno",
        respuesta: intento.frase,
        comando: intento,
      };
    }

    // -------------------------------------------
    // B) IA EXTERNA (GPT / Claude / Gemini)
    // -------------------------------------------
    const respuesta = await AURA_MultiModel.llamar(modelo, texto);

    return {
      origen: modelo,
      respuesta,
      comando: null,
    };
  },

  // ====================================================================
  //  4. ASISTENCIA AUTOMÁTICA: evaluar riesgos
  // ====================================================================
  autoAnalizar(contexto) {
    const problemas = [];

    if (contexto?.rutas) {
      const litros = contexto.rutas.reduce((a, b) => a + b.litros, 0);
      if (litros > 40000) {
        problemas.push("Carga diaria excesiva detectada en rutas.");
      }
    }

    if (contexto?.camiones) {
      const criticos = contexto.camiones.filter((c) => c.estado === "critico");
      if (criticos.length > 0) {
        problemas.push(`Hay ${criticos.length} camiones en estado crítico.`);
      }
    }

    return problemas;
  },

  // ====================================================================
  //  5. SI DETECTA PROBLEMAS → ACCIONES AUTOMÁTICAS
  // ====================================================================
  actuar(problemas) {
    problemas.forEach((p) => {
      if (p.includes("carga")) {
        ejecutarAccion("redistribuir-automatico");
      }
      if (p.includes("crítico")) {
        ejecutarAccion("alertar-mantenimiento");
      }
    });
  },
};

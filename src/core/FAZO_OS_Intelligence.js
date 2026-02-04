// ======================================================================
//  FAZO_OS_Intelligence.js — Motor Maestro Multimodel 2025
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Elección automática del mejor modelo según tarea
// ======================================================================

import { AURA_MultiModel_Process } from "./AURA_MultiModel";
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

    if (
      t.includes("decision") ||
      t.includes("sugiere") ||
      t.includes("qué hago")
    )
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
        this.ultimoModelo = "claude";
        return "claude";

      case "programacion":
        this.ultimoModelo = "openai";
        return "openai";

      case "matematico":
        this.ultimoModelo = "gemini";
        return "gemini";

      case "decision":
        this.ultimoModelo = "openai";
        return "openai";

      default:
        this.ultimoModelo = "openai";
        return "openai";
    }
  },

  // ====================================================================
  //  3. PROCESAR MENSAJE COMPLETO (AURAChat llama aquí)
  // ====================================================================
  async procesarMensaje(texto) {
    const tipo = this.clasificar(texto);
    const modelo = this.seleccionarModelo(tipo);

    this.historial.push({
      role: "user",
      content: texto,
      tipo,
      modelo,
    });

    // ---------------------------------------------------
    // A) INTENTOS INTERNOS (COMANDOS / MÓDULOS FAZO)
    // ---------------------------------------------------
    const intento = interpretar(texto);

    if (
      intento?.tipo === "accion" ||
      intento?.tipo === "subruta" ||
      intento?.tipo === "modulo"
    ) {
      return {
        origen: "interno",
        respuesta: intento.frase,
        comando: intento,
      };
    }

    // ---------------------------------------------------
    // B) IA EXTERNA (MULTI-MODELO REAL)
    // ---------------------------------------------------
    const resultado = await AURA_MultiModel_Process(
      texto,
      this.historial,
      modelo
    );

    return {
      origen: resultado.proveedor,
      respuesta: resultado.respuesta,
      comando: null,
    };
  },

  // ====================================================================
  //  4. ASISTENCIA AUTOMÁTICA — EVALUAR RIESGOS OPERACIONALES
  // ====================================================================
  autoAnalizar(contexto) {
    const problemas = [];

    if (contexto?.rutas?.length) {
      const litros = contexto.rutas.reduce(
        (acc, r) => acc + Number(r.litros || 0),
        0
      );

      if (litros > 40000) {
        problemas.push("Carga diaria excesiva detectada en rutas.");
      }
    }

    if (contexto?.camiones?.length) {
      const criticos = contexto.camiones.filter(
        (c) => c.estado === "critico"
      );
      if (criticos.length > 0) {
        problemas.push(
          `Hay ${criticos.length} camiones en estado crítico.`
        );
      }
    }

    return problemas;
  },

  // ====================================================================
  //  5. EJECUTAR ACCIONES AUTOMÁTICAS
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

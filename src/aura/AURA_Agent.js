// ======================================================================
//  AURA_Agent.js — Autonomous Decision Engine 2025
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Motor de autonomía + reglas + acciones inteligentes
// ======================================================================

/*
   AURA AGENT = El cerebro que toma decisiones por sí mismo.

   Sus funciones principales:
   ✔ Detectar riesgos
   ✔ Detectar problemas operacionales
   ✔ Tomar decisiones sin que Gustavo lo pida
   ✔ Enviar sugerencias inteligentes
   ✔ Ejecutar acciones automáticas (AURA_Actions.js)
   ✔ Supervisar módulos FAZO (AguaRuta, Flota, Traslado, etc.)

   Este archivo NO tiene interfaz.
   Lo importa AURAChat o cualquier módulo FAZO.
*/

// ======================================================================
//  IMPORTAR MOTOR DE ACCIONES
// ======================================================================
import { ejecutarAccion } from "../core/AURA_Actions";

// ======================================================================
//  MOTOR DE AUTONOMÍA
// ======================================================================

export const AURA_Agent = {
  // Estado interno del agente
  estado: {
    ultimaRevision: null,
    problemasDetectados: [],
    sugerencias: [],
  },

  // ================================================================
  // 1. ANÁLISIS PRINCIPAL
  // ================================================================
  analizarContexto(datos) {
    const reporte = [];

    // ------------------------------------------------------------
    // A) Detectar rutas desbalanceadas
    // ------------------------------------------------------------
    if (datos.rutas) {
      const warningRutas = this.detectarDesbalance(datos.rutas);
      if (warningRutas) reporte.push(warningRutas);
    }

    // ------------------------------------------------------------
    // B) Detectar camiones críticos
    // ------------------------------------------------------------
    if (datos.camiones) {
      const warningCamion = this.detectarFallasCamiones(datos.camiones);
      if (warningCamion) reporte.push(warningCamion);
    }

    // ------------------------------------------------------------
    // C) Detectar viernes sobrecargados
    // ------------------------------------------------------------
    if (datos.rutas) {
      const warnViernes = this.detectarProblemasViernes(datos.rutas);
      if (warnViernes) reporte.push(warnViernes);
    }

    this.estado.ultimaRevision = new Date();
    this.estado.problemasDetectados = reporte;

    return reporte;
  },

  // ================================================================
  // 2. REGLA — Rutas desbalanceadas
  // ================================================================
  detectarDesbalance(rutas) {
    try {
      const litrosPorCamion = {};

      rutas.forEach((r) => {
        const c = r.camion;
        litrosPorCamion[c] = (litrosPorCamion[c] || 0) + r.litros;
      });

      const entries = Object.entries(litrosPorCamion);

      const max = Math.max(...entries.map((x) => x[1]));
      const min = Math.min(...entries.map((x) => x[1]));

      if (max - min > 12000) {
        return {
          tipo: "alerta",
          mensaje:
            "Detecté un desbalance importante entre camiones. Sugiero redistribuir.",
          datos: { litrosPorCamion },
        };
      }
    } catch (err) {}

    return null;
  },

  // ================================================================
  // 3. REGLA — Camiones críticos
  // ================================================================
  detectarFallasCamiones(camiones) {
    const criticos = camiones.filter((c) => c.estado === "critico");

    if (criticos.length > 0) {
      return {
        tipo: "alerta",
        mensaje: `Detecté ${criticos.length} camión(es) en estado crítico.`,
        datos: criticos,
      };
    }

    return null;
  },

  // ================================================================
  // 4. REGLA — Viernes deben ser livianos
  // ================================================================
  detectarProblemasViernes(rutas) {
    const viernes = rutas.filter((r) => r.dia === "Viernes");

    const total = viernes.reduce((a, b) => a + b.litros, 0);

    if (total > 26000) {
      return {
        tipo: "alerta",
        mensaje: "El viernes está sobrecargado. Sugiero reducción para terminar temprano.",
        litros: total,
      };
    }

    return null;
  },

  // ================================================================
  // 5. SUGERENCIAS AUTOMÁTICAS
  // ================================================================
  generarSugerencias() {
    const out = [];

    if (this.estado.problemasDetectados.length === 0) {
      out.push("Todo se ve estable ahora mismo.");
    } else {
      this.estado.problemasDetectados.forEach((p) => {
        out.push("🔍 " + p.mensaje);
      });
    }

    this.estado.sugerencias = out;
    return out;
  },

  // ================================================================
  // 6. AUTONOMÍA — EL AGENTE TOMA DECISIONES
  // ================================================================
  actuarSiEsNecesario() {
    const problemas = this.estado.problemasDetectados;

    problemas.forEach((p) => {
      if (p.mensaje.includes("redistribuir")) {
        ejecutarAccion("redistribuir-automatico", p.datos);
      }

      if (p.mensaje.includes("crítico")) {
        ejecutarAccion("alertar-mantenimiento", p.datos);
      }
    });

    return true;
  },

  // ================================================================
  // 7. CONSULTA RÁPIDA PARA AURAChat
  // ================================================================
  obtenerEstado() {
    return {
      ultimaRevision: this.estado.ultimaRevision,
      problemas: this.estado.problemasDetectados,
      sugerencias: this.estado.sugerencias,
    };
  },
};

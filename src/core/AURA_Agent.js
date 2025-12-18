// ======================================================================
//  AURA_Agent.js — Autonomous Decision Engine 2025 (FAZO OS AI CORE)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Motor de autonomía + reglas + análisis automático
// ======================================================================

import { ejecutarAccion } from "./AURA_Actions";

export const AURA_Agent = {
  estado: {
    ultimaRevision: null,
    problemasDetectados: [],
    sugerencias: [],
  },

  // ================================================================
  // 1. ANALIZAR CONTEXTO GENERAL DEL SISTEMA
  // ================================================================
  analizarContexto(datos) {
    const reporte = [];

    // A) Rutas desbalanceadas
    if (datos.rutas) {
      const warn = this.detectarDesbalance(datos.rutas);
      if (warn) reporte.push(warn);
    }

    // B) Camiones críticos
    if (datos.camiones) {
      const warn = this.detectarCamionesCriticos(datos.camiones);
      if (warn) reporte.push(warn);
    }

    // C) Problemas en días viernes
    if (datos.rutas) {
      const warn = this.detectarViernesPesado(datos.rutas);
      if (warn) reporte.push(warn);
    }

    this.estado.ultimaRevision = new Date();
    this.estado.problemasDetectados = reporte;

    return reporte;
  },

  // ================================================================
  // 2. DETECTAR DESBALANCE ENTRE CAMIONES
  // ================================================================
  detectarDesbalance(rutas) {
    try {
      const litros = {};

      rutas.forEach((r) => {
        litros[r.camion] = (litros[r.camion] || 0) + r.litros;
      });

      const arr = Object.values(litros);
      if (arr.length === 0) return null;

      const max = Math.max(...arr);
      const min = Math.min(...arr);

      if (max - min > 12000) {
        return {
          tipo: "alerta",
          mensaje: "Detecté un desbalance importante entre camiones.",
          datos: litros,
        };
      }
    } catch {}

    return null;
  },

  // ================================================================
  // 3. DETECTAR CAMIONES CRÍTICOS
  // ================================================================
  detectarCamionesCriticos(camiones) {
    const criticos = camiones.filter((c) => c.estado === "critico");
    if (criticos.length > 0) {
      return {
        tipo: "alerta",
        mensaje: "Detecté camiones en condición crítica.",
        datos: criticos,
      };
    }
    return null;
  },

  // ================================================================
  // 4. DETECTAR DÍAS VIERNES SOBRECARGADOS
  // ================================================================
  detectarViernesPesado(rutas) {
    const viernes = rutas.filter((r) => r.dia?.toLowerCase() === "viernes");
    const total = viernes.reduce((a, b) => a + b.litros, 0);

    if (total > 26000) {
      return {
        tipo: "alerta",
        mensaje: "El viernes está sobrecargado. Sugiero aligerar la jornada.",
        litros: total,
      };
    }

    return null;
  },

  // ================================================================
  // 5. GENERAR SUGERENCIAS AUTOMÁTICAS
  // ================================================================
  generarSugerencias() {
    if (this.estado.problemasDetectados.length === 0) {
      this.estado.sugerencias = ["Todo estable por ahora."];
    } else {
      this.estado.sugerencias = this.estado.problemasDetectados.map(
        (p) => "🔍 " + p.mensaje
      );
    }
    return this.estado.sugerencias;
  },

  // ================================================================
  // 6. EJECUTAR ACCIONES AUTOMÁTICAS SEGÚN ALERTAS
  // ================================================================
  actuarSiEsNecesario() {
    this.estado.problemasDetectados.forEach((p) => {
      if (p.mensaje.includes("desbalance")) {
        ejecutarAccion("redistribuir-automatico", p.datos);
      }
      if (p.mensaje.includes("crític")) {
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

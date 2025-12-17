// ======================================================================
//  AURA_Agent.js — Autonomous Decision Engine 2025 (VERSIÓN PRO MAX)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Motor de autonomía + reglas + acciones inteligentes
// ======================================================================

import { ejecutarAccion } from "../core/AURA_Actions";
import interpretarMensaje from "../aura/AURA_NaturalLanguage";

// ======================================================================
//  MOTOR DEL AGENTE AUTÓNOMO AURA
// ======================================================================

export const AURA_Agent = {
  estado: {
    ultimaRevision: null,
    problemasDetectados: [],
    sugerencias: [],
    prioridad: null,
  },

  // ================================================================
  // 1. ANALIZAR CONTEXTO OPERACIONAL COMPLETO
  // ================================================================
  analizarContexto(datos) {
    const reporte = [];

    // ---- A) Rutas desbalanceadas
    const warnRutas = this.detectarDesbalance(datos.rutas);
    if (warnRutas) reporte.push(warnRutas);

    // ---- B) Camiones críticos
    const warnCamion = this.detectarFallasCamiones(datos.camiones);
    if (warnCamion) reporte.push(warnCamion);

    // ---- C) Viernes deben ser livianos
    const warnViernes = this.detectarProblemasViernes(datos.rutas);
    if (warnViernes) reporte.push(warnViernes);

    // Guardar estado
    this.estado.ultimaRevision = new Date();
    this.estado.problemasDetectados = reporte;

    // Calcular prioridad general
    this.estado.prioridad = this.calcularPrioridad(reporte);

    return reporte;
  },

  // ================================================================
  // 2. PRIORIDADES — Inteligencia táctica
  // ================================================================
  calcularPrioridad(reporte) {
    if (reporte.length === 0) return "estable";

    if (reporte.some((p) => p.tipo === "critico")) return "critico";

    if (reporte.some((p) => p.tipo === "alerta")) return "alerta";

    return "moderado";
  },

  // ================================================================
  // 3. DETECCIÓN DE DESBALANCE ENTRE CAMIONES
  // ================================================================
  detectarDesbalance(rutas) {
    if (!rutas) return null;

    const litrosPorCamion = {};

    rutas.forEach((r) => {
      litrosPorCamion[r.camion] = (litrosPorCamion[r.camion] || 0) + r.litros;
    });

    const valores = Object.values(litrosPorCamion);

    const max = Math.max(...valores);
    const min = Math.min(...valores);

    if (max - min > 12000) {
      return {
        tipo: "alerta",
        mensaje:
          "Detecté un desbalance importante entre camiones. Sugiero redistribuir rutas.",
        datos: litrosPorCamion,
      };
    }

    return null;
  },

  // ================================================================
  // 4. DETECCIÓN DE CAMIONES CRÍTICOS
  // ================================================================
  detectarFallasCamiones(camiones) {
    if (!camiones) return null;

    const criticos = camiones.filter((c) => c.estado === "critico");

    if (criticos.length > 0) {
      return {
        tipo: "critico",
        mensaje: `⚠️ Detecté ${criticos.length} camión(es) en estado crítico.`,
        datos: criticos,
      };
    }

    return null;
  },

  // ================================================================
  // 5. DETECTAR PROBLEMAS EN VIERNES (debe ser liviano)
  // ================================================================
  detectarProblemasViernes(rutas) {
    if (!rutas) return null;

    const viernes = rutas.filter((r) => r.dia === "Viernes");

    const total = viernes.reduce((a, b) => a + b.litros, 0);

    if (total > 26000) {
      return {
        tipo: "alerta",
        mensaje:
          "El viernes está sobrecargado. Sugiero reducir carga para terminar temprano.",
        litros: total,
      };
    }

    return null;
  },

  // ================================================================
  // 6. SUGERENCIAS HUMANAS PARA AURAChat
  // ================================================================
  generarSugerencias() {
    const out = [];

    if (this.estado.problemasDetectados.length === 0) {
      out.push("Todo está estable por ahora. ✔️");
    } else {
      this.estado.problemasDetectados.forEach((p) => {
        out.push("🔍 " + p.mensaje);
      });
    }

    this.estado.sugerencias = out;
    return out;
  },

  // ================================================================
  // 7. AUTONOMÍA REAL — Tomar decisiones
  // ================================================================
  actuarSiEsNecesario() {
    const problemas = this.estado.problemasDetectados;

    problemas.forEach((p) => {
      // --- Redistribución
      if (p.mensaje.includes("redistribuir")) {
        ejecutarAccion("redistribuir-automatico", p.datos);
      }

      // --- Mantenimiento urgente
      if (p.tipo === "critico") {
        ejecutarAccion("alertar-mantenimiento", p.datos);
      }
    });

    return true;
  },

  // ================================================================
  // 8. PROCESAR LENGUAJE NATURAL
  // ================================================================
  interpretar(texto) {
    return interpretarMensaje(texto);
  },

  // ================================================================
  // 9. CONSULTA PARA AURAChat
  // ================================================================
  obtenerEstado() {
    return {
      ultimaRevision: this.estado.ultimaRevision,
      problemas: this.estado.problemasDetectados,
      sugerencias: this.estado.sugerencias,
      prioridad: this.estado.prioridad,
    };
  },
};

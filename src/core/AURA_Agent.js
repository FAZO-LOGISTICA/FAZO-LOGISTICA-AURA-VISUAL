// ======================================================================
//  AURA_Agent.js — Motor de autonomía inteligente de AURA
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Análisis automático, alertas y decisiones del sistema
// ======================================================================

import { FAZO_OS_EventBridge } from "./FAZO_OS_EventBridge";

// Frecuencia de análisis automático (ms)
const INTERVALO = 8000; // cada 8 segundos — puedes ajustar

let AGENTE_ACTIVO = false;

export const AURA_Agent = {
  iniciar() {
    if (AGENTE_ACTIVO) return;
    AGENTE_ACTIVO = true;

    console.log("🤖 AURA Agent iniciado…");

    setInterval(() => {
      this.revisionAutomatica();
    }, INTERVALO);
  },

  // ============================================================
  // 1) Revisión completa de sistema
  // ============================================================
  revisionAutomatica() {
    if (!window.__FAZO_DATA__) return;

    const data = window.__FAZO_DATA__;
    const alertas = [];

    // ------------------------------------------
    // A) Balance de litros por camión
    // ------------------------------------------
    if (data.camiones) {
      for (let c of data.camiones) {
        if (c.litros > 45000) {
          alertas.push(`El camión ${c.nombre} supera los 45.000 litros.`);
        }
        if (c.litros < 30000) {
          alertas.push(
            `El camión ${c.nombre} tiene carga muy baja (${c.litros} L).`
          );
        }
      }
    }

    // ------------------------------------------
    // B) Días con rutas insuficientes
    // ------------------------------------------
    if (data.dias) {
      for (let d of data.dias) {
        if (d.entregas < 2) {
          alertas.push(
            `El día ${d.nombre} tiene muy pocas entregas asignadas.`
          );
        }
      }
    }

    // ------------------------------------------
    // C) Puntos sin coordenadas
    // ------------------------------------------
    if (data.puntos) {
      const sinGeo = data.puntos.filter(
        (p) => !p.latitud || !p.longitud
      ).length;

      if (sinGeo > 0) {
        alertas.push(`Hay ${sinGeo} puntos sin coordenadas GPS.`);
      }
    }

    // ------------------------------------------
    // D) Puntos duplicados
    // ------------------------------------------
    if (data.puntos) {
      const nombres = {};
      const duplicados = [];

      for (let p of data.puntos) {
        if (!nombres[p.nombre]) nombres[p.nombre] = 0;
        nombres[p.nombre]++;

        if (nombres[p.nombre] === 2) duplicados.push(p.nombre);
      }

      if (duplicados.length > 0) {
        alertas.push(`Puntos duplicados detectados: ${duplicados.join(", ")}`);
      }
    }

    // ------------------------------------------
    // ENVIAR A AURA SI HAY ALERTAS
    // ------------------------------------------
    if (alertas.length > 0) {
      FAZO_OS_EventBridge.emit("AURA_ANALISIS_AUTOMATICO", {
        sugerencias: alertas,
      });
    }
  },
};

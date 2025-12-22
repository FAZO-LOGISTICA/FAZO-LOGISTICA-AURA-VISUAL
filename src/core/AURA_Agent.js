// ======================================================================
//  AURA_Agent.js — Autonomía + Aprendizaje + Memoria Total
// ======================================================================

import { FAZO_OS_EventBridge } from "./FAZO_OS_EventBridge";
import { guardarEnMemoria, obtenerRecuerdos } from "./AURAMemory";

const INTERVALO = 8000;
let AGENTE_ACTIVO = false;

export const AURA_Agent = {
  iniciar() {
    if (AGENTE_ACTIVO) return;
    AGENTE_ACTIVO = true;

    console.log("🤖 AURA Agent iniciado… (con memoria total)");

    setInterval(() => this.revisionAutomatica(), INTERVALO);
  },

  // ============================================================
  // ANÁLISIS AUTOMÁTICO
  // ============================================================
  revisionAutomatica() {
    if (!window.__FAZO_DATA__) return;

    const d = window.__FAZO_DATA__;
    const alertas = [];

    // -------- balance litros --------
    if (d.camiones) {
      for (let c of d.camiones) {
        if (c.litros > 45000)
          alertas.push(`⚠️ El camión ${c.nombre} está sobrecargado (${c.litros} L).`);
        if (c.litros < 25000)
          alertas.push(`ℹ️ El camión ${c.nombre} tiene muy poca carga.`);
      }
    }

    // -------- puntos sin GPS --------
    if (d.puntos) {
      const sinGeo = d.puntos.filter((p) => !p.latitud || !p.longitud).length;
      if (sinGeo > 0)
        alertas.push(`📍 Hay ${sinGeo} puntos sin coordenadas GPS.`);
    }

    // -------- duplicados --------
    if (d.puntos) {
      const map = {};
      const dup = [];
      for (let p of d.puntos) {
        map[p.nombre] = (map[p.nombre] || 0) + 1;
        if (map[p.nombre] === 2) dup.push(p.nombre);
      }
      if (dup.length)
        alertas.push(`🔁 Duplicados detectados: ${dup.join(", ")}`);
    }

    // -------- MEMORIA ACTIVA --------
    const recuerdos = obtenerRecuerdos();
    if (recuerdos.length > 0) {
      alertas.push(`🧠 Tengo ${recuerdos.length} recuerdos recientes almacenados.`);
    }

    // -------- disparar --------
    if (alertas.length > 0) {
      guardarEnMemoria(
        `Agente detectó ${alertas.length} alertas automáticas.`
      );

      FAZO_OS_EventBridge.emit("AURA_ANALISIS_AUTOMATICO", {
        sugerencias: alertas,
      });
    }
  },
};

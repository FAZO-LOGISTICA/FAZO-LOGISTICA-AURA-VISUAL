// ======================================================================
//  AURA_Agent.js — Agente Autónomo FAZO OS (Versión Profesional)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Monitoreo automático + Diagnóstico del sistema
// ======================================================================

import { FAZO_OS_EventBridge } from "./FAZO_OS_EventBridge";

const INTERVALO = 8000; // cada 8 segundos
let AGENTE_ACTIVO = false;

export const AURA_Agent = {
  iniciar() {
    if (AGENTE_ACTIVO) return;
    AGENTE_ACTIVO = true;

    console.log("🤖 AURA Agent Autónomo iniciado…");

    setInterval(() => this.revisionAutomatica(), INTERVALO);
  },

  // ============================================================
  //  Monitoreo Operativo FAZO OS — AguaRuta / Traslado / Flota
  // ============================================================
  revisionAutomatica() {
    const data = window.__FAZO_DATA__;
    if (!data) return;

    const alertas = [];

    // A) Litros por camión (carga crítica)
    if (data.camiones) {
      data.camiones.forEach((c) => {
        if (c.litros > 45000)
          alertas.push(`Camión ${c.nombre}: carga excesiva (${c.litros} L).`);
        if (c.litros < 30000)
          alertas.push(`Camión ${c.nombre}: carga muy baja (${c.litros} L).`);
      });
    }

    // B) Días con rutas insuficientes
    if (data.dias) {
      data.dias.forEach((d) => {
        if (d.entregas < 2)
          alertas.push(`El día ${d.nombre} tiene menos de 2 entregas asignadas.`);
      });
    }

    // C) Puntos sin georreferencia
    if (data.puntos) {
      const sinGeo = data.puntos.filter(
        (p) => !p.latitud || !p.longitud
      ).length;

      if (sinGeo > 0)
        alertas.push(`${sinGeo} puntos no tienen coordenadas GPS.`);
    }

    // D) Duplicados por nombre
    if (data.puntos) {
      const count = {};
      const duplicados = [];

      data.puntos.forEach((p) => {
        count[p.nombre] = (count[p.nombre] || 0) + 1;
        if (count[p.nombre] === 2) duplicados.push(p.nombre);
      });

      if (duplicados.length)
        alertas.push(
          `Puntos duplicados detectados: ${duplicados.join(", ")}`
        );
    }

    // Emitir alertas
    if (alertas.length > 0) {
      FAZO_OS_EventBridge.emit("AURA_ANALISIS_AUTOMATICO", {
        sugerencias: alertas,
      });
    }
  },
};

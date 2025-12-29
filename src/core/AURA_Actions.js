// ======================================================================
//  AURA_Actions.js — Acciones del Sistema para AURA OS (FAZO LOGÍSTICA)
//  Versión ULTIMATE 2025 — Conectado a Nexus, EventBridge y AutoFix
// ======================================================================

import {
  eventoAbrirModulo,
  eventoAbrirSubruta,
  eventoAccionSistema,
} from "./FAZO_OS_EventBridge";

import { AURA_AutoFix } from "./AURA_AutoFix";
import { actualizarFAZOData } from "./FAZO_DATA";

// ============================================================
// MAPA PRINCIPAL DE ACCIONES
// ============================================================

const acciones = {
  // ------------------------------
  // SISTEMA
  // ------------------------------
  logout: () => {
    eventoAccionSistema("logout");
  },

  reiniciar: () => {
    eventoAccionSistema("reiniciar");
  },

  // ------------------------------
  // MÓDULOS COMPLETOS
  // ------------------------------
  "abrir-inicio": () => eventoAbrirModulo("inicio"),
  "abrir-aguaruta": () => eventoAbrirModulo("aguaruta"),
  "abrir-flota": () => eventoAbrirModulo("flota"),
  "abrir-traslado": () => eventoAbrirModulo("traslado"),
  "abrir-reportes": () => eventoAbrirModulo("reportes"),
  "abrir-ajustes": () => eventoAbrirModulo("ajustes"),

  // ------------------------------
  // SUBRUTAS DENTRO DE AGUARUTA
  // ------------------------------
  "aguaruta-open-tab": ({ tab }) => {
    if (!tab) return;
    eventoAbrirSubruta("aguaruta", tab);
  },

  // ------------------------------
  // FILTROS ESPECÍFICOS
  // ------------------------------
  "filtro-camion": ({ camion }) => {
    eventoAccionSistema("filtro-camion", { camion });
  },

  // ------------------------------
  // AUTO-FIX DEL SISTEMA → IA
  // ------------------------------
  autofix: async () => {
    const reporte = await AURA_AutoFix();

    return (
      "🔧 AutoFix completado.\n" +
      reporte.acciones.map((a) => `• ${a}`).join("\n")
    );
  },

  // ------------------------------
  // ACTUALIZAR BASE FAZO
  // ------------------------------
  "actualizar-fazo": async () => {
    await actualizarFAZOData();
    return "Datos FAZO actualizados.";
  },
};

// ============================================================
// EJECUTOR CENTRAL DE ACCIONES
// ============================================================

export function ejecutarAccion(nombre, payload = {}) {
  console.log("⚡ Ejecutando acción:", nombre, payload);

  const fn = acciones[nombre];

  if (!fn) {
    console.warn("❌ Acción no definida:", nombre);
    return `No reconozco la acción "${nombre}".`;
  }

  try {
    return fn(payload);
  } catch (err) {
    console.error("❌ Error ejecutando acción:", err);
    return "Hubo un error ejecutando la acción.";
  }
}

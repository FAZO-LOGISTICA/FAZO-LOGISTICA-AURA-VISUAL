// ======================================================================
//  AURA_Actions.js — Acciones reales del sistema FAZO OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Router oficial para comandos del OS
// ======================================================================

import { emitirEvento } from "./FAZO_OS_EventBridge";

// ============================================================
//  ACCIONES DEL SISTEMA (MODULARES, ESCALABLES, MULTIPROYECTO)
// ============================================================

export function ejecutarAccion(accion, payload = {}) {
  console.log("⚡ Ejecutando acción:", accion, payload);

  switch (accion) {
    // ============================================================
    // 🔐 Sesión
    // ============================================================
    case "logout":
      emitirEvento({
        tipo: "AURA_ACCION",
        accion: "logout",
      });
      return;

    // ============================================================
    // 🗂 Navegación general FAZO OS
    // ============================================================
    case "abrir-aguaruta":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "aguaruta",
      });
      return;

    case "abrir-traslado":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "traslado",
      });
      return;

    case "abrir-flota":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "flota",
      });
      return;

    case "abrir-inicio":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "inicio",
      });
      return;

    // ============================================================
    // 📍 Subrutas AguaRuta
    // ============================================================
    case "aguaruta-open-tab":
      emitirEvento({
        tipo: "AURA_SUBRUTA",
        modulo: "aguaruta",
        ruta: payload.tab,
      });
      return;

    // ============================================================
    // 🚚 Filtros en AguaRuta
    // ============================================================
    case "filtro-camion":
      emitirEvento({
        tipo: "AURA_ACCION",
        accion: "filtro-camion",
        camion: payload.camion,
      });
      return;

    // ============================================================
    // 🛠 Auto-Fix / Auto-Repair
    // ============================================================
    case "autofix-duplicados":
      emitirEvento({
        tipo: "AURA_ACCION",
        accion: "autofix-duplicados",
      });
      return;

    case "autofix-geodata":
      emitirEvento({
        tipo: "AURA_ACCION",
        accion: "autofix-geodata",
      });
      return;

    // ============================================================
    // 🔥 Acción desconocida
    // ============================================================
    default:
      console.warn("⚠️ Acción no reconocida:", accion);
      return;
  }
}

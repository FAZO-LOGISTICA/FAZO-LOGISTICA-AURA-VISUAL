// ======================================================================
//  AURA_Actions.js — Sistema de Acciones Oficial FAZO OS 2025
//  Conexión directa con:
//  - AURA_NEXUS
//  - AURA_Agent (autonomía inteligente)
//  - EventBridge (FAZO_OS_EventBridge.js)
//  - App.js (módulos, subrutas, filtros, logout)
// ======================================================================

import { emitirEvento } from "./FAZO_OS_EventBridge";

/*
   Todas las acciones del sistema van aquí.
   Son simples, limpias, y NO requieren conocer el intérprete de NLP.

   Desde este archivo, AURA puede:
   ✔ Abrir módulos completos
   ✔ Abrir subrutas de AguaRuta
   ✔ Ejecutar acciones del sistema
   ✔ Enviar filtros y comandos a iframes
   ✔ Cerrar sesión
   ✔ Enviar órdenes a AURA_Agent (futuro)
*/

// ======================================================================
// ACCIONES PRINCIPALES
// ======================================================================

export function ejecutarAccion(accion, payload = {}) {
  console.log("⚙️ Ejecutando acción:", accion, payload);

  switch (accion) {
    // --------------------------------------------------------------
    // SISTEMA / LOGIN / LOGOUT
    // --------------------------------------------------------------
    case "logout":
      emitirEvento({
        tipo: "AURA_ACCION",
        accion: "logout",
      });
      return;

    // --------------------------------------------------------------
    // AGUARUTA — MÓDULO COMPLETO
    // --------------------------------------------------------------
    case "abrir-aguaruta":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "aguaruta",
      });
      return;

    // --------------------------------------------------------------
    // TRASLADO MUNICIPAL — MÓDULO COMPLETO
    // --------------------------------------------------------------
    case "abrir-traslado":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "traslado",
      });
      return;

    // --------------------------------------------------------------
    // FLOTa MUNICIPAL
    // --------------------------------------------------------------
    case "abrir-flota":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "flota",
      });
      return;

    // --------------------------------------------------------------
    // INICIO
    // --------------------------------------------------------------
    case "abrir-inicio":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "inicio",
      });
      return;

    // --------------------------------------------------------------
    // REPORTES
    // --------------------------------------------------------------
    case "abrir-reportes":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "reportes",
      });
      return;

    // --------------------------------------------------------------
    // AJUSTES
    // --------------------------------------------------------------
    case "abrir-ajustes":
      emitirEvento({
        tipo: "AURA_MODULO",
        modulo: "ajustes",
      });
      return;

    // --------------------------------------------------------------
    // AGUARUTA — SUBRUTAS
    // --------------------------------------------------------------
    case "aguaruta-open-tab":
      emitirEvento({
        tipo: "AURA_SUBRUTA",
        ruta: payload.tab,
      });
      return;

    // --------------------------------------------------------------
    // FILTRO POR CAMIÓN
    // --------------------------------------------------------------
    case "filtro-camion":
      emitirEvento({
        tipo: "AURA_ACCION",
        accion: "filtro-camion",
        payload: {
          valor: payload?.valor,
        },
      });
      return;

    // --------------------------------------------------------------
    // ABRIR MAPA DIRECTO
    // --------------------------------------------------------------
    case "abrir-mapa":
      emitirEvento({
        tipo: "AURA_ACCION",
        accion: "abrir-mapa",
      });
      return;

    // --------------------------------------------------------------
    // ENVIAR DATOS O COMANDOS PERSONALIZADOS
    // --------------------------------------------------------------
    case "custom":
      emitirEvento({
        tipo: "AURA_ACCION",
        accion: "custom",
        payload,
      });
      return;

    // --------------------------------------------------------------
    // AUTO LOG — DEBUG
    // --------------------------------------------------------------
    default:
      console.warn("⚠️ Acción no definida en AURA_Actions:", accion, payload);
      return;
  }
}

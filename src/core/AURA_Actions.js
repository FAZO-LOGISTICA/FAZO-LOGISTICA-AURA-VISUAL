// ======================================================================
//  AURA_Actions.js — MOTOR DE ACCIONES DEL SISTEMA (FAZO OS + AURA NEXUS)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Acciones universales, modulares y expansibles
// ======================================================================

// ============================================================
//   UTILIDAD: ENVIAR EVENTOS AL SISTEMA (FAZO OS / App.js)
// ============================================================
function dispatchToOS(evento, data = {}) {
  window.dispatchEvent(
    new CustomEvent("AURA_EVENT", {
      detail: { evento, data },
    })
  );
}

// ============================================================
//   MOTOR CENTRAL DE ACCIONES
// ============================================================
export function ejecutarAccion(accion, payload = {}) {
  console.log("⚡ AURA ejecutando acción:", accion, payload);

  switch (accion) {
    // ============================================================
    // 🔵 SISTEMA (OS)
    // ============================================================
    case "logout":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "accion",
        accion: "logout",
      });
      break;

    case "abrir-inicio":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "modulo",
        modulo: "inicio",
      });
      break;

    case "abrir-aguaruta":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "modulo",
        modulo: "aguaruta",
      });
      break;

    case "abrir-traslado":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "modulo",
        modulo: "traslado",
      });
      break;

    case "abrir-flota":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "modulo",
        modulo: "flota",
      });
      break;

    case "abrir-reportes":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "modulo",
        modulo: "reportes",
      });
      break;

    case "abrir-ajustes":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "modulo",
        modulo: "ajustes",
      });
      break;

    // ============================================================
    // 🔵 SUBRUTAS — AGUARUTA
    // ============================================================
    case "aguaruta-open-tab":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "subruta",
        modulo: "aguaruta",
        ruta: payload.tab,
      });
      break;

    case "aguaruta-filtrar-camion":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "accion",
        accion: "filtrar-camion",
        valor: payload.camion,
      });
      break;

    // ============================================================
    // 🔵 COMANDOS GENERALES
    // ============================================================
    case "filtro-camion":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "accion",
        accion: "filtro-camion",
        valor: payload.valor,
      });
      break;

    case "refrescar":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "accion",
        accion: "refrescar",
      });
      break;

    // ============================================================
    // 🔵 FUTURO: EXTENSIONES
    // ============================================================
    case "notificacion":
      dispatchToOS("AURA_COMANDO_OS", {
        tipo: "accion",
        accion: "notificacion",
        mensaje: payload.mensaje,
      });
      break;

    // ============================================================
    // 🔴 SI NO EXISTE → ADVERTENCIA
    // ============================================================
    default:
      console.warn("⚠️ AURA_Actions: acción no reconocida →", accion);
      break;
  }
}

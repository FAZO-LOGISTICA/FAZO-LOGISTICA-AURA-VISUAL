// ======================================================================
//  AURA_Actions.js — MOTOR DE ACCIONES DEL SISTEMA (FAZO OS + AURA NEXUS)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Acciones universales, modulares y expansibles
// ======================================================================

// Todas las acciones disparan eventos que App.js (FAZO OS) escucha
function dispatchToOS(evento, data = {}) {
  window.dispatchEvent(
    new CustomEvent("AURA_EVENT", {
      detail: { evento, data },
    })
  );
}

// ======================================================================
//  LISTADO DE ACCIONES — OS, AguaRuta, Traslado, Flota, Global
// ======================================================================

export function ejecutarAccion(accion, payload = {}) {
  console.log("⚡ AURA ejecutando acción:", accion, payload);

  switch (accion) {
    // ============================================================
    // SISTEMA / FAZO OS
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
        tipo

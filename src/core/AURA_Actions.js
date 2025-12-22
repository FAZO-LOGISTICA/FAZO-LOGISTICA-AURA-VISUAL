// ======================================================================
//  AURA_Actions.js — Acciones reales que ejecuta el sistema FAZO OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Integración con EventBridge + MultiLog
// ======================================================================

import { FAZO_OS_EventBridge } from "./FAZO_OS_EventBridge";
import { LOG } from "./FAZO_OS_Log"; // 🔵 Nuevo: Logging total

/* 
   Todas las acciones reales del sistema pasan por aquí.
   AURA_NEXUS decide *qué hacer*, y AURA_Actions lo ejecuta.
*/

export function ejecutarAccion(accion, payload = {}) {
  LOG.accion("EjecutarAccion llamada", { accion, payload }); // 🔵 LOG

  try {
    switch (accion) {
      // ------------------------------------------------------------
      // CERRAR SESIÓN
      // ------------------------------------------------------------
      case "logout":
        LOG.accion("Cerrando sesión…");
        localStorage.removeItem("aura-acceso");
        window.location.reload();
        break;

      // ------------------------------------------------------------
      // AGUARUTA → ABRIR PANEL DE RUTAS
      // ------------------------------------------------------------
      case "abrir-rutas":
        LOG.accion("Abrir módulo AguaRuta → rutas-activas");
        FAZO_OS_EventBridge.emit("AURA_SUBRUTA", {
          modulo: "aguaruta",
          ruta: "rutas-activas",
        });
        break;

      // ------------------------------------------------------------
      // AGUARUTA → MAPA
      // ------------------------------------------------------------
      case "abrir-mapa":
        LOG.accion("Abrir mapa de AguaRuta");
        FAZO_OS_EventBridge.emit("AURA_SUBRUTA", {
          modulo: "aguaruta",
          ruta: "mapa",
        });
        break;

      // ------------------------------------------------------------
      // AGUARUTA (SUBRUTA DIRECTA)
      // ------------------------------------------------------------
      case "aguaruta-open-tab":
        LOG.accion("Abrir subruta AguaRuta", payload);
        FAZO_OS_EventBridge.emit("AURA_SUBRUTA", {
          modulo: "aguaruta",
          ruta: payload.tab,
        });
        break;

      // ------------------------------------------------------------
      // ABRIR MÓDULOS COMPLETOS
      // ------------------------------------------------------------
      case "abrir-aguaruta":
      case "abrir-traslado":
      case "abrir-flota":
      case "abrir-reportes":
      case "abrir-ajustes":
        const modulo = accion.replace("abrir-", "");
        LOG.accion("Abrir módulo completo", { modulo });
        FAZO_OS_EventBridge.emit("AURA_MODULO", {
          modulo,
        });
        break;

      // ------------------------------------------------------------
      // FILTRO DE CAMIÓN (COMANDO PARA AGUARUTA)
      // ------------------------------------------------------------
      case "filtro-camion":
        LOG.accion("Aplicando filtro de camión", payload);
        FAZO_OS_EventBridge.emit("AURA_ACCION", {
          accion: "filtro-camion",
          payload,
        });
        break;

      // ------------------------------------------------------------
      // ACCIÓN DESCONOCIDA
      // ------------------------------------------------------------
      default:
        LOG.error("Acción NO reconocida", { accion, payload });
        console.warn("⚠️ Acción no reconocida:", accion);
        break;
    }
  } catch (err) {
    LOG.error("Error ejecutando acción", { accion, error: err });
    console.error("❌ Error ejecutando acción:", err);
  }
}

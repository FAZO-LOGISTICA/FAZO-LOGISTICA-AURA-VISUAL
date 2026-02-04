// src/core/FAZO_DataListener.js
import { actualizarFAZOData } from "./FAZO_DATA";
import { FAZO_Intelligence } from "./FAZO_OS_Intelligence";

export function initFAZODataListener() {
  function onMessage(event) {
    if (!event?.data) return;

    if (event.data.type === "FAZO_DATA_UPDATE") {
      const { camiones, dias, puntos } = event.data.payload || {};

      console.log("📥 FAZO OS recibe datos de AguaRuta:", {
        camiones,
        dias,
        puntos,
      });

      // 1) Guardar memoria global
      actualizarFAZOData({
        camiones,
        dias,
        puntos,
      });

      // 2) Activar inteligencia
      const problemas = FAZO_Intelligence.autoAnalizar({
        camiones,
        dias,
        rutas: puntos,
      });

      if (problemas?.length) {
        FAZO_Intelligence.actuar(problemas);
      }
    }
  }

  window.addEventListener("message", onMessage);
  console.log("🛰️ FAZO Data Listener ACTIVO");

  return () => window.removeEventListener("message", onMessage);
}

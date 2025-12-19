// ======================================================================
//  AURA_Actions.js — Motor de Acciones Inteligentes del Sistema FAZO OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Acciones reales dentro del OS
// ======================================================================

/*
   Este archivo define TODAS las acciones que AURA puede ejecutar
   directamente dentro de FAZO OS, AguaRuta, Traslado y otros módulos.

   AURA usa esto cuando:
   ✔ El usuario da una orden (“abre rutas activas”, “cambia a flota”)
   ✔ El agente autónomo detecta un problema
   ✔ El sistema necesita enviar comandos a iFrames o cambiar vistas
*/

export function ejecutarAccion(tipo, payload = {}) {
  console.log("⚡ EJECUTANDO ACCIÓN AURA:", tipo, payload);

  switch (tipo) {

    // ============================================================
    //   ACCIONES GENERALES DEL SISTEMA
    // ============================================================
    case "logout":
      localStorage.removeItem("aura-acceso");
      window.location.reload();
      break;

    case "abrir-inicio":
      window.dispatchEvent(
        new CustomEvent("FAZO_SET_VISTA", { detail: "inicio" })
      );
      break;

    case "abrir-aura":
      window.dispatchEvent(
        new CustomEvent("FAZO_SET_VISTA", { detail: "aura" })
      );
      break;

    // ============================================================
    //   MÓDULOS PRINCIPALES
    // ============================================================

    case "abrir-aguaruta":
      window.dispatchEvent(
        new CustomEvent("FAZO_SET_VISTA", { detail: "aguaruta" })
      );
      break;

    case "abrir-traslado":
      window.dispatchEvent(
        new CustomEvent("FAZO_SET_VISTA", { detail: "traslado" })
      );
      break;

    case "abrir-flota":
      window.dispatchEvent(
        new CustomEvent("FAZO_SET_VISTA", { detail: "flota" })
      );
      break;

    case "abrir-reportes":
      window.dispatchEvent(
        new CustomEvent("FAZO_SET_VISTA", { detail: "reportes" })
      );
      break;

    case "abrir-ajustes":
      window.dispatchEvent(
        new CustomEvent("FAZO_SET_VISTA", { detail: "ajustes" })
      );
      break;

    // ============================================================
    //   SUBRUTAS AGUARUTA
    // ============================================================

    case "aguaruta-open-tab":
      if (!payload.tab) return;
      enviarAFrame("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: payload.tab,
      });
      break;

    case "aguaruta-filtrar-camion":
      if (!payload.camion) return;
      enviarAFrame("aguaruta", {
        type: "FAZO_CMD",
        command: "filtrar-camion",
        camion: payload.camion,
      });
      break;

    case "aguaruta-filtrar-dia":
      enviarAFrame("aguaruta", {
        type: "FAZO_CMD",
        command: "filtrar-dia",
        dia: payload.dia,
      });
      break;

    // ============================================================
    //   ANÁLISIS AUTOMÁTICOS
    // ============================================================

    case "redistribuir-automatico":
      console.log("♻ AURA inicia redistribución automática:", payload);
      enviarAFrame("aguaruta", {
        type: "FAZO_CMD",
        command: "redistribucion-automatica",
        data: payload,
      });
      break;

    case "alertar-mantenimiento":
      console.log("🛠 AURA detectó camión crítico → alerta enviada");
      enviarAFrame("flota", {
        type: "FAZO_CMD",
        command: "alerta-mantenimiento",
        data: payload,
      });
      break;

    // ============================================================
    //   DEFAULT
    // ============================================================
    default:
      console.warn("⚠ Acción no reconocida:", tipo);
      break;
  }
}

/* ======================================================================
   ENVÍO A IFRAMES
====================================================================== */

function enviarAFrame(modulo, payload) {
  try {
    window.postMessage(
      {
        modulo,
        ...payload,
      },
      "*"
    );
  } catch (err) {
    console.error("❌ Error al enviar a iFrame:", err);
  }
}

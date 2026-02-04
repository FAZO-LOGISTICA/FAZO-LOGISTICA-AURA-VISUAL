// ======================================================================
//  FAZO_DataResolver.js — Intérprete FAZO → Lenguaje Humano
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Núcleo que permite a AURA responder con datos reales
// ======================================================================

import { FAZO_DATA } from "./FAZO_DATA";

/**
 * Resuelve preguntas operativas del sistema FAZO
 * Si reconoce la pregunta, devuelve TEXTO
 * Si no reconoce, devuelve null (y AURA va a la nube)
 */
export function resolverPreguntaFAZO(texto) {
  if (!texto) return null;

  const t = texto.toLowerCase();

  // ======================================================
  // 🟦 DEFINICIÓN DEL SISTEMA
  // ======================================================
  if (t.includes("qué es aguaruta") || t.includes("que es aguaruta")) {
    return (
      "AguaRuta es el sistema municipal de gestión y entrega de agua potable. " +
      "Permite controlar rutas, camiones aljibe, litros entregados, estados de entrega y redistribución operativa."
    );
  }

  // ======================================================
  // 🚚 CAMIONES
  // ======================================================
  if (t.includes("camiones")) {
    if (!FAZO_DATA.camiones || FAZO_DATA.camiones.length === 0) {
      return "No hay camiones cargados actualmente en el sistema.";
    }

    return (
      "Camiones registrados:\n" +
      FAZO_DATA.camiones
        .map(
          (c) =>
            `• ${c.nombre} — ${Number(c.litros || 0).toLocaleString("es-CL")} litros`
        )
        .join("\n")
    );
  }

  // ======================================================
  // 📍 RUTAS / PUNTOS
  // ======================================================
  if (t.includes("rutas") || t.includes("puntos")) {
    return `Actualmente hay ${FAZO_DATA.puntos.length} puntos de entrega registrados en el sistema.`;
  }

  // ======================================================
  // 💧 LITROS TOTALES
  // ======================================================
  if (t.includes("litros")) {
    const total = FAZO_DATA.camiones.reduce(
      (acc, c) => acc + Number(c.litros || 0),
      0
    );

    return `El total de litros planificados para hoy es ${total.toLocaleString(
      "es-CL"
    )} litros.`;
  }

  // ======================================================
  // 📊 ESTADO GENERAL
  // ======================================================
  if (t.includes("estado del sistema") || t.includes("estado fazo")) {
    return (
      "Estado del sistema FAZO:\n" +
      `• Camiones: ${FAZO_DATA.camiones.length}\n` +
      `• Puntos de entrega: ${FAZO_DATA.puntos.length}\n` +
      `• Última actualización: ${
        window.__FAZO_DATA__ ? "reciente" : "sin datos"
      }`
    );
  }

  // ❌ No es pregunta FAZO
  return null;
}

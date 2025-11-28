// ========================================================
// 🚚 MÓDULO FLOTA Y MANTENCIÓN — FAZO (VERSIÓN PRO)
// Conexión a backend + análisis inteligente de la flota
// ========================================================

export async function resolver(texto) {
  const msg = texto.toLowerCase();
  const clean = msg.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const incluye = (...palabras) =>
    palabras.some((p) => clean.includes(p));

  const API = "https://flota-api.onrender.com/estado";
  let data = null;

  // ===============================
  // 🔗 INTENTO DE CONEXIÓN API
  // ===============================
  try {
    const res = await fetch(API);

    if (!res.ok) throw new Error("API no respondió");

    data = await res.json();
  } catch (err) {
    console.warn("⚠️ AURA: No pude conectar con Flota API.");
    data = null;
  }

  // ======================================================
  // 🔥 LÓGICA INTELIGENTE DE RESPUESTAS
  // ======================================================

  // -------------------------------------
  // ⛽ COMBUSTIBLE / RENDIMIENTO
  // -------------------------------------
  if (
    incluye("combustible", "bencina", "petroleo", "diesel", "rendimiento", "km", "km/l")
  ) {
    if (data?.rendimiento) {
      return (
        `El rendimiento promedio actual de la flota es ` +
        `${data.rendimiento} km/L. ` +
        `Si quieres, te calculo consumo aproximado por vehículo.` 
      );
    }

    return "No pude obtener el rendimiento actual, pero puedo ayudarte a estimarlo manualmente.";
  }

  // -------------------------------------
  // 🔧 MANTENCIONES
  // -------------------------------------
  if (
    incluye("mantencion", "mantencion", "mantencion proxima", "mantencion pendiente", "revision", "revisión técnica", "rt")
  ) {
    if (data?.mantencion_proxima) {
      return (
        `La próxima mantención corresponde al vehículo: ${data.mantencion_proxima}. ` +
        `¿Quieres que revise su historial de mantenciones?`
      );
    }

    return "No pude obtener la mantención programada, pero puedo ayudarte a planificarla.";
  }

  // -------------------------------------
  // 🚗 ESTADO DE LA FLOTA
  // -------------------------------------
  if (incluye("estado", "flota", "vehiculos", "vehículos", "cantidad")) {
    if (data?.activos !== undefined) {
      return (
        `Actualmente hay ${data.activos} vehículos activos en la flota municipal. ` +
        `Puedo revisar uso, carga de trabajo o disponibilidad.`
      );
    }

    return "No pude obtener el estado de la flota, pero puedo ayudarte con datos históricos.";
  }

  // ======================================================
  // 🔥 FALLBACK GENERAL
  // ======================================================
  return (
    "Puedo ayudarte con mantenimiento, combustible, rendimiento, odómetro, " +
    "revisión técnica y reportes de flota. ¿Qué quieres revisar exactamente?"
  );
}

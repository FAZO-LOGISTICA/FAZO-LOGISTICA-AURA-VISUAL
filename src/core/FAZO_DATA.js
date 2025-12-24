// ======================================================================
//  FAZO_DATA.js — Núcleo de datos del sistema FAZO OS
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Base analítica para AURA Agent
// ======================================================================

// Estructura central del sistema
export const FAZO_DATA = {
  camiones: [],   // { nombre, litros }
  dias: [],       // { nombre, entregas }
  puntos: []      // { nombre, latitud, longitud }
};

// ======================================================================
//  ACTUALIZAR DATA DESDE AGUARUTA (iFrame)
// ======================================================================
export function actualizarFAZOData(nuevaData) {
  try {
    if (!nuevaData) return;

    if (nuevaData.camiones) {
      FAZO_DATA.camiones = nuevaData.camiones;
    }

    if (nuevaData.dias) {
      FAZO_DATA.dias = nuevaData.dias;
    }

    if (nuevaData.puntos) {
      FAZO_DATA.puntos = nuevaData.puntos;
    }

    // Exponerlo al Window para AURA Agent
    window.__FAZO_DATA__ = FAZO_DATA;

    console.log("📡 FAZO_DATA actualizado correctamente:", FAZO_DATA);

  } catch (err) {
    console.error("❌ Error actualizando FAZO_DATA:", err);
  }
}

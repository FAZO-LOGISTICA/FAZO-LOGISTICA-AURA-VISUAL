// src/utils/fazoFetch.js

// ===============================================
//  FAZO BRIDGE — LECTURA DE DATOS en BACKEND REAL
// ===============================================

const API = "https://aguaruta-api.onrender.com"; 
// Reemplaza por tu dominio real si cambia

// ------------------------------------------------
// 1) Traer rutas activas completas
// ------------------------------------------------
export async function getRutasActivas() {
  try {
    const r = await fetch(`${API}/rutas-activas`);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    console.error("Error getRutasActivas:", e);
    return null;
  }
}

// ------------------------------------------------
// 2) Litros entregados por camión y día
// ------------------------------------------------
export async function getLitrosPorCamion() {
  try {
    const r = await fetch(`${API}/estadisticas/litros-camion-dia`);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    console.error("Error getLitrosPorCamion:", e);
    return null;
  }
}

// ------------------------------------------------
// 3) Entregas por día
// ------------------------------------------------
export async function getEntregasDia(dia) {
  try {
    const r = await fetch(`${API}/entregas-dia?dia=${dia}`);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    console.error("Error getEntregasDia:", e);
    return null;
  }
}

// ------------------------------------------------
// 4) Litros entregados semanalmente
// ------------------------------------------------
export async function getResumenSemanal() {
  try {
    const r = await fetch(`${API}/estadisticas/semanal`);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    console.error("Error getResumenSemanal:", e);
    return null;
  }
}

// ------------------------------------------------
// 5) Nuevas rutas con redistribución
// ------------------------------------------------
export async function getRedistribucion() {
  try {
    const r = await fetch(`${API}/redistribucion`);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    console.error("Error getRedistribucion:", e);
    return null;
  }
}

// ------------------------------------------------
// 6) Puntos no entregados con motivo y foto
// ------------------------------------------------
export async function getNoEntregadas() {
  try {
    const r = await fetch(`${API}/no-entregadas`);
    if (!r.ok) return null;
    return await r.json();
  } catch (e) {
    console.error("Error getNoEntregadas:", e);
    return null;
  }
}

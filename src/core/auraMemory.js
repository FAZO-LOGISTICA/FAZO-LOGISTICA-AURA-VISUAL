// ===============================================
//  AURA MEMORY — Recuerdos persistentes de FAZO
// ===============================================

const KEY = "AURA_MEMORY_V1";

export function cargarMemoria() {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : { recuerdos: [] };
  } catch {
    return { recuerdos: [] };
  }
}

export function guardarEnMemoria(texto) {
  const memoria = cargarMemoria();

  memoria.recuerdos.push({
    texto,
    fecha: new Date().toISOString(),
  });

  localStorage.setItem(KEY, JSON.stringify(memoria));
}

export function obtenerRecuerdos() {
  return cargarMemoria().recuerdos.slice(-10); // últimos 10 recuerdos
}

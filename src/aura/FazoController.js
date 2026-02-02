// ===================================================
// FazoController.js — PUENTE AURA → UI
// FAZO OS 2025
// ===================================================

export function initFazoController(setModuloActivo) {
  if (typeof setModuloActivo !== "function") {
    console.error("❌ setModuloActivo no es función");
    return;
  }

  console.log("🧠 FAZO Controller iniciado");

  window.addEventListener("AURA_EVENT", (e) => {
    const evento = e.detail;

    console.log("📡 FAZO EVENT RECIBIDO:", evento);

    if (!evento || !evento.tipo) return;

    switch (evento.tipo) {
      case "OPEN_MODULE":
        if (evento.modulo) {
          console.log("🚀 Cambiando módulo a:", evento.modulo);
          setModuloActivo(evento.modulo.toLowerCase());
        }
        break;

      default:
        console.warn("⚠ Evento FAZO no manejado:", evento.tipo);
    }
  });
}

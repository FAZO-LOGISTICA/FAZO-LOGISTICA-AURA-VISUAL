// ===================================================
// FazoController.js — PUENTE REAL AURA → FAZO UI
// ===================================================

export function initFazoController(setModuloActivo) {
  if (!setModuloActivo) {
    console.error("❌ setModuloActivo no recibido");
    return;
  }

  console.log("🧠 FazoController inicializado");

  window.addEventListener("AURA_EVENT", (e) => {
    const data = e.detail;
    if (!data) return;

    console.log("⚡ EVENTO FAZO RECIBIDO:", data);

    // ==============================
    // 🔓 ABRIR MÓDULOS
    // ==============================
    if (data.tipo === "OPEN_MODULE") {
      const modulo = data.modulo?.toLowerCase();

      if (modulo) {
        console.log("➡️ Cambiando módulo a:", modulo);
        setModuloActivo(modulo);
      }
    }
  });
}

// ===================================================
// FazoController.js — PUENTE REAL AURA → FAZO UI
// ===================================================

export function initFazoController(setModuloActivo) {
  if (typeof setModuloActivo !== "function") {
    console.error("❌ setModuloActivo inválido en FazoController");
    return;
  }

  console.log("🧠 FazoController inicializado");

  const handler = (event) => {
    const data = event.detail;
    if (!data) return;

    console.log("⚡ AURA_EVENT recibido:", data);

    // 🔑 CLAVE: tipo EXACTO
    if (data.tipo === "OPEN_MODULE") {
      const modulo = data.modulo?.toLowerCase();

      if (modulo) {
        console.log("➡️ Cambiando módulo a:", modulo);
        setModuloActivo(modulo);
      }
    }
  };

  window.addEventListener("AURA_EVENT", handler);

  // Limpieza segura
  return () => {
    window.removeEventListener("AURA_EVENT", handler);
  };
}

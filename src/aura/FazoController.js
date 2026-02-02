// ===================================================
// FazoController.js — PUENTE REAL AURA → FAZO UI
// ===================================================

export function initFazoController(setModuloActivo) {
  if (typeof setModuloActivo !== "function") {
    console.error("❌ setModuloActivo no es función");
    return;
  }

  console.log("🧠 FazoController activo");

  const handler = (event) => {
    const data = event.detail;
    if (!data) return;

    console.log("⚡ AURA_EVENT recibido:", data);

    // 🔑 ESTA ES LA CLAVE
    if (data.tipo === "OPEN_MODULE") {
      const modulo = data.modulo?.toLowerCase();

      if (modulo) {
        console.log("➡️ Cambiando módulo a:", modulo);
        setModuloActivo(modulo);
      }
    }
  };

  window.addEventListener("AURA_EVENT", handler);

  // Limpieza correcta
  return () => {
    window.removeEventListener("AURA_EVENT", handler);
  };
}

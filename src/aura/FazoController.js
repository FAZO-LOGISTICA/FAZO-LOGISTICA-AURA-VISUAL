// ===================================================
// FazoController.js
// Núcleo de control FAZO OS
// Escucha eventos AURA y controla la UI
// ===================================================

export function initFazoController(setModuloActivo) {
  if (typeof setModuloActivo !== "function") {
    console.error("❌ setModuloActivo no es una función");
    return;
  }

  console.log("🧠 FazoController inicializado");

  window.addEventListener("AURA_EVENT", (event) => {
    const data = event.detail;

    if (!data) return;

    console.log("⚡ Evento FAZO recibido:", data);

    // ===============================
    // APERTURA DE MÓDULOS
    // ===============================
    if (data.tipo === "OPEN_MODULE" && data.modulo) {
      setModuloActivo(data.modulo.toLowerCase());
    }
  });
}

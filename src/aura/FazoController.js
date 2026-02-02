// ===================================================
// FazoController.js
// Control central de FAZO OS desde AURA
// ===================================================

let estadoActual = {
  modulo: "inicio",
};

export function initFazoController(setModuloActivo) {
  window.addEventListener("AURA_EVENT", (e) => {
    const data = e.detail;
    if (!data) return;

    console.log("🎛 FAZO CONTROLLER:", data);

    switch (data.tipo) {
      case "OPEN_MODULE":
        if (data.modulo) {
          estadoActual.modulo = data.modulo.toLowerCase();
          setModuloActivo(estadoActual.modulo);
        }
        break;

      case "QUERY_DATA":
        // aquí luego conectamos AguaRuta real
        console.log("Consulta de datos:", data);
        break;

      default:
        console.warn("Evento FAZO no manejado:", data);
    }
  });
}

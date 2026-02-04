// ======================================================================
//  FAZO_OS_EventBridge.js — Puente Universal AURA ↔ FAZO OS (FINAL)
// ======================================================================

const subscriptores = new Set();

export function registrarSubsistema(callback) {
  if (typeof callback !== "function") {
    console.error("❌ Subsistema inválido:", callback);
    return () => {};
  }

  subscriptores.add(callback);
  console.log("✅ Subsistema registrado");

  return () => {
    subscriptores.delete(callback);
    console.log("🧹 Subsistema eliminado");
  };
}

export function emitirEvento(evento) {
  if (!evento) return;

  subscriptores.forEach((callback) => {
    try {
      callback(evento); // ✅ ÚNICA FORMA CORRECTA
    } catch (err) {
      console.error("❌ Error en subsistema:", err);
    }
  });
}

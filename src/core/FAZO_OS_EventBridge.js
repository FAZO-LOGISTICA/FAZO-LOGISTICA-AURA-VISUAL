// ======================================================================
//  FAZO_OS_EventBridge.js — Puente Universal AURA ↔ FAZO OS (FIXED)
// ======================================================================

const subscriptores = new Set();

/**
 * Registra un subsistema (callback)
 * @param {Function} callback
 */
export function registrarSubsistema(callback) {
  if (typeof callback !== "function") {
    console.error("❌ Subsistema inválido:", callback);
    return () => {};
  }

  subscriptores.add(callback);
  console.log("✅ Subsistema registrado");

  // Retornar unsubscribe REAL
  return () => {
    subscriptores.delete(callback);
    console.log("🧹 Subsistema eliminado");
  };
}

/**
 * Emite un evento a todos los subsistemas
 * @param {Object} evento
 */
export function emitirEvento(evento) {
  if (!evento) return;

  subscriptores.forEach((callback) => {
    try {
      callback(evento); // 👈 AQUÍ ESTABA EL ERROR
    } catch (err) {
      console.error("❌ Error en subsistema:", err);
    }
  });
}

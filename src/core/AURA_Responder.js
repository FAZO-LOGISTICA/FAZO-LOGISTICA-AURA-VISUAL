// ======================================================================
// AURA_Responder.js — Canal oficial de respuesta AURA → Chat
// FAZO LOGÍSTICA — Gustavo Oliva
// Mateo IA — DevMode 2025
// ======================================================================

/**
 * Envía texto directamente al componente AURAChat.
 * AURAChat ya escucha el evento "AURA_RESPUESTA".
 */
export function responderAURA(texto) {
  if (!texto) return;
  window.dispatchEvent(
    new CustomEvent("AURA_RESPUESTA", {
      detail: texto,
    })
  );
}

// ======================================================================
//  AURA_ResponseChannel.js — Canal unificado de respuesta
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Envía respuestas del NEXUS hacia AURAChat
// ======================================================================

/*
   Este módulo es simple:

   NEXUS → llama a emitirRespuesta()
   emitirRespuesta() → lanza un evento global
   AURAChat → lo recibe y lo muestra en pantalla
*/

export function emitirRespuesta(texto) {
  try {
    window.dispatchEvent(
      new CustomEvent("AURA_RESPUESTA", {
        detail: texto,
      })
    );
  } catch (err) {
    console.error("❌ Error enviando respuesta a AURAChat:", err);
  }
}

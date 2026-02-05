// ======================================================
// useAuraVoice.js — Voz para AURA (Web Speech API)
// ======================================================

export function usarVozAURA({ onTexto }) {
  let recognition = null;

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("❌ Navegador no soporta reconocimiento de voz");
    return { iniciar: () => {}, detener: () => {} };
  }

  recognition = new SpeechRecognition();
  recognition.lang = "es-CL";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (e) => {
    const texto = e.results[0][0].transcript;
    if (onTexto) onTexto(texto);
  };

  recognition.onerror = (e) => {
    console.error("🎙️ Error voz:", e);
  };

  return {
    iniciar: () => recognition.start(),
    detener: () => recognition.stop(),
  };
}

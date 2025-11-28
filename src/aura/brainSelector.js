// brainSelector.js
// --------------------------------------
// Selección automática del "cerebro" de AURA
// --------------------------------------

export const modeloPrioridad = [
  "claude",   // 🎯 Mejor para razonar y conversar
  "openai",   // 🔥 GPT-4.1 o GPT-5
  "gemini",   // 🤖 Buena para tareas multimedia
  "groq",     // ⚡ Rápida y gratis
  "llama",    // 🟦 Gratis (Meta)
  "cohere",   // 📘 Buen texto
  "deepseek"  // 🈶 Excelente en código
];

// Comprueba si hay clave en .env (si no hay, se salta el modelo)
function estaDisponible(nombre) {
  return Boolean(process.env[`REACT_APP_${nombre.toUpperCase()}_KEY`]);
}

export function obtenerModeloDisponible() {
  for (const modelo of modeloPrioridad) {
    if (estaDisponible(modelo)) {
      console.log("🧠 AURA eligió el motor:", modelo.toUpperCase());
      return modelo;
    }
  }

  console.warn("⚠️ No se encontró NINGÚN modelo con clave válida.");
  return null;
}

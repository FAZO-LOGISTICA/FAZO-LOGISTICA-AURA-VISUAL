// modelRouter.js
// ----------------------------------------------------
// Redirige la pregunta al modelo correcto
// ----------------------------------------------------

import { obtenerModeloDisponible } from "./brainSelector";

import { useClaude } from "./models/claude";
import { useOpenAI } from "./models/openai";
import { useGemini } from "./models/gemini";
import { useGroq } from "./models/groq";
import { useLlama } from "./models/llama";
import { useCohere } from "./models/cohere";
import { useDeepSeek } from "./models/deepseek";

export async function consultarModelo(prompt) {
  const modelo = obtenerModeloDisponible();
  if (!modelo) return "(No hay modelos disponibles. Revisa las claves del .env)";

  switch (modelo) {
    case "claude":
      return await useClaude(prompt);
    case "openai":
      return await useOpenAI(prompt);
    case "gemini":
      return await useGemini(prompt);
    case "groq":
      return await useGroq(prompt);
    case "llama":
      return await useLlama(prompt);
    case "cohere":
      return await useCohere(prompt);
    case "deepseek":
      return await useDeepSeek(prompt);
    default:
      return "(Modelo no reconocido)";
  }
}

// =====================================================
// modelRouter.js — AURA MULTI-IA ROUTER (PRODUCCIÓN)
// FAZO OS 2025
// =====================================================

import { obtenerModeloDisponible } from "./brainSelector";

import { useClaude } from "./models/claude";
import { useOpenAI } from "./models/openai";
import { useGemini } from "./models/gemini";
import { useGroq } from "./models/groq";
import { useLlama } from "./models/llama";
import { useCohere } from "./models/cohere";
import { useDeepSeek } from "./models/deepseek";

// =====================================================
// MAPA DE MODELOS
// =====================================================

const MODELOS = {
  claude: useClaude,
  openai: useOpenAI,
  gemini: useGemini,
  groq: useGroq,
  llama: useLlama,
  cohere: useCohere,
  deepseek: useDeepSeek,
};

// =====================================================
// CONSULTA CENTRAL (NUNCA CRASHEA)
// =====================================================

export async function consultarModelo(prompt) {
  const modelo = obtenerModeloDisponible();

  if (!modelo || !MODELOS[modelo]) {
    console.warn("⚠️ No hay modelos disponibles");
    return "AURA está operativa, pero ningún modelo de IA está disponible en este momento.";
  }

  try {
    const respuesta = await MODELOS[modelo](prompt);

    if (!respuesta || typeof respuesta !== "string") {
      throw new Error("Respuesta inválida del modelo");
    }

    // 🔍 Trazabilidad (solo debug)
    if (process.env.NODE_ENV !== "production") {
      console.debug(`🤖 Modelo usado: ${modelo}`);
    }

    return respuesta;
  } catch (error) {
    console.error(`❌ Error en modelo ${modelo}:`, error);

    return (
      "Tu solicitud fue recibida, pero el modelo activo tuvo un problema técnico. " +
      "Puedes intentarlo nuevamente o reformular la pregunta."
    );
  }
}

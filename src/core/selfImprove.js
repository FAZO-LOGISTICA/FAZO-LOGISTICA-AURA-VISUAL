// ====================================================
// SELF-IMPROVE — AURA analiza y mejora su propio código
// ====================================================

import { llamarIA } from "./llamadaIA";
import auraPersonality from "./auraPersonality";
import { obtenerRecuerdos } from "./auraMemory";

export async function mejorarCodigo(archivo, contenido) {
  try {
    const recuerdos = obtenerRecuerdos();

    const prompt = `
Eres AURA, un asistente técnico que mejora su propio código.

ARCHIVO A EVALUAR:
${archivo}

CÓDIGO:
${contenido}

RECUERDOS RELEVANTES DE USUARIO:
${recuerdos.map(r => "- " + r.texto).join("\n")}

INSTRUCCIONES:
1. Detecta errores o malas prácticas.
2. Propón mejoras reales, no inventadas.
3. Mantén el estilo técnico de FAZO.
4. NO inventes dependencias que no existen.
5. Devuelve SOLO código corregido.
`;

    const respuesta = await llamarIA(prompt);
    return respuesta;

  } catch (error) {
    return "// No fue posible mejorar este archivo ahora.";
  }
}

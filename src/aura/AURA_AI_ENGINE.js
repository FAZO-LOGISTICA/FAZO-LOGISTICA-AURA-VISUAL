// ======================================================================
// AURA_AI_ENGINE.js — Motor IA con Fallback Inteligente
// FAZO OS 2025 — Gustavo Oliva
// ======================================================================

import { registrarAccion } from "./AURAMemory";

// ============================================================
// CONFIGURACIÓN DE PROVEEDORES
// ============================================================

const OPENAI_ENDPOINT = "/api/openai";     // backend proxy
const CLAUDE_ENDPOINT = "/api/claude";     // backend proxy

// ============================================================
// IA LOCAL DE RESPALDO (NUNCA FALLA)
// ============================================================

function respuestaLocal(mensaje) {
  return `Entendido. He registrado tu solicitud: "${mensaje}". 
Si necesitas ejecutar una acción, indícamelo claramente.`;
}

// ============================================================
// LLAMADA A OPENAI
// ============================================================

async function llamarOpenAI(mensaje, contexto = []) {
  const res = await fetch(OPENAI_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mensaje,
      contexto,
    }),
  });

  if (!res.ok) throw new Error("OpenAI no disponible");

  const data = await res.json();
  return data?.respuesta;
}

// ============================================================
// LLAMADA A CLAUDE
// ============================================================

async function llamarClaude(mensaje, contexto = []) {
  const res = await fetch(CLAUDE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mensaje,
      contexto,
    }),
  });

  if (!res.ok) throw new Error("Claude no disponible");

  const data = await res.json();
  return data?.respuesta;
}

// ============================================================
// MOTOR PRINCIPAL
// ============================================================

export async function procesarMensajeIA(mensaje, contexto = []) {
  registrarAccion("IA_REQUEST", mensaje);

  // 1️⃣ OpenAI
  try {
    const r1 = await llamarOpenAI(mensaje, contexto);
    registrarAccion("IA_OK_OPENAI");
    return r1;
  } catch (err) {
    console.warn("⚠️ OpenAI falló:", err.message);
    registrarAccion("IA_FAIL_OPENAI");
  }

  // 2️⃣ Claude
  try {
    const r2 = await llamarClaude(mensaje, contexto);
    registrarAccion("IA_OK_CLAUDE");
    return r2;
  } catch (err) {
    console.warn("⚠️ Claude falló:", err.message);
    registrarAccion("IA_FAIL_CLAUDE");
  }

  // 3️⃣ Local (último recurso)
  registrarAccion("IA_LOCAL_FALLBACK");
  return respuestaLocal(mensaje);
}

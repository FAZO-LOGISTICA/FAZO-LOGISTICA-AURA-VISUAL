// ======================================================================
//  AURA_AI_Provider.js — Motor de Proveedores IA
//  FAZO-OS 2025
//  OpenAI PRIMARY · Claude SECONDARY · Fallback LOCAL
// ======================================================================

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const CLAUDE_API_KEY = import.meta.env.VITE_CLAUDE_API_KEY;

// Timeout global (ms)
const TIMEOUT = 12000;

// ============================================================
// Utilidad: timeout seguro
// ============================================================
function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("⏱️ Timeout IA")), ms)
    ),
  ]);
}

// ============================================================
// PROVEEDOR 1 — OPENAI (PRINCIPAL)
// ============================================================
async function callOpenAI(prompt) {
  if (!OPENAI_API_KEY) throw new Error("OpenAI API Key no configurada");

  const res = await withTimeout(
    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      }),
    }),
    TIMEOUT
  );

  if (!res.ok) {
    throw new Error("OpenAI respondió con error");
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content || "";
}

// ============================================================
// PROVEEDOR 2 — CLAUDE (SECUNDARIO)
// ============================================================
async function callClaude(prompt) {
  if (!CLAUDE_API_KEY) throw new Error("Claude API Key no configurada");

  const res = await withTimeout(
    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    }),
    TIMEOUT
  );

  if (!res.ok) {
    throw new Error("Claude respondió con error");
  }

  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ============================================================
// FALLBACK LOCAL (NUNCA FALLA)
// ============================================================
function localFallback(prompt) {
  return (
    "Estoy operativa, pero el proveedor de IA no está disponible en este momento. " +
    "Puedo seguir ayudándote con funciones del sistema, datos locales y navegación."
  );
}

// ============================================================
// FUNCIÓN PRINCIPAL — AURA THINK
// ============================================================
export async function auraThink(prompt) {
  // 1️⃣ OpenAI (SIEMPRE primero)
  try {
    const r = await callOpenAI(prompt);
    if (r) return r;
  } catch (err) {
    console.warn("⚠️ OpenAI falló:", err.message);
  }

  // 2️⃣ Claude (solo si OpenAI falla)
  try {
    const r = await callClaude(prompt);
    if (r) return r;
  } catch (err) {
    console.warn("⚠️ Claude falló:", err.message);
  }

  // 3️⃣ Fallback local (última línea de defensa)
  return localFallback(prompt);
}

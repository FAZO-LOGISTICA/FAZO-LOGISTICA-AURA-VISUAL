// ===================================================
// AURA_NEXUS.js — ORQUESTADOR DE IAs
// FAZO-OS 2025
// ===================================================

const TIMEOUT = 12000;

// ================= UTIL =================

const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout IA")), ms)
    ),
  ]);

// ================= IA PROVIDERS =================

// 1️⃣ OpenAI — PRINCIPAL
async function usarOpenAI(messages) {
  const res = await fetch("/api/ia/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) throw new Error("OpenAI falló");
  return res.json();
}

// 2️⃣ Claude — RESPALDO
async function usarClaude(messages) {
  const res = await fetch("/api/ia/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  if (!res.ok) throw new Error("Claude falló");
  return res.json();
}

// 3️⃣ Fallback local — ÚLTIMO RECURSO
function usarFallbackLocal() {
  return {
    reply:
      "Estoy operativo en modo seguro. No tengo acceso completo a IA externa, pero puedo seguir ayudándote.",
  };
}

// ================= NEXUS =================

export async function procesarConAURANexus(messages) {
  try {
    // 🥇 OpenAI
    return await withTimeout(usarOpenAI(messages), TIMEOUT);
  } catch (_) {
    try {
      // 🥈 Claude
      return await withTimeout(usarClaude(messages), TIMEOUT);
    } catch (_) {
      // 🥉 Local
      return usarFallbackLocal();
    }
  }
}

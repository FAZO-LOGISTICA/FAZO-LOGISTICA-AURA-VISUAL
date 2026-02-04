// ======================================================================
//  AURA_MultiModel.js — FAZO IA Router 2025 PRO ENTERPRISE
// ======================================================================

import config from "../config";

// ======================================================================
//  PROVEEDORES LÓGICOS (backend decide el motor real)
// ======================================================================

const PROVIDERS = {
  openai: { name: "OpenAI GPT" },
  claude: { name: "Claude" },
  gemini: { name: "Gemini" },
};

// ======================================================================
//  REGLAS DE SELECCIÓN AUTOMÁTICA
// ======================================================================

export function seleccionarIA(mensaje) {
  const t = mensaje.toLowerCase();

  if (
    t.includes("codigo") ||
    t.includes("programa") ||
    t.includes("react") ||
    t.includes("optimiza")
  ) return "openai";

  if (
    t.includes("redacta") ||
    t.includes("carta") ||
    t.includes("formal")
  ) return "claude";

  if (
    t.includes("analiza") ||
    t.includes("diagnóstico") ||
    t.includes("decisión")
  ) return "gemini";

  return "openai";
}

// ======================================================================
//  EJECUCIÓN REAL (SIEMPRE VÍA BACKEND)
// ======================================================================

export async function usarIA(provider, mensajes) {
  try {
    const res = await fetch(config.AURA_BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider,
        messages: mensajes,
      }),
    });

    const data = await res.json();
    return data.reply || "Sin respuesta de la IA.";
  } catch (err) {
    console.error("❌ Error IA:", err);
    return "Error al conectar con el backend de AURA.";
  }
}

// ======================================================================
//  MOTOR PRINCIPAL
// ======================================================================

export async function procesarAURA_Inteligencia(
  mensaje,
  historial,
  forzarIA = null
) {
  const proveedor = forzarIA || seleccionarIA(mensaje);
  const mensajes = [...historial, { role: "user", content: mensaje }];

  let respuesta = await usarIA(proveedor, mensajes);

  if (respuesta) {
    return { proveedor, respuesta };
  }

  // Fallback ordenado
  for (let p of ["openai", "claude", "gemini"]) {
    if (p === proveedor) continue;
    respuesta = await usarIA(p, mensajes);
    if (respuesta) return { proveedor: p, respuesta };
  }

  return {
    proveedor: "ninguno",
    respuesta: "No pude conectarme a ningún proveedor.",
  };
}

// ======================================================================
//  API FINAL PARA AURAChat
// ======================================================================

export async function AURA_MultiModel_Process(texto, historial, force = null) {
  return procesarAURA_Inteligencia(texto, historial, force);
}

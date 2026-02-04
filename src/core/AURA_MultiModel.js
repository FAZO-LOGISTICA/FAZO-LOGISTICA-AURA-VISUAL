// ======================================================================
//  AURA_MultiModel.js — FAZO IA Router 2025 (BUILD SAFE)
//  Autor: Mateo IA + Gustavo Oliva
//  Versión sin variables no usadas (Netlify / CI compatible)
// ======================================================================

import config from "../config";

// ======================================================================
//  1) SELECCIÓN AUTOMÁTICA DE IA SEGÚN INTENCIÓN
// ======================================================================

export function seleccionarIA(mensaje) {
  const t = mensaje.toLowerCase();

  // Código / desarrollo
  if (
    t.includes("codigo") ||
    t.includes("programa") ||
    t.includes("react") ||
    t.includes("fastapi") ||
    t.includes("optimiza")
  ) {
    return "openai";
  }

  // Redacción / comunicación
  if (
    t.includes("redacta") ||
    t.includes("correo") ||
    t.includes("oficio") ||
    t.includes("formal")
  ) {
    return "claude";
  }

  // Análisis / diagnóstico
  if (
    t.includes("analiza") ||
    t.includes("diagnostico") ||
    t.includes("estrategia") ||
    t.includes("decide")
  ) {
    return "gemini";
  }

  // Default
  return config.AURA_PRIMARY || "openai";
}

// ======================================================================
//  2) LLAMADA ÚNICA AL BACKEND AURA (Render)
// ======================================================================

async function llamarBackendAURA(mensajes) {
  const endpoint = config.AURA_BACKEND_URL;

  if (!endpoint) {
    throw new Error("Backend AURA no configurado");
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: mensajes }),
  });

  if (!res.ok) {
    throw new Error("Error backend AURA");
  }

  const data = await res.json();
  return data.reply || "Sin respuesta del backend.";
}

// ======================================================================
//  3) MOTOR PRINCIPAL MULTI-IA
// ======================================================================

export async function procesarAURA_Inteligencia(
  mensaje,
  historial = [],
  forzarIA = null
) {
  try {
    const proveedor = forzarIA || seleccionarIA(mensaje);

    const mensajes = [
      ...historial,
      { role: "user", content: mensaje },
    ];

    const respuesta = await llamarBackendAURA(mensajes);

    return {
      proveedor,
      respuesta,
    };
  } catch (err) {
    console.error("❌ Error AURA_MultiModel:", err);

    return {
      proveedor: "fallback",
      respuesta:
        "Estoy operativo en modo seguro. El backend no respondió, pero sigo activo.",
    };
  }
}

// ======================================================================
//  4) API FINAL PARA AURAChat
// ======================================================================

export async function AURA_MultiModel_Process(
  texto,
  historial = [],
  force = null
) {
  return await procesarAURA_Inteligencia(texto, historial, force);
}

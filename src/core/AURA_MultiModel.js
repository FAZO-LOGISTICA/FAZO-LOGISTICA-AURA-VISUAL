// ======================================================================
//  AURA_MultiModel.js — FAZO IA Router 2025 PRO ENTERPRISE
//  Autor: Mateo IA + Gustavo Oliva
//  Sistema híbrido que selecciona automáticamente la mejor IA para cada tarea.
//  Compatible con OpenAI, Claude, Gemini y expansiones futuras.
// ======================================================================

import config from "../config";

// ======================================================================
//  1) DEFINICIÓN DE PROVEEDORES DISPONIBLES
// ======================================================================

const PROVIDERS = {
  openai: {
    name: "OpenAI GPT",
    endpoint: config.AURA_BACKEND_URL,               // tu backend ya enruta GPT
    model: config.AURA_PRIMARY || "gpt-4.1",
  },
  claude: {
    name: "Claude",
    endpoint: config.CLAUDE_BACKEND_URL || "",
    model: config.AURA_CLAUDE_MODEL || "claude-3-5-sonnet",
  },
  gemini: {
    name: "Gemini",
    endpoint: config.GEMINI_BACKEND_URL || "",
    model: config.AURA_GEMINI_MODEL || "gemini-1.5-pro",
  },
};

// ======================================================================
//  2) REGLAS DE SELECCIÓN AUTOMÁTICA DE MODELO
// ======================================================================

export function seleccionarIA(mensaje) {
  const t = mensaje.toLowerCase();

  // ----------------------------
  // Código → GPT-o1 u OpenAI
  // ----------------------------
  if (
    t.includes("haz un código") ||
    t.includes("corrige este código") ||
    t.includes("programa") ||
    t.includes("optimiza código")
  ) {
    return "openai";
  }

  // ----------------------------
  // Redacción humana → Claude
  // ----------------------------
  if (
    t.includes("redacta") ||
    t.includes("escribe formal") ||
    t.includes("carta") ||
    t.includes("comunica") ||
    t.includes("humano")
  ) {
    return "claude";
  }

  // ----------------------------
  // Análisis largo → Gemini
  // ----------------------------
  if (
    t.includes("analiza") ||
    t.includes("interpretación") ||
    t.includes("diagnóstico") ||
    t.includes("toma de decisiones")
  ) {
    return "gemini";
  }

  // ----------------------------
  // Lógica de planificación → Claude
  // ----------------------------
  if (
    t.includes("planifica") ||
    t.includes("proyecta") ||
    t.includes("estrategia")
  ) {
    return "claude";
  }

  // ----------------------------
  // Por defecto → OpenAI (más equilibrado)
  // ----------------------------
  return "openai";
}

// ======================================================================
//  3) EJECUTAR CONSULTA EN EL PROVEEDOR CORRESPONDIENTE
// ======================================================================

export async function usarIA(providerName, mensajes) {
  const prov = PROVIDERS[providerName];
  if (!prov || !prov.endpoint) {
    console.warn("⚠️ Proveedor no configurado:", providerName);
    return "Proveedor no disponible.";
  }

  try {
    const res = await fetch(prov.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: providerName,
        model: prov.model,
        messages: mensajes,
      }),
    });

    const data = await res.json();
    return data.reply || "No obtuve respuesta.";
  } catch (err) {
    console.error("❌ Error al consultar IA:", err);
    return "Error al conectar con la IA.";
  }
}

// ======================================================================
//  4) MOTOR PRINCIPAL — MODO AUTOMÁTICO + MANUAL
// ======================================================================

export async function procesarAURA_Inteligencia(mensaje, historial, forzarIA = null) {
  let proveedor = null;

  // ----------------------------
  // 1) Si usuario fuerza IA
  // ----------------------------
  if (forzarIA) proveedor = forzarIA;
  else proveedor = seleccionarIA(mensaje);

  // ----------------------------
  // 2) Construcción del historial
  // ----------------------------
  const mensajes = [...historial, { role: "user", content: mensaje }];

  // ----------------------------
  // 3) Intento principal
  // ----------------------------
  let respuesta = await usarIA(proveedor, mensajes);

  if (respuesta && respuesta !== "Error al conectar con la IA.") {
    return { proveedor, respuesta };
  }

  // ----------------------------
  // 4) Fallback automático
  // ----------------------------
  const fallbackOrden = ["openai", "claude", "gemini"].filter(
    (p) => p !== proveedor
  );

  for (let p of fallbackOrden) {
    respuesta = await usarIA(p, mensajes);
    if (respuesta && respuesta !== "Error al conectar con la IA.") {
      return { proveedor: p, respuesta };
    }
  }

  // ----------------------------
  // 5) Último recurso
  // ----------------------------
  return {
    proveedor: "ninguno",
    respuesta: "No pude conectarme a ningún proveedor.",
  };
}

// ======================================================================
//  5) API FINAL PARA AURAChat
// ======================================================================

export async function AURA_MultiModel_Process(texto, historial, force = null) {
  return await procesarAURA_Inteligencia(texto, historial, force);
}

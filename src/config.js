// =======================================================
//   FAZO-CONFIG v4.5 — Configuración ULTIMATE de AURA
//   Multi-IA real • Backend dinámico • Versionamiento PRO
//   Arquitectura FAZO LOGÍSTICA — 2025
// =======================================================

// =======================================================
// 🔧 Utilidades PRO
// =======================================================

// Limpia strings y evita undefined
const clean = (v) => (typeof v === "string" ? v.trim() : "");

// Detecta entorno local / producción automáticamente
const getBackendURL = () => {
  const envURL = clean(process.env.REACT_APP_AURA_BACKEND_URL);
  if (envURL) return envURL;

  // Local por defecto (React / Expo Web)
  return "http://127.0.0.1:8000/aura";
};

// =======================================================
// 🧠 Modelos recomendados por proveedor (2025)
// =======================================================
const MODELOS = {
  // ANTHROPIC
  claude: "claude-3-7-sonnet",

  // OPENAI
  openai: "gpt-4.1",

  // GEMINI
  gemini: "gemini-1.5-flash",

  // LLAMA (Groq)
  llama: "llama-3.1-70b",

  // DEEPSEEK
  deepseek: "deepseek-chat",

  // COHERE
  cohere: "command-r",

  // GROQ (Mixtral / Llama)
  groq: "llama3-8b-8192",
};

// =======================================================
// 🌐 Endpoints oficiales de cada proveedor (2025)
// =======================================================
const URLS = {
  claude: "https://api.anthropic.com/v1/messages",

  openai: "https://api.openai.com/v1/chat/completions",

  gemini:
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",

  llama: "https://api.groq.com/openai/v1/chat/completions",

  deepseek: "https://api.deepseek.com/v1/chat/completions",

  cohere: "https://api.cohere.com/v1/chat",

  groq: "https://api.groq.com/openai/v1/chat/completions",
};

// =======================================================
// 🔐 Claves del frontend (NO obligatorias)
//   ⚠️ REACT_APP_* → No debes poner claves reales aquí
//   El backend es quien usa las claves verdaderas
// =======================================================
const KEYS = {
  claude: clean(process.env.REACT_APP_CLAUDE_KEY),
  openai: clean(process.env.REACT_APP_OPENAI_KEY),
  gemini: clean(process.env.REACT_APP_GEMINI_KEY),
  llama: clean(process.env.REACT_APP_LLAMA_KEY),
  deepseek: clean(process.env.REACT_APP_DEEPSEEK_KEY),
  cohere: clean(process.env.REACT_APP_COHERE_KEY),
  groq: clean(process.env.REACT_APP_GROQ_KEY),
};

// =======================================================
// 🤖 Motor IA primario de AURA (selección de proveedor)
// =======================================================
const AURA_PRIMARY =
  clean(process.env.REACT_APP_AURA_PRIMARY) ||
  "claude"; // Claude por defecto (mejor en español)

// =======================================================
// 🚀 Configuración global final — Exportación PRO
// =======================================================
const config = {
  AURA_PRIMARY,
  MODELOS,
  URLS,
  KEYS,

  // Backend dinámico
  AURA_BACKEND_URL: getBackendURL(),

  // Branding oficial FAZO
  BRAND: {
    sistema: "FAZO-LOGÍSTICA",
    modulo: "AURA",
    version: "4.5 ULTRA PRO",
    autor: "Gustavo Alejandro Oliva Miranda",
    pais: "Chile",
    ciudad: "Valparaíso",
  },

  // Información para depuración
  DEBUG: {
    entorno: process.env.NODE_ENV || "development",
    backend_url: getBackendURL(),
    ia_principal: AURA_PRIMARY,
  },
};

export default config;

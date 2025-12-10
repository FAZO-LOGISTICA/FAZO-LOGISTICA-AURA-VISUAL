// =======================================================
//   FAZO-CONFIG v6.0 — Arquitectura Definitiva AURA 2025
//   Multi-IA real | Backend Render | Netlify | Ultra PRO
//   Gustavo Oliva — FAZO LOGÍSTICA
// =======================================================

import React from "react"; // ← 🔥 IMPORTANTE: evita el error “React no definido”

// =======================================================
// 🔧 Utilidades robustas
// =======================================================

// Limpia valores para evitar null/undefined en React
const clean = (v) => (typeof v === "string" ? v.trim() : "");

// Detecta backend dinámico: producción (Netlify → Render) o local
const getBackendURL = () => {
  const envURL = clean(process.env.REACT_APP_AURA_BACKEND_URL);
  if (envURL) return envURL;

  // Modo local para desarrollo
  return "http://127.0.0.1:8000/api/aura";
};

// =======================================================
// 🧠 Modelos IA (2025) — compatibles con backend FAZO
// =======================================================
const MODELOS = {
  claude: "claude-3-7-sonnet",
  openai: "gpt-4.1",
  gemini: "gemini-1.5-flash",
  llama: "llama-3.1-70b",
  deepseek: "deepseek-chat",
  cohere: "command-r",
  groq: "llama3-8b-8192",
};

// =======================================================
// 🌐 Endpoints IA oficiales
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
// 🔐 Claves IA del frontend (opcionales — JAMÁS reales)
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
// 🤖 IA primaria según Netlify
// =======================================================
const AURA_PRIMARY =
  clean(process.env.REACT_APP_AURA_PRIMARY) || "claude";

// =======================================================
// 🎨 Branding FAZO oficial
// =======================================================
const BRAND = {
  sistema: "FAZO-LOGÍSTICA",
  modulo: "AURA",
  version: "6.0 ULTRA MASTER",
  autor: "Gustavo Alejandro Oliva Miranda",
  pais: "Chile",
  ciudad: "Valparaíso",
  licencia: "© 2025 — Uso Municipal / FAZO",
};

// =======================================================
// 🛠️ DEBUG automático — diagnóstico perfecto
// =======================================================
const DEBUG = {
  entorno: process.env.NODE_ENV || "development",
  react_version: React?.version || "N/A",
  backend_url: getBackendURL(),
  ia_principal: AURA_PRIMARY,
  fecha_config: new Date().toISOString(),
};

// =======================================================
// 🚀 Exportación final — El corazón del sistema AURA
// =======================================================
const config = {
  AURA_PRIMARY,
  MODELOS,
  URLS,
  KEYS,
  BRAND,
  DEBUG,

  // Backend Render real
  AURA_BACKEND_URL: getBackendURL(),
};

export default config;

// =======================================================
//   FAZO-CONFIG v6.1 — Arquitectura Definitiva AURA 2025
//   Multi-IA real | Backend Render | Netlify | Ultra PRO
//   Gustavo Oliva — FAZO LOGÍSTICA
// =======================================================

import React from "react"; // Evita error “React no definido”

// =======================================================
// 🔧 Utilidades robustas
// =======================================================

// Limpia valores para evitar null / undefined
const clean = (v) => (typeof v === "string" ? v.trim() : "");

// =======================================================
// 🌐 Backend dinámico (PRODUCCIÓN / LOCAL)
// =======================================================
// Prioridad:
// 1️⃣ Variable de entorno (Netlify / local)
// 2️⃣ Backend Render por defecto (producción real)

const getBackendURL = () => {
  const envURL = clean(process.env.REACT_APP_AURA_BACKEND_URL);
  if (envURL) return envURL;

  // ✅ Backend Render oficial (producción)
  return "https://aura-g5nw.onrender.com/aura";
};

// =======================================================
// 🧠 Modelos IA soportados (2025)
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
// 🌐 Endpoints oficiales IA (SOLO REFERENCIA)
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
// 🔐 Claves IA frontend (NUNCA reales en producción)
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
// 🤖 IA primaria por defecto
// =======================================================

const AURA_PRIMARY =
  clean(process.env.REACT_APP_AURA_PRIMARY) || "openai";

// =======================================================
// 🎨 Branding FAZO oficial
// =======================================================

const BRAND = {
  sistema: "FAZO-LOGÍSTICA",
  modulo: "AURA",
  version: "6.1 ULTRA MASTER",
  autor: "Gustavo Alejandro Oliva Miranda",
  pais: "Chile",
  ciudad: "Valparaíso",
  licencia: "© 2025 — Uso Municipal / FAZO",
};

// =======================================================
// 🛠️ DEBUG automático (clave para diagnóstico)
// =======================================================

const DEBUG = {
  entorno: process.env.NODE_ENV || "development",
  react_version: React?.version || "N/A",
  backend_url: getBackendURL(),
  ia_principal: AURA_PRIMARY,
  fecha_config: new Date().toISOString(),
};

// =======================================================
// 🚀 EXPORT FINAL — CORAZÓN DE AURA
// =======================================================

const config = {
  // Backend
  AURA_BACKEND_URL: getBackendURL(),

  // IA
  AURA_PRIMARY,
  MODELOS,
  URLS,
  KEYS,

  // Sistema
  BRAND,
  DEBUG,
};

export default config;

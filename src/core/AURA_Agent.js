// ======================================================================
//  AURA_Agent.js — Autonomía Inteligente PRO 2025
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Supervisión automática de sistemas
// ======================================================================

import { AURA_EventBridge } from "./AURA_EventBridge";

const WAIT = (ms) => new Promise((res) => setTimeout(res, ms));

let agentActivo = false;

// ======================================================================
//  CONFIGURACIONES DE MONITOREO
// ======================================================================
const CHECKS = {
  internet: true,
  iframeAguaRuta: true,
  backendAguaRuta: true,
  iaStatus: true,
};

const INTERVALOS = {
  internet: 5000,        // 5 segundos
  iframeAguaRuta: 8000,  // 8 segundos
  backendAguaRuta: 10000,// 10 segundos
  iaStatus: 15000,       // 15 segundos
};

// ======================================================================
//  FUNCIONES DE REVISIÓN
// ======================================================================

// 1) Internet
async function checkInternet() {
  const online = navigator.onLine;

  if (!online) {
    AURA_EventBridge.emit("AURA_ALERT", {
      tipo: "internet",
      mensaje: "⚠️ Sin conexión a internet.",
    });
  }

  return online;
}

// 2) AguaRuta iFrame
async function checkIframe() {
  const iframe = document.querySelector("iframe[title='AguaRuta']");

  if (!iframe) {
    AURA_EventBridge.emit("AURA_ALERT", {
      tipo: "iframe",
      mensaje: "⚠️ No se encontró el iframe de AguaRuta.",
    });
    return false;
  }

  // Si no carga en 5 segundos, error
  if (iframe.dataset.loaded !== "true") {
    AURA_EventBridge.emit("AURA_ALERT", {
      tipo: "iframe",
      mensaje: "⚠️ AguaRuta no está respondiendo.",
    });
  }

  return true;
}

// 3) Backend AguaRuta
async function checkBackend() {
  try {
    const res = await fetch("https://aguaruta-api.onrender.com/status");
    if (!res.ok) throw new Error();

    return true;
  } catch (err) {
    AURA_EventBridge.emit("AURA_ALERT", {
      tipo: "backend",
      mensaje: "🚨 El backend de AguaRuta está caído.",
    });
    return false;
  }
}

// 4) IA Providers (OpenAI / Claude / Gemini)
async function checkIA() {
  // Aqui simulamos un check sin API real
  AURA_EventBridge.emit("AURA_INFO", {
    tipo: "ia-check",
    mensaje: "⏳ Revisando estado de proveedores IA...",
  });

  return true;
}

// ======================================================================
//  LOOP PRINCIPAL — Corre para siempre
// ======================================================================
async function AGENT_LOOP() {
  if (agentActivo) return; // evitar duplicación
  agentActivo = true;

  AURA_EventBridge.emit("AURA_INFO", {
    mensaje: "🤖 AURA_Agent PRO iniciado correctamente.",
  });

  while (true) {
    if (CHECKS.internet) await checkInternet();
    await WAIT(100);

    if (CHECKS.iframeAguaRuta) await checkIframe();
    await WAIT(100);

    if (CHECKS.backendAguaRuta) await checkBackend();
    await WAIT(100);

    if (CHECKS.iaStatus) await checkIA();
    await WAIT(100);

    await WAIT(2000); // respiración
  }
}

// ======================================================================
//  API PÚBLICA
// ======================================================================
export const AURA_Agent = {
  start() {
    AGENT_LOOP();
  },
};

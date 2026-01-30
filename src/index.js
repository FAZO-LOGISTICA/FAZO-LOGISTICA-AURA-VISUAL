// =========================================================
//   INDEX.JS — FAZO OS 2025 (MODO ESTABLE AURA)
//   ✓ Arranque limpio
//   ✓ Sin cursor / audio experimental
//   ✓ Preparado para comandos AURA
// =========================================================

import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

// =========================================================
//   BANNER FAZO OS — Consola
// =========================================================
console.log(
  "%cFAZO OS 2025 — Sistema Operativo Municipal",
  "color:#38bdf8; font-size:20px; font-weight:700;"
);
console.log("%cAURA CORE INICIANDO…", "color:#a5f3fc;");

// =========================================================
//   OBTENER ROOT
// =========================================================
const rootElement = document.getElementById("root");

if (!rootElement) {
  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#0f172a;
      color:white;
      font-family:Inter,sans-serif;
      text-align:center;
    ">
      <div>
        <h1 style="font-size:26px; margin-bottom:12px;">❌ Error crítico</h1>
        <p>No se encontró <strong>#root</strong>.</p>
        <p>Revisa <code>public/index.html</code></p>
      </div>
    </div>
  `;
  throw new Error("Root element not found");
}

// =========================================================
//   CREAR ROOT (REACT 18)
// =========================================================
const root = createRoot(rootElement);

// =========================================================
//   RENDER PRINCIPAL
// =========================================================
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // Notificar que FAZO OS está listo
  window.dispatchEvent(new Event("FAZO_READY"));
} catch (err) {
  console.error("❌ Error al renderizar FAZO OS:", err);

  rootElement.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#0f172a;
      color:#ef4444;
      font-family:Inter,sans-serif;
      text-align:center;
    ">
      <div>
        <h1 style="font-size:26px;">⚠️ Error en el arranque</h1>
        <p>AURA no pudo inicializarse.</p>
        <p>Revisa la consola.</p>
      </div>
    </div>
  `;
}

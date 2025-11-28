// ===============================================
//  INDEX.JS PREMIUM — AURA VISUAL / FAZO 2025
// ===============================================

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// ------------------------------
//  LOG SISTEMA (útil para debug)
// ------------------------------
console.log(
  "%cAURA VISUAL — FAZO-LOGÍSTICA",
  "color:#60a5fa; font-size:18px; font-weight:700;"
);
console.log("%cInicializando...", "color:#cbd5e1;");

// ------------------------------
//  UBICAR EL ROOT
// ------------------------------
const container = document.getElementById("root");

// ⚠️ Fallback extremadamente robusto
if (!container) {
  document.body.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      height:100vh;
      background:#0f172a;
      color:white;
      font-family:Inter,sans-serif;
      text-align:center;">
      <div>
        <h1 style="font-size:28px; margin-bottom:16px;">❌ Error crítico</h1>
        <p>No se encontró el elemento <strong>#root</strong> en el HTML.</p>
        <p>Revisa el archivo <code>public/index.html</code></p>
      </div>
    </div>
  `;
  throw new Error("No se encontró #root en el DOM.");
}

// ------------------------------
//  CREAR ROOT (React 18)
// ------------------------------
let root;
try {
  root = createRoot(container);
} catch (err) {
  console.error("❌ Error al crear React Root:", err);
  alert("Error crítico al iniciar la interfaz de AURA.");
}

// ------------------------------
//  RENDER PRINCIPAL
// ------------------------------
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (err) {
  console.error("❌ Error al renderizar AURA:", err);

  // fallback visual si el render falla
  container.innerHTML = `
    <div style="
      display:flex;
      align-items:center;
      justify-content:center;
      height:100vh;
      background:#111827;
      color:#f87171;
      font-family:Inter,sans-serif;
      text-align:center;">
      <div>
        <h1 style="font-size:26px; margin-bottom:12px;">⚠️ Error en la interfaz</h1>
        <p>Algo impidió cargar AURA correctamente.</p>
        <p>Revisa la consola para más detalles.</p>
      </div>
    </div>
  `;
}

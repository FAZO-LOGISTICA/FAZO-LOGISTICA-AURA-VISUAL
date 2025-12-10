// =========================================================
//   INDEX.JS — FAZO OS 2025 (Versión ULTRA DEFINITIVA)
//   ✓ Cursor holográfico
//   ✓ Splash integrado
//   ✓ Manejo de errores en caliente
//   ✓ Sistema OS AURA listo nivel municipal
// =========================================================

import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import FAZOCursor from "./components/FAZOCursor";

// =========================================================
//   BANNER FAZO OS — Consola Profesional
// =========================================================
console.log(
  "%cFAZO OS 2025 — Sistema Operativo Municipal",
  "color:#38bdf8; font-size:20px; font-weight:700; text-shadow:0 0 6px #0ea5e9;"
);
console.log("%cCargando núcleo de AURA…", "color:#a5f3fc;");

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
    ">
      <div style="text-align:center;">
        <h1 style="font-size:28px; margin-bottom:12px;">❌ Error crítico</h1>
        <p>No se encontró el elemento <strong>#root</strong>.</p>
        <p>Revisa <code>public/index.html</code>.</p>
      </div>
    </div>
  `;
  throw new Error("Root element not found.");
}

// =========================================================
//   CREAR ROOT (REACT 18 API)
// =========================================================
let root;

try {
  root = createRoot(rootElement);
} catch (err) {
  console.error("❌ Fallo al crear el React Root:", err);
  alert("Error crítico al iniciar el sistema FAZO OS.");
}

// =========================================================
//   RENDER PRINCIPAL DEL SISTEMA
// =========================================================
try {
  root.render(
    <React.StrictMode>
      {/* Cursor OS */}
      <FAZOCursor />

      {/* Sistema Operativo completo */}
      <App />
    </React.StrictMode>
  );
} catch (err) {
  console.error("❌ Error al renderizar App:", err);

  // =========================================================
  //   FALLBACK VISUAL — si AURA falla, que la pantalla no muera
  // =========================================================
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
        <h1 style="font-size:26px; margin-bottom:10px;">⚠️ Error en el arranque</h1>
        <p>No fue posible cargar la interfaz de AURA.</p>
        <p>Revisa la consola para más detalles.</p>
      </div>
    </div>
  `;
}

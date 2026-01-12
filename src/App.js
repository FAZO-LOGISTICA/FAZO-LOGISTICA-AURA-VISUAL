// ===================================================
// App.js — FAZO OS / AURA FINAL SUPER PRO
// Autor: Gustavo Oliva — 2025
// Arquitectura: CORE ORQUESTADOR (NO CEREBRO)
// ===================================================

import React, { useCallback } from "react";

/* ================= COMPONENTES ================= */

import AURAChat from "./components/AURAChat";
import { procesarMensajeAURA } from "./components/AURA_NEXUS";

/* ================= MEMORIA ================= */

import {
  registrarAccion,
} from "./aura/AURAMemory";

/* ================= EVENTOS SISTEMA ================= */

import {
  enviarEventoDesdeAURA,
} from "./aura/FAZO_OS_EventBridge";

/* ===================================================
   APP PRINCIPAL
=================================================== */

function App() {

  /* ===============================================
     AURA → SISTEMA (PUNTO ÚNICO DE ENTRADA)
  =============================================== */
  const onAuraMessage = useCallback(async (texto) => {
    if (!texto || typeof texto !== "string") return;

    try {
      /* ---------- REGISTRO INPUT ---------- */
      registrarAccion("AURA_INPUT", texto);

      /* ---------- PROCESAR EN NEXUS ---------- */
      const resultado = await procesarMensajeAURA(texto);

      if (!resultado) return;

      /* ---------- REGISTRO OUTPUT ---------- */
      registrarAccion("AURA_OUTPUT", resultado.tipo || "RESPUESTA");

      /* ---------- EVENTOS UI / SISTEMA ---------- */
      if (resultado.evento) {
        enviarEventoDesdeAURA({
          tipo: resultado.evento.tipo || "accion",
          accion: resultado.evento.accion,
          payload: resultado.evento.payload || {},
        });
      }

    } catch (error) {
      /* ---------- ERROR SILENCIOSO ---------- */
      registrarAccion("AURA_ERROR", error?.message || "error desconocido");
    }
  }, []);

  /* ===============================================
     RENDER
  =============================================== */
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#020617",
      }}
    >
      <AURAChat
        onUserMessage={onAuraMessage}
      />
    </div>
  );
}

export default App;

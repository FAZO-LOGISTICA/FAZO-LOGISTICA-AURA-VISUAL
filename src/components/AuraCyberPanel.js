// ======================================================================
//  AuraCyberPanel.js — Panel holográfico central de AURA OS
//  Integrado 100% al NEXUS + EventBridge + MultiModel + AutoFix
// ======================================================================

import React, { useState } from "react";
import AuraChat from "./AuraChat";

import { AURA_NEXUS } from "../core/AURA_NEXUS";
import { enviarEventoDesdeAURA } from "../core/FAZO_OS_EventBridge";

export default function AuraCyberPanel({
  visible,
  onClose,
}) {
  const [messages, setMessages] = useState([]);

  if (!visible) return null;

  // ============================================================
  //  ENVÍO DE MENSAJE → NEXUS → SISTEMA
  // ============================================================
  const procesarMensaje = async (texto) => {
    const historial = messages.map((m) => ({
      role: m.from === "user" ? "user" : "assistant",
      content: m.text,
    }));

    // 1) Enviar a NEXUS
    const respuesta = await AURA_NEXUS(texto, historial, navigator.onLine);

    // 2) Si NEXUS detectó una acción → enviarla al sistema FAZO OS
    if (respuesta.tipo === "accion" ||
        respuesta.tipo === "modulo" ||
        respuesta.tipo === "subruta") {
      enviarEventoDesdeAURA(respuesta);
    }

    // 3) Mostrar la respuesta en pantalla
    agregarMensaje("aura", respuesta.respuesta);
  };

  const agregarMensaje = (from, text) =>
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), from, text },
    ]);

  // ============================================================
  // UI
  // ============================================================
  return (
    <div className="
      fixed inset-0 bg-black/70 backdrop-blur-xl
      flex items-center justify-center z-50
    ">
      <div className="
        w-[95%] md:w-[70%] lg:w-[55%]
        bg-black/60 border border-cyan-400/40
        rounded-2xl shadow-[0_0_25px_rgba(0,255,255,.25)]
        p-6 relative
      ">

        {/* BOTÓN CERRAR */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cyan-300 hover:text-white text-xl"
        >
          ✖
        </button>

        {/* TÍTULO */}
        <h2 className="text-center text-2xl font-bold text-cyan-300 mb-4">
          AURA — Panel Holográfico
        </h2>

        <AuraChat
          onMensaje={async (texto) => {
            agregarMensaje("user", texto);
            await procesarMensaje(texto);
          }}
        />
      </div>
    </div>
  );
}

// =======================================================
//   AuraRealistic.js — GOD MODE 2025
//   Avatar holográfico premium + parallax + energía dinámica
//   FAZO LOGÍSTICA — Gustavo Oliva
// =======================================================

import React from "react";
import { motion } from "framer-motion";

// Colores por emoción
const emotionGlow = {
  happy: "0_0_45px_#22c55e",
  angry: "0_0_45px_#ef4444",
  sad: "0_0_45px_#3b82f6",
  neutral: "0_0_45px_#8b5cf6",
};

export default function AuraRealistic({ emotion, talking, listening }) {
  return (
    <div className="relative flex flex-col items-center justify-center select-none">

      {/* =======================================================
            CAPA 1 — ENERGÍA CUÁNTICA CYAN (externo)
         ======================================================= */}
      <motion.div
        className="absolute w-[23rem] h-[23rem] rounded-full pointer-events-none"
        style={{
          boxShadow: `0 0 90px rgba(0,255,255,0.45)`,
        }}
        animate={{
          scale: listening ? [1, 1.25, 1] : [1, 1.1, 1],
          opacity: talking ? [0.5, 0.2, 0.5] : [0.35, 0.5, 0.35],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* =======================================================
            CAPA 2 — HUD STARK (scanlines holográficos)
         ======================================================= */}
      <div
        className="
          absolute w-64 h-64 rounded-full opacity-30
          bg-[linear-gradient(rgba(0,255,255,0.08)_2px,transparent_2px)]
          bg-[length:100%_4px]
          animate-scanlines
          pointer-events-none
        "
      />

      {/* =======================================================
            CAPA 3 — HALO EMOCIONAL
         ======================================================= */}
      <motion.div
        className="absolute w-[20rem] h-[20rem] rounded-full blur-xl opacity-70 pointer-events-none"
        style={{
          boxShadow: `0 0 60px rgba(0,255,255,0.4), 
                       0 0 80px rgba(0,255,255,0.2),
                       inset 0 0 60px rgba(0,255,255,0.3)`,
        }}
        animate={{
          scale: talking ? [1, 1.15, 1] : [1, 1.05, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* =======================================================
            CAPA 4 — NÚCLEO INTELIGENTE (pulsos)
         ======================================================= */}
      <motion.div
        className="absolute w-44 h-44 rounded-full opacity-50 pointer-events-none"
        style={{
          boxShadow: `0 0 45px rgba(0,255,255,0.9)`,
        }}
        animate={{
          scale: listening ? [1, 1.4, 1] : [1, 1.2, 1],
          opacity: listening ? [0.3, 0.85, 0.3] : [0.15, 0.45, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* =======================================================
            CAPA 5 — CONTENEDOR PRINCIPAL DEL ROSTRO
         ======================================================= */}
      <div
        className="
          w-64 h-64 rounded-full overflow-hidden
          border-[4px] border-cyan-300/40
          shadow-[0_0_40px_rgba(0,255,255,0.55)]
          bg-gradient-to-br from-blue-500/20 via-indigo-500/20 to-purple-600/30
          relative
        "
      >
        {/* Shine superior */}
        <div
          className="
            absolute inset-0 rounded-full
            bg-gradient-to-b from-cyan-300/20 to-transparent
            pointer-events-none
          "
        />

        {/* Scanlines interiores */}
        <div
          className="
            absolute inset-0 rounded-full opacity-40 pointer-events-none
            bg-[linear-gradient(transparent_85%,rgba(0,255,255,0.10)_86%)]
            bg-[length:100%_5px]
            animate-holoScan
          "
        />

        {/* =======================================================
              ROSTRO DE AURA — con movimiento PARALLAX
           ======================================================= */}
        <motion.img
          src="/aura/aura1.png"
          alt="AURA Avatar"
          className="w-full h-full object-cover opacity-95"
          animate={{
            scale: talking ? [1, 1.04, 1] : listening ? [1, 1.02, 1] : 1,
            rotate: listening ? [0, 0.6, -0.6, 0] : 0,
            filter:
              emotion === "happy"
                ? "brightness(1.12) saturate(1.15)"
                : emotion === "angry"
                ? "brightness(1.05) contrast(1.28) hue-rotate(-10deg)"
                : emotion === "sad"
                ? "brightness(0.85) saturate(0.9)"
                : "brightness(1)",
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>

      {/* =======================================================
            CAPA 6 — TEXTO DE ESTADO (mejorado)
         ======================================================= */}
      <motion.div
        className="
          absolute top-[270px]
          text-cyan-200 text-sm font-light
          drop-shadow-[0_0_12px_cyan]
          tracking-wide
        "
        animate={{
          opacity: talking || listening ? [1, 0.5, 1] : [0.9],
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        {talking
          ? "🎙️ Hablando…"
          : listening
          ? "🎧 Escuchando…"
          : emotion === "happy"
          ? "😄 Feliz"
          : emotion === "angry"
          ? "😡 Enojada"
          : emotion === "sad"
          ? "😢 Melancólica"
          : "💤 Reposo"}
      </motion.div>
    </div>
  );
}

// =======================================================
//   AuraRealistic.js — GOD MODE 2025 (EYE + MOUTH AI)
//   Avatar holográfico premium con parpadeo y boca animada
//   FAZO LOGÍSTICA — Gustavo Oliva
// =======================================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Glow por emoción
const emotionGlow = {
  happy: "0_0_45px_#22c55e",
  angry: "0_0_45px_#ef4444",
  sad: "0_0_45px_#3b82f6",
  neutral: "0_0_45px_#8b5cf6",
};

export default function AuraRealistic({
  emotion = "neutral",
  talking = false,
  listening = false,
  offline = false,
}) {
  // =======================================================
  //   PARPADEO AUTOMÁTICO (cada 3–6 segundos)
  // =======================================================
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 180); // Cierre breve
    }, Math.random() * 3000 + 3000); // 3 a 6 segundos aleatorio

    return () => clearInterval(interval);
  }, []);

  // =======================================================
  //   BOCA ANIMADA (abre/cierra al hablar)
  // =======================================================
  const mouthScale = talking ? [1, 1.25, 1.05, 1.3, 1] : [1];

  return (
    <div className="relative flex flex-col items-center justify-center select-none">

      {/* =======================================================
              CAPA 1 — ENERGÍA EXTERNA CYAN
      ======================================================= */}
      <motion.div
        className="absolute w-[23rem] h-[23rem] rounded-full pointer-events-none"
        style={{ boxShadow: `0 0 90px rgba(0,255,255,0.45)` }}
        animate={{
          scale: listening ? [1, 1.25, 1] : [1, 1.1, 1],
          opacity: talking ? [0.5, 0.2, 0.5] : [0.35, 0.5, 0.35],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* =======================================================
              CAPA 2 — SCANLINES HUD
      ======================================================= */}
      <div
        className="
          absolute w-64 h-64 rounded-full opacity-30 pointer-events-none
          bg-[linear-gradient(rgba(0,255,255,0.08)_2px,transparent_2px)]
          bg-[length:100%_4px]
          animate-scanlines
        "
      />

      {/* =======================================================
              CAPA 3 — HALO EMOCIONAL
      ======================================================= */}
      <motion.div
        className="absolute w-[20rem] h-[20rem] rounded-full blur-xl opacity-70 pointer-events-none"
        style={{
          boxShadow: `
            0 0 60px rgba(0,255,255,0.4),
            0 0 80px rgba(0,255,255,0.2),
            inset 0 0 60px rgba(0,255,255,0.3)
          `,
        }}
        animate={{ scale: talking ? [1, 1.15, 1] : [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* =======================================================
              CAPA 4 — NÚCLEO PULSANTE
      ======================================================= */}
      <motion.div
        className="absolute w-44 h-44 rounded-full opacity-50 pointer-events-none"
        style={{ boxShadow: `0 0 45px rgba(0,255,255,0.9)` }}
        animate={{
          scale: listening ? [1, 1.4, 1] : [1, 1.2, 1],
          opacity: listening ? [0.3, 0.85, 0.3] : [0.15, 0.45, 0.15],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* =======================================================
              CAPA 5 — ROSTRO CON BOCA + OJOS ANIMADOS
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

        {/* Scanlines internos */}
        <div
          className="
            absolute inset-0 rounded-full opacity-40 pointer-events-none
            bg-[linear-gradient(transparent_85%,rgba(0,255,255,0.10)_86%)]
            bg-[length:100%_5px]
            animate-holoScan
          "
        />

        {/* Imagen base */}
        <img
          src={
            offline
              ? "/aura/aura-offline.png" // Imagen especial para modo sin internet
              : "/aura/aura1.png"
          }
          className="w-full h-full object-cover opacity-95"
          alt="AURA Avatar"
        />

        {/* =======================================================
                OJOS ANIMADOS — PARPADEO
        ======================================================= */}
        <motion.div
          className="absolute top-[34%] left-[25%] w-[50%] h-[18%] rounded-full bg-black"
          animate={{
            scaleY: blink ? 0.05 : 1,
          }}
          transition={{ duration: 0.18 }}
          style={{
            opacity: 0.55,
            borderRadius: "999px",
            pointerEvents: "none",
          }}
        />

        {/* =======================================================
                BOCA ANIMADA SEGÚN VOZ — MOUTH AI
        ======================================================= */}
        <motion.div
          className="absolute bottom-[20%] left-[35%] w-[30%] h-[14%] bg-black/70 rounded-full"
          animate={{ scaleY: mouthScale }}
          transition={{ duration: talking ? 0.18 : 0.4, repeat: talking ? Infinity : 0 }}
          style={{
            pointerEvents: "none",
            borderRadius: "999px",
            filter: "blur(6px)",
            opacity: talking ? 0.8 : 0.4,
          }}
        />
      </div>

      {/* =======================================================
              ESTADO DE AURA
      ======================================================= */}
      <motion.div
        className="
          absolute top-[270px]
          text-cyan-200 text-sm font-light tracking-wide
          drop-shadow-[0_0_12px_cyan]
        "
        animate={{
          opacity: talking || listening ? [1, 0.6, 1] : [0.9],
        }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        {offline
          ? "🔌 Sin conexión…"
          : talking
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

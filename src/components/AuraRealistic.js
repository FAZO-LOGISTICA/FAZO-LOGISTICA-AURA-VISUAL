// =======================================================
//   AuraRealistic.js — ULTRA REALISTA GOD MODE 2025
//   Versión SIN OJOS — Avatar limpio y profesional
//   FAZO OS — Gustavo Oliva
// =======================================================

import React from "react";
import { motion } from "framer-motion";

export default function AuraRealistic({
  emotion = "neutral",
  talking = false,
  listening = false,
  offline = false,
  micVolume = 0,
}) {
  // =======================================================
  //   BOCA CON LIP-SYNC POR VOLUMEN
  // =======================================================
  const mouthScale = talking ? 1 + Math.min(micVolume * 4, 1.25) : 1;

  // =======================================================
  //   EMOCIONES (Color + brillo holográfico)
  // =======================================================
  const emotionGlow = {
    happy: "0 0 60px #22c55e",
    angry: "0 0 60px #ef4444",
    sad: "0 0 60px #3b82f6",
    neutral: "0 0 60px #a855f7",
    hablando: "0 0 65px #00eaff",
  };

  const emotionFilter = {
    happy: "brightness(1.18) saturate(1.2)",
    angry: "contrast(1.25) hue-rotate(-10deg)",
    sad: "brightness(0.85)",
    neutral: "brightness(1)",
    hablando: "brightness(1.15) saturate(1.25)",
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">

      {/* HOLOGRAMA ENERGÉTICO */}
      <motion.div
        className="absolute w-[22rem] h-[22rem] rounded-full pointer-events-none"
        style={{
          boxShadow: `0 0 80px rgba(0,255,255,0.35), ${emotionGlow[emotion]}`,
        }}
        animate={{
          scale: listening ? [1, 1.25, 1] : [1, 1.1, 1],
          opacity: talking ? [0.65, 0.3, 0.65] : [0.4, 0.55, 0.4],
        }}
        transition={{ duration: 2.6, repeat: Infinity }}
      />

      {/* CABEZA */}
      <div
        className="
          w-64 h-64 rounded-3xl overflow-hidden relative
          border-[4px] border-cyan-300/40
          shadow-[0_0_40px_rgba(0,255,255,0.45)]
          bg-gradient-to-br from-blue-500/10 via-indigo-700/20 to-purple-800/20
        "
      >
        {/* IMAGEN PRINCIPAL SIN OJOS EXTRA */}
        <motion.img
          src={offline ? "/aura/aura-offline.png" : "/aura/aura1.png"}
          alt="AURA"
          className="w-full h-full object-cover opacity-[0.97]"
          animate={{
            scale: listening ? [1, 1.03, 1] : [1, 1.01, 1],
            filter: emotionFilter[emotion],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* BOCA — LIP-SYNC */}
        <motion.div
          className="absolute bottom-[18%] left-[34%] w-[32%] h-[10%] bg-black/60 rounded-full"
          animate={{ scaleY: mouthScale }}
          transition={{
            duration: talking ? 0.12 : 0.4,
            repeat: talking ? Infinity : 0,
          }}
          style={{
            filter: "blur(6px)",
            opacity: talking ? 0.85 : 0.45,
          }}
        />
      </div>

      {/* TEXTO DE ESTADO */}
      <motion.div
        className="absolute top-[270px] text-cyan-200 text-sm font-light drop-shadow-[0_0_12px_cyan]"
        animate={{ opacity: talking || listening ? [1, 0.5, 1] : [1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        {offline
          ? "🔌 Sin conexión"
          : talking
          ? "🎙️ Hablando…"
          : listening
          ? "🎧 Escuchando…"
          : "💤 Reposo"}
      </motion.div>
    </div>
  );
}

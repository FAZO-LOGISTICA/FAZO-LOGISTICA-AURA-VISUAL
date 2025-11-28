import React from "react";
import { motion } from "framer-motion";

export default function AuraRealistic({ emotion, talking, listening }) {

  const emotionColors = {
    happy: "shadow-[0_0_60px_#22c55e]",
    angry: "shadow-[0_0_60px_#ef4444]",
    sad: "shadow-[0_0_60px_#3b82f6]",
    neutral: "shadow-[0_0_60px_#8b5cf6]",
  };

  return (
    <div className="relative flex flex-col items-center justify-center">

      {/* =======================================================
            EFECTO HUD STARK (SCANLINES + CYAN HOLOGRAMA)
         ======================================================= */}
      <div
        className="
          absolute inset-0 w-full h-full pointer-events-none
          bg-[linear-gradient(rgba(0,255,255,0.07)_1px,transparent_1px)]
          bg-[length:100%_3px]
          opacity-30
          animate-scanlines
          rounded-full
        "
      />

      {/* =======================================================
                HALO ENERGÉTICO ORIGINAL (NO SE TOCA)
               + MEJORA CYAN NEON STARK
         ======================================================= */}
      <motion.div
        className={`
          absolute rounded-full border-2
          border-cyan-300/40
          w-80 h-80 blur-xl opacity-60
          ${emotionColors[emotion]}
          shadow-[0_0_80px_rgba(0,255,255,0.5)]
        `}
        animate={{
          scale: listening ? [1, 1.25, 1] : [1, 1.1, 1],
          opacity: talking ? [0.6, 0.3, 0.6] : [0.45, 0.25, 0.45],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* =======================================================
                      CÍRCULO PRINCIPAL
         ======================================================= */}
      <div
        className="
          rounded-full overflow-hidden 
          border-4 border-cyan-400/40 
          shadow-[0_0_40px_rgba(0,255,255,0.45)]
          w-64 h-64 
          bg-gradient-to-tr 
          from-indigo-500/40
          via-blue-500/30
          to-purple-500/40
          relative
        "
      >
        {/* =======================================================
                    MEJORA: BRILLO CYAN SUPERIOR
           ======================================================= */}
        <div
          className="
            absolute inset-0 rounded-full pointer-events-none
            bg-gradient-to-b from-cyan-400/15 to-transparent
          "
        />

        {/* =======================================================
                        SCANLINE INTERIOR
           ======================================================= */}
        <div
          className="
            absolute inset-0 pointer-events-none 
            bg-[linear-gradient(transparent_90%,rgba(0,255,255,0.09)_91%)]
            bg-[length:100%_4px]
            opacity-50
            animate-holoScan
            rounded-full
          "
        />

        {/* =======================================================
                       ROSTRO ORIGINAL DE AURA
                 (NO SE MODIFICA NADA, SOLO MEJORAS)
           ======================================================= */}
        <motion.img
          src="/aura/aura1.png"
          alt="Aura"
          className="w-full h-full object-cover opacity-95"
          animate={{
            scale: talking ? [1, 1.03, 1] : listening ? [1, 1.015, 1] : 1,
            filter:
              emotion === "happy"
                ? "brightness(1.15) saturate(1.2)"
                : emotion === "angry"
                ? "contrast(1.25) hue-rotate(-10deg)"
                : emotion === "sad"
                ? "brightness(0.8) saturate(0.9)"
                : "brightness(1)",
          }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      </div>

      {/* =======================================================
                    TEXTO ESTADO ORIGINAL + GLOW
         ======================================================= */}
      <motion.div
        className="
          absolute top-[270px] 
          text-cyan-200 text-sm font-light drop-shadow-[0_0_10px_cyan]
        "
        animate={{ opacity: talking || listening ? [1, 0.5, 1] : [0.85] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {emotion === "happy"
          ? "😄 Feliz"
          : emotion === "angry"
          ? "😡 Enojada"
          : emotion === "sad"
          ? "😢 Melancólica"
          : listening
          ? "🎧 Escuchando..."
          : talking
          ? "🎙️ Hablando..."
          : "💤 Reposo"}
      </motion.div>
    </div>
  );
}

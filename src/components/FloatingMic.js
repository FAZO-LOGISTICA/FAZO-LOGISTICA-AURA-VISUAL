// =======================================================
//   FloatingMic.js — HOLOMIC PRO MAX 2025
//   FAZO LOGÍSTICA — Gustavo Oliva
//   Micrófono holográfico reactivo al estado de AURA
// =======================================================

import React from "react";
import { motion } from "framer-motion";

export default function FloatingMic({ isListening, disabled, onToggle }) {
  const baseGlow = isListening
    ? "shadow-[0_0_35px_#22d3ee,0_0_65px_#0ea5e9]"
    : "shadow-[0_0_18px_#0ea5e9]";

  const borderGlow = isListening
    ? "border-cyan-400/90"
    : "border-cyan-500/40";

  return (
    <motion.button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onToggle()}
      className={`
        relative w-14 h-14 rounded-full 
        bg-black/60 backdrop-blur-xl
        flex items-center justify-center
        border ${borderGlow}
        transition-all
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        ${baseGlow}
      `}
      whileHover={!disabled ? { scale: 1.12 } : {}}
      whileTap={!disabled ? { scale: 0.9 } : {}}
      animate={{
        scale: isListening ? [1, 1.18, 1] : [1, 1.06, 1],
      }}
      transition={{
        duration: isListening ? 1.2 : 2,
        repeat: Infinity,
      }}
    >
      {/* =======================================================
           PULSOS HOLOGRÁFICOS CUANDO ESCUCHA
         ======================================================= */}
      {isListening && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-300/40"
            animate={{
              scale: [1, 1.45],
              opacity: [0.5, 0],
            }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />

          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-300/20"
            animate={{
              scale: [1, 1.8],
              opacity: [0.35, 0],
            }}
            transition={{ duration: 1.8, repeat: Infinity }}
          />

          <motion.div
            className="absolute inset-0 rounded-full border border-cyan-300/10"
            animate={{
              scale: [1, 2.2],
              opacity: [0.2, 0],
            }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </>
      )}

      {/* =======================================================
           MIC SVG — ANIMADO PRO
         ======================================================= */}
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 h-7 w-7"
        viewBox="0 0 24 24"
        fill="none"
        stroke={isListening ? "#67e8f9" : "#bae6fd"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{
          scale: isListening ? [1, 1.22, 1] : [1, 1.04, 1],
          filter: isListening
            ? [
                "drop-shadow(0 0 8px #22d3ee)",
                "drop-shadow(0 0 16px #0891b2)",
                "drop-shadow(0 0 8px #22d3ee)",
              ]
            : "drop-shadow(0 0 4px #0ea5e9)",
        }}
        transition={{ duration: isListening ? 1.3 : 2, repeat: Infinity }}
      >
        {/* Cuerpo */}
        <rect x="9" y="4" width="6" height="10" rx="3" />
        {/* Curva inferior */}
        <path d="M5 11a7 7 0 0 0 14 0" />
        {/* Soporte */}
        <line x1="12" y1="18" x2="12" y2="22" />
        {/* Base */}
        <line x1="9" y1="22" x2="15" y2="22" />
      </motion.svg>

      {/* =======================================================
           HALO DE ENERGÍA IA — SIEMPRE ACTIVO
         ======================================================= */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{
          opacity: isListening ? [0.4, 0.8, 0.4] : [0.25, 0.4, 0.25],
          boxShadow: isListening
            ? [
                "0 0 22px #22d3ee",
                "0 0 36px #0ea5e9",
                "0 0 22px #22d3ee",
              ]
            : ["0 0 14px rgba(0,255,255,0.25)"],
        }}
        transition={{ duration: isListening ? 1.2 : 2.2, repeat: Infinity }}
      />
    </motion.button>
  );
}

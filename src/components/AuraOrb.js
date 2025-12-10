// ========================================================
//   AuraOrb.js — FAZO OS 2025
//   Orbe Holográfico Definitivo • Reactor IA
//   Mateo IA — versión ULTRA PRO MAX
// ========================================================

import React from "react";
import { motion } from "framer-motion";

export default function AuraOrb({ onClick }) {
  return (
    <motion.div
      onClick={onClick}
      drag
      dragMomentum={false}
      whileHover={{ scale: 1.18, rotate: 2 }}
      whileTap={{ scale: 0.88 }}
      className="
        fixed bottom-6 right-6 z-50
        w-20 h-20 rounded-full cursor-pointer select-none
        flex items-center justify-center
        backdrop-blur-xl
        bg-cyan-400/15
        border border-cyan-300/40
        shadow-[0_0_45px_rgba(0,255,255,0.45)]
        holo-glow
      "
      style={{
        boxShadow:
          "0 0 35px rgba(0,255,255,0.7), inset 0 0 25px rgba(0,255,255,0.5)",
      }}
    >
      {/* NÚCLEO ENERGÉTICO CENTRAL */}
      <motion.div
        className="
          w-10 h-10 rounded-full
          bg-cyan-200/80
          shadow-[0_0_30px_rgba(0,255,255,0.9)]
        "
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{ duration: 1.6, repeat: Infinity }}
      />

      {/* ANILLO HOLOGRÁFICO PRINCIPAL */}
      <motion.div
        className="
          absolute w-20 h-20 rounded-full
          border border-cyan-200/50
        "
        animate={{
          scale: [1, 1.4, 1],
          opacity: [0.25, 0.6, 0.25],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ANILLO SECUNDARIO (efecto reactor Stark) */}
      <motion.div
        className="
          absolute w-16 h-16 rounded-full
          border border-cyan-300/30
        "
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

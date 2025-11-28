// src/components/AuraOrb.js
import React from "react";
import { motion } from "framer-motion";

/**
 * Orbe holográfico FAZO — versión Stark
 * Flotante, animado, siempre visible.
 * Abre el panel flotante de AURA.
 */

export default function AuraOrb({ onClick }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      drag
      dragMomentum={false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      className="
        fixed z-50
        bottom-6 right-6
        w-20 h-20
        rounded-full cursor-pointer select-none
        flex items-center justify-center
        bg-cyan-500/20
        border border-cyan-300/50
        backdrop-blur-xl
        shadow-[0_0_30px_rgba(0,255,255,0.35)]
        holo-glow
      "
      style={{
        boxShadow:
          "0 0 25px rgba(0,255,255,0.6), inset 0 0 18px rgba(0,255,255,0.4)",
      }}
    >
      {/* NÚCLEO INTERNO */}
      <motion.div
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="
          w-10 h-10 rounded-full
          bg-cyan-300/60
          shadow-[0_0_25px_rgba(0,255,255,0.7)]
        "
      />

      {/* ONDA HOLOGRÁFICA */}
      <motion.div
        className="
          absolute w-20 h-20 rounded-full
          border border-cyan-200/30
        "
        animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.35, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
}

// ===============================================
// Inicio.js — FAZO OS 2025
// Pantalla de inicio holográfica previo al Login
// by Mateo IA + Gustavo Oliva
// ===============================================

import React from "react";
import { motion } from "framer-motion";

export default function Inicio({ onContinue }) {
  return (
    <div
      className="
        fixed inset-0 
        bg-black/90 backdrop-blur-2xl 
        flex flex-col items-center justify-center
        z-40 select-none
      "
    >
      {/* LOGO HOLOGRÁFICO */}
      <motion.img
        src="/fazo-logo.png"
        alt="FAZO OS"
        className="w-48 h-48 mb-8 glow-stark"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* TITULO PRINCIPAL */}
      <motion.h1
        className="text-4xl font-bold tracking-widest text-cyan-300 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        FAZO OS — SISTEMA MUNICIPAL
      </motion.h1>

      {/* SUBTITULO */}
      <motion.p
        className="text-cyan-200/70 mt-2 text-sm tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        Operaciones • AguaRuta • Traslado • AURA AGI
      </motion.p>

      {/* BARRA DE LUZ HOLOGRÁFICA */}
      <motion.div
        className="w-64 h-1 bg-cyan-400/40 mt-6 rounded-full overflow-hidden"
        initial={{ width: 0 }}
        animate={{ width: "16rem" }}
        transition={{ duration: 1.2 }}
      >
        <motion.div
          className="h-full w-20 bg-cyan-300"
          animate={{ x: ["0%", "200%"] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>

      {/* BOTÓN ENTRAR */}
      <motion.button
        onClick={onContinue}
        className="
          mt-10 px-8 py-3 rounded-xl
          bg-cyan-600/40 hover:bg-cyan-600/60
          border border-cyan-400/40
          text-cyan-200 font-bold tracking-wide
          shadow-[0_0_20px_rgba(0,255,255,0.3)]
          transition-all
        "
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
      >
        ENTRAR AL SISTEMA
      </motion.button>

      {/* PIE DE PAGINA */}
      <motion.p
        className="text-xs text-cyan-500/50 mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        © 2025 FAZO LOGÍSTICA — AURA AGI SYSTEM
      </motion.p>
    </div>
  );
}

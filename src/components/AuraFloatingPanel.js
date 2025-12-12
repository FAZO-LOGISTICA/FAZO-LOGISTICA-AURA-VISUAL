// ========================================================
//   AuraFloatingPanel.js — FAZO OS 2025 (VERSIÓN SUPREMA)
//   Ventana flotante tipo sistema operativo con niveles
//   de energía, resize real, drag, y HUD holográfico.
//   Integración total con AURAChat + FAZO Bridge.
// ========================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuraChat from "./AuraChat";
import { FiMinus, FiSquare, FiX, FiCpu, FiMaximize2 } from "react-icons/fi";

export default function AuraFloatingPanel({
  visible,
  onClose,
  onComando,
  onSendToIframe,
}) {
  // Tamaño dinámico: xs | md | xl
  const [size, setSize] = useState("md");

  const sizeClasses = {
    xs: "w-[280px] h-[260px]",
    md: "w-[480px] h-[430px]",
    xl: "w-[720px] h-[560px]",
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ======================================================
                 CAPA OSCURA DE FONDO (BLUR SUAVE)
            ====================================================== */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-[900]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* ======================================================
                 CAPA DE ENERGÍA HOLOGRÁFICA DETRÁS DEL PANEL
            ====================================================== */}
          <motion.div
            className="
              fixed z-[901]
              bottom-32 left-[22rem]
              w-[500px] h-[500px]
              rounded-full
              bg-cyan-500/10
              pointer-events-none
              blur-3xl
            "
            animate={{
              opacity: [0.1, 0.25, 0.1],
              scale: [1, 1.4, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* ======================================================
                         PANEL PRINCIPAL
            ====================================================== */}
          <motion.div
            key="aura-panel"
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            drag
            dragElastic={0.12}
            dragMomentum={false}
            className={`
              fixed z-[902]
              ${sizeClasses[size]}
              bottom-28 left-[22rem]
              rounded-2xl overflow-hidden
              bg-black/70 backdrop-blur-2xl
              border border-cyan-400/40
              shadow-[0_0_45px_rgba(0,255,255,0.45)]
              flex flex-col
            `}
          >
            {/* ======================================================
                       TOPBAR COMPLETA — OS MODE
              ====================================================== */}
            <div
              className="
                flex items-center justify-between
                px-4 py-2 bg-black/60
                border-b border-cyan-400/30
                cursor-move select-none
              "
            >
              {/* ICONO DE AURA */}
              <div className="flex items-center gap-2">
                <FiCpu className="text-cyan-300" size={16} />
                <span className="text-cyan-200 text-xs tracking-wide">
                  AURA — Panel Inteligente
                </span>
              </div>

              <div className="flex items-center gap-3">

                {/* Compactar */}
                <button
                  onClick={() => setSize("xs")}
                  className="text-cyan-400/70 hover:text-cyan-200"
                  title="Vista compacta"
                >
                  <FiMinus size={15} />
                </button>

                {/* Normal */}
                <button
                  onClick={() => setSize("md")}
                  className="text-cyan-400/70 hover:text-cyan-200"
                  title="Vista normal"
                >
                  <FiSquare size={14} />
                </button>

                {/* Expandida */}
                <button
                  onClick={() => setSize("xl")}
                  className="text-emerald-400/80 hover:text-emerald-200"
                  title="Vista ampliada"
                >
                  <FiMaximize2 size={16} />
                </button>

                {/* Cerrar */}
                <button
                  onClick={onClose}
                  className="text-red-400 hover:text-red-300 ml-1"
                  title="Ocultar AURA"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* ======================================================
                         CONTENIDO — AURA CHAT
              ====================================================== */}
            <div className="flex-1 overflow-hidden bg-black/20">
              <AuraChat
                onComando={onComando}
                onSendToIframe={onSendToIframe}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

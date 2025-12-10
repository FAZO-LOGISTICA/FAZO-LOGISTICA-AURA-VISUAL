// ========================================================
//   AuraFloatingPanel.js — FAZO OS 2025 (VERSIÓN SUPREMA)
//   Ventana flotante estilo sistema operativo + animaciones
//   Integrado 100% con AuraChat y FAZO Bridge
// ========================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuraChat from "./AuraChat";
import { FiMinus, FiSquare, FiX } from "react-icons/fi";

export default function AuraFloatingPanel({
  visible,
  onClose,
  onComando,
  onSendToIframe,
}) {
  // Tamaño dinámico: xs | md | xl
  const [size, setSize] = useState("md");

  const sizeClasses = {
    xs: "w-[260px] h-[260px]",
    md: "w-[440px] h-[400px]",
    xl: "w-[620px] h-[520px]",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="aura-panel"
          initial={{ opacity: 0, scale: 0.85, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 40 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          drag
          dragElastic={0.15}
          dragMomentum={false}
          className={`
            fixed z-50 ${sizeClasses[size]}
            bottom-28 left-[22rem]
            rounded-2xl overflow-hidden
            bg-black/80 backdrop-blur-2xl
            border border-cyan-400/40
            shadow-[0_0_35px_rgba(0,255,255,0.4)]
            flex flex-col
          `}
        >
          {/* ==================================================
                     TOPBAR — ESTILO VENTANA MAC/WIN
             ================================================== */}
          <div
            className="
              flex items-center justify-between
              px-4 py-2 bg-black/60
              border-b border-cyan-400/30
              cursor-move select-none
            "
          >
            <span className="text-cyan-200 text-xs tracking-wide">
              AURA — Panel Inteligente
            </span>

            <div className="flex items-center gap-2">
              {/* Reducir */}
              <button
                onClick={() => setSize("xs")}
                className="text-cyan-400/70 hover:text-cyan-200"
                title="Tamaño compacto"
              >
                <FiMinus size={14} />
              </button>

              {/* Normal */}
              <button
                onClick={() => setSize("md")}
                className="text-cyan-400/70 hover:text-cyan-200"
                title="Tamaño normal"
              >
                <FiSquare size={14} />
              </button>

              {/* Expandir */}
              <button
                onClick={() => setSize("xl")}
                className="text-emerald-400/80 hover:text-emerald-200"
                title="Tamaño grande"
              >
                ⬜
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

          {/* ==================================================
                        CONTENIDO (AURA CHAT)
             ================================================== */}
          <div className="flex-1 overflow-hidden">
            <AuraChat onComando={onComando} onSendToIframe={onSendToIframe} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

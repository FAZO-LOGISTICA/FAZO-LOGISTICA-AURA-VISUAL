// ======================================================================
//  AuraCyberPanel.js — CURVED CYBERPUNK PANEL 2025 (VERSIÓN SUPREMA)
//  FAZO LOGÍSTICA + Mateo IA
//  Panel holográfico futurista estilo consola de mando.
//  Integración total con AURAChat + FAZO OS + AURA Agent
// ======================================================================

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuraChat from "./AuraChat";
import {
  FiX,
  FiMinimize2,
  FiMaximize2,
  FiCpu,
  FiRadio,
  FiAperture,
} from "react-icons/fi";

export default function AuraCyberPanel({
  visible,
  onClose,
  onComando,
  onSendToIframe,
}) {
  const [size, setSize] = useState("md");

  const sizeMap = {
    xs: "w-[360px] h-[300px]",
    md: "w-[520px] h-[480px]",
    xl: "w-[860px] h-[600px]",
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* ======================================================
              DIM LAYER + BLUR
          ====================================================== */}
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/50 backdrop-blur-[6px] z-[900]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* ======================================================
              BACK ENERGY ARC — CYBERPUNK BLUE
          ====================================================== */}
          <motion.div
            className="
              fixed bottom-40 left-[20rem]
              w-[650px] h-[650px]
              bg-cyan-500/10
              rounded-full blur-3xl pointer-events-none z-[901]
            "
            animate={{
              opacity: [0.1, 0.25, 0.12],
              scale: [1, 1.25, 1],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* ======================================================
              PANEL PRINCIPAL — CURVED CYBERPUNK SHELL
          ====================================================== */}
          <motion.div
            key="panel"
            drag
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            transition={{ duration: 0.25 }}
            className={`
              fixed bottom-28 left-[22rem] z-[902]
              ${sizeMap[size]}
              rounded-3xl overflow-hidden
              bg-gradient-to-br from-black/70 via-slate-900/80 to-black/70
              border border-cyan-400/30
              shadow-[0_0_35px_rgba(0,255,255,0.35)]
              backdrop-blur-2xl
              flex flex-col
            `}
          >
            {/* ======================================================
                TOPBAR — Cyberpunk
            ====================================================== */}
            <div
              className="
                flex justify-between items-center px-4 py-2
                bg-black/50 border-b border-cyan-400/20
                text-cyan-300 tracking-wide text-xs font-medium
                select-none cursor-move
              "
            >
              {/* TÍTULO + ICONO */}
              <div className="flex items-center gap-2">
                <FiCpu className="text-cyan-300" size={16} />
                <span>AURA — CyberShell Console</span>
              </div>

              {/* BOTONES */}
              <div className="flex items-center gap-3">
                {/* XS */}
                <button
                  onClick={() => setSize("xs")}
                  className="hover:text-cyan-200 text-cyan-400/70"
                >
                  <FiMinimize2 size={15} />
                </button>

                {/* XL */}
                <button
                  onClick={() => setSize("xl")}
                  className="hover:text-emerald-200 text-emerald-400/80"
                >
                  <FiMaximize2 size={15} />
                </button>

                {/* CERRAR */}
                <button
                  onClick={onClose}
                  className="hover:text-red-300 text-red-400"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* ======================================================
                HUD SUPERIOR — Indicadores IA
            ====================================================== */}
            <div
              className="
                flex items-center gap-6 px-4 py-2
                bg-black/40 border-b border-cyan-400/10
              "
            >
              {/* ENERGY CORE */}
              <motion.div
                className="flex items-center gap-1"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FiRadio className="text-cyan-300" />
                <span className="text-cyan-200/80 text-xs">Energía IA</span>
              </motion.div>

              {/* THINKING STATUS */}
              <motion.div
                className="flex items-center gap-1"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <FiAperture className="text-cyan-300" />
                <span className="text-cyan-200/80 text-xs">Monitorización</span>
              </motion.div>
            </div>

            {/* ======================================================
                CONTENIDO PRINCIPAL — AURA CHAT
            ====================================================== */}
            <div className="flex-1 overflow-hidden bg-black/30">
              <AuraChat onComando={onComando} onSendToIframe={onSendToIframe} />
            </div>

            {/* ======================================================
                FOOTER — Data scan line
            ====================================================== */}
            <motion.div
              className="
                h-1 bg-cyan-400/30
              "
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

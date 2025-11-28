// src/components/AuraFloatingPanel.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import AuraChat from "./AuraChat";

export default function AuraFloatingPanel({
  visible,
  onClose,
  onComando,
  onSendToIframe,
}) {
  const [size, setSize] = useState("medium"); // small | medium | large

  if (!visible) return null;

  const sizeClasses = {
    small: "w-[260px] h-[260px]",
    medium: "w-[420px] h-[360px]",
    large: "w-[520px] h-[440px]",
  };

  return (
    <motion.div
      className={`
        fixed z-40
        ${sizeClasses[size]}
        bottom-24 left-[21rem]
        flex flex-col
        rounded-2xl
        bg-black/80 backdrop-blur-xl
        border border-cyan-400/50
        shadow-[0_0_30px_rgba(0,255,255,0.5)]
      `}
      drag
      dragMomentum={false}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
    >
      {/* BARRA SUPERIOR: mover / tamaño / cerrar */}
      <div
        className="
          flex items-center justify-between
          px-3 py-1
          text-xs text-cyan-200
          bg-black/70
          border-b border-cyan-400/40
          rounded-t-2xl
          cursor-move
        "
      >
        <span>AURA — Panel flotante</span>

        <div className="flex items-center gap-1">
          {/* Botones de tamaño */}
          <button
            type="button"
            onClick={() => setSize("small")}
            className="w-4 h-4 rounded-full bg-cyan-500/30 hover:bg-cyan-400/60"
            title="Compacta"
          />
          <button
            type="button"
            onClick={() => setSize("medium")}
            className="w-4 h-4 rounded-full bg-cyan-300/40 hover:bg-cyan-200/80"
            title="Normal"
          />
          <button
            type="button"
            onClick={() => setSize("large")}
            className="w-4 h-4 rounded-full bg-emerald-400/50 hover:bg-emerald-300"
            title="Grande"
          />

          {/* Cerrar (minimizar) */}
          <button
            type="button"
            onClick={onClose}
            className="ml-2 text-red-400 hover:text-red-300"
            title="Ocultar AURA"
          >
            ✕
          </button>
        </div>
      </div>

      {/* CONTENIDO AURA */}
      <div className="flex-1 overflow-hidden">
        <AuraChat onComando={onComando} onSendToIframe={onSendToIframe} />
      </div>
    </motion.div>
  );
}

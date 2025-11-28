// src/components/FloatingMic.js
import React from "react";

/**
 * Botón de micrófono estilo HUD FAZO PRO
 * Negro + Cyan neon, con pulso cuando está escuchando.
 *
 * Props:
 * - isListening: bool → indica si el micrófono está activo
 * - disabled: bool → deshabilita el botón
 * - onToggle: function → se llama al hacer click
 */
export default function FloatingMic({ isListening, disabled, onToggle }) {
  const baseBtn =
    "relative flex items-center justify-center w-11 h-11 rounded-full border transition focus:outline-none";

  const activeStyles = isListening
    ? "border-cyan-400 bg-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.8)]"
    : "border-cyan-500/40 bg-black/60 shadow-[0_0_14px_rgba(0,255,255,0.35)]";

  const disabledStyles = disabled
    ? "opacity-40 cursor-not-allowed"
    : "cursor-pointer hover:border-cyan-200 hover:shadow-[0_0_20px_rgba(0,255,255,0.9)]";

  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled && typeof onToggle === "function") {
          onToggle();
        }
      }}
      className={`${baseBtn} ${activeStyles} ${disabledStyles}`}
      title={
        disabled
          ? "Micrófono no disponible"
          : isListening
          ? "AURA está escuchando… haz clic para detener"
          : "Activar micrófono para hablar con AURA"
      }
    >
      {/* Anillo de pulso cuando está escuchando */}
      {isListening && (
        <span className="absolute inline-flex h-full w-full rounded-full border border-cyan-300/60 animate-ping" />
      )}

      {/* Ícono de micrófono (simple, sin librerías extra) */}
      <span className="relative text-cyan-200">
        {/* “Mic” dibujado con SVG para no depender de más paquetes */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Cuerpo del micrófono */}
          <rect x="9" y="4" width="6" height="10" rx="3" />
          {/* Curva inferior */}
          <path d="M5 11a7 7 0 0 0 14 0" />
          {/* Línea soporte */}
          <line x1="12" y1="18" x2="12" y2="22" />
          {/* Base */}
          <line x1="9" y1="22" x2="15" y2="22" />
        </svg>
      </span>
    </button>
  );
}

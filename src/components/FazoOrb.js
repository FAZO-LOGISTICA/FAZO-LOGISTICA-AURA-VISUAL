// src/components/FazoOrb.js
import React from "react";

export default function FazoOrb({ onClick, abierto }) {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-6 right-6
        w-20 h-20 rounded-full
        flex items-center justify-center
        transition-all duration-300
        ${abierto ? "bg-cyan-500/60" : "bg-cyan-400/30"}
        shadow-[0_0_40px_rgba(0,255,255,0.5)]
        backdrop-blur-md
        border border-cyan-300/40
        hover:scale-110
        holo-glow
      `}
    >
      <span className="text-white text-xl font-bold">
        {abierto ? "✖" : "A"}
      </span>
    </button>
  );
}

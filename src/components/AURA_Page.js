// ======================================================================
//  AURA_Page.js — Vista Principal de AURA (FAZO OS 2025)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Holographic Interface + AURA Chat + Sistema OS
// ======================================================================

import React from "react";
import AURAChat from "./AURAChat";
import SidebarFazo from "./SidebarFazo";

export default function AURA_Page({ onNavigate, active }) {
  return (
    <div
      className="
        flex min-h-screen w-full 
        bg-gradient-to-br from-black via-[#03121d] to-[#082f3a]
        text-cyan-100 relative
      "
    >

      {/* ========================= SIDEBAR ========================= */}
      <SidebarFazo active={active} onNavigate={onNavigate} />

      {/* ========================= CONTENT ========================== */}
      <main
        className="
          flex-1 ml-64 p-6
          overflow-y-auto
          relative
        "
      >
        {/* LOGO CENTRAL */}
        <div className="flex items-center gap-3 mb-6">
          <img
            src="/fazo-logo.png"
            alt="FAZO Logo"
            className="w-12 h-12 opacity-80 drop-shadow-[0_0_12px_cyan]"
          />
          <h1 className="text-2xl font-bold tracking-wide text-cyan-300">
            AURA — Sistema Inteligente FAZO OS
          </h1>
        </div>

        {/* CONTENEDOR DEL CHAT */}
        <div
          className="
            bg-black/40 border border-cyan-400/30
            rounded-2xl backdrop-blur-xl
            p-6 shadow-[0_0_35px_rgba(0,255,255,0.15)]
          "
        >
          <AURAChat />
        </div>
      </main>
    </div>
  );
}

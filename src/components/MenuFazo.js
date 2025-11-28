// src/components/MenuFazo.js
import React from "react";
import {
  FiDroplet,
  FiTruck,
  FiActivity,
  FiSettings,
  FiCpu,
  FiHome
} from "react-icons/fi";

// ========================================
//   HUD STARK — NEGRO + CYAN NEON
//   Menú lateral FAZO-Logística
// ========================================
export default function MenuFazo({ setVista }) {
  const btn =
    "flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition " +
    "bg-black/20 border border-cyan-500/20 shadow-[0_0_12px_rgba(0,255,255,0.15)] " +
    "hover:bg-cyan-500/20 hover:border-cyan-400/60 hover:shadow-[0_0_18px_rgba(0,255,255,0.35)]";

  const icon = "text-cyan-300 text-xl";

  const label = "text-cyan-100 font-medium tracking-wide";

  return (
    <aside
      className="
        w-64 min-h-screen p-6
        bg-black/50
        border-r border-cyan-400/20
        backdrop-blur-xl
        shadow-[0_0_25px_rgba(0,255,255,0.25)]
        flex flex-col gap-4
      "
    >
      {/* LOGO / TITULO */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cyan-300 tracking-wider drop-shadow-lg select-none">
          FAZO LOGÍSTICA
        </h1>
        <p className="text-cyan-200/70 text-sm mt-1 select-none">
          Sistema Central Municipal
        </p>
      </div>

      {/* BOTONES */}
      <div className="flex flex-col gap-3 select-none">

        {/* INICIO / PANEL CENTRAL */}
        <div className={btn} onClick={() => setVista("aura")}>
          <FiHome className={icon} />
          <span className={label}>Inicio / AURA</span>
        </div>

        {/* AGUARUTA */}
        <div className={btn} onClick={() => setVista("aguaruta")}>
          <FiDroplet className={icon} />
          <span className={label}>AguaRuta</span>
        </div>

        {/* TRASLADO MUNICIPAL */}
        <div className={btn} onClick={() => setVista("traslado")}>
          <FiTruck className={icon} />
          <span className={label}>Traslado Municipal</span>
        </div>

        {/* FLOTA MUNICIPAL */}
        <div className={btn} onClick={() => setVista("flota")}>
          <FiActivity className={icon} />
          <span className={label}>Flota Municipal</span>
        </div>

        {/* REPORTES */}
        <div className={btn} onClick={() => setVista("reportes")}>
          <FiCpu className={icon} />
          <span className={label}>Reportes</span>
        </div>

        {/* AJUSTES */}
        <div className={btn} onClick={() => setVista("ajustes")}>
          <FiSettings className={icon} />
          <span className={label}>Ajustes</span>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-auto pt-6 border-t border-cyan-500/20">
        <p className="text-cyan-300/50 text-xs text-center select-none">
          FAZO-IA HUD © {new Date().getFullYear()}
        </p>
      </div>
    </aside>
  );
}

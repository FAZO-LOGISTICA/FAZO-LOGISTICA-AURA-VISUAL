// ===============================================
// SidebarFazo.js — FAZO LOGÍSTICA 2025
// Navegación profesional estilo municipal
// Integrado con AURAChat (onComando)
// ===============================================

import React from "react";
import { FiHome, FiMap, FiLayers, FiBarChart2, FiTruck, FiSettings, FiMic, FiUserCheck } from "react-icons/fi";

export default function SidebarFazo({ active, onNavigate }) {
  const menu = [
    { name: "Inicio", slug: "inicio", icon: <FiHome /> },
    { name: "AURA", slug: "aura", icon: <FiMic /> },
    { name: "Rutas Activas", slug: "rutas-activas", icon: <FiLayers /> },
    { name: "Mapa", slug: "mapa", icon: <FiMap /> },
    { name: "Gráficos", slug: "graficos", icon: <FiBarChart2 /> },
    { name: "Comparación Semanal", slug: "comparacion-semanal", icon: <FiBarChart2 /> },
    { name: "Registrar Entrega", slug: "registrar-entrega", icon: <FiUserCheck /> },
    { name: "No Entregadas", slug: "no-entregadas", icon: <FiTruck /> },
    { name: "Camión Estadísticas", slug: "camion-estadisticas", icon: <FiTruck /> },
    { name: "Nueva Distribución", slug: "nueva-distribucion", icon: <FiSettings /> },
    { name: "Editar Redistribución", slug: "editar-redistribucion", icon: <FiSettings /> },
    { name: "Migrantes QR", slug: "qr", icon: <FiUserCheck /> },
    { name: "Traslado Municipal", slug: "traslado", icon: <FiTruck /> },
    { name: "Flota Municipal", slug: "flota", icon: <FiTruck /> },
  ];

  return (
    <aside
      className="
        w-64 
        bg-black/40 
        backdrop-blur-xl 
        text-cyan-200 
        border-r 
        border-cyan-500/20 
        shadow-[5px_0_20px_rgba(0,255,255,0.08)]
        h-screen 
        flex flex-col 
        fixed
      "
    >
      <div className="p-6 text-xl font-bold text-cyan-300 tracking-wide">
        FAZO LOGÍSTICA
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3">
        {menu.map((item) => (
          <button
            key={item.slug}
            onClick={() => onNavigate(item.slug)}
            className={`
              flex items-center gap-3 px-4 py-2 rounded-lg transition-all
              ${active === item.slug
                ? "bg-cyan-500/30 border border-cyan-400 text-white shadow-lg"
                : "hover:bg-cyan-500/10"}
            `}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm">{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 text-xs text-cyan-300/60 text-center">
        © 2025 FAZO — Sistema Municipal Avanzado
      </div>
    </aside>
  );
}

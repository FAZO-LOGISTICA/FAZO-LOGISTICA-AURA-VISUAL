// ===========================================================
// SidebarFazo.js — FAZO OS 2025
// Navegación holográfica estilo Sistema Operativo Municipal
// Integración total con AURA, módulos y submódulos
// By FAZO Logística + Mateo IA
// ===========================================================

import React from "react";
import {
  FiHome,
  FiCpu,
  FiMic,
  FiLayers,
  FiMap,
  FiUserCheck,
  FiBarChart2,
  FiSettings,
  FiTruck,
  FiUsers,
} from "react-icons/fi";

export default function SidebarFazo({ active, onNavigate }) {
  
  const menu = [
    // --------------------------
    // SISTEMA PRINCIPAL FAZO OS
    // --------------------------
    {
      title: "FAZO OS",
      items: [
        { name: "Inicio", slug: "inicio", icon: <FiHome /> },
        { name: "AURA", slug: "aura", icon: <FiMic /> },
      ],
    },

    // --------------------------
    // MÓDULO AGUARUTA
    // --------------------------
    {
      title: "AguaRuta",
      items: [
        { name: "Rutas Activas", slug: "rutas-activas", icon: <FiLayers /> },
        { name: "Mapa", slug: "mapa", icon: <FiMap /> },
        { name: "Gráficos", slug: "graficos", icon: <FiBarChart2 /> },
        { name: "Comparación Semanal", slug: "comparacion-semanal", icon: <FiBarChart2 /> },
        { name: "Registrar Entrega", slug: "registrar-entrega", icon: <FiUserCheck /> },
        { name: "No Entregadas", slug: "no-entregadas", icon: <FiTruck /> },
        { name: "Camión Estadísticas", slug: "camion-estadisticas", icon: <FiTruck /> },
        { name: "Nueva Distribución", slug: "nueva-distribucion", icon: <FiSettings /> },
        { name: "Editar Redistribución", slug: "editar-redistribucion", icon: <FiSettings /> },
      ],
    },

    // --------------------------
    // OTROS MÓDULOS
    // --------------------------
    {
      title: "Módulos Adicionales",
      items: [
        { name: "Migrantes QR", slug: "qr", icon: <FiUsers /> },
        { name: "Traslado Municipal", slug: "traslado", icon: <FiTruck /> },
        { name: "Flota Municipal", slug: "flota", icon: <FiTruck /> },
      ],
    },
  ];

  return (
    <aside
      className="
        w-64 fixed left-0 top-0 bottom-0
        bg-black/40 backdrop-blur-xl
        text-cyan-200
        border-r border-cyan-500/20
        shadow-[5px_0_25px_rgba(0,255,255,0.15)]
        flex flex-col
      "
    >
      {/* LOGO */}
      <div
        className="
          p-6 text-xl font-bold text-cyan-300 tracking-wider
          drop-shadow-[0_0_8px_rgba(0,255,255,0.7)]
        "
      >
        FAZO OS
      </div>

      {/* MENU */}
      <nav className="flex-1 overflow-y-auto px-3 pr-4">
        {menu.map((section) => (
          <div key={section.title} className="mb-6">

            {/* TITULO DE SECCIÓN */}
            <div className="text-xs uppercase text-cyan-400/70 mb-2 pl-2 tracking-wider">
              {section.title}
            </div>

            {/* ITEMS */}
            {section.items.map((item) => (
              <button
                key={item.slug}
                onClick={() => onNavigate(item.slug)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2 mb-1
                  rounded-lg transition-all duration-150
                  group relative
                  ${
                    active === item.slug
                      ? "bg-cyan-500/30 border border-cyan-400/50 text-white shadow-lg shadow-cyan-500/20"
                      : "hover:bg-cyan-500/10 hover:shadow-md hover:shadow-cyan-500/10"
                  }
                `}
              >
                {/* ICONO */}
                <span
                  className="
                    text-lg transition-transform duration-200 
                    group-hover:scale-110
                  "
                >
                  {item.icon}
                </span>

                {/* TEXTO */}
                <span className="text-sm tracking-wide">{item.name}</span>
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-4 text-xs text-cyan-300/60 text-center border-t border-cyan-500/10">
        © 2025 FAZO — Sistema Municipal Avanzado
      </div>
    </aside>
  );
}

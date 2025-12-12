// ===========================================================
// SidebarFazo.js — FAZO OS HOLOGRAPHIC 2025 (VERSIÓN SUPREMA)
// Navegación holográfica con energía IA, radar activo y luz
// dinámica por módulo. 100% integrado con AURA y FAZO OS.
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
  FiActivity,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function SidebarFazo({ active, onNavigate }) {
  // ===========================================================
  // Estructura del menú
  // ===========================================================
  const menu = [
    {
      title: "FAZO OS",
      items: [
        { name: "Inicio", slug: "inicio", icon: <FiHome /> },
        { name: "AURA", slug: "aura", icon: <FiMic /> },
      ],
    },
    {
      title: "AguaRuta",
      items: [
        { name: "Rutas Activas", slug: "rutas-activas", icon: <FiLayers /> },
        { name: "Mapa", slug: "mapa", icon: <FiMap /> },
        { name: "Gráficos", slug: "graficos", icon: <FiBarChart2 /> },
        { name: "Comparación Semanal", slug: "comparacion-semanal", icon: <FiBarChart2 /> },
        { name: "Registrar Entrega", slug: "registrar-entrega", icon: <FiUserCheck /> },
        { name: "No Entregadas", slug: "no-entregadas", icon: <FiTruck /> },
        { name: "Camión Estadísticas", slug: "camion-estadisticas", icon: <FiActivity /> },
        { name: "Nueva Distribución", slug: "nueva-distribucion", icon: <FiSettings /> },
        { name: "Editar Redistribución", slug: "editar-redistribucion", icon: <FiSettings /> },
      ],
    },
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
        w-64 fixed left-0 top-0 bottom-0 z-40
        bg-black/45 backdrop-blur-2xl
        border-r border-cyan-400/20
        shadow-[12px_0_45px_rgba(0,255,255,0.15)]
        flex flex-col
        overflow-hidden
      "
    >
      {/* ===========================================================
          LOGO FAZO OS CON EFECTO HOLOGRÁFICO
      =========================================================== */}
      <motion.div
        className="
          p-6 text-2xl font-extrabold tracking-widest text-cyan-300 
          drop-shadow-[0_0_12px_cyan]
          flex items-center gap-3
        "
        animate={{
          opacity: [0.8, 1, 0.8],
          scale: [1, 1.03, 1],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <FiCpu className="text-cyan-300" size={26} />
        FAZO OS
      </motion.div>

      {/* ===========================================================
          MENÚ PRINCIPAL
      =========================================================== */}
      <nav className="flex-1 overflow-y-auto px-3 pr-4">
        {menu.map((section) => (
          <div key={section.title} className="mb-7">

            {/* TÍTULO DE SECCIÓN */}
            <div className="text-xs uppercase text-cyan-400/60 pl-2 tracking-wider mb-3">
              {section.title}
            </div>

            {/* ITEMS */}
            {section.items.map((item) => {
              const isActive = active === item.slug;

              return (
                <motion.button
                  key={item.slug}
                  onClick={() => onNavigate(item.slug)}
                  className={`
                    relative w-full flex items-center gap-3 px-4 py-2 mb-2
                    rounded-lg transition-all duration-150
                    ${
                      isActive
                        ? "bg-cyan-500/25 border border-cyan-400/50 text-white shadow-lg shadow-cyan-500/20"
                        : "hover:bg-cyan-500/10 hover:text-white"
                    }
                  `}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {/* ICONO */}
                  <motion.span
                    className="text-lg"
                    animate={{
                      scale: isActive ? [1, 1.2, 1] : 1,
                      color: isActive ? "#67e8f9" : "#bae6fd",
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: isActive ? Infinity : 0,
                    }}
                  >
                    {item.icon}
                  </motion.span>

                  {/* TEXTO */}
                  <span className="text-sm tracking-wide">{item.name}</span>

                  {/* RADAR ACTIVO — EFECTO HOLOGRÁFICO */}
                  {isActive && (
                    <motion.div
                      className="
                        absolute right-2 top-1/2 -translate-y-1/2
                        w-2 h-2 rounded-full bg-cyan-300
                      "
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.8, 0.2, 0.8],
                        boxShadow: [
                          "0 0 6px #22d3ee",
                          "0 0 12px #22d3ee",
                          "0 0 6px #22d3ee",
                        ],
                      }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ===========================================================
          FOOTER
      =========================================================== */}
      <div
        className="
          p-4 text-xs text-cyan-300/60 text-center border-t border-cyan-500/10
        "
      >
        © 2025 FAZO — Sistema Municipal Avanzado
      </div>
    </aside>
  );
}

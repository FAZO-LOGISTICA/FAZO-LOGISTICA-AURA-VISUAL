// ======================================================================
//  AURA_DashboardNotificaciones.js — Panel de Alertas en Vivo 2025
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Integración con AURA_Agent y FAZO OS
// ======================================================================

import React, { useEffect, useState } from "react";
import { AURA_Agent } from "../core/AURA_Agent";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiCheckCircle, FiActivity } from "react-icons/fi";

export default function AURA_DashboardNotificaciones() {
  
  const [estado, setEstado] = useState({
    ultimaRevision: null,
    problemas: [],
    sugerencias: [],
  });

  useEffect(() => {
    // Cargar estado inicial del agente
    setEstado(AURA_Agent.obtenerEstado());

    // Actualizar cada vez que el agente procese algo nuevo
    const interval = setInterval(() => {
      setEstado(AURA_Agent.obtenerEstado());
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 text-cyan-200">
      <motion.h1
        className="text-2xl font-bold mb-4 text-cyan-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        🔔 Panel de Notificaciones — AURA IA
      </motion.h1>

      {/* Última revisión */}
      <div className="mb-5 text-sm text-cyan-400/80">
        Última revisión:{" "}
        <span className="text-cyan-200 font-semibold">
          {estado.ultimaRevision
            ? new Date(estado.ultimaRevision).toLocaleString()
            : "Aún no se ha realizado la primera revisión"}
        </span>
      </div>

      {/* PROBLEMAS DETECTADOS */}
      <motion.div
        className="bg-black/40 p-4 rounded-xl border border-cyan-500/30 shadow-lg mb-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-red-300">
          <FiAlertTriangle /> Problemas Detectados
        </h2>

        {estado.problemas.length === 0 ? (
          <p className="text-cyan-300/70">✔ No hay problemas por ahora.</p>
        ) : (
          estado.problemas.map((p, idx) => (
            <motion.div
              key={idx}
              className="p-3 mb-3 rounded-lg bg-red-900/20 border border-red-500/30"
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-semibold text-red-300">{p.mensaje}</p>
              {p.datos && (
                <pre className="text-xs mt-2 text-red-200/80">
                  {JSON.stringify(p.datos, null, 2)}
                </pre>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* SUGERENCIAS */}
      <motion.div
        className="bg-black/40 p-4 rounded-xl border border-cyan-500/30 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2 text-green-300">
          <FiCheckCircle /> Sugerencias Inteligentes
        </h2>

        {estado.sugerencias.length === 0 ? (
          <p className="text-cyan-300/70">AURA aún no genera sugerencias.</p>
        ) : (
          estado.sugerencias.map((s, idx) => (
            <motion.div
              key={idx}
              className="p-3 mb-2 rounded-lg bg-green-900/20 border border-green-500/30"
              whileHover={{ scale: 1.02 }}
            >
              {s}
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}

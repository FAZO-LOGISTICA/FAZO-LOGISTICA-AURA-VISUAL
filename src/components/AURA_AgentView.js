// ======================================================================
//  AURA_AgentView.js — Vista Profesional del Agente Autónomo 2025
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Sistema de autonomía, auditoría y análisis avanzado
// ======================================================================

import React, { useEffect, useState } from "react";
import { AURA_Agent } from "../core/AURA_Agent";
import { motion } from "framer-motion";
import {
  FiCpu,
  FiAlertTriangle,
  FiCheckCircle,
  FiActivity,
  FiRefreshCw,
} from "react-icons/fi";

export default function AURA_AgentView() {
  const [estado, setEstado] = useState(null);

  useEffect(() => {
    setEstado(AURA_Agent.obtenerEstado());

    const timer = setInterval(() => {
      setEstado(AURA_Agent.obtenerEstado());
    }, 1200);

    return () => clearInterval(timer);
  }, []);

  if (!estado) return <p className="text-cyan-300">Cargando agente…</p>;

  return (
    <div className="p-8 text-cyan-200">

      {/* TITLE */}
      <motion.h1
        className="text-3xl font-bold mb-6 flex items-center gap-3 text-cyan-300 drop-shadow-[0_0_12px_cyan]"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <FiCpu className="text-cyan-300" /> AURA Agent — Motor Autónomo
      </motion.h1>

      {/* Última revisión */}
      <p className="text-sm mb-6 text-cyan-400">
        Última revisión del sistema:{" "}
        <span className="text-cyan-200 font-semibold">
          {estado.ultimaRevision
            ? new Date(estado.ultimaRevision).toLocaleString()
            : "Aún no se ha ejecutado análisis"}
        </span>
      </p>

      {/* ===============================================================
          PROBLEMAS DETECTADOS
      =============================================================== */}
      <motion.div
        className="bg-black/40 p-5 rounded-xl border border-cyan-500/20 shadow-xl mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl mb-4 flex items-center gap-2 text-red-300">
          <FiAlertTriangle /> Problemas Detectados por AURA
        </h2>

        {estado.problemas.length === 0 ? (
          <p className="text-cyan-400">✔ No se detectaron problemas.</p>
        ) : (
          estado.problemas.map((p, idx) => (
            <motion.div
              key={idx}
              className="bg-red-900/20 border border-red-600/40 p-4 rounded-lg mb-3"
              whileHover={{ scale: 1.02 }}
            >
              <p className="font-medium text-red-300">{p.mensaje}</p>

              {p.datos && (
                <pre className="mt-2 text-xs text-red-200/80">
                  {JSON.stringify(p.datos, null, 2)}
                </pre>
              )}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* ===============================================================
          SUGERENCIAS DEL AGENTE
      =============================================================== */}
      <motion.div
        className="bg-black/40 p-5 rounded-xl border border-green-500/20 shadow-xl mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl mb-4 flex items-center gap-2 text-green-300">
          <FiCheckCircle /> Sugerencias Inteligentes
        </h2>

        {estado.sugerencias.length === 0 ? (
          <p className="text-cyan-400">AURA no ha generado sugerencias aún.</p>
        ) : (
          estado.sugerencias.map((s, idx) => (
            <motion.div
              key={idx}
              className="bg-green-900/20 border border-green-600/40 p-3 rounded-lg mb-2"
              whileHover={{ scale: 1.03 }}
            >
              {s}
            </motion.div>
          ))
        )}
      </motion.div>

      {/* ===============================================================
          LOG DE ACCIONES AUTOMÁTICAS (PRÓXIMA ETAPA)
      =============================================================== */}
      <motion.div
        className="bg-black/40 p-5 rounded-xl border border-yellow-500/20 shadow-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl mb-4 flex items-center gap-2 text-yellow-300">
          <FiActivity /> Acciones Automáticas
        </h2>

        <p className="text-cyan-300/70">
          Este módulo mostrará todas las decisiones que AURA ejecute de forma
          autónoma (Redistribuciones, alertas a mantenimiento, balanceos, etc.)
        </p>
      </motion.div>
    </div>
  );
}

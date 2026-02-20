// ========================================================
//   AuraOrb.js — FAZO OS 2025 ULTRA
//   Orbe Holográfico Definitivo • Reactor IA Arc
//   Versión JARVIS/ULTRON con estados dinámicos
// ========================================================

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AuraOrb.css";

export default function AuraOrb({ 
  status = "idle", // idle, listening, thinking, speaking, error
  onClick,
  showLabel = true 
}) {
  const [particles, setParticles] = useState([]);

  // Generar partículas flotantes
  useEffect(() => {
    const particleCount = 8;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      angle: (360 / particleCount) * i,
      delay: i * 0.15,
    }));
    setParticles(newParticles);
  }, []);

  // Configuración de colores según estado
  const statusConfig = {
    idle: {
      color: "cyan",
      shadow: "0 0 45px rgba(0,255,255,0.7)",
      innerShadow: "inset 0 0 30px rgba(0,255,255,0.5)",
      border: "border-cyan-300/40",
      glow: "bg-cyan-200/80",
      label: "En línea",
      labelColor: "text-cyan-300",
    },
    listening: {
      color: "magenta",
      shadow: "0 0 55px rgba(255,0,128,0.9)",
      innerShadow: "inset 0 0 35px rgba(255,0,128,0.6)",
      border: "border-pink-400/50",
      glow: "bg-pink-300/90",
      label: "Escuchando...",
      labelColor: "text-pink-300",
    },
    thinking: {
      color: "purple",
      shadow: "0 0 50px rgba(138,43,226,0.8)",
      innerShadow: "inset 0 0 32px rgba(138,43,226,0.6)",
      border: "border-purple-400/50",
      glow: "bg-purple-300/85",
      label: "Pensando...",
      labelColor: "text-purple-300",
    },
    speaking: {
      color: "green",
      shadow: "0 0 48px rgba(0,255,128,0.8)",
      innerShadow: "inset 0 0 30px rgba(0,255,128,0.6)",
      border: "border-green-400/50",
      glow: "bg-green-300/85",
      label: "Hablando...",
      labelColor: "text-green-300",
    },
    error: {
      color: "red",
      shadow: "0 0 45px rgba(255,0,0,0.8)",
      innerShadow: "inset 0 0 28px rgba(255,0,0,0.6)",
      border: "border-red-400/50",
      glow: "bg-red-300/85",
      label: "Error",
      labelColor: "text-red-300",
    },
  };

  const config = statusConfig[status] || statusConfig.idle;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", duration: 0.6 }}
    >
      {/* LABEL DE ESTADO */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`
              px-4 py-1.5 rounded-full
              bg-black/60 backdrop-blur-md
              border border-white/10
              ${config.labelColor}
              text-xs font-medium tracking-wider
              shadow-lg
            `}
          >
            {config.label}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENEDOR DEL ORBE */}
      <motion.div
        onClick={onClick}
        drag
        dragMomentum={false}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        className={`
          relative w-24 h-24 rounded-full cursor-pointer select-none
          flex items-center justify-center
          backdrop-blur-xl
          bg-${config.color}-400/15
          ${config.border}
          transition-all duration-300
        `}
        style={{
          boxShadow: `${config.shadow}, ${config.innerShadow}`,
        }}
      >
        {/* PARTÍCULAS ORBITANDO */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`absolute w-1 h-1 rounded-full ${config.glow}`}
            style={{
              left: "50%",
              top: "50%",
            }}
            animate={{
              x: [
                Math.cos((particle.angle * Math.PI) / 180) * 45,
                Math.cos(((particle.angle + 360) * Math.PI) / 180) * 45,
              ],
              y: [
                Math.sin((particle.angle * Math.PI) / 180) * 45,
                Math.sin(((particle.angle + 360) * Math.PI) / 180) * 45,
              ],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: particle.delay,
              ease: "linear",
            }}
          />
        ))}

        {/* ANILLO EXTERIOR ROTANDO */}
        <motion.div
          className={`absolute w-24 h-24 rounded-full border ${config.border}`}
          animate={{
            rotate: status === "thinking" ? 360 : 0,
            scale: [1, 1.05, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity },
            opacity: { duration: 2, repeat: Infinity },
          }}
        />

        {/* ANILLO MEDIO PULSANTE */}
        <motion.div
          className={`absolute w-20 h-20 rounded-full border ${config.border}`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ANILLO INTERNO */}
        <motion.div
          className={`absolute w-16 h-16 rounded-full border ${config.border}`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.35, 0.1],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* NÚCLEO CENTRAL - REACTOR ARC */}
        <motion.div
          className={`
            relative w-12 h-12 rounded-full
            ${config.glow}
            flex items-center justify-center
          `}
          animate={{
            scale:
              status === "listening"
                ? [1, 1.2, 1]
                : status === "speaking"
                ? [1, 1.15, 1, 1.15, 1]
                : [1, 1.1, 1],
            rotate: status === "thinking" ? 360 : 0,
          }}
          transition={{
            scale: {
              duration: status === "speaking" ? 0.8 : 1.5,
              repeat: Infinity,
            },
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            },
          }}
          style={{
            boxShadow: `0 0 30px ${config.color === "cyan" ? "rgba(0,255,255,0.9)" : 
                                  config.color === "magenta" ? "rgba(255,0,128,0.9)" :
                                  config.color === "purple" ? "rgba(138,43,226,0.9)" :
                                  config.color === "green" ? "rgba(0,255,128,0.9)" :
                                  "rgba(255,0,0,0.9)"}`,
          }}
        >
          {/* LÍNEAS DE ENERGÍA INTERIOR (efecto reactor) */}
          <div className="absolute w-full h-full">
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <motion.div
                key={i}
                className="absolute w-0.5 h-3 bg-white/60 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transformOrigin: "center",
                  transform: `rotate(${angle}deg) translateY(-8px)`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  height: status === "speaking" ? ["12px", "16px", "12px"] : ["12px", "14px", "12px"],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>

          {/* PUNTO CENTRAL */}
          <motion.div
            className="w-2 h-2 rounded-full bg-white/90"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* ONDAS DE AUDIO (solo cuando habla) */}
        <AnimatePresence>
          {status === "speaking" && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`wave-${i}`}
                  className="absolute w-20 h-20 rounded-full border-2 border-green-300/40"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

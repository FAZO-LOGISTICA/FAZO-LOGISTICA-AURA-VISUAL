// =======================================================
//   AuraRealistic.js — GOD MODE 2025
//   IA Avatar: Eye-Tracking + Mouth AI + Blink + Offline
//   FAZO LOGÍSTICA — Gustavo Oliva
// =======================================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AuraRealistic({
  emotion = "neutral",
  talking = false,
  listening = false,
  offline = false,
}) {
  // =======================================================
  //   PARPADEO AUTOMÁTICO
  // =======================================================
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 160);
    }, Math.random() * 3000 + 3000);

    return () => clearInterval(interval);
  }, []);

  // =======================================================
  //   EYE-TRACKING (ojos siguen el cursor)
  // =======================================================
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      const dx = (e.clientX - cx) / 250; // sensibilidad horizontal
      const dy = (e.clientY - cy) / 250; // vertical

      setEyeOffset({ x: dx, y: dy });
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // =======================================================
  //   MOUTH ANIMATION (boquita según voz)
  // =======================================================
  const mouthAnim = talking
    ? [1, 1.25, 1.05, 1.3, 1]
    : [1];

  // =======================================================
  //   FILTRO EMOCIONAL
  // =======================================================
  const emotionFilters = {
    happy: "brightness(1.12) saturate(1.15)",
    angry: "contrast(1.2) hue-rotate(-12deg)",
    sad: "brightness(0.85) saturate(0.9)",
    neutral: "brightness(1)",
  };

  return (
    <div className="relative flex flex-col items-center justify-center select-none">

      {/* =======================================================
              CAPA 1 — Energía externa
      ======================================================= */}
      <motion.div
        className="absolute w-[23rem] h-[23rem] rounded-full pointer-events-none"
        style={{ boxShadow: `0 0 90px rgba(0,255,255,0.45)` }}
        animate={{
          scale: listening ? [1, 1.25, 1] : [1, 1.1, 1],
          opacity: talking ? [0.55, 0.25, 0.55] : [0.35, 0.5, 0.35],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* =======================================================
              CAPA 2 — Scanlines holográficas
      ======================================================= */}
      <div
        className="
          absolute w-64 h-64 rounded-full opacity-30 pointer-events-none
          bg-[linear-gradient(rgba(0,255,255,0.07)_2px,transparent_2px)]
          bg-[length:100%_4px]
          animate-scanlines
        "
      />

      {/* =======================================================
              CAPA 3 — Halo emocional
      ======================================================= */}
      <motion.div
        className="absolute w-[20rem] h-[20rem] rounded-full blur-xl opacity-60 pointer-events-none"
        style={{
          boxShadow: `
            0 0 60px rgba(0,255,255,0.4),
            0 0 80px rgba(0,255,255,0.2),
            inset 0 0 60px rgba(0,255,255,0.3)
          `,
        }}
        animate={{
          scale: talking ? [1, 1.15, 1] : [1, 1.05, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* =======================================================
              CAPA 4 — Núcleo pulsante
      ======================================================= */}
      <motion.div
        className="absolute w-44 h-44 rounded-full opacity-50 pointer-events-none"
        style={{ boxShadow: `0 0 45px rgba(0,255,255,0.9)` }}
        animate={{
          scale: listening ? [1, 1.4, 1] : [1, 1.2, 1],
          opacity: listening ? [0.3, 0.85, 0.3] : [0.2, 0.45, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      {/* =======================================================
              CAPA 5 — ROSTRO AURA + ojos y boca animados
      ======================================================= */}
      <div
        className="
          w-64 h-64 rounded-full overflow-hidden relative
          border-[4px] border-cyan-300/40 shadow-[0_0_40px_rgba(0,255,255,0.55)]
          bg-gradient-to-br from-blue-600/20 via-indigo-500/20 to-purple-600/30
        "
      >
        {/* Imagen base */}
        <motion.img
          src={offline ? "/aura/aura-offline.png" : "/aura/aura1.png"}
          alt="Aura"
          className="w-full h-full object-cover"
          animate={{
            scale: talking ? [1, 1.03, 1] : listening ? [1, 1.015, 1] : 1,
            filter: emotionFilters[emotion] || emotionFilters.neutral,
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />

        {/* ===========================
              OJOS (eye tracking)
        ============================ */}
        <motion.div
          className="absolute top-[34%] left-[28%] w-[44%] h-[18%] flex justify-between px-2"
          animate={{
            x: eyeOffset.x * 8,
            y: eyeOffset.y * 6,
          }}
          transition={{ type: "spring", stiffness: 40, damping: 7 }}
        >
          {/* Ojo izquierdo */}
          <motion.div
            className="w-[38%] h-full bg-black/70 rounded-full"
            animate={{ scaleY: blink ? 0.1 : 1 }}
            transition={{ duration: 0.15 }}
            style={{ filter: "blur(2px)" }}
          />
          {/* Ojo derecho */}
          <motion.div
            className="w-[38%] h-full bg-black/70 rounded-full"
            animate={{ scaleY: blink ? 0.1 : 1 }}
            transition={{ duration: 0.15 }}
            style={{ filter: "blur(2px)" }}
          />
        </motion.div>

        {/* ===========================
              BOCA (mouth AI)
        ============================ */}
        <motion.div
          className="absolute bottom-[19%] left-[34%] w-[32%] h-[14%] bg-black/70 rounded-full"
          animate={{ scaleY: mouthAnim }}
          transition={{ duration: talking ? 0.18 : 0.35, repeat: talking ? Infinity : 0 }}
          style={{
            filter: "blur(6px)",
            opacity: talking ? 0.85 : 0.4,
          }}
        />
      </div>

      {/* =======================================================
              ESTADO EN TEXTO
      ======================================================= */}
      <motion.div
        className="
          absolute top-[270px] text-cyan-200 text-sm font-light
          drop-shadow-[0_0_12px_cyan]
        "
        animate={{ opacity: talking || listening ? [1, 0.5, 1] : [0.9] }}
        transition={{ duration: 1.2, repeat: Infinity }}
      >
        {offline
          ? "🔌 Sin conexión"
          : talking
          ? "🎙️ Hablando…"
          : listening
          ? "🎧 Escuchando…"
          : emotion === "happy"
          ? "😄 Feliz"
          : emotion === "sad"
          ? "😢 Melancólica"
          : emotion === "angry"
          ? "😡 Enojada"
          : "💤 Reposo"}
      </motion.div>
    </div>
  );
}

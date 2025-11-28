import React from "react";
import { motion } from "framer-motion";

export default function AuraAvatar({ talking, listening, emotion }) {
  
  // COLORES SEGÚN EMOCIÓN
  const glow = {
    neutral: "rgba(147, 197, 253, 0.6)",
    happy: "rgba(110, 231, 183, 0.7)",
    angry: "rgba(248, 113, 113, 0.7)",
    sad: "rgba(96, 165, 250, 0.7)",
  };

  const colorGlow = glow[emotion] || glow.neutral;

  return (
    <div className="relative flex flex-col items-center justify-center">

      {/* HALO ENERGÉTICO */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            border: `2px solid ${colorGlow}`,
            width: 240 + i * 40,
            height: 240 + i * 40,
          }}
          animate={{
            scale:
              talking || listening
                ? [1, 1.25 + i * 0.05, 1]
                : [1, 1.1 + i * 0.03, 1],
            opacity:
              talking || listening
                ? [0.7, 0.25, 0.7]
                : [0.3, 0.15, 0.3],
          }}
          transition={{
            duration: 2 + i * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ROSTRO REAL */}
      <motion.img
        src="/aura/aura1.png"
        alt="AURA"
        className="w-56 h-56 rounded-full object-cover shadow-2xl border border-white/10"
        animate={{
          scale: talking ? [1, 1.04, 1] : listening ? [1, 1.02, 1] : 1,
          opacity: talking ? [1, 0.85, 1] : 1,
          filter:
            emotion === "happy"
              ? "brightness(1.15) saturate(1.2)"
              : emotion === "angry"
              ? "contrast(1.15) hue-rotate(-10deg)"
              : emotion === "sad"
              ? "brightness(0.85)"
              : "brightness(1)",
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
        }}
      />

      {/* TEXTO DE ESTADO */}
      <motion.div
        className="mt-4 text-white/80 text-sm"
        animate={{
          opacity: talking || listening ? [1, 0.6, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
      >
        {emotion === "happy"
          ? "Feliz"
          : emotion === "angry"
          ? "Enérgica"
          : emotion === "sad"
          ? "Melancólica"
          : listening
          ? "Escuchando…"
          : talking
          ? "Hablando…"
          : "En reposo"}
      </motion.div>

    </div>
  );
}

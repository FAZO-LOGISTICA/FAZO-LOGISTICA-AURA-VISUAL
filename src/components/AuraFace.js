import React from "react";
import { motion } from "framer-motion";

export default function AuraFace({ talking, listening, emotion }) {
  const emotionColors = {
    happy: ["from-emerald-400 via-green-400 to-lime-500", "#a7f3d0"],
    angry: ["from-red-500 via-rose-500 to-orange-400", "#fecaca"],
    sad: ["from-blue-400 via-indigo-500 to-cyan-600", "#bfdbfe"],
    neutral: ["from-blue-400 via-indigo-400 to-purple-600", "#c7d2fe"],
  };

  const color = emotionColors[emotion] || emotionColors.neutral;

  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Halo energético */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full border-2 opacity-30`}
          style={{
            borderColor: color[1],
            width: 220 + i * 30,
            height: 220 + i * 30,
            top: -15 - i * 15,
            left: -15 - i * 15,
          }}
          animate={{
            scale: talking || listening ? [1, 1.3, 1] : [1, 1.1, 1],
            opacity: talking || listening ? [0.6, 0.2, 0.6] : [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: talking || listening ? 1.5 + i * 0.5 : 3 + i * 0.8,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}

      {/* Cabeza */}
      <motion.div
        className={`relative rounded-full w-56 h-56 bg-gradient-to-tr ${color[0]} shadow-2xl flex items-center justify-center`}
        animate={{
          scale: talking ? [1, 1.2, 1] : listening ? [1, 1.1, 1] : [1, 1.05, 1],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {/* Ojos */}
        <div className="flex justify-between w-24 absolute top-20">
          <motion.div
            className="w-6 h-6 bg-white rounded-full"
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 4,
            }}
          />
          <motion.div
            className="w-6 h-6 bg-white rounded-full"
            animate={{
              scaleY: [1, 0.1, 1],
            }}
            transition={{
              duration: 0.2,
              repeat: Infinity,
              repeatDelay: 4.2,
            }}
          />
        </div>

        {/* Boca según emoción */}
        <motion.div
          className="absolute bottom-14 w-12 h-3 rounded-full"
          style={{
            backgroundColor: "white",
          }}
          animate={{
            scaleY: talking ? [1, 2.5, 1.3, 2, 1] : [1],
            rotate:
              emotion === "happy"
                ? [0, 0, -15, 0]
                : emotion === "angry"
                ? [0, 0, 15, 0]
                : emotion === "sad"
                ? [0, 0, 180, 180]
                : [0],
            opacity: talking ? [1, 0.8, 1] : [0.7],
          }}
          transition={{
            duration: talking ? 0.4 : 2,
            repeat: talking ? Infinity : 0,
          }}
        />
      </motion.div>

      {/* Estado */}
      <motion.div
        className="absolute top-[260px] text-white/80 text-sm font-light"
        animate={{
          opacity: talking || listening ? [1, 0.6, 1] : [0.8],
        }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {emotion === "happy"
          ? "😄 Feliz"
          : emotion === "angry"
          ? "😡 Enojada"
          : emotion === "sad"
          ? "😢 Triste"
          : talking
          ? "🎙️ Hablando..."
          : listening
          ? "🎧 Escuchando..."
          : "💤 En reposo"}
      </motion.div>
    </div>
  );
}

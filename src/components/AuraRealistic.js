// =======================================================
//   AuraRealistic.js — ULTRA REALISTA GOD MODE 2025
//   IA Avatar: EyeTracking V2 + Mouth Volume AI + Blink
//   Fazo OS — Gustavo Oliva
// =======================================================

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

export default function AuraRealistic({
  emotion = "neutral",
  talking = false,
  listening = false,
  offline = false,
}) {
  // =======================================================
  //   1) PARPADEO REAL
  // =======================================================
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const blinkLoop = () => {
      setBlink(true);
      setTimeout(() => setBlink(false), 140);
    };

    const interval = setInterval(
      () => blinkLoop(),
      Math.random() * 2500 + 2500
    );

    return () => clearInterval(interval);
  }, []);

  // =======================================================
  //   2) EYE-TRACKING AVANZADO (inercia + dilatación pupila)
  // =======================================================
  const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
  const [pupilScale, setPupilScale] = useState(1);

  useEffect(() => {
    const handler = (e) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;

      const dx = (e.clientX - cx) / 300;
      const dy = (e.clientY - cy) / 300;

      setEyePos((old) => ({
        x: old.x * 0.7 + dx * 0.3,
        y: old.y * 0.7 + dy * 0.3,
      }));

      const dist = Math.sqrt(dx * dx + dy * dy);
      setPupilScale(1 + dist * 0.5);
    };

    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  // =======================================================
  //   3) BOCA CON LIB-SYNC POR VOLUMEN REAL (micrófono)
  // =======================================================
  const [mouth, setMouth] = useState(1);
  const analyserRef = useRef(null);

  useEffect(() => {
    const listenVolume = async () => {
      try {
        const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ctx = new AudioContext();
        const analyser = ctx.createAnalyser();
        const source = ctx.createMediaStreamSource(audio);

        analyser.fftSize = 512;
        source.connect(analyser);
        analyserRef.current = analyser;

        const data = new Uint8Array(analyser.frequencyBinCount);

        const tick = () => {
          analyser.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;

          setMouth(1 + Math.min(avg / 90, 1.2)); // apertura de boca según volumen

          requestAnimationFrame(tick);
        };

        tick();
      } catch {
        console.warn("Micrófono no disponible → usando mouth anim normal.");
      }
    };

    if (talking) listenVolume();
  }, [talking]);

  const mouthScale = talking ? mouth : 1;

  // =======================================================
  //   4) EXPRESIONES FACIALES (cejas + ojos + brillo)
  // =======================================================
  const emotionColor = {
    happy: "0_0_50px_#22c55e",
    angry: "0_0_50px_#ef4444",
    sad: "0_0_50px_#3b82f6",
    neutral: "0_0_50px_#a855f7",
  };

  const emotionFilter = {
    happy: "brightness(1.18) saturate(1.2)",
    angry: "contrast(1.28) hue-rotate(-10deg)",
    sad: "brightness(0.85) saturate(0.9)",
    neutral: "brightness(1)",
  };

  const browOffset =
    emotion === "angry"
      ? -6
      : emotion === "sad"
      ? 4
      : emotion === "happy"
      ? -2
      : 0;

  return (
    <div className="relative flex flex-col items-center justify-center select-none">

      {/* ======================================================= */}
      {/*        CAPA HOLOGRÁFICA — ENERGÍA DINÁMICA             */}
      {/* ======================================================= */}
      <motion.div
        className="absolute w-[24rem] h-[24rem] rounded-full pointer-events-none"
        style={{
          boxShadow: `0 0 90px rgba(0,255,255,0.45), ${emotionColor[emotion]}`,
        }}
        animate={{
          scale: listening ? [1, 1.3, 1] : [1, 1.12, 1],
          opacity: talking ? [0.7, 0.25, 0.7] : [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* ======================================================= */}
      {/*        CABEZA COMPLETA                                 */}
      {/* ======================================================= */}
      <div
        className="
          w-64 h-64 rounded-full overflow-hidden relative
          border-[5px] border-cyan-300/40
          shadow-[0_0_45px_rgba(0,255,255,0.55)]
          bg-gradient-to-br from-blue-500/20 via-indigo-600/20 to-purple-700/30
        "
      >
        {/* Imagen base */}
        <motion.img
          src={offline ? "/aura/aura-offline.png" : "/aura/aura1.png"}
          alt="AURA"
          className="w-full h-full object-cover opacity-95"
          animate={{
            scale: listening ? [1, 1.03, 1] : [1, 1.01, 1],
            filter: emotionFilter[emotion],
          }}
          transition={{ duration: 2.2, repeat: Infinity }}
        />

        {/* ======================================================= */}
        {/*                      CEJAS                              */}
        {/* ======================================================= */}
        <motion.div
          className="absolute top-[28%] left-[23%] w-[54%] flex justify-between"
          animate={{ y: browOffset }}
        >
          <div className="w-2/5 h-[10px] bg-black/50 rounded-full" />
          <div className="w-2/5 h-[10px] bg-black/50 rounded-full" />
        </motion.div>

        {/* ======================================================= */}
        {/*                      OJOS (Tracking + Blink + Pupila)   */}
        {/* ======================================================= */}
        <motion.div
          className="absolute top-[36%] left-[27%] w-[48%] h-[18%] flex justify-between"
          animate={{
            x: eyePos.x * 10,
            y: eyePos.y * 8,
          }}
          transition={{ type: "spring", stiffness: 35, damping: 6 }}
        >
          {/* Ojo izquierdo */}
          <motion.div
            className="w-[40%] h-full bg-black/70 rounded-full flex items-center justify-center"
            animate={{ scaleY: blink ? 0.1 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="w-2 h-2 bg-cyan-300 rounded-full"
              animate={{ scale: pupilScale }}
            />
          </motion.div>

          {/* Ojo derecho */}
          <motion.div
            className="w-[40%] h-full bg-black/70 rounded-full flex items-center justify-center"
            animate={{ scaleY: blink ? 0.1 : 1 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="w-2 h-2 bg-cyan-300 rounded-full"
              animate={{ scale: pupilScale }}
            />
          </motion.div>
        </motion.div>

        {/* ======================================================= */}
        {/*                      BOCA (Lip-sync real)               */}
        {/* ======================================================= */}
        <motion.div
          className="absolute bottom-[20%] left-[34%] w-[32%] h-[12%] bg-black/60 rounded-full"
          animate={{ scaleY: mouthScale }}
          transition={{
            duration: talking ? 0.12 : 0.4,
            repeat: talking ? Infinity : 0,
          }}
          style={{ filter: "blur(6px)", opacity: talking ? 0.85 : 0.45 }}
        />
      </div>

      {/* ======================================================= */}
      {/*                      ESTADO TEXTO                       */}
      {/* ======================================================= */}
      <motion.div
        className="absolute top-[270px] text-cyan-200 text-sm font-light drop-shadow-[0_0_12px_cyan]"
        animate={{ opacity: talking || listening ? [1, 0.5, 1] : [1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
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

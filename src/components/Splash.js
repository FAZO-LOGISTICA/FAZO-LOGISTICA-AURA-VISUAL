// ===============================================
// Splash.js — FAZO OS 2025
// Pantalla de arranque holográfica profesional
// Animación estilo Jarvis / Stark Industries
// ===============================================

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Splash() {
  const [visible, setVisible] = useState(true);
  const [mensaje, setMensaje] = useState("Inicializando módulos…");

  // Mensajes estilo boot del sistema
  const mensajes = [
    "Cargando núcleo AURA…",
    "Montando sistema FAZO-OS…",
    "Sincronizando módulos municipales…",
    "Activando motores holográficos…",
    "Optimizando entorno de operaciones…",
    "Listo. Bienvenido Gustavo.",
  ];

  useEffect(() => {
    // alterna mensajes
    let i = 0;
    const interval = setInterval(() => {
      setMensaje(mensajes[i]);
      i++;
      if (i === mensajes.length) i = 0;
    }, 700);

    // oculta splash después de 3.2s
    const timeout = setTimeout(() => setVisible(false), 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed inset-0 z-[9999]
        bg-black flex flex-col items-center justify-center
        text-white overflow-hidden
      "
    >
      {/* LÍNEAS HOLOGRÁFICAS */}
      <div className="absolute inset-0 opacity-10 animate-scanlines bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[length:100%_4px]" />

      {/* LOGO HOLOGRÁFICO */}
      <motion.img
        src="/fazo-logo.png"
        alt="FAZO LOGÍSTICA"
        className="w-44 h-44 mb-6 glow-stark"
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />

      {/* TEXTO PRINCIPAL */}
      <motion.h2
        className="text-xl font-bold tracking-widest text-cyan-300"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        {mensaje}
      </motion.h2>

      {/* BARRA DE CARGA */}
      <div className="w-64 h-2 bg-white/10 rounded-full mt-6 overflow-hidden">
        <motion.div
          className="h-full bg-cyan-400/80"
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "40%", "70%", "100%"] }}
          transition={{ duration: 2.8, ease: "easeInOut" }}
        />
      </div>

      {/* SUBTEXTO */}
      <motion.p
        className="text-xs mt-4 text-cyan-200/60 tracking-widest"
        animate={{ opacity: [1, 0.2, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
      >
        FAZO-LOGÍSTICA • System AGI 2025
      </motion.p>
    </motion.div>
  );
}

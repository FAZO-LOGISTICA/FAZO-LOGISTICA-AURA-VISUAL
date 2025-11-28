// Splash.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Splash() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => setVisible(false), 2500);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 text-white">
      <motion.img
        src="/fazo-logo.png"
        alt="FAZO LOGÍSTICA"
        className="w-40 h-40 mb-8 opacity-90"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />

      <motion.h2
        className="text-xl font-bold tracking-wider"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Inicializando módulos de AURA…
      </motion.h2>

      <motion.p
        className="text-sm mt-4 text-blue-300"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      >
        FAZO-LOGÍSTICA AGI System
      </motion.p>
    </div>
  );
}

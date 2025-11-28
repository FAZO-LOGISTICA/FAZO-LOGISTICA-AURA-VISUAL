// C:\fazo\aura-visual\src\components\AuthGate.js

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function AuthGate({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // PIN oficial de acceso (puedes cambiarlo aquí)
  const PIN_CORRECTO = "7452";

  // Si ya fue desbloqueado antes, no mostrar la pantalla de acceso
  useEffect(() => {
    const unlocked = localStorage.getItem("AURA_UNLOCKED");
    if (unlocked === "true") {
      onUnlock();
    }
  }, [onUnlock]);

  const intentarAcceso = () => {
    if (pin === PIN_CORRECTO) {
      localStorage.setItem("AURA_UNLOCKED", "true");
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1200);
    }
  };

  return (
    <div
      className="
        fixed inset-0 
        bg-gradient-to-br 
        from-slate-900 via-indigo-900 to-blue-900 
        flex flex-col items-center justify-center 
        text-white z-[9999]
      "
    >

      {/* LOGO ANIMADO */}
      <motion.div
        className="mb-10 text-5xl font-extrabold tracking-wide drop-shadow-lg"
        animate={{ opacity: [0.4, 1, 0.6, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        AURA — FAZO
      </motion.div>

      {/* TARJETA DE ACCESO */}
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="
          bg-white/10 backdrop-blur-xl 
          p-8 rounded-2xl shadow-2xl 
          border border-white/20 
          w-[300px]
        "
      >
        <p className="text-center mb-4 text-white/80 text-lg">
          Ingreso de seguridad
        </p>

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4}
          className="
            w-full p-3 text-center text-2xl 
            rounded-xl bg-white/20 outline-none 
            border border-white/30
            text-white tracking-widest
          "
          placeholder="••••"
        />

        <button
          onClick={intentarAcceso}
          className="
            mt-5 bg-blue-600 hover:bg-blue-700 
            w-full py-2 rounded-xl font-semibold shadow-xl
            transition
          "
        >
          Entrar
        </button>

        {error && (
          <p className="mt-3 text-red-400 text-center animate-pulse">
            PIN incorrecto
          </p>
        )}
      </motion.div>

      {/* PIE DE PÁGINA */}
      <div className="mt-8 text-white/40 text-sm">
        Sistema FAZO-LOGÍSTICA © {new Date().getFullYear()}
      </div>
    </div>
  );
}

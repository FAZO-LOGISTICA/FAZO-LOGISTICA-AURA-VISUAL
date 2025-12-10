// ========================================================
//   Login.js — FAZO OS 2025
//   Acceso tipo sistema operativo • Seguridad PIN
//   Mateo IA — versión ULTRA PRO MAX
// ========================================================

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Login({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const claveCorrecta = "2008"; // 🔐 CLAVE OFICIAL FAZO OS

  const handleSubmit = (e) => {
    e.preventDefault();

    if (pin === claveCorrecta) {
      localStorage.setItem("aura-acceso", "ok");
      onLogin();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div
      className="
        w-full h-screen flex items-center justify-center 
        bg-gradient-to-br from-black via-slate-900 to-black
        text-white select-none
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="
          p-10 rounded-3xl bg-black/50 backdrop-blur-xl
          border border-cyan-400/30
          shadow-[0_0_35px_rgba(0,255,255,0.25)]
          text-center w-[340px]
        "
      >
        {/* LOGO FAZO */}
        <div className="mb-5">
          <motion.div
            animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="
              mx-auto w-20 h-20 rounded-full
              bg-cyan-400/20 border border-cyan-300/40
              flex items-center justify-center
              shadow-[0_0_25px_rgba(0,255,255,0.45)]
            "
          >
            <span className="text-cyan-300 font-bold text-3xl">A</span>
          </motion.div>
        </div>

        <h1 className="text-2xl font-bold mb-3 tracking-wide text-cyan-200">
          Acceso a FAZO OS
        </h1>

        <p className="text-cyan-200/70 text-sm mb-6">
          Ingresa tu clave de seguridad para iniciar sesión
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* INPUT PIN */}
          <motion.input
            key={error ? "error" : "ok"}
            type="password"
            maxLength={4}
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            animate={error ? { x: [-8, 8, -8, 0] } : {}}
            transition={{ duration: 0.25 }}
            className="
              px-4 py-3 rounded-xl text-center text-2xl tracking-[0.5em]
              bg-black/40 border border-cyan-300/30 text-cyan-100
              outline-none focus:border-cyan-300/70 
              shadow-inner shadow-cyan-300/10
            "
            placeholder="••••"
          />

          {/* ERROR */}
          {error && (
            <p className="text-red-400 text-sm -mt-2">
              Clave incorrecta
            </p>
          )}

          {/* BOTÓN ENTRAR */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="
              w-full py-3 rounded-xl font-bold
              bg-cyan-600 hover:bg-cyan-700
              shadow-[0_0_15px_rgba(0,255,255,0.35)]
              text-white tracking-wide
            "
          >
            Entrar
          </motion.button>
        </form>

        {/* PIE DE PÁGINA */}
        <p className="text-xs text-cyan-300/50 mt-6">
          © 2025 FAZO LOGÍSTICA — Sistema Operativo Municipal
        </p>
      </motion.div>
    </div>
  );
}

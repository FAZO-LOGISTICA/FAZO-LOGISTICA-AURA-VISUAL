import React, { useState, useEffect } from "react";

export default function AuraLock({ onUnlock }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  // Tu PIN secreto (cámbialo si quieres)
  const PIN_CORRECTO = "7452";

  // Si ya fue desbloqueado antes, no pedir PIN de nuevo
  useEffect(() => {
    const saved = localStorage.getItem("AURA_UNLOCKED");
    if (saved === "true") onUnlock();
  }, [onUnlock]);

  const handleUnlock = () => {
    if (pin === PIN_CORRECTO) {
      localStorage.setItem("AURA_UNLOCKED", "true");
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div
      className="
        fixed inset-0 bg-gradient-to-br 
        from-slate-900 via-indigo-900 to-blue-900
        flex flex-col items-center justify-center
        text-white z-[9999]
      "
    >
      <h1 className="text-4xl font-bold mb-6 drop-shadow-lg">
        AURA — Acceso Restringido
      </h1>

      <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-white/20">
        <p className="text-center mb-4 text-white/80">
          Ingresa tu <span className="font-bold">PIN de acceso</span>
        </p>

        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength={4}
          className="
            w-40 text-center p-3 text-2xl 
            rounded-xl bg-white/20 outline-none border border-white/30
            placeholder-white/50 tracking-widest
          "
          placeholder="••••"
        />

        <button
          onClick={handleUnlock}
          className="
            mt-5 bg-blue-600 hover:bg-blue-700 
            px-6 py-2 rounded-xl font-semibold shadow-md transition
            w-full
          "
        >
          Entrar
        </button>

        {error && (
          <p className="mt-3 text-red-400 text-center animate-pulse">
            PIN incorrecto
          </p>
        )}
      </div>
    </div>
  );
}

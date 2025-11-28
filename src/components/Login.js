// src/components/Login.js
import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  const claveCorrecta = "2008"; // NUEVA CLAVE

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
    <div className="w-full h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900/80 p-8 rounded-3xl border border-white/10 shadow-xl text-center select-none">
        
        <h1 className="text-2xl font-bold mb-4">Acceso a AURA</h1>
        <p className="text-white/70 text-sm mb-6">
          Ingresa tu clave de acceso para continuar
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={pin}
            maxLength={4}
            onChange={(e) => setPin(e.target.value)}
            className="px-4 py-3 rounded-xl bg-black/30 border border-white/20 text-white text-center text-xl tracking-widest outline-none"
            placeholder="••••"
          />

          {error && (
            <p className="text-red-400 text-sm mt-[-10px]">
              Clave incorrecta
            </p>
          )}

          <button
            type="submit"
            className="
              px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 
              transition font-bold shadow-lg text-white
            "
          >
            Entrar
          </button>
        </form>

      </div>
    </div>
  );
}

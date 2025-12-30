/* ======================================================================
   AURA_CyberPanel.js — Panel Técnico de AURA OS (Versión Final PRO 2025)
   FAZO LOGÍSTICA — Monitor del Sistema, Nexus y AutoFix
====================================================================== */

import React, { useEffect, useState } from "react";
import { obtenerResumenMemoria } from "../core/AURAMemory";

/* ======================================================================
   PANEL TÉCNICO DE AURA
====================================================================== */

export default function AURA_CyberPanel() {
  const [estado, setEstado] = useState({
    online: navigator.onLine,
    memoria: obtenerResumenMemoria(),
    ultimaRevision: null,
  });

  /* ====== EVENTO ONLINE / OFFLINE ====== */
  useEffect(() => {
    const on = () => setEstado((e) => ({ ...e, online: true }));
    const off = () => setEstado((e) => ({ ...e, online: false }));

    window.addEventListener("online", on);
    window.addEventListener("offline", off);

    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  /* ====== REFRESCO DE MEMORIA AURA ====== */
  const refrescar = () => {
    setEstado({
      online: navigator.onLine,
      memoria: obtenerResumenMemoria(),
      ultimaRevision: new Date().toLocaleString(),
    });
  };

  /* ======================================================================
       UI
  ======================================================================= */

  const box = "bg-black/40 border border-cyan-400/30 p-4 rounded-xl mb-4";

  return (
    <section className="p-4 bg-black/30 rounded-xl border border-cyan-500/30 backdrop-blur-xl">
      <h2 className="text-cyan-300 text-xl mb-3">🛰️ PANEL TÉCNICO AURA OS</h2>

      {/* Estado de Red */}
      <div className={box}>
        <h3 className="text-cyan-200">Conectividad</h3>
        <p className="text-cyan-100/80 mt-1">
          Estado:{" "}
          {estado.online ? (
            <span className="text-emerald-400">ONLINE ✔️</span>
          ) : (
            <span className="text-red-400">OFFLINE ❌</span>
          )}
        </p>
      </div>

      {/* Memoria AURA */}
      <div className={box}>
        <h3 className="text-cyan-200">Memoria Interna de AURA</h3>

        <pre className="text-xs text-cyan-100/80 mt-2 whitespace-pre-wrap bg-black/40 p-3 rounded-lg max-h-72 overflow-auto">
{JSON.stringify(estado.memoria, null, 2)}
        </pre>

        <button
          onClick={refrescar}
          className="mt-3 px-4 py-2 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600"
        >
          🔄 Actualizar
        </button>

        {estado.ultimaRevision && (
          <p className="text-cyan-200 text-xs mt-2">
            Última actualización: {estado.ultimaRevision}
          </p>
        )}
      </div>

      {/* Información del Sistema */}
      <div className={box}>
        <h3 className="text-cyan-200">Información del Sistema</h3>
        <p className="text-cyan-100/80 text-sm">
          Versión AURA OS: <b>3.0.0 Nexus Ultra</b>
        </p>
        <p className="text-cyan-100/80 text-sm">
          Multimodel AI: <b>Activado</b>
        </p>
        <p className="text-cyan-100/80 text-sm">
          AutoFix Operacional: <b>Activo</b>
        </p>
      </div>
    </section>
  );
}

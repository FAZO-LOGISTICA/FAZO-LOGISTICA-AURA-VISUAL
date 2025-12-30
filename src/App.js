/* ======================================================================
   App.js — FAZO OS + AURA OS (Versión Final 2025)
   Sistema Operativo FAZO — Integración con AURA, Nexus y EventBridge
====================================================================== */

import React, { useEffect, useState } from "react";

import AURAChat from "./components/AURAChat";
import AURA_CyberPanel from "./components/AURA_CyberPanel";

import {
  registrarSubsistema,
} from "./core/FAZO_OS_EventBridge";

/* ======================================================================
   COMPONENTES / MÓDULOS FAZO
   (AguaRuta, Traslado, Flota se integrarán aquí)
====================================================================== */

function PantallaInicio() {
  return (
    <div className="text-cyan-200 text-center p-4">
      <h1 className="text-2xl">FAZO LOGÍSTICA OS</h1>
      <p className="text-cyan-300/80 mt-2">
        Sistema Operativo Logístico — Integrado con AURA OS
      </p>
    </div>
  );
}

/* ======================================================================
   APP PRINCIPAL
====================================================================== */

export default function App() {
  const [pantalla, setPantalla] = useState("inicio");
  const [subruta, setSubruta] = useState("");

  /* ============================================================
      SUSCRIPCIÓN A EVENTOS DE AURA (EventBridge)
  ============================================================ */

  useEffect(() => {
    registrarSubsistema((evento) => {
      console.log("📡 Evento recibido desde AURA:", evento);

      // Abrir módulo completo
      if (evento.tipo === "AURA_MODULO") {
        setPantalla(evento.modulo);
      }

      // Abrir subruta
      if (evento.tipo === "AURA_SUBRUTA") {
        setPantalla(evento.modulo);
        setSubruta(evento.ruta);
      }

      // Acciones del sistema
      if (evento.tipo === "AURA_ACCION") {
        if (evento.accion === "logout") {
          setPantalla("inicio");
        }
      }
    });
  }, []);

  /* ======================================================================
      UI PRINCIPAL
  ======================================================================= */

  return (
    <div className="min-h-screen bg-black text-white p-4">
      {/* PANEL SUPERIOR AURA */}
      <AURAChat />

      <div className="mt-6">
        {/* RENDER SEGÚN MÓDULO */}
        {pantalla === "inicio" && <PantallaInicio />}
        {pantalla === "panel" && <AURA_CyberPanel />}

        {/* AQUÍ IRÁ AGUARUTA, TRASLADO, FLOTAS, ETC */}
        {pantalla === "aguaruta" && (
          <div className="p-4 bg-black/40 rounded-xl border border-cyan-500/30">
            <h2 className="text-cyan-300">Módulo AguaRuta</h2>
            <p className="text-cyan-100/70">
              AURA puede mejorar y corregir este módulo automáticamente.
            </p>

            {subruta && (
              <p className="text-cyan-400 mt-2">Subruta activa: {subruta}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

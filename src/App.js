/* =======================================================
   FAZO OS — App.js (NEXUS + AGENT EDITION 2025)
   Integración total con:
   - AURAChat (NEXUS)
   - AURA_Agent (Autonomía)
   - AURA_NEXUS EventBridge
   - AguaRuta (Netlify)
========================================================== */

import React, { useState, useEffect, useRef } from "react";

// Componentes centrales del OS
import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

import { AURA_Agent } from "./core/AURA_Agent";
import { FAZO_EventBridge } from "./core/FAZO_EventBridge";

import "./index.css";

// URL REAL DE DATOS AGUARUTA
const URL_FAZO_DATA = "https://aguaruta.netlify.app/fazo-data.json";

export default function App() {
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  /* =======================================================
     SISTEMA READY (Splash → AURA Boot)
  ======================================================= */
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("FAZO_READY"));
    }, 400);
  }, []);

  /* =======================================================
     LOGIN PERSISTENTE
  ======================================================= */
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) return <Login onLogin={() => setAcceso(true)} />;

  /* =======================================================
     ETAPA 1 — CARGA DE DATOS REALES DE AGUARUTA
     (Inyecta datos en window.__FAZO_DATA__)
  ======================================================= */
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(URL_FAZO_DATA);
        const data = await res.json();

        // 🔥 Información compartida para todo FAZO OS + AURA
        window.__FAZO_DATA__ = data;

        // Avisar al agente que hay nueva data
        AURA_Agent.actualizarDatos(data);
      } catch (err) {
        console.error("❌ Error cargando FAZO DATA:", err);
      }
    }

    loadData();

    // refrescar cada 10 segundos
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  /* =======================================================
     ETAPA 2 — ACTIVAR AURA AGENT (Autonomía)
  ======================================================= */
  useEffect(() => {
    // Iniciar el motor autónomo
    AURA_Agent.iniciar();

    // Cada 12 segundos, análisis automático
    const auto = setInterval(() => {
      const reporte = AURA_Agent.analizar();

      if (reporte?.alertas?.length > 0) {
        // 🔥 Enviar alerta a AURAChat
        FAZO_EventBridge.emit("AURA_ALERTA", reporte);
      }
    }, 12000);

    return () => clearInterval(auto);
  }, []);

  /* =======================================================
     BRIDGE → COMUNICAR AURA CON IFrames
  ======================================================= */
  const sendToIframe = (app, payload) => {
    try {
      if (!payload) return;

      const target =
        app === "aguaruta"
          ? aguarutaIframeRef.current
          : app === "traslado"
          ? trasladoIframeRef.current
          : null;

      target?.contentWindow?.postMessage(payload, "*");
    } catch (error) {
      console.error("❌ Error enviando comando a iframe:", error);
    }
  };

  /* =======================================================
     AURA → OS: PROCESAR COMANDOS DEL NEXUS
  ======================================================= */
  const handleComandoAura = (cmd) => {
    if (!cmd) return;

    // String directo
    if (typeof cmd === "string") {
      setVista(cmd);
      return;
    }

    // Módulos
    if (cmd.tipo === "modulo") {
      setVista(cmd.modulo);
      if (cmd.modulo === "aguaruta") setSubrutaAgua("");
      return;
    }

    // Subrutas AguaRuta
    if (cmd.tipo === "subruta") {
      setVista("aguaruta");
      const clean = (cmd.ruta || "").replace(/^\//, "");
      setSubrutaAgua(clean);

      sendToIframe("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: clean,
      });
      return;
    }

    // Acciones generales
    if (cmd.tipo === "accion") {
      switch (cmd.accion) {
        case "logout":
          localStorage.removeItem("aura-acceso");
          window.location.reload();
          break;

        case "abrir-rutas":
          setVista("aguaruta");
          setSubrutaAgua("rutas-activas");
          break;

        case "filtro-camion":
          sendToIframe("aguaruta", {
            type: "FAZO_CMD",
            command: "filtrar-camion",
            camion: cmd.valor,
          });
          break;

        default:
          console.warn("⚠️ Acción no reconocida:", cmd);
      }
    }
  };

  /* =======================================================
     RENDER DEL FAZO OS
  ======================================================= */
  return (
    <div className="flex min-h-screen text-white bg-gradient-to-br from-black via-slate-900 to-black overflow-hidden relative fade-in">
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade smooth">
          {vista === "aguaruta" && (
            <iframe
              ref={aguarutaIframeRef}
              src={`https://aguaruta.netlify.app/${subrutaAgua}`}
              title="AguaRuta"
              className="w-full h-[88vh] rounded-2xl border border-cyan-400/40 bg-black/40 backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.25)] transition-all duration-500"
            />
          )}

          {vista === "traslado" && (
            <iframe
              ref={trasladoIframeRef}
              src="https://traslado-municipal.netlify.app"
              title="Traslado Municipal"
              className="w-full h-[88vh] rounded-2xl border border-emerald-400/40 bg-black/40 backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,255,0.25)] transition-all duration-500"
            />
          )}

          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 glow-stark">Flota Municipal</h2>
              <p className="text-cyan-200/80">Control de vehículos, disponibilidad y mantenciones.</p>
              <p className="text-cyan-300/40 mt-3">(En construcción)</p>
            </div>
          )}

          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 glow-stark">Panel de Reportes</h2>
              <p className="text-cyan-200/80">Análisis avanzado del sistema.</p>
              <p className="text-cyan-300/40 mt-3">(En construcción)</p>
            </div>
          )}
        </main>
      </div>

      <AuraOrb onClick={() => setAuraVisible(true)} />

      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onComando={handleComandoAura}
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}

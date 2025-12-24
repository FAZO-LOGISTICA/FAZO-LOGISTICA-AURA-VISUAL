// ======================================================================
//  FAZO OS — App.js (PASO 5 — Integración EventBridge)
//  FAZO LOGÍSTICA — Gustavo Oliva
//  Mateo IA — Integración total AURA ↔ OS
// ======================================================================

import React, { useState, useEffect, useRef } from "react";

import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

import {
  registrarSubsistema,
} from "./core/FAZO_OS_EventBridge";

import { AURA_Agent } from "./core/AURA_Agent";

import "./index.css";

export default function App() {
  // ======================================================
  //  ESTADOS PRINCIPALES DEL OS
  // ======================================================
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  // Referencias a iframes
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // ======================================================
  //  LOGIN PERSISTENTE
  // ======================================================
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) return <Login onLogin={() => setAcceso(true)} />;

  // ======================================================
  //  AURA READY EVENT (SPLASH)
  // ======================================================
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("FAZO_READY"));
    }, 200);
  }, []);

  // ======================================================
  //  INICIAR AURA_AGENT (Análisis automático)
  // ======================================================
  useEffect(() => {
    AURA_Agent.iniciar();
  }, []);

  // ======================================================
  //  FAZO BRIDGE — Enviar comandos a iFrames
  // ======================================================
  const sendToIframe = (app, payload) => {
    try {
      const target =
        app === "aguaruta"
          ? aguarutaIframeRef.current
          : app === "traslado"
          ? trasladoIframeRef.current
          : null;

      if (target?.contentWindow) {
        target.contentWindow.postMessage(payload, "*");
      }
    } catch (err) {
      console.error("❌ Error enviando comando a iframe:", err);
    }
  };

  // ======================================================
  //  SUSCRIPCIÓN A EVENTOS DE AURA (EventBridge)
  // ======================================================
  useEffect(() => {
    registrarSubsistema((evento) => {
      console.log("📡 App.js recibió evento AURA:", evento);

      // ----------------------------------------------------
      // 1) MÓDULO COMPLETO
      // ----------------------------------------------------
      if (evento.tipo === "AURA_MODULO") {
        setVista(evento.modulo);
        if (evento.modulo === "aguaruta") setSubrutaAgua("");
      }

      // ----------------------------------------------------
      // 2) SUBRUTA AGUARUTA
      // ----------------------------------------------------
      if (evento.tipo === "AURA_SUBRUTA") {
        setVista(evento.modulo);
        setSubrutaAgua(evento.ruta);

        sendToIframe("aguaruta", {
          type: "FAZO_CMD",
          command: "open-tab",
          tab: evento.ruta,
        });
      }

      // ----------------------------------------------------
      // 3) ACCIONES GENERALES
      // ----------------------------------------------------
      if (evento.tipo === "AURA_ACCION") {
        switch (evento.accion) {
          case "logout":
            localStorage.removeItem("aura-acceso");
            window.location.reload();
            break;

          case "filtrar-camion":
            sendToIframe("aguaruta", {
              type: "FAZO_CMD",
              command: "filtrar-camion",
              camion: evento.payload?.valor,
            });
            break;

          case "abrir-rutas":
            setVista("aguaruta");
            setSubrutaAgua("rutas-activas");
            break;

          default:
            console.warn("⚠️ Acción desconocida:", evento);
        }
      }

      // ----------------------------------------------------
      // 4) AURA ANALYSIS AUTO — ALERTAS
      // ----------------------------------------------------
      if (evento.tipo === "AURA_ANALISIS_AUTOMATICO") {
        console.log("🔍 AURA análisis automático:", evento.payload);
        setAuraVisible(true); // abre el panel IA automáticamente
      }
    });
  }, []);

  // ======================================================
  //  RENDER FAZO OS COMPLETO
  // ======================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative fade-in
      "
    >
      {/* MENÚ IZQUIERDO */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* PANEL CENTRAL */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade smooth">

          {/* AguaRuta */}
          {vista === "aguaruta" && (
            <iframe
              ref={aguarutaIframeRef}
              src={`https://aguaruta.netlify.app/${subrutaAgua}`}
              title="AguaRuta"
              className="
                w-full h-[88vh] rounded-2xl
                border border-cyan-400/40
                bg-black/40 backdrop-blur-xl
                shadow-[0_0_25px_rgba(0,255,255,0.25)]
                transition-all duration-500
              "
            />
          )}

          {/* Traslado Municipal */}
          {vista === "traslado" && (
            <iframe
              ref={trasladoIframeRef}
              src="https://traslado-municipal.netlify.app"
              title="Traslado Municipal"
              className="
                w-full h-[88vh] rounded-2xl
                border border-emerald-400/40
                bg-black/40 backdrop-blur-xl
                shadow-[0_0_25px_rgba(0,255,255,0.25)]
              "
            />
          )}

          {/* Flota */}
          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2 glow-stark">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">Control y gestión vehicular.</p>
            </div>
          )}

          {/* Reportes */}
          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">Reportes FAZO</h2>
              <p className="text-cyan-200/80">Análisis avanzado.</p>
            </div>
          )}
        </main>
      </div>

      {/* ORBE IA */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* PANEL AURA */}
      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onComando={() => {}} 
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}

// ======================================================================
//  FAZO OS — App.js 2025 (VERSIÓN DEFINITIVA NEXUS + EVENTBRIDGE)
//  Compatible con AguaRuta (Netlify), Traslado Municipal, AURA OS
// ======================================================================

import React, { useState, useEffect, useRef } from "react";

import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

import {
  registrarSubsistema,
  eventoAbrirModulo,
  eventoAbrirSubruta,
  eventoAccionSistema,
} from "./core/FAZO_OS_EventBridge";

import { AURA_Agent } from "./core/AURA_Agent";

import "./index.css";

export default function App() {
  // =============================================================
  // ESTADOS PRINCIPALES DEL SISTEMA
  // =============================================================
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  // IFRAMES
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // =============================================================
  // SPLASH / READY EVENT
  // =============================================================
  useEffect(() => {
    setTimeout(() => window.dispatchEvent(new Event("FAZO_READY")), 300);
  }, []);

  // =============================================================
  // LOGIN PERSISTENCIA
  // =============================================================
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  // =============================================================
  // AURA AGENT — Supervisión Automática
  // =============================================================
  useEffect(() => {
    AURA_Agent.iniciar();
  }, []);

  // =============================================================
  // FAZO EVENTBRIDGE → Escuchar comandos de AURA
  // =============================================================
  useEffect(() => {
    registrarSubsistema((evento) => {
      if (!evento) return;

      // -----------------------------
      // 1) ABRIR MÓDULOS COMPLETOS
      // -----------------------------
      if (evento.tipo === "AURA_MODULO") {
        setVista(evento.modulo);

        if (evento.modulo === "aguaruta") {
          setSubrutaAgua("");
        }
        return;
      }

      // -----------------------------
      // 2) SUBRUTAS DE AGUARUTA
      // -----------------------------
      if (evento.tipo === "AURA_SUBRUTA") {
        setVista(evento.modulo);

        const clean = evento.ruta.replace(/^\//, "");
        setSubrutaAgua(clean);

        // enviar comando al iframe
        if (aguarutaIframeRef.current?.contentWindow) {
          aguarutaIframeRef.current.contentWindow.postMessage(
            {
              type: "FAZO_CMD",
              command: "open-tab",
              tab: clean,
            },
            "*"
          );
        }
        return;
      }

      // -----------------------------
      // 3) ACCIONES DEL SISTEMA
      // -----------------------------
      if (evento.tipo === "AURA_ACCION") {
        const { accion, payload } = evento;

        switch (accion) {
          case "logout":
            localStorage.removeItem("aura-acceso");
            window.location.reload();
            break;

          case "abrir-mapa":
            setVista("aguaruta");
            setSubrutaAgua("mapa");
            break;

          case "abrir-rutas":
            setVista("aguaruta");
            setSubrutaAgua("rutas-activas");
            break;

          case "filtrar-camion":
            if (aguarutaIframeRef.current?.contentWindow) {
              aguarutaIframeRef.current.contentWindow.postMessage(
                {
                  type: "FAZO_CMD",
                  command: "filtrar-camion",
                  camion: payload?.camion,
                },
                "*"
              );
            }
            break;

          default:
            console.warn("⚠️ Acción no reconocida:", accion);
        }
      }
    });
  }, []);

  // =============================================================
  // LOGIN SCREEN
  // =============================================================
  if (!acceso) return <Login onLogin={() => setAcceso(true)} />;

  // =============================================================
  // RENDER PRINCIPAL
  // =============================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative fade-in
      "
    >
      {/* ============================ */}
      {/* SIDEBAR */}
      {/* ============================ */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* ============================ */}
      {/* PANEL VISUAL PRINCIPAL */}
      {/* ============================ */}
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
                transition-all duration-500 jarvis-frame
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
                transition-all duration-500 jarvis-frame
              "
            />
          )}

          {/* Flota Municipal */}
          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2 glow-stark">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">En construcción.</p>
            </div>
          )}

          {/* Reportes */}
          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2 glow-stark">
                Reportes FAZO OS
              </h2>
              <p className="text-cyan-200/80">En construcción.</p>
            </div>
          )}

          {/* Ajustes */}
          {vista === "ajustes" && (
            <div className="card-fazo p-10 blur-in">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4 glow-stark">
                Ajustes del Sistema
              </h2>
              <button
                onClick={() => {
                  localStorage.removeItem("aura-acceso");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 shadow-lg"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ORBE DE AURA */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* PANEL DE AURA */}
      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
      />
    </div>
  );
}

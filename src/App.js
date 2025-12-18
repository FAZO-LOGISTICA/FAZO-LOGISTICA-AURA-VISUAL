// =====================================================
//  FAZO OS — App.js 2025 (VERSIÓN DEFINITIVA)
//  Integración total con AURAChat GOD MODE Offline/Online
//  Ultra Optimizado — Compatible con avatar realista 2025
// =====================================================

import React, { useState, useEffect, useRef } from "react";

// Componentes centrales FAZO OS
import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

import "./index.css";

export default function App() {
  // ESTADOS PRINCIPALES DEL OS
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  // Referencias a iFrames externos
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // =====================================================
  //  1) Splash FAZO OS (index.html → AURA READY)
  // =====================================================
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("FAZO_READY"));
    }, 400);
  }, []);

  // =====================================================
  //  2) Persistencia de Login
  // =====================================================
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) return <Login onLogin={() => setAcceso(true)} />;

  // =====================================================
  //  3) FAZO Bridge — Comunicación OS → Iframes
  // =====================================================
  const sendToIframe = (app, payload) => {
    try {
      if (!payload) return;

      const target =
        app === "aguaruta"
          ? aguarutaIframeRef.current
          : app === "traslado"
          ? trasladoIframeRef.current
          : null;

      if (target?.contentWindow) {
        target.contentWindow.postMessage(payload, "*");
      }
    } catch (error) {
      console.error("❌ Error enviando comando a iframe:", error);
    }
  };

  // =====================================================
  //  4) Procesar Comandos desde AURA → FAZO OS
  // =====================================================
  const handleComandoAura = (cmd) => {
    if (!cmd) return;

    // -----------------------------
    // 1) Acceso directo tipo string
    // -----------------------------
    if (typeof cmd === "string") {
      setVista(cmd);
      return;
    }

    // -----------------------------
    // 2) Módulos principales
    // -----------------------------
    if (cmd.tipo === "modulo") {
      setVista(cmd.modulo);
      if (cmd.modulo === "aguaruta") setSubrutaAgua("");
      return;
    }

    // -----------------------------
    // 3) Subrutas AguaRuta
    // -----------------------------
    if (cmd.tipo === "subruta" && cmd.modulo === "aguaruta") {
      setVista("aguaruta");

      const clean = (cmd.ruta || "").replace(/^\//, "");
      setSubrutaAgua(clean);

      // Comando al iframe
      sendToIframe("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: clean,
      });

      return;
    }

    // -----------------------------
    // 4) Acciones generales
    // -----------------------------
    if (cmd.tipo === "accion") {
      switch (cmd.accion) {
        case "logout":
          localStorage.removeItem("aura-acceso");
          window.location.reload();
          break;

        case "filtro-camion":
          sendToIframe("aguaruta", {
            type: "FAZO_CMD",
            command: "filtrar-camion",
            camion: cmd.valor,
          });
          break;

        case "abrir-rutas":
          setVista("aguaruta");
          setSubrutaAgua("rutas-activas");
          break;

        default:
          console.warn("⚠️ Acción de AURA no reconocida:", cmd);
      }
    }
  };

  // =====================================================
  //  5) RENDER OFICIAL — FAZO OS DESKTOP HUD
  // =====================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative fade-in
      "
    >
      {/* =============================== */}
      {/*     MENÚ LATERAL FAZO OS        */}
      {/* =============================== */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* =============================== */}
      {/*        PANEL PRINCIPAL          */}
      {/* =============================== */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade smooth">

          {/* =============================== */}
          {/*     AGUARUTA — iFrame          */}
          {/* =============================== */}
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

          {/* =============================== */}
          {/*     TRASLADO MUNICIPAL         */}
          {/* =============================== */}
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

          {/* =============================== */}
          {/*     FLOTA MUNICIPAL            */}
          {/* =============================== */}
          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2 glow-stark">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">
                Control total de vehículos, disponibilidad y mantenciones.
              </p>
              <p className="text-cyan-300/40 mt-3">(En construcción)</p>
            </div>
          )}

          {/* =============================== */}
          {/*     REPORTES FAZO OS           */}
          {/* =============================== */}
          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2 glow-stark">
                Panel de Reportes FAZO
              </h2>
              <p className="text-cyan-200/80">
                Análisis avanzado de AguaRuta y Flota Municipal.
              </p>
              <p className="text-cyan-300/40 mt-3">(En construcción)</p>
            </div>
          )}

          {/* =============================== */}
          {/*     AJUSTES DEL SISTEMA        */}
          {/* =============================== */}
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
                className="
                  px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 
                  shadow-lg transition-all
                "
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </main>
      </div>

      {/* =============================== */}
      {/*     ORBE HOLOGRÁFICO AURA       */}
      {/* =============================== */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* =============================== */}
      {/*     PANEL IA — AURA OS          */}
      {/* =============================== */}
     <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onComando={handleComandoAura}
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}

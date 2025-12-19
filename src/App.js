// =====================================================
//  FAZO OS — App.js 2025 (VERSIÓN DEFINITIVA NEXUS)
//  Integración completa:
//  - AURAChat GOD MODE
//  - AURA_NEXUS
//  - MultiModel IA
//  - FAZO Bridge
//  - AguaRuta + Traslado Municipal
// =====================================================

import React, { useState, useEffect, useRef } from "react";

// Componentes centrales FAZO OS
import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

// Núcleo FAZO OS
import { AURA_NEXUS } from "./core/AURA_NEXUS";

import "./index.css";

export default function App() {
  // =====================================================
  //  ESTADOS PRINCIPALES DEL SISTEMA OPERATIVO
  // =====================================================
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  // Referencias a iFrames externos
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // =====================================================
  //  1) Splash FAZO OS (arranque visual)
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
      console.error("❌ Error enviando comando:", error);
    }
  };

  // =====================================================
  //  4) Procesar Comandos desde AURA → FAZO OS
  // =====================================================
  const handleComandoAura = (cmd) => {
    if (!cmd) return;

    // 1) Comando simple como string
    if (typeof cmd === "string") {
      setVista(cmd);
      return;
    }

    // 2) Navegación de módulos principales
    if (cmd.tipo === "modulo") {
      setVista(cmd.modulo);

      if (cmd.modulo === "aguaruta") {
        setSubrutaAgua("");
      }

      return;
    }

    // 3) Subrutas internas de AguaRuta
    if (cmd.tipo === "subruta" && cmd.modulo === "aguaruta") {
      setVista("aguaruta");

      const cleanTab = (cmd.ruta || "").replace(/^\//, "");
      setSubrutaAgua(cleanTab);

      sendToIframe("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: cleanTab,
      });

      return;
    }

    // 4) Acciones directas del sistema
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
          console.warn("⚠️ Acción no reconocida:", cmd);
      }
    }
  };

  // =====================================================
  //  5) NEXUS — Acciones autónomas hacia App.js
  // =====================================================
  useEffect(() => {
    const sub = AURA_NEXUS.subscribe((evento) => {
      if (!evento) return;

      switch (evento.tipo) {
        case "CAMBIO_MODULO":
          setVista(evento.modulo);
          break;

        case "SUBRUTA_AGUARUTA":
          setVista("aguaruta");
          setSubrutaAgua(evento.subruta);

          sendToIframe("aguaruta", {
            type: "FAZO_CMD",
            command: "open-tab",
            tab: evento.subruta,
          });
          break;

        case "COMANDO_IFRAME":
          sendToIframe(evento.app, evento.payload);
          break;

        default:
          console.log("📡 Evento NEXUS ignorado:", evento);
      }
    });

    return () => sub?.unsubscribe?.();
  }, []);

  // =====================================================
  //  6) RENDER OFICIAL — ESCRITORIO FAZO OS
  // =====================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative fade-in
      "
    >
      {/* MENÚ LATERAL OS */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* PANEL PRINCIPAL */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade smooth">

          {/* ======================= */}
          {/*    AGUARUTA — IFRAME    */}
          {/* ======================= */}
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

          {/* ======================= */}
          {/*   TRASLADO MUNICIPAL   */}
          {/* ======================= */}
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

          {/* ======================= */}
          {/*     FLOTA MUNICIPAL    */}
          {/* ======================= */}
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

          {/* ======================= */}
          {/*        REPORTES        */}
          {/* ======================= */}
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

          {/* ======================= */}
          {/*        AJUSTES         */}
          {/* ======================= */}
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

      {/* ORBE AURA */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* PANEL IA */}
      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onComando={handleComandoAura}
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}

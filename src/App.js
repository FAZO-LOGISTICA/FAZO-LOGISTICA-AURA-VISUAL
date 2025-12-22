// ======================================================================
//  FAZO OS — App.js 2025 (VERSIÓN DEFINITIVA + AURA NEXUS/AGENT)
//  Ahora App.js escucha eventos globales del sistema (EventBridge)
//  FAZO LOGÍSTICA — Gustavo Oliva
// ======================================================================

import React, { useState, useEffect, useRef } from "react";

// Componentes
import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

// EventBridge
import { FAZO_OS_EventBridge } from "./core/FAZO_OS_EventBridge";

import "./index.css";

export default function App() {
  // Estado principal del Sistema Operativo
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  // Referencias a iframes (AguaRuta / Traslado)
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // ======================================================================
  // 1) Splash FAZO OS READY
  // ======================================================================
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("FAZO_READY"));
    }, 400);
  }, []);

  // ======================================================================
  // 2) Login Persistente
  // ======================================================================
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) return <Login onLogin={() => setAcceso(true)} />;

  // ======================================================================
  // 3) Función para enviar comandos a iframes
  // ======================================================================
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
    } catch (e) {
      console.error("❌ Error enviando comando a iframe:", e);
    }
  };

  // ======================================================================
  // 4) Escuchar EVENTOS desde AURA (EventBridge)
  // ======================================================================
  useEffect(() => {
    // Listener general
    const handler = (evento) => {
      const { tipo } = evento;

      // -----------------------------------------------------------
      // A) AURA_MODULO → abrir módulo completo
      // -----------------------------------------------------------
      if (tipo === "AURA_MODULO") {
        const { modulo } = evento;
        setVista(modulo);

        // Reset subruta cuando entras a AguaRuta
        if (modulo === "aguaruta") setSubrutaAgua("");
      }

      // -----------------------------------------------------------
      // B) AURA_SUBRUTA → abrir panel interno de AguaRuta
      // -----------------------------------------------------------
      if (tipo === "AURA_SUBRUTA") {
        const { ruta } = evento;
        setVista("aguaruta");
        setSubrutaAgua(ruta);

        sendToIframe("aguaruta", {
          type: "FAZO_CMD",
          command: "open-tab",
          tab: ruta,
        });
      }

      // -----------------------------------------------------------
      // C) AURA_ACCION → operaciones generales
      // -----------------------------------------------------------
      if (tipo === "AURA_ACCION") {
        const { accion, payload } = evento;

        switch (accion) {
          case "logout":
            localStorage.removeItem("aura-acceso");
            window.location.reload();
            break;

          case "filtro-camion":
            sendToIframe("aguaruta", {
              type: "FAZO_CMD",
              command: "filtrar-camion",
              camion: payload?.valor,
            });
            break;

          case "abrir-mapa":
            setVista("aguaruta");
            setSubrutaAgua("mapa");
            break;

          case "abrir-rutas":
            setVista("aguaruta");
            setSubrutaAgua("rutas-activas");
            break;

          default:
            console.warn("⚠️ Acción no reconocida:", accion);
        }
      }
    };

    // Registrar suscripción
    FAZO_OS_EventBridge.on("AURA_MODULO", handler);
    FAZO_OS_EventBridge.on("AURA_SUBRUTA", handler);
    FAZO_OS_EventBridge.on("AURA_ACCION", handler);

    return () => {
      FAZO_OS_EventBridge.clear("AURA_MODULO");
      FAZO_OS_EventBridge.clear("AURA_SUBRUTA");
      FAZO_OS_EventBridge.clear("AURA_ACCION");
    };
  }, []);

  // ======================================================================
  // 5) RENDER PRINCIPAL
  // ======================================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative fade-in
      "
    >
      {/* Menú lateral */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* Panel Principal */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade smooth">
          {/* AGUARUTA */}
          {vista === "aguaruta" && (
            <iframe
              ref={aguarutaIframeRef}
              src={`https://aguaruta.netlify.app/${subrutaAgua}`}
              title="AguaRuta"
              className="
                w-full h-[88vh] rounded-2xl
                border border-cyan-400/40
                bg-black/40 backdrop-blur-xl
              "
            />
          )}

          {/* TRASLADO */}
          {vista === "traslado" && (
            <iframe
              ref={trasladoIframeRef}
              src="https://traslado-municipal.netlify.app"
              title="Traslado Municipal"
              className="
                w-full h-[88vh] rounded-2xl
                border border-emerald-400/40
                bg-black/40 backdrop-blur-xl
              "
            />
          )}

          {/* FLOTA */}
          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">
                Control de vehículos, disponibilidad y mantenciones.
              </p>
            </div>
          )}

          {/* REPORTES */}
          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Panel de Reportes
              </h2>
              <p className="text-cyan-200/80">
                Análisis avanzado del sistema.
              </p>
            </div>
          )}

          {/* AJUSTES */}
          {vista === "ajustes" && (
            <div className="card-fazo p-10 blur-in">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                Ajustes
              </h2>

              <button
                onClick={() => {
                  localStorage.removeItem("aura-acceso");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </main>
      </div>

      {/* AURA ORB */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* PANEL DE AURA */}
      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
      />
    </div>
  );
}

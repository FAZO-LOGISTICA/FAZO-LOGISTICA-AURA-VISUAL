/* ======================================================================
   FAZO OS — App.js 2025 (VERSIÓN DEFINITIVA + EVENTBRIDGE)
   AURA OS | MultiModel | Nexus | EventBridge
   FAZO LOGÍSTICA — Gustavo Oliva
====================================================================== */

import React, { useState, useEffect, useRef } from "react";

// Componentes del sistema
import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

// EventBridge — conecta AURA → FAZO OS
import { registrarSubsistema } from "./core/FAZO_OS_EventBridge";

import "./index.css";

export default function App() {
  // ESTADO PRINCIPAL DEL OS
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  // IFRAMES
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  /* ======================================================================
     1) Splash FAZO OS (listo en 400ms)
  ======================================================================= */
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("FAZO_READY"));
    }, 400);
  }, []);

  /* ======================================================================
     2) Persistencia de acceso (login guardado)
  ======================================================================= */
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) return <Login onLogin={() => setAcceso(true)} />;

  /* ======================================================================
     3) Enviar comandos a un iframe específico
  ======================================================================= */
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

  /* ======================================================================
     4) Escuchar COMANDOS desde el EVENTBRIDGE de AURA
     Esto es lo más IMPORTANTE de App.js 2025
  ======================================================================= */
  useEffect(() => {
    registrarSubsistema((evento) => {
      console.log("📡 Evento recibido desde AURA:", evento);

      // --------------------------
      // A) Abrir módulo completo
      // --------------------------
      if (evento.tipo === "AURA_MODULO") {
        setVista(evento.modulo);

        if (evento.modulo === "aguaruta") setSubrutaAgua("");

        return;
      }

      // --------------------------
      // B) Abrir subruta de AguaRuta
      // --------------------------
      if (evento.tipo === "AURA_SUBRUTA") {
        setVista("aguaruta");

        const r = evento.ruta?.replace(/^\//, "") || "";
        setSubrutaAgua(r);

        sendToIframe("aguaruta", {
          type: "FAZO_CMD",
          command: "open-tab",
          tab: r,
        });

        return;
      }

      // --------------------------
      // C) Acciones directas del sistema
      // --------------------------
      if (evento.tipo === "AURA_ACCION") {
        switch (evento.accion) {
          case "logout":
            localStorage.removeItem("aura-acceso");
            window.location.reload();
            break;

          case "filtro-camion":
            sendToIframe("aguaruta", {
              type: "FAZO_CMD",
              command: "filtrar-camion",
              camion: evento.payload?.valor,
            });
            break;

          case "abrir-mapa":
            setVista("aguaruta");
            setSubrutaAgua("mapa");
            break;

          default:
            console.warn("⚠️ Acción no reconocida en App.js:", evento);
        }
        return;
      }

      // --------------------------
      // D) Análisis automático de AURA
      // --------------------------
      if (evento.tipo === "AURA_ANALISIS_AUTOMATICO") {
        alert(
          "🔍 AURA detectó puntos importantes en la operación:\n\n" +
            evento.payload.sugerencias.join("\n")
        );
      }
    });
  }, []);

  /* ======================================================================
     5) RENDER PRINCIPAL — FAZO OS DESKTOP
  ======================================================================= */
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative fade-in
      "
    >
      {/* MENÚ LATERAL */}
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

          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2 glow-stark">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">
                Control total de vehículos y mantenciones.
              </p>
            </div>
          )}

          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2 glow-stark">
                Panel de Reportes
              </h2>
              <p className="text-cyan-200/80">
                Análisis avanzado de AguaRuta y Flota.
              </p>
            </div>
          )}

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

      {/* PANEL AURA */}
      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}

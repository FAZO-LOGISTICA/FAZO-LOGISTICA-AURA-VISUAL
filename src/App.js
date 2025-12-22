// ======================================================================
//  FAZO OS — App.js ETAPA 4 FINAL COMPLETO
//  Integración oficial AURA + NEXUS + Agent + EventBridge
//  Gustavo Oliva — FAZO LOGÍSTICA 2025
// ======================================================================
import { AURA_Agent } from "./core/AURA_Agent";

// Dentro de App()
useEffect(() => {
  AURA_Agent.iniciar();
}, []);

import React, { useState, useEffect, useRef } from "react";

import SidebarFazo from "./components/SidebarFazo";
import AuraCyberPanel from "./components/AuraCyberPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

import {
  registrarSubsistema,
} from "./core/FAZO_OS_EventBridge";

import "./index.css";

export default function App() {
  // ======================================================
  // ESTADOS BASE
  // ======================================================
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // ======================================================
  // 1) Splash → Señal de sistema listo
  // ======================================================
  useEffect(() => {
    setTimeout(() => {
      window.dispatchEvent(new Event("FAZO_READY"));
    }, 400);
  }, []);

  // ======================================================
  // 2) LOGIN Persistente
  // ======================================================
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) {
    return <Login onLogin={() => setAcceso(true)} />;
  }

  // ======================================================
  // 3) BRIDGE — ENVÍO A IFRAMES
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
    } catch (e) {
      console.error("❌ Error enviando comando a iframe:", e);
    }
  };

  // ======================================================
  // 4) SUBSISTEMA — EVENTOS QUE VIENEN DESDE AURA (NEXUS)
  // ======================================================
  useEffect(() => {
    registrarSubsistema((evento) => {
      // ------------------------
      // A) Módulo completo
      // ------------------------
      if (evento.tipo === "AURA_MODULO") {
        setVista(evento.modulo);
        if (evento.modulo === "aguaruta") setSubrutaAgua("");
        return;
      }

      // ------------------------
      // B) Subruta dentro de AguaRuta
      // ------------------------
      if (evento.tipo === "AURA_SUBRUTA") {
        setVista("aguaruta");
        setSubrutaAgua(evento.ruta);

        sendToIframe("aguaruta", {
          type: "FAZO_CMD",
          command: "open-tab",
          tab: evento.ruta,
        });
        return;
      }

      // ------------------------
      // C) Acciones del sistema (logout, filtros, etc.)
      // ------------------------
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
              camion: evento.payload?.camion,
            });
            break;

          case "abrir-rutas":
            setVista("aguaruta");
            setSubrutaAgua("rutas-activas");
            break;

          default:
            console.warn("⚠️ Acción desconocida:", evento);
        }
        return;
      }

      // ------------------------
      // D) Diagnóstico automático del AURA Agent
      // ------------------------
      if (evento.tipo === "AURA_ANALISIS_AUTOMATICO") {
        console.log("🔍 Diagnóstico automático recibido:", evento.payload);
      }
    });
  }, []);

  // ======================================================
  // 5) RENDER DEL ESCRITORIO COMPLETO FAZO OS
  // ======================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative
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

      {/* PANEL PRINCIPAL */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1">

          {/* =============================== */}
          {/*      AGUARUTA (NETLIFY)         */}
          {/* =============================== */}
          {vista === "aguaruta" && (
            <iframe
              ref={aguarutaIframeRef}
              src={`https://aguaruta.netlify.app/${subrutaAgua}`}
              title="AguaRuta"
              className="
                w-full h-[88vh]
                rounded-2xl border border-cyan-400/40 
                bg-black/40 backdrop-blur-xl
                shadow-[0_0_25px_rgba(0,255,255,0.25)]
              "
            />
          )}

          {/* =============================== */}
          {/*   TRASLADO MUNICIPAL (NETLIFY)  */}
          {/* =============================== */}
          {vista === "traslado" && (
            <iframe
              ref={trasladoIframeRef}
              src="https://traslado-municipal.netlify.app"
              title="Traslado Municipal"
              className="
                w-full h-[88vh]
                rounded-2xl border border-emerald-400/40 
                bg-black/40 backdrop-blur-xl
                shadow-[0_0_25px_rgba(0,255,255,0.25)]
              "
            />
          )}

          {/* =============================== */}
          {/*            FLOTA                */}
          {/* =============================== */}
          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">
                Control de vehículos, mantenciones y disponibilidad.
              </p>
            </div>
          )}

          {/* =============================== */}
          {/*           REPORTES              */}
          {/* =============================== */}
          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center">
              <h2 className="text-3xl text-cyan-300 font-bold">
                Reportes FAZO OS
              </h2>
              <p className="text-cyan-200/80">Próximamente…</p>
            </div>
          )}

          {/* =============================== */}
          {/*           AJUSTES               */}
          {/* =============================== */}
          {vista === "ajustes" && (
            <div className="card-fazo p-10">
              <h2 className="text-2xl text-cyan-300 font-bold mb-4">
                Ajustes del Sistema
              </h2>

              <button
                onClick={() => {
                  localStorage.removeItem("aura-acceso");
                  window.location.reload();
                }}
                className="px-4 py-2 bg-red-600 rounded-lg"
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ORBE HOLOGRÁFICO */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* PANEL DE AURA */}
      <AuraCyberPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}

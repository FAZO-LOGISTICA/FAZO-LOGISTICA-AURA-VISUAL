// src/App.js
import React, { useState, useEffect, useRef } from "react";
import SidebarFazo from "./components/SidebarFazo";
import AuraFloatingPanel from "./components/AuraFloatingPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";
import "./index.css";

// ========================================================
//   FAZO OS — SISTEMA OPERATIVO MUNICIPAL (2025)
//   AURA núcleo inteligente + Módulos vía iframes
//   Optimización total por Mateo IA
// ========================================================
export default function App() {
  // ----------------------------------------
  // LOGIN
  // ----------------------------------------
  const [acceso, setAcceso] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) {
    return <Login onLogin={() => setAcceso(true)} />;
  }

  // ----------------------------------------
  // ESTADOS GLOBALES
  // ----------------------------------------
  const [vista, setVista] = useState("aguaruta");      // módulo actual
  const [subrutaAgua, setSubrutaAgua] = useState("");  // pestañas internas
  const [auraVisible, setAuraVisible] = useState(false);

  // iframe refs (para comunicación bidireccional)
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // ----------------------------------------
  // ENVIAR COMANDOS A IFRAMES (FAZO BRIDGE)
  // ----------------------------------------
  const sendToIframe = (app, payload) => {
    try {
      if (!payload) return;

      if (app === "aguaruta" && aguarutaIframeRef.current?.contentWindow) {
        aguarutaIframeRef.current.contentWindow.postMessage(payload, "*");
      }

      if (app === "traslado" && trasladoIframeRef.current?.contentWindow) {
        trasladoIframeRef.current.contentWindow.postMessage(payload, "*");
      }
    } catch (err) {
      console.error("❌ Error enviando comando a iframe:", err);
    }
  };

  // =======================================================
  //          AURA → CONTROL DE MÓDULOS (voz + texto)
  // =======================================================
  const handleComandoAura = (cmd) => {
    if (!cmd) return;

    // -----------------------------
    // Si AURA envía un string simple
    // -----------------------------
    if (typeof cmd === "string") {
      setVista(cmd);
      return;
    }

    // -----------------------------
    // MÓDULOS PRINCIPALES
    // -----------------------------
    if (cmd.tipo === "modulo") {
      setVista(cmd.modulo);

      // Reiniciar subruta cuando abre AguaRuta
      if (cmd.modulo === "aguaruta") {
        setSubrutaAgua("");
      }
    }

    // -----------------------------
    // SUBRUTAS DE AGUARUTA
    // -----------------------------
    if (cmd.tipo === "subruta") {
      if (cmd.modulo === "aguaruta") {
        setVista("aguaruta");

        const clean = (cmd.ruta || "").replace(/^\//, ""); // /rutas-activas → rutas-activas
        setSubrutaAgua(clean);

        sendToIframe("aguaruta", {
          type: "FAZO_CMD",
          command: "open-tab",
          tab: clean,
        });
      }
    }
  };

  // =======================================================
  //                     RENDER PRINCIPAL
  // =======================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative
      "
    >
      {/* ======================================================
            SIDEBAR FAZO PRO (IZQUIERDA)
         ====================================================== */}
      <SidebarFazo active={vista} onNavigate={(slug) => {
        setVista(slug);

        // si el usuario abre AguaRuta desde el menú
        if (slug === "aguaruta") setSubrutaAgua("");
      }} />

      {/* ======================================================
            PANEL DERECHO (CONTENIDO)
         ====================================================== */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade">

          {/* ----------------------------- */}
          {/*        MÓDULO AGUARUTA        */}
          {/* ----------------------------- */}
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
              "
            />
          )}

          {/* ----------------------------- */}
          {/*      TRASLADO MUNICIPAL       */}
          {/* ----------------------------- */}
          {vista === "traslado" && (
            <iframe
              ref={trasladoIframeRef}
              src="https://traslado-municipal.netlify.app"
              title="Traslado Municipal"
              className="
                w-full h-[88vh] rounded-2xl
                border border-cyan-400/40
                bg-black/40 backdrop-blur-xl
                shadow-[0_0_25px_rgba(0,255,255,0.25)]
              "
            />
          )}

          {/* ----------------------------- */}
          {/*         FLOTA MUNICIPAL       */}
          {/* ----------------------------- */}
          {vista === "flota" && (
            <div
              className="
                text-center p-10 rounded-2xl
                bg-black/30 backdrop-blur-xl
                border border-cyan-400/40
                shadow-[0_0_25px_rgba(0,255,255,0.2)]
              "
            >
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">Flota Municipal</h2>
              <p className="text-cyan-200/80">Vehículos, mantenimiento y disponibilidad.</p>
              <p className="text-cyan-300/40 mt-3">(módulo en construcción)</p>
            </div>
          )}

          {/* ----------------------------- */}
          {/*           REPORTES            */}
          {/* ----------------------------- */}
          {vista === "reportes" && (
            <div
              className="
                text-center p-10 rounded-2xl
                bg-black/30 backdrop-blur-xl
                border border-cyan-400/40
                shadow-[0_0_25px_rgba(0,255,255,0.2)]
              "
            >
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">Reportes FAZO</h2>
              <p className="text-cyan-200/80">
                Informes avanzados, análisis y datos municipales.
              </p>
              <p className="text-cyan-300/40 mt-3">(módulo en construcción)</p>
            </div>
          )}

          {/* ----------------------------- */}
          {/*            AJUSTES            */}
          {/* ----------------------------- */}
          {vista === "ajustes" && (
            <div
              className="
                p-8 rounded-2xl
                bg-black/30 backdrop-blur-xl
                border border-cyan-400/40
                shadow-[0_0_25px_rgba(0,255,255,0.2)]
              "
            >
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">Ajustes del Sistema</h2>
              <p className="text-cyan-200/70">
                Configura voz, tema, accesos y opciones del sistema FAZO.
              </p>

              <button
                onClick={() => {
                  localStorage.removeItem("aura-acceso");
                  window.location.reload();
                }}
                className="
                  mt-6 px-4 py-2 bg-red-600
                  rounded-lg shadow hover:bg-red-700 transition
                "
              >
                Cerrar sesión
              </button>
            </div>
          )}
        </main>
      </div>

      {/* ======================================================
                ORB FAZO (BOTÓN AURA)
         ====================================================== */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* ======================================================
                PANEL FLOATING (AURA CHAT)
         ====================================================== */}
      <AuraFloatingPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onComando={handleComandoAura}
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}

// =====================================================
//  FAZO OS — App.js 2025
//  Núcleo gráfico + navegación + integración AURA
//  Ultra Optimizado — Versión Oficial Final
// =====================================================

import React, { useState, useEffect, useRef } from "react";

// Componentes FAZO OS
import SidebarFazo from "./components/SidebarFazo";
import AuraFloatingPanel from "./components/AuraFloatingPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";

import "./index.css";

export default function App() {
  // Estados OS
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  // Referencias para módulos externos
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // =====================================================
  //  1) Splash FAZO OS (viene DESDE index.html)
  // =====================================================
  useEffect(() => {
    // Le avisamos al index.html que React ya está listo
    setTimeout(() => {
      window.dispatchEvent(new Event("FAZO_READY"));
    }, 350);
  }, []);

  // =====================================================
  //  2) Persistencia del Login
  // =====================================================
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) return <Login onLogin={() => setAcceso(true)} />;

  // =====================================================
  //  3) FAZO Bridge — Comunicación con módulos externos
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
    } catch (err) {
      console.error("❌ Error enviando comando FAZO → iframe:", err);
    }
  };

  // =====================================================
  //  4) AURA → FAZO OS  (Comandos)
  // =====================================================
  const handleComandoAura = (cmd) => {
    if (!cmd) return;

    // ● Comando directo tipo string
    if (typeof cmd === "string") {
      setVista(cmd);
      return;
    }

    // ● Cambiar módulo principal
    if (cmd.tipo === "modulo") {
      setVista(cmd.modulo);
      if (cmd.modulo === "aguaruta") setSubrutaAgua("");
    }

    // ● Subrutas propias de AguaRuta
    if (cmd.tipo === "subruta" && cmd.modulo === "aguaruta") {
      setVista("aguaruta");

      const clean = (cmd.ruta || "").replace(/^\//, "");
      setSubrutaAgua(clean);

      sendToIframe("aguaruta", {
        type: "FAZO_CMD",
        command: "open-tab",
        tab: clean,
      });
    }

    // ● Acciones generales
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
          console.log("⚠️ Acción AURA no reconocida:", cmd);
      }
    }
  };

  // =====================================================
  //  5) RENDER PRINCIPAL — FAZO OS Layout
  // =====================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative fade-in
      "
    >
      {/* ===============================
          MENÚ LATERAL FAZO OS
       =============================== */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* ===============================
          PANEL PRINCIPAL
       =============================== */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade smooth">

          {/* AGUARUTA ===================================== */}
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

          {/* TRASLADO MUNICIPAL ============================ */}
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

          {/* FLOTA MUNICIPAL =============================== */}
          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2 glow-stark">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">
                Control total de vehículos, disponibilidad y mantención.
              </p>
              <p className="text-cyan-300/40 mt-3">(En construcción)</p>
            </div>
          )}

          {/* REPORTES =============================== */}
          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center blur-in">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2 glow-stark">
                Panel de Reportes FAZO
              </h2>
              <p className="text-cyan-200/80">
                Análisis avanzado de AguaRuta, Flota y Operaciones.
              </p>
              <p className="text-cyan-300/40 mt-3">(En construcción)</p>
            </div>
          )}

          {/* AJUSTES =============================== */}
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

      {/* ===============================
          ORBE HOLOGRÁFICO DE AURA
       =============================== */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* ===============================
          PANEL FLOTANTE AURA
       =============================== */}
      <AuraFloatingPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onComando={handleComandoAura}
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}

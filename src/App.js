// src/App.js
import React, { useState, useEffect, useRef } from "react";
import Splash from "./components/Splash";
import SidebarFazo from "./components/SidebarFazo";
import AuraFloatingPanel from "./components/AuraFloatingPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";
import "./index.css";

// FAZO OS — Sistema Operativo Municipal 2025
export default function App() {
  const [splash, setSplash] = useState(true);
  const [acceso, setAcceso] = useState(false);
  const [vista, setVista] = useState("aguaruta");
  const [subrutaAgua, setSubrutaAgua] = useState("");
  const [auraVisible, setAuraVisible] = useState(false);

  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // Splash → 2.5s
  useEffect(() => {
    const timer = setTimeout(() => setSplash(false), 2600);
    return () => clearTimeout(timer);
  }, []);

  // Persistencia Login
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (splash) return <Splash />;
  if (!acceso) return <Login onLogin={() => setAcceso(true)} />;

  // FAZO Bridge → enviar comandos a módulos
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

  // Comandos que AURA envía a FAZO OS
  const handleComandoAura = (cmd) => {
    if (!cmd) return;

    // Comando básico tipo string
    if (typeof cmd === "string") {
      setVista(cmd);
      return;
    }

    // Módulos principales
    if (cmd.tipo === "modulo") {
      setVista(cmd.modulo);
      if (cmd.modulo === "aguaruta") setSubrutaAgua("");
    }

    // Subrutas AguaRuta
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

    // Acciones internas
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
      }
    }
  };

  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative
      "
    >
      {/* MENÚ LATERAL FAZO */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* PANEL PRINCIPAL */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto ml-64">
        <main className="flex-1 holo-fade">

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
                shadow-[0_0_25px_rgba(0,255,255,0.25)]
                transition-all duration-300
              "
            />
          )}

          {/* TRASLADO MUNICIPAL */}
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

          {/* FLOTA */}
          {vista === "flota" && (
            <div className="card-fazo-strong p-10 text-center">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">
                Control total de vehículos, mantenimiento y disponibilidad.
              </p>
              <p className="text-cyan-300/40 mt-3">(En construcción)</p>
            </div>
          )}

          {/* REPORTES */}
          {vista === "reportes" && (
            <div className="card-fazo-strong p-10 text-center">
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Reportes FAZO
              </h2>
              <p className="text-cyan-200/80">
                Estadísticas avanzadas y análisis municipales.
              </p>
              <p className="text-cyan-300/40 mt-3">(En construcción)</p>
            </div>
          )}

          {/* AJUSTES */}
          {vista === "ajustes" && (
            <div className="card-fazo p-10">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                Ajustes del Sistema
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

      {/* BOTÓN ORB AURA */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* PANEL FLOTANTE AURA */}
      <AuraFloatingPanel
        visible={auraVisible}
        onClose={() => setAuraVisible(false)}
        onComando={handleComandoAura}
        onSendToIframe={sendToIframe}
      />
    </div>
  );
}

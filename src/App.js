// src/App.js
import React, { useState, useEffect, useRef } from "react";
import SidebarFazo from "./components/SidebarFazo";
import AuraFloatingPanel from "./components/AuraFloatingPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";
import "./index.css";

// ========================================================
//   FAZO OS — SISTEMA OPERATIVO MUNICIPAL (2025)
//   AURA núcleo inteligente • Navegación tipo Windows/Mac
//   Optimización total por Mateo IA
// ========================================================
export default function App() {
  // ----------------------------------------
  // LOGIN PERSISTENTE
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
  // ESTADOS GLOBALES DEL SISTEMA FAZO OS
  // ----------------------------------------
  const [vista, setVista] = useState("aguaruta");  // módulo principal activo
  const [subrutaAgua, setSubrutaAgua] = useState(""); // pestaña interna de AguaRuta
  const [auraVisible, setAuraVisible] = useState(false);

  // Refs de los iframes
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // ----------------------------------------
  // FUNCIÓN GLOBAL → COMANDOS FAZO-BRIDGE
  // ----------------------------------------
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

  // ============================================================
  //      AURA → ACCIONES REALMENTE EJECUTADAS EN FAZO OS
  // ============================================================
  const handleComandoAura = (cmd) => {
    if (!cmd) return;

    // Caso simple (string)
    if (typeof cmd === "string") {
      setVista(cmd);
      return;
    }

    // -----------------------------
    //   MODULOS PRINCIPALES
    // -----------------------------
    if (cmd.tipo === "modulo") {
      setVista(cmd.modulo);

      // Reiniciar pestañas si entra a AguaRuta
      if (cmd.modulo === "aguaruta") {
        setSubrutaAgua("");
      }
    }

    // -----------------------------
    //   SUBRUTAS (AguaRuta)
    // -----------------------------
    if (cmd.tipo === "subruta") {
      if (cmd.modulo === "aguaruta") {
        setVista("aguaruta");

        const clean = (cmd.ruta || "").replace(/^\//, ""); // "/rutas-activas" → "rutas-activas"
        setSubrutaAgua(clean);

        // Enviar comando al iframe para activar pestaña interna
        sendToIframe("aguaruta", {
          type: "FAZO_CMD",
          command: "open-tab",
          tab: clean,
        });
      }
    }

    // -----------------------------
    //   ACCIONES AURA OPERATIVA
    // -----------------------------
    if (cmd.tipo === "accion") {
      switch (cmd.accion) {
        case "abrir-traslado":
          setVista("traslado");
          break;

        case "abrir-rutas":
          setVista("aguaruta");
          setSubrutaAgua("rutas-activas");
          break;

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
      }
    }
  };

  // ============================================================
  //                      RENDER PRINCIPAL
  // ============================================================
  return (
    <div
      className="
        flex min-h-screen text-white
        bg-gradient-to-br from-black via-slate-900 to-black
        overflow-hidden relative
      "
    >
      {/* ======================================================
              SIDEBAR FAZO (MENÚ IZQUIERDO)
         ====================================================== */}
      <SidebarFazo
        active={vista}
        onNavigate={(slug) => {
          setVista(slug);

          // Si el usuario abre AguaRuta → reset subruta
          if (slug === "aguaruta") setSubrutaAgua("");
        }}
      />

      {/* ======================================================
              PANEL DERECHO → CONTENIDO
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
                transition-all duration-300
              "
            />
          )}

          {/* ----------------------------- */}
          {/*     TRASLADO MUNICIPAL        */}
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
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Flota Municipal
              </h2>
              <p className="text-cyan-200/80">
                Vehículos, mantenimiento y disponibilidad.
              </p>
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
              <h2 className="text-3xl font-bold text-cyan-300 mb-2">
                Reportes FAZO
              </h2>
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
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">
                Ajustes del Sistema
              </h2>

              <p className="text-cyan-200/70">
                Configura voz, accesos y preferencias del sistema FAZO.
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
                   AURA ORB (BOTÓN FLOTANTE)
         ====================================================== */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* ======================================================
                   PANEL AURA (CHAT)
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

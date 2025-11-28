// src/App.js
import React, { useState, useEffect, useRef } from "react";
import MenuFazo from "./components/MenuFazo";
import AuraFloatingPanel from "./components/AuraFloatingPanel";
import AuraOrb from "./components/AuraOrb";
import Login from "./components/Login";
import "./index.css";

// ========================================
//      FAZO — HUD STARK NEGRO + CYAN
//      AURA COMO NÚCLEO FLOTANTE
// ========================================
export default function App() {
  const [acceso, setAcceso] = useState(false);

  // Vista activa (módulo principal)
  const [vista, setVista] = useState("aguaruta");

  // Subruta interna de AguaRuta
  const [aguaRutaPath, setAguaRutaPath] = useState("");

  // AURA flotante visible
  const [auraVisible, setAuraVisible] = useState(false);

  // Refs a iframes (para FAZO bridge)
  const aguarutaIframeRef = useRef(null);
  const trasladoIframeRef = useRef(null);

  // Revisar login guardado
  useEffect(() => {
    const saved = localStorage.getItem("aura-acceso");
    if (saved === "ok") setAcceso(true);
  }, []);

  if (!acceso) {
    return <Login onLogin={() => setAcceso(true)} />;
  }

  // ========================================
  //   FUNCIÓN GENERAL → ENVIAR A IFRAMES
  // ========================================
  const sendToIframe = (app, payload) => {
    try {
      if (!payload) return;

      if (app === "aguaruta" && aguarutaIframeRef.current?.contentWindow) {
        aguarutaIframeRef.current.contentWindow.postMessage(
          payload,
          "*"
        );
      }

      if (app === "traslado" && trasladoIframeRef.current?.contentWindow) {
        trasladoIframeRef.current.contentWindow.postMessage(
          payload,
          "*"
        );
      }
    } catch (err) {
      console.error("Error enviando comando FAZO a iframe:", err);
    }
  };

  // ========================================
  //   MANEJO DE COMANDOS DE AURA
  //   (módulos + subrutas AguaRuta)
// ========================================
  const handleComandoAura = (cmd) => {
    if (!cmd) return;

    // Compatibilidad simple (string)
    if (typeof cmd === "string") {
      setVista(cmd);
      return;
    }

    // Comandos de módulo principal
    if (cmd.tipo === "modulo") {
      setVista(cmd.modulo);

      // Si es AguaRuta y no trae ruta específica
      if (cmd.modulo === "aguaruta" && !cmd.ruta) {
        setAguaRutaPath("");
      }
    }

    // Comandos de subruta (pestañas AguaRuta)
    if (cmd.tipo === "subruta") {
      if (cmd.modulo === "aguaruta") {
        // Cambiar iframe a AguaRuta
        setVista("aguaruta");
        setAguaRutaPath(cmd.ruta || "");

        // Además, mandar comando al iframe para que interprete la pestaña
        const tabSlug = (cmd.ruta || "").replace(/^\//, ""); // "/rutas-activas" → "rutas-activas"

        if (tabSlug) {
          // Forma estándar para fazo-bridge.js dentro de AguaRuta
          sendToIframe("aguaruta", {
            type: "FAZO_CMD",
            command: "open-tab",
            tab: tabSlug,
          });
        }
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
      {/* ======================================================
                PANEL IZQUIERDO → MENÚ
         ====================================================== */}
      <MenuFazo setVista={setVista} />

      {/* ======================================================
                PANEL DERECHO → CONTENIDO / IFRAME
         ====================================================== */}
      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <main className="flex-1 holo-fade">
          {/* ======================================
                    AGUARUTA (IFRAME)
             ====================================== */}
          {vista === "aguaruta" && (
            <iframe
              ref={aguarutaIframeRef}
              src={`https://aguaruta.netlify.app${aguaRutaPath}`}
              title="AguaRuta"
              className="
                w-full h-[88vh] rounded-2xl
                border border-cyan-400/40
                bg-black/40 backdrop-blur-xl
                shadow-[0_0_25px_rgba(0,255,255,0.25)]
                transition
              "
            />
          )}

          {/* ======================================
                    TRASLADO MUNICIPAL
             ====================================== */}
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

          {/* ======================================
                    FLOTA MUNICIPAL
             ====================================== */}
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
              <p className="text-cyan-300/40 mt-3">
                (módulo en construcción)
              </p>
            </div>
          )}

          {/* ======================================
                    REPORTES
             ====================================== */}
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
              <p className="text-cyan-300/40 mt-3">
                (módulo en construcción)
              </p>
            </div>
          )}

          {/* ======================================
                    AJUSTES
             ====================================== */}
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
              ORB FAZO FLOTANTE (BOTÓN)
         ====================================================== */}
      <AuraOrb onClick={() => setAuraVisible(true)} />

      {/* ======================================================
              PANEL FLOTANTE DE AURA (CHAT)
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
